export const currencyOptions = [
  { code: 'USD', country: 'United States', currency: 'US Dollar', symbol: '$' },
  { code: 'EUR', country: 'Euro Area', currency: 'Euro', symbol: '€' },
  { code: 'GBP', country: 'United Kingdom', currency: 'Pound Sterling', symbol: '£' },
  { code: 'DZD', country: 'Algeria', currency: 'Algerian Dinar', symbol: 'دج' },
  { code: 'AOA', country: 'Angola', currency: 'Kwanza', symbol: 'Kz' },
  { code: 'XOF', country: "Benin / Burkina Faso / Cote d'Ivoire / Guinea-Bissau / Mali / Niger / Senegal / Togo", currency: 'West African CFA Franc', symbol: 'CFA' },
  { code: 'BWP', country: 'Botswana', currency: 'Pula', symbol: 'P' },
  { code: 'BIF', country: 'Burundi', currency: 'Burundian Franc', symbol: 'FBu' },
  { code: 'CVE', country: 'Cape Verde', currency: 'Cape Verdean Escudo', symbol: 'Esc' },
  { code: 'XAF', country: 'Cameroon / Central African Republic / Chad / Congo / Equatorial Guinea / Gabon', currency: 'Central African CFA Franc', symbol: 'FCFA' },
  { code: 'KMF', country: 'Comoros', currency: 'Comorian Franc', symbol: 'CF' },
  { code: 'CDF', country: 'Democratic Republic of the Congo', currency: 'Congolese Franc', symbol: 'FC' },
  { code: 'DJF', country: 'Djibouti', currency: 'Djiboutian Franc', symbol: 'Fdj' },
  { code: 'EGP', country: 'Egypt', currency: 'Egyptian Pound', symbol: 'E£' },
  { code: 'ERN', country: 'Eritrea', currency: 'Nakfa', symbol: 'Nfk' },
  { code: 'SZL', country: 'Eswatini', currency: 'Lilangeni', symbol: 'E' },
  { code: 'ETB', country: 'Ethiopia', currency: 'Ethiopian Birr', symbol: 'Br' },
  { code: 'GMD', country: 'Gambia', currency: 'Dalasi', symbol: 'D' },
  { code: 'GHS', country: 'Ghana', currency: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'GNF', country: 'Guinea', currency: 'Guinean Franc', symbol: 'FG' },
  { code: 'KES', country: 'Kenya', currency: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'LSL', country: 'Lesotho', currency: 'Loti', symbol: 'L' },
  { code: 'LRD', country: 'Liberia', currency: 'Liberian Dollar', symbol: 'L$' },
  { code: 'LYD', country: 'Libya', currency: 'Libyan Dinar', symbol: 'LD' },
  { code: 'MGA', country: 'Madagascar', currency: 'Malagasy Ariary', symbol: 'Ar' },
  { code: 'MWK', country: 'Malawi', currency: 'Malawian Kwacha', symbol: 'MK' },
  { code: 'MRU', country: 'Mauritania', currency: 'Ouguiya', symbol: 'UM' },
  { code: 'MUR', country: 'Mauritius', currency: 'Mauritian Rupee', symbol: 'Rs' },
  { code: 'MAD', country: 'Morocco', currency: 'Moroccan Dirham', symbol: 'DH' },
  { code: 'MZN', country: 'Mozambique', currency: 'Mozambican Metical', symbol: 'MT' },
  { code: 'NAD', country: 'Namibia', currency: 'Namibian Dollar', symbol: 'N$' },
  { code: 'NGN', country: 'Nigeria', currency: 'Naira', symbol: '₦' },
  { code: 'RWF', country: 'Rwanda', currency: 'Rwandan Franc', symbol: 'RF' },
  { code: 'STN', country: 'Sao Tome and Principe', currency: 'Dobra', symbol: 'Db' },
  { code: 'SCR', country: 'Seychelles', currency: 'Seychellois Rupee', symbol: 'SR' },
  { code: 'SLE', country: 'Sierra Leone', currency: 'Leone', symbol: 'Le' },
  { code: 'SOS', country: 'Somalia', currency: 'Somali Shilling', symbol: 'Sh.So.' },
  { code: 'ZAR', country: 'South Africa', currency: 'Rand', symbol: 'R' },
  { code: 'SSP', country: 'South Sudan', currency: 'South Sudanese Pound', symbol: 'SSP' },
  { code: 'SDG', country: 'Sudan', currency: 'Sudanese Pound', symbol: 'SDG' },
  { code: 'TZS', country: 'Tanzania', currency: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'TND', country: 'Tunisia', currency: 'Tunisian Dinar', symbol: 'DT' },
  { code: 'UGX', country: 'Uganda', currency: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'ZMW', country: 'Zambia', currency: 'Zambian Kwacha', symbol: 'ZK' },
  { code: 'ZWL', country: 'Zimbabwe', currency: 'Zimbabwe Dollar', symbol: 'Z$' },
]

const legacyCurrencyMap = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '₦': 'NGN',
  '₵': 'GHS',
  KSh: 'KES',
  R: 'ZAR',
}

export function normalizeCurrencyCode(value) {
  const cleaned = String(value || '').trim()
  if (!cleaned) return 'USD'
  return legacyCurrencyMap[cleaned] || cleaned.toUpperCase()
}

export function getCurrencyOption(value) {
  const code = normalizeCurrencyCode(value)
  return currencyOptions.find((option) => option.code === code) || currencyOptions[0]
}

export function getCurrencySymbol(value) {
  return getCurrencyOption(value).symbol
}

export function formatCurrencyOption(option) {
  return `${option.country} - ${option.code} ${option.symbol} (${option.currency})`
}
