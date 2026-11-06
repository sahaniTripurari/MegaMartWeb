import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://xmraekhawrucxnlthtec.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_3b3bcwMtxuUb-8Gxkbz4iA_j_-7Wd3p';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * ==============================================================================
 * MEGAMART CLOUD DATA SERVICES (Enterprise Supabase Engine)
 * ==============================================================================
 */

// 1. Fetch live products from Cloud Database (falls back to local model if DB empty)
export async function getCloudProducts(category = null) {
  try {
    let query = supabase.from('products').select('*');
    if (category && category !== 'All Products' && category !== 'For You') {
      query = query.eq('category_name', category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data && data.length > 0 ? data : null;
  } catch (err) {
    console.warn('[Supabase] Products query error:', err.message);
    return null;
  }
}

// 2. Auth: Sign Up with Email, Password & Name
export async function cloudSignUp(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    if (error) throw error;
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 3. Auth: Sign In with Email & Password
export async function cloudSignIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 4. Auth: Sign Out
export async function cloudSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 5. Auth: Get Current Authenticated User & Profile
export async function getCloudCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return {
      ...user,
      profile: profile || {
        full_name: user.user_metadata?.full_name || 'MegaMart Shopper',
        email: user.email,
        megacoins: 150
      }
    };
  } catch (err) {
    console.warn('[Supabase] Auth check failed:', err.message);
    return null;
  }
}

// 6. Cloud Cart Sync
export async function syncCloudCart(userId, items) {
  if (!userId) return;
  try {
    // Upsert items into cart_items
    for (const item of items) {
      await supabase.from('cart_items').upsert({
        user_id: userId,
        product_id: item.id,
        quantity: item.quantity,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,product_id' });
    }
  } catch (err) {
    console.warn('[Supabase] Cart sync error:', err.message);
  }
}

// 7. Place Real Cloud Order
export async function createCloudOrder(userId, orderPayload) {
  try {
    const { data, error } = await supabase.from('orders').insert({
      user_id: userId,
      order_number: 'MM-' + Math.floor(100000 + Math.random() * 900000),
      total_amount: orderPayload.totalAmount,
      delivery_fee: orderPayload.deliveryFee || 0,
      payment_method: orderPayload.paymentMethod || 'COD',
      payment_status: 'PAID',
      order_status: 'PLACED',
      delivery_address: orderPayload.address,
      items: orderPayload.items,
      timeline: [
        { status: 'Order Placed', time: new Date().toISOString(), completed: true },
        { status: 'Packing at Dark-Store', time: null, completed: false },
        { status: 'Out for 10-Min Delivery', time: null, completed: false },
        { status: 'Delivered', time: null, completed: false }
      ]
    }).select().single();

    if (error) throw error;
    return { success: true, order: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 8. Fetch User Cloud Orders
export async function getCloudOrders(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Supabase] Orders fetch error:', err.message);
    return [];
  }
}
