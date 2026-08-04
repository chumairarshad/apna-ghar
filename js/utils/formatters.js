/**
 * Format raw PKR numeric values into authentic Pakistani real estate terms (Lakh, Crore, etc.)
 */
export function formatPKR(amount, showSymbol = true) {
  if (isNaN(amount) || amount === null) return showSymbol ? "PKR 0" : "0";
  
  const num = Number(amount);
  const symbol = showSymbol ? "PKR " : "";

  if (num >= 10000000) { // 1 Crore = 10,000,000
    const croreVal = (num / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${symbol}${croreVal} Crore`;
  } else if (num >= 100000) { // 1 Lakh = 100,000
    const lakhVal = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `${symbol}${lakhVal} Lakh`;
  } else if (num >= 1000) {
    const kVal = (num / 1000).toFixed(0);
    return `${symbol}${kVal} Thousand`;
  }

  return `${symbol}${num.toLocaleString('en-PK')}`;
}

/**
 * Format Area display (Marla, Kanal, Sq Ft, Sq Yds)
 */
export function formatArea(sizeInMarla, unit = "Marla") {
  const marla = Number(sizeInMarla);
  if (isNaN(marla)) return "N/A";

  if (unit === "Kanal") {
    const kanal = (marla / 20).toFixed(2).replace(/\.00$/, '');
    return `${kanal} Kanal`;
  } else if (unit === "Sq Ft") {
    const sqft = (marla * 225).toLocaleString('en-PK');
    return `${sqft} Sq Ft`;
  } else if (unit === "Sq Yds") {
    const sqyds = Math.round((marla * 225) / 9).toLocaleString('en-PK');
    return `${sqyds} Sq Yds`;
  }

  // Default Marla representation: if >= 20 Marla, auto suggest Kanal display option
  if (marla >= 20) {
    const kanal = (marla / 20).toFixed(1).replace(/\.0$/, '');
    return `${kanal} Kanal (${marla} Marla)`;
  }

  return `${marla} Marla`;
}

/**
 * Convert Area between Pakistani Real Estate units
 */
export function convertArea(value, fromUnit, toUnit) {
  const val = Number(value);
  if (isNaN(val)) return 0;

  // Standardize everything to Sq Ft first
  // Note: 1 Marla in modern housing (DHA/Bahria) = 225 sq ft (or 272 sq ft traditional). Default: 225.
  let sqft = 0;
  switch (fromUnit) {
    case "Marla": sqft = val * 225; break;
    case "Kanal": sqft = val * 20 * 225; break;
    case "Sq Ft": sqft = val; break;
    case "Sq Yds": sqft = val * 9; break;
    case "Acre": sqft = val * 8 * 20 * 225; break;
    default: sqft = val * 225;
  }

  switch (toUnit) {
    case "Marla": return (sqft / 225).toFixed(2);
    case "Kanal": return (sqft / (20 * 225)).toFixed(2);
    case "Sq Ft": return sqft.toFixed(0);
    case "Sq Yds": return (sqft / 9).toFixed(2);
    case "Acre": return (sqft / (8 * 20 * 225)).toFixed(3);
    default: return sqft.toFixed(0);
  }
}

/**
 * Calculate Monthly EMI for Pakistani Banks Home Financing
 */
export function calculateMortgage(propertyPrice, downPaymentPercent, tenureYears, annualInterestRate) {
  const price = Number(propertyPrice) || 0;
  const downPayment = (price * Number(downPaymentPercent)) / 100;
  const loanAmount = price - downPayment;
  
  const monthlyRate = (Number(annualInterestRate) / 100) / 12;
  const totalMonths = Number(tenureYears) * 12;

  if (loanAmount <= 0 || totalMonths <= 0 || monthlyRate <= 0) {
    return { monthlyEMI: 0, totalPayment: 0, totalInterest: 0, loanAmount: 0, downPayment: 0 };
  }

  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyEMI: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    loanAmount: Math.round(loanAmount),
    downPayment: Math.round(downPayment)
  };
}
