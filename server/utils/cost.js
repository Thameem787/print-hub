/**
 * Cost Calculation Engine for PrintHub
 *
 * Total Cost = Material Cost + Print Cost + Delivery Cost
 */

const MATERIAL_MULTIPLIERS = {
  PLA:   1.0,
  ABS:   1.2,
  PETG:  1.3,
  TPU:   1.8,
  Resin: 2.5,
};

const BASE_PRINT_COST_PER_GRAM = 0.8; // $/gram base printing fee
const DELIVERY_FLAT_FEE        = 5.0; // $ flat delivery fee
const DELIVERY_PER_KM          = 0.5; // $ per km for delivery

/**
 * Calculate order cost breakdown.
 *
 * @param {object} params
 * @param {string} params.material       - e.g. "PLA"
 * @param {number} params.estimatedGrams - weight in grams
 * @param {number} params.quantity       - number of copies
 * @param {string} params.deliveryType   - "pickup" | "delivery"
 * @param {number} params.pricePerGram   - vendor's filament price per gram
 * @param {number} [params.distanceKm]   - distance if delivery
 * @returns {{ materialCost, printCost, deliveryCost, totalCost }}
 */
export function calculateCost({
  material,
  estimatedGrams,
  quantity,
  deliveryType,
  pricePerGram,
  distanceKm = 0,
}) {
  const multiplier   = MATERIAL_MULTIPLIERS[material] ?? 1.0;
  const totalGrams   = estimatedGrams * quantity;

  const materialCost = parseFloat((totalGrams * pricePerGram * multiplier).toFixed(2));
  const printCost    = parseFloat((totalGrams * BASE_PRINT_COST_PER_GRAM * multiplier).toFixed(2));
  const deliveryCost =
    deliveryType === 'delivery'
      ? parseFloat((DELIVERY_FLAT_FEE + distanceKm * DELIVERY_PER_KM).toFixed(2))
      : 0;

  const totalCost = parseFloat((materialCost + printCost + deliveryCost).toFixed(2));

  return { materialCost, printCost, deliveryCost, totalCost };
}

/**
 * Haversine formula to calculate distance (km) between two lat/lng points.
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R    = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
