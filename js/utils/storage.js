const FAVORITES_KEY = "apnaghar_favorites";
const CUSTOM_PROPERTIES_KEY = "apnaghar_custom_properties";
const DEALER_LEADS_KEY = "apnaghar_dealer_leads";
const AGENCY_PROFILE_KEY = "apnaghar_agency_profile";

export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(propertyId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(propertyId);
  let updated = [];
  if (index > -1) {
    updated = favorites.filter(id => id !== propertyId);
  } else {
    updated = [...favorites, propertyId];
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function getCustomProperties() {
  try {
    const data = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomProperty(newProperty) {
  const current = getCustomProperties();
  const updated = [newProperty, ...current];
  localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updated));
  return updated;
}

export function getDealerLeads() {
  try {
    const data = localStorage.getItem(DEALER_LEADS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveDealerLeads(leads) {
  localStorage.setItem(DEALER_LEADS_KEY, JSON.stringify(leads));
}

export function getAgencyProfile() {
  try {
    const data = localStorage.getItem(AGENCY_PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveAgencyProfile(profile) {
  localStorage.setItem(AGENCY_PROFILE_KEY, JSON.stringify(profile));
}
