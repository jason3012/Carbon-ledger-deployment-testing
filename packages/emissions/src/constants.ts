// MCC Code to Category Mapping
export const MCC_CATEGORY_MAP: Record<string, string> = {
  // Fuel & Transportation
  '5541': 'transport.fuel',
  '5542': 'transport.fuel',
  '5172': 'transport.fuel',
  '5983': 'transport.fuel',
  '4111': 'transport.publictransit',
  '4112': 'transport.publictransit',
  '4131': 'transport.publictransit',
  '3000': 'transport.airline',
  '3001': 'transport.airline',
  '3002': 'transport.airline',
  '4511': 'transport.airline',
  
  // Utilities
  '4900': 'utilities.electricity',
  '4814': 'utilities.telecom',
  '4816': 'utilities.telecom',
  
  // Groceries
  '5411': 'grocery',
  '5412': 'grocery',
  '5422': 'grocery',
  '5451': 'grocery',
  
  // Restaurants & Food
  '5812': 'restaurants',
  '5813': 'restaurants',
  '5814': 'restaurants',
  
  // Apparel & Retail
  '5611': 'apparel',
  '5621': 'apparel',
  '5631': 'apparel',
  '5651': 'apparel',
  '5661': 'apparel',
  
  // Electronics
  '5732': 'electronics',
  '5045': 'electronics',
  '5065': 'electronics',
  
  // Home & Garden
  '5211': 'home',
  '5231': 'home',
  '5251': 'home',
  
  // Entertainment
  '7832': 'entertainment',
  '7841': 'entertainment',
  
  // Healthcare
  '8011': 'healthcare',
  '8021': 'healthcare',
  '8031': 'healthcare',
  '8041': 'healthcare',
  '8042': 'healthcare',
  '8043': 'healthcare',
  '8049': 'healthcare',
  '8050': 'healthcare',
  '8062': 'healthcare',
  '8071': 'healthcare',
};

// Keyword-based category classification
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'transport.fuel': ['gas', 'fuel', 'shell', 'exxon', 'chevron', 'bp', 'mobil', 'texaco', 'sunoco', 'valero'],
  'transport.publictransit': ['metro', 'subway', 'bus', 'transit', 'train', 'rail', 'bart', 'mta'],
  'transport.airline': ['airline', 'airways', 'flight', 'delta', 'united', 'american airlines', 'southwest'],
  'utilities.electricity': ['electric', 'power', 'utility', 'pge', 'energy'],
  'utilities.telecom': ['verizon', 'att', 't-mobile', 'sprint', 'comcast', 'xfinity', 'spectrum'],
  'grocery': ['grocery', 'supermarket', 'safeway', 'whole foods', 'trader joe', 'kroger', 'costco', 'walmart'],
  'restaurants': ['restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonald', 'burger', 'pizza', 'taco', 'subway'],
  'apparel': ['clothing', 'apparel', 'fashion', 'nike', 'adidas', 'zara', 'h&m', 'gap', 'nordstrom'],
  'electronics': ['electronics', 'apple', 'best buy', 'computer', 'phone', 'amazon'],
  'home': ['home depot', 'lowes', 'ikea', 'furniture', 'hardware'],
  'entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'hulu', 'disney', 'gaming'],
  'healthcare': ['hospital', 'clinic', 'pharmacy', 'cvs', 'walgreens', 'doctor', 'medical'],
};

// Default category for unclassified transactions
export const DEFAULT_CATEGORY = 'other';

