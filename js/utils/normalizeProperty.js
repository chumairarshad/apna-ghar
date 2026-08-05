/**
 * Shared Property Normalization Module
 */
export function normalizeProperty(p = {}) {
  if (!p || typeof p !== 'object') p = {};

  const images = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const badges = Array.isArray(p.badges) && p.badges.length > 0
    ? p.badges
    : ['VERIFIED LISTING'];

  const features = Array.isArray(p.features) && p.features.length > 0
    ? p.features
    : (Array.isArray(p.amenities) && p.amenities.length > 0 ? p.amenities : ['Electricity', 'Water Supply', 'Sewerage']);

  const amenities = Array.isArray(p.amenities) && p.amenities.length > 0
    ? p.amenities
    : features;

  const agencyObj = (p.agency && typeof p.agency === 'object') ? p.agency : {};

  const agency = {
    id: agencyObj.id || p.dealer_id || p.dealerId || 'agency-default',
    name: agencyObj.name || p.agency_name || p.agencyName || 'Apna Ghar Real Estate',
    agentName: agencyObj.agentName || p.agent_name || p.agentName || 'Verified Realtor',
    phone: agencyObj.phone || p.agent_phone || p.agentPhone || '+92 300 0000000',
    whatsapp: agencyObj.whatsapp || (p.agent_phone ? String(p.agent_phone).replace(/[^0-9]/g, '') : '923000000000'),
    badge: agencyObj.badge || 'VERIFIED DEALER',
    avatar: agencyObj.avatar || agencyObj.logo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    city: agencyObj.city || p.city || 'Lahore'
  };

  return {
    id: String(p.id || `prop-${Date.now()}`),
    title: String(p.title || 'Pakistani Property Listing'),
    purpose: String(p.purpose || 'sale').toLowerCase(),
    category: String(p.category || 'house').toLowerCase(),
    city: String(p.city || 'Lahore'),
    location: String(p.location || 'Prime Location'),
    address: String(p.address || (p.location ? `${p.location}, ${p.city || 'Lahore'}` : 'Main Boulevard, Pakistan')),
    price: Number(p.price || 0),
    sizeMarla: Number(p.sizeMarla || p.size_marla || 1),
    bedrooms: Number(p.bedrooms || 0),
    bathrooms: Number(p.bathrooms || 0),
    description: String(p.description || 'Verified property listing available for sale or rent in Pakistan.'),
    status: String(p.status || 'active').toLowerCase(),
    views: Number(p.views || p.views_count || 1),
    facing: String(p.facing || 'Main Boulevard'),
    builtYear: Number(p.builtYear || p.built_year || 2024),
    ...p,
    images,
    badges,
    features,
    amenities,
    agency,
    agent_name: agency.agentName,
    agent_phone: agency.phone,
    agency_name: agency.name,
    dealer_id: agency.id
  };
}

export function normalizeProperties(properties = []) {
  if (!Array.isArray(properties)) return [];
  return properties.map(p => normalizeProperty(p));
}
