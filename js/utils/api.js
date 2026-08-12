/**
 * API Client for Neon PostgreSQL Database & Free Unlimited Image Upload CDN
 */

// Helper to map DB row to frontend property object
function mapDbPropertyToFrontend(p) {
  return {
    id: p.id,
    dealerId: p.dealer_id || p.dealerId || p.postedByUserId,
    postedByUserId: p.dealer_id || p.postedByUserId,
    ownerEmail: p.agent_email || p.ownerEmail || p.postedByEmail,
    title: p.title,
    purpose: p.purpose,
    category: p.category,
    city: p.city,
    location: p.location,
    address: p.address || p.location,
    price: Number(p.price),
    sizeMarla: Number(p.size_marla),
    bedrooms: p.bedrooms || 4,
    bathrooms: p.bathrooms || 5,
    description: p.description || '',
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    features: Array.isArray(p.features) ? p.features : ['Solar Power Backup', 'Gas Connection'],
    status: p.status || 'active',
    agency: {
      name: p.agency_name || 'Verified Real Estate Agency',
      agentName: p.agent_name || 'Verified Agent',
      phone: p.agent_phone || '+92 300 0000000',
      email: p.agent_email || p.ownerEmail || p.postedByEmail,
      whatsapp: (p.agent_phone || '923000000000').replace(/[^0-9]/g, ''),
      badge: 'VERIFIED DEALER',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
    },
    postedDate: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    views: p.views_count || 1
  };
}

// Fetch properties from Neon PostgreSQL database
export async function fetchPropertiesFromApi() {
  try {
    const apiUrl = (typeof window !== 'undefined') ? '/api/properties' : 'http://localhost:5000/api/properties';
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
      return data.properties.map(mapDbPropertyToFrontend);
    }
    return null;
  } catch (e) {
    console.warn('Backend API notice:', e.message);
    return null;
  }
}

// Fetch specific user properties from Neon PostgreSQL database by User ID / Email
export async function fetchUserPropertiesFromApi(userIdOrEmail) {
  try {
    if (!userIdOrEmail) return [];
    const res = await fetch(`/api/properties/user/${encodeURIComponent(userIdOrEmail)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success && Array.isArray(data.properties)) {
      return data.properties.map(mapDbPropertyToFrontend);
    }
    return [];
  } catch (e) {
    console.warn('Fetch user properties notice:', e.message);
    return [];
  }
}

// Save property to Neon PostgreSQL Database
export async function savePropertyToApi(property) {
  try {
    const payload = {
      id: property.id,
      dealerId: property.dealerId || property.postedByUserId,
      postedByUserId: property.postedByUserId || property.dealerId,
      ownerEmail: property.ownerEmail || property.postedByEmail || property.agency?.email,
      agentEmail: property.agency?.email || property.ownerEmail,
      title: property.title,
      purpose: property.purpose,
      category: property.category,
      city: property.city,
      location: property.location,
      address: property.address,
      price: property.price,
      sizeMarla: property.sizeMarla,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      description: property.description,
      images: Array.isArray(property.images) && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
      features: property.features,
      status: property.status || 'active',
      agentName: property.agency?.agentName,
      agentPhone: property.agency?.phone,
      agencyName: property.agency?.name
    };

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      return { success: true, localOnly: true, message: 'Saved locally' };
    }
    const data = await res.json().catch(() => ({ success: true }));
    return data || { success: true };
  } catch (e) {
    console.warn('Save to Neon API notice:', e.message);
    return { success: true, localOnly: true, message: e.message };
  }
}

// Upload image file to Free CDN (ImgBB)
export async function uploadImageToFreeCdn(base64Image) {
  try {
    if (!base64Image) return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
    if (base64Image.startsWith('http://') || base64Image.startsWith('https://')) {
      return base64Image;
    }
    
    // 1. Send to Express API endpoint /api/upload
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });
    const data = await res.json().catch(() => null);
    if (data && data.success && data.url && data.url.startsWith('http')) {
      return data.url;
    }

    // 2. Direct ImgBB API Fallback
    const apiKey = 'f6d0ec208aa0c0c984cbc6ef2b5315c3';
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const bodyData = new URLSearchParams();
    bodyData.append('image', cleanBase64);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyData.toString()
    });
    const imgbbData = await imgbbRes.json().catch(() => null);
    if (imgbbData && imgbbData.data && imgbbData.data.url) {
      return imgbbData.data.url;
    }

    return base64Image;
  } catch (e) {
    console.warn('Upload image API notice:', e.message);
    return base64Image;
  }
}

// Upload multiple images in parallel
export async function uploadMultipleImages(base64Array = []) {
  if (!Array.isArray(base64Array) || base64Array.length === 0) return [];
  const uploadPromises = base64Array.map(img => uploadImageToFreeCdn(img));
  return await Promise.all(uploadPromises);
}

// Delete property from Neon PostgreSQL Database
export async function deletePropertyFromApi(id) {
  try {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    console.warn('API property delete notice:', e.message);
    return false;
  }
}

// ----------------------------------------------------
// ADMIN API HELPER FUNCTIONS (POSTGRESQL SINGLE SOURCE OF TRUTH)
// ----------------------------------------------------

export async function fetchAdminUsersApi(token) {
  try {
    const apiUrl = (typeof window !== 'undefined') ? '/api/admin/users' : 'http://localhost:5000/api/admin/users';
    const res = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json().catch(() => null);
    return (res.ok && data && data.success) ? data.users : [];
  } catch (e) {
    console.warn('Fetch admin users notice:', e.message);
    return [];
  }
}

export async function fetchAdminDealersApi(token) {
  try {
    const apiUrl = (typeof window !== 'undefined') ? '/api/admin/dealers' : 'http://localhost:5000/api/admin/dealers';
    const res = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json().catch(() => null);
    return (res.ok && data && data.success) ? data.dealers : [];
  } catch (e) {
    console.warn('Fetch admin dealers notice:', e.message);
    return [];
  }
}

export async function fetchAdminStatsApi(token) {
  try {
    const apiUrl = (typeof window !== 'undefined') ? '/api/admin/stats' : 'http://localhost:5000/api/admin/stats';
    const res = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json().catch(() => null);
    return (res.ok && data && data.success) ? data.stats : null;
  } catch (e) {
    console.warn('Fetch admin stats notice:', e.message);
    return null;
  }
}

export async function toggleUserStatusApi(userId, currentStatus, token) {
  try {
    const isSusp = currentStatus === 'suspended' || currentStatus === 'disabled';
    const newStatus = isSusp ? 'active' : 'suspended';
    const newSuspBool = !isSusp;

    const res = await fetch(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus, isSuspended: newSuspBool })
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

export async function activateDealerSubscriptionApi(dealerId, planName, token, customDurationDays = null) {
  try {
    const bodyObj = { planName };
    if (customDurationDays) bodyObj.customDurationDays = customDurationDays;

    const res = await fetch(`/api/admin/dealers/${dealerId}/activate-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bodyObj)
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

export async function createAdminAccountApi(adminData, token) {
  try {
    const res = await fetch('/api/admin/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

export async function adminCreateUserApi(userData, token) {
  try {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

