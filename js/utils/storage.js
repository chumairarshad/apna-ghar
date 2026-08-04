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

const MODIFIED_PROPERTIES_KEY = "apnaghar_modified_properties";
const DELETED_PROPERTIES_KEY = "apnaghar_deleted_properties";

export function getDeletedPropertyIds() {
  try {
    const data = localStorage.getItem(DELETED_PROPERTIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function deletePropertyFromStorage(id) {
  // 1. Remove from custom properties if exists
  const custom = getCustomProperties();
  const updatedCustom = custom.filter(p => p.id !== id);
  localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updatedCustom));

  // 2. Add to deleted IDs set
  const deleted = getDeletedPropertyIds();
  if (!deleted.includes(id)) {
    localStorage.setItem(DELETED_PROPERTIES_KEY, JSON.stringify([...deleted, id]));
  }
}

export function getModifiedPropertiesMap() {
  try {
    const data = localStorage.getItem(MODIFIED_PROPERTIES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveOrUpdatePropertyInStorage(property) {
  const custom = getCustomProperties();
  const customIdx = custom.findIndex(p => p.id === property.id);
  
  if (customIdx > -1) {
    custom[customIdx] = property;
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(custom));
  } else {
    // Check if it's an initial property being edited or new
    const modifiedMap = getModifiedPropertiesMap();
    modifiedMap[property.id] = property;
    localStorage.setItem(MODIFIED_PROPERTIES_KEY, JSON.stringify(modifiedMap));
  }
}

export function getEffectiveProperties(initialProperties) {
  const deletedIds = getDeletedPropertyIds();
  const custom = getCustomProperties();
  const modifiedMap = getModifiedPropertiesMap();

  const effectiveInitial = initialProperties
    .filter(p => !deletedIds.includes(p.id))
    .map(p => modifiedMap[p.id] ? { ...p, ...modifiedMap[p.id] } : p);

  const effectiveCustom = custom.filter(p => !deletedIds.includes(p.id));

  return [...effectiveCustom, ...effectiveInitial];
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
