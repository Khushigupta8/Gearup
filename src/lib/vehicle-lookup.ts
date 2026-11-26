/** DVLA supplies registered details; model, mileage and gearbox remain staff-entered. */
export function vehicleLookupFields(vehicle: Record<string, unknown>) {
  const label = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim().toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()) : undefined;
  const number = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : undefined;
  const mot = vehicle.motExpiryDate ?? vehicle.motExpiry;
  return {
    make: label(vehicle.make), colour: label(vehicle.colour), fuel: label(vehicle.fuelType),
    year: number(vehicle.yearOfManufacture), engineCc: number(vehicle.engineCapacity),
    motExpiry: typeof mot === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(mot) ? mot : undefined,
  };
}
