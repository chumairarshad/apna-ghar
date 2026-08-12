/**
 * Property Size Parser Utility
 * Parses user search queries for property sizes in Marla, Kanal, or Sq Yd.
 */

export function parsePropertySizeFromQuery(query) {
  if (!query || typeof query !== 'string') return null;

  const q = query.trim().toLowerCase();

  // Pattern 1: Kanal (e.g., "1 Kanal", "2 Kanals", "1.5 Kanal", "1kanal", "2kanal")
  const kanalMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:kanal|kanals|kn)\b/i);
  if (kanalMatch) {
    const val = parseFloat(kanalMatch[1]);
    if (!isNaN(val) && val > 0) {
      const marlaEquiv = val * 20;
      const label = `${val === 1 ? '1' : val} Kanal`;
      return { sizeMarla: marlaEquiv, sizeLabel: label, originalUnit: 'Kanal', rawValue: val };
    }
  }

  // Pattern 2: Marla (e.g., "10 Marla", "5 Marlas", "7.5 marla", "10marla", "5marla")
  const marlaMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:marla|marlas|mrl)\b/i);
  if (marlaMatch) {
    const val = parseFloat(marlaMatch[1]);
    if (!isNaN(val) && val > 0) {
      const label = `${val} Marla`;
      return { sizeMarla: val, sizeLabel: label, originalUnit: 'Marla', rawValue: val };
    }
  }

  // Pattern 3: Sq Yd / Square Yards (e.g., "500 Sq Yd", "250 SqYd", "120 sq yards")
  const sqydMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:sq\s*yd|sqyd|sq\s*yard|sq\s*yards|square\s*yard|square\s*yards)\b/i);
  if (sqydMatch) {
    const val = parseFloat(sqydMatch[1]);
    if (!isNaN(val) && val > 0) {
      // 1 Marla = 22.5 Sq Yd (standard conversion)
      const marlaEquiv = parseFloat((val / 22.5).toFixed(2));
      const label = `${val} Sq Yd`;
      return { sizeMarla: marlaEquiv, sizeLabel: label, originalUnit: 'Sq Yd', rawValue: val };
    }
  }

  return null;
}

export function formatWhatsAppSizeMessage(sizeLabel, cityStr) {
  const size = sizeLabel || 'property';
  const locationInfo = cityStr && cityStr !== 'all' ? ` in ${cityStr.toUpperCase()}` : '';
  return `Hi, I'm looking for a ${size}${locationInfo}. Can you help me find one?`;
}
