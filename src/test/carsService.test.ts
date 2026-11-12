import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCar,
  createHireListing,
  deleteCar,
  deleteHireListing,
  INITIAL_CARS,
  listCars,
  listHireListings,
  subscribeToDemoData,
  updateCar,
  updateHireListing,
  type Car,
  type HireListing,
} from "@/services/carsService";

describe("demo cars service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides complete mock cars with the requested vehicle fields", () => {
    expect(INITIAL_CARS.length).toBeGreaterThan(0);
    for (const car of INITIAL_CARS) {
      expect(car).toMatchObject({
        name: expect.any(String),
        model: expect.any(String),
        manufacturer: expect.any(String),
        manufacturingYear: expect.any(Number),
        currency: expect.stringMatching(/^(UGX|USD|KES|JPY|KRW)$/),
        mileage: expect.any(Number),
        fuelType: expect.stringMatching(/^(Petrol|Diesel|Hybrid|Electric)$/),
        transmission: expect.stringMatching(/^(Automatic|Manual)$/),
        engineCapacity: expect.any(Number),
        bodyType: expect.stringMatching(/^(SUV|Sedan|Hatchback|Pickup|Van|Coupe|Wagon)$/),
        exteriorColor: expect.any(String),
        interiorColor: expect.any(String),
        seats: expect.any(Number),
        driveType: expect.stringMatching(/^(FWD|RWD|AWD|4WD)$/),
        condition: expect.stringMatching(/^(New|Foreign Used|Locally Used)$/),
        availability: expect.stringMatching(/^(Available|Reserved|Sold|Hired)$/),
        location: expect.stringMatching(/^(Kampala|Mombasa|Tokyo|Seoul)$/),
        description: expect.any(String),
      });
    }
  });

  it("creates, updates, and deletes cars in local storage", () => {
    const sample = INITIAL_CARS[0];
    if (!sample) throw new Error("Expected an initial mock car.");
    const car: Car = { ...sample, id: "service-test-car" };

    createCar(car);
    expect(listCars().find((item) => item.id === car.id)).toEqual(car);

    const updated = { ...car, name: "Updated service test car" };
    updateCar(updated);
    expect(listCars().find((item) => item.id === car.id)?.name).toBe(updated.name);

    deleteCar(car.id);
    expect(listCars().some((item) => item.id === car.id)).toBe(false);
  });

  it("creates and updates hire listings through the same data service", () => {
    const listing: HireListing = {
      id: "service-test-hire",
      carId: INITIAL_CARS[0]?.id ?? "",
      dailyRate: 250_000,
      currency: "KES",
      availability: "Available",
      location: "Mombasa",
      terms: "Test terms.",
    };

    createHireListing(listing);
    expect(listHireListings()).toContainEqual(listing);

    const updated = { ...listing, availability: "Unavailable" as const, terms: "Updated test terms." };
    updateHireListing(updated);
    expect(listHireListings()).toContainEqual(updated);

    deleteHireListing(listing.id);
    expect(listHireListings()).not.toContainEqual(updated);
  });

  it("notifies subscribed public listings after demo data changes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToDemoData(listener);
    const sample = INITIAL_CARS[0];
    if (!sample) throw new Error("Expected an initial mock car.");
    createCar({ ...sample, id: "service-test-notify" });
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
