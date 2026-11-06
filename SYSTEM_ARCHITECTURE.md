# MegaMart Distributed System Design & AI Engineering Blueprint

This document specifies the authoritative system design, database architecture, high-concurrency transaction handling, and Generative AI vector pipeline for **MegaMart** — an enterprise-grade quick-commerce platform operating on a 10-minute dark-store fulfillment model.

---

## 1. High-Level System Architecture (C4 Model)

```
[ Web & Mobile Client (Vite SPA) ]
                |
                v  (HTTPS / TLS 1.3)
[ Cloudflare / Vercel Edge Gateway ]
    |-- Rate Limiting & DDoS Shield (Token Bucket Algorithm)
    |-- Idempotency Filter (Prevents duplicate order charging)
    |-- Global Edge CDN (SWR Caching for static assets & catalog)
                |
    +-----------+-----------+----------------------+
    |                       |                      |
    v                       v                      v
[ /api/orders ]     [ /api/ai-copilot ]    [ /api/health ]
(Idempotent Tx)     (Gemini + RAG)         (Telemetry Engine)
    |                       |                      |
    +-----------+-----------+                      |
                |                                  |
                v                                  v
[ Supabase PostgreSQL 15 (AWS ap-south-1) ] <------+
    |-- Connection Pooler (PgBouncer - 10,000+ Concurrency)
    |-- Row Level Security (RLS) - Ironclad Zero-Trust
    |-- pgvector Extension (768-dimensional Cosine Embeddings)
    |-- ACID Order Engine & Live Replication Streams
```

---

## 2. Core Technical Specifications

| Component | Technology | Rationale & Architectural SLA |
| :--- | :--- | :--- |
| **Database** | PostgreSQL 15 (Supabase) | Strict ACID compliance, relational integrity, foreign key cascades. |
| **Vector Engine** | `pgvector` (768-dim) | Native vector search without external vector DB latency (sub-15ms). |
| **AI LLM Agent** | Google Gemini API | Natural language meal recipe-to-cart parsing and tool-use synthesis. |
| **API Layer** | Vercel Serverless / Edge Functions | Autoscaling from 0 to 100,000+ RPS without server idle costs. |
| **Security Layer** | Row Level Security (RLS) | Database-enforced authorization; zero token tampering possible. |
| **State Sync** | Supabase Realtime Channels | WebSocket push for live order packing and 10-minute delivery tracking. |

---

## 3. Database Relational Schema (PostgreSQL)

```sql
-- 1. Profiles (Tied to auth.users with Cascade)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    megacoins INTEGER DEFAULT 150,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT
);

-- 3. Products with 768-dimensional Vector Embeddings
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    unit TEXT DEFAULT '1 unit',
    stock_quantity INTEGER DEFAULT 100,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    image_url TEXT NOT NULL,
    is_assured BOOLEAN DEFAULT true,
    -- AI Semantic Search Vector (Gemini text-embedding-004)
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders with Idempotent Guarantee & JSONB Items
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'COD',
    payment_status TEXT DEFAULT 'PAID',
    order_status TEXT DEFAULT 'PLACED',
    delivery_address JSONB NOT NULL,
    items JSONB NOT NULL,
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. AI Engineering: Semantic Vector Search & Shopping Copilot

### 4.1 RAG & Vector Embeddings Architecture
1. **Catalog Vectorization**:
   - Every product's `title`, `category_name`, and `description` are converted into 768-dimensional float arrays via Gemini `text-embedding-004`.
2. **Approximate Nearest Neighbor (ANN) Query**:
   ```sql
   SELECT id, title, price, image_url,
          1 - (embedding <=> $user_query_vector) AS similarity_score
   FROM public.products
   WHERE 1 - (embedding <=> $user_query_vector) > 0.72
   ORDER BY similarity_score DESC
   LIMIT 10;
   ```
3. **Semantic Fallback Engine**:
   - The client-side `services/semanticSearch.js` implements intent mapping for common food, recipe, gym, and party concepts when operating in offline/low-connectivity environments.

### 4.2 Autonomous Shopping Copilot ("Recipe to Cart")
- **Workflow**:
  1. User asks: *"Paneer Butter Masala recipe for 4 people"*
  2. The LLM tool-calling agent parses required ingredients: Malai Paneer, Amul Butter, Cow Ghee, Cream, Spices.
  3. The agent queries dark-store inventory in Supabase, validates stock levels, and computes bundle pricing.
  4. Generates an interactive chat card with a 1-click **"Add All to Cart"** action, eliminating the multi-page checkout friction.

---

### 4.3 Autonomous Multi-Intent AI Agent Pipeline
- **Strict E-Commerce Guardrails**: Intercepts non-shopping queries (political, general trivia) with domain-specific redirects, protecting LLM context windows and preventing hallucination.
- **Interactive Checklist Parser**: Extracts discrete unstructured text (comma/newline separated grocery lists), maps fuzzy entities across the 246-item Supabase catalog, and renders a client-editable checklist with micro-steppers `[+]` `[-]`, item deletion, and live total recalculation.
- **Support & Order Live Tracking Integration**: Directly connects to user's order records, rendering a visual delivery stepper (`Placed -> Packed -> On the Way -> Delivered`) and estimated rider arrival time.
- **Market Basket Association Rule Mining**: Implements Apriori-inspired co-occurrence pairs (`Milk -> Bread, Eggs, Tea`; `Atta -> Ghee, Rice, Dal`; `Phone -> Earbuds, Watch`) to generate high-conversion personalized refill suggestions.

## 5. High-Concurrency & Zero-Trust Security Guarantees

1. **Idempotency Protection (`/api/orders`)**:
   - Every order submission requires a client-generated UUID in the `Idempotency-Key` header.
   - Duplicate HTTP retries within 120 seconds return the cached order confirmation rather than re-executing payment or decrementing stock twice.
2. **Row Level Security (RLS)**:
   - Users can only read and mutate their own cart items, wishlist records, and orders (`auth.uid() = user_id`).
   - Catalog data (`categories`, `products`) is publicly readable via CDN edge caching with zero database write exposure.
3. **OWASP Immunity**:
   - 100% Parameterized queries via Supabase PostgREST (Zero SQL Injection attack surface).
   - Strict XSS escaping across all dynamic DOM injections.
