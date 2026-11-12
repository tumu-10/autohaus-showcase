import { useEffect, useState } from "react";
import {
  INITIAL_CARS,
  INITIAL_HIRE_LISTINGS,
  listCars,
  listHireListings,
  subscribeToDemoData,
  type Car,
  type HireListing,
} from "@/services/carsService";

export function useCars() {
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);

  useEffect(() => {
    const refresh = () => setCars(listCars());
    refresh();
    return subscribeToDemoData(refresh);
  }, []);

  return cars;
}

export function useHireListings() {
  const [listings, setListings] = useState<HireListing[]>(INITIAL_HIRE_LISTINGS);

  useEffect(() => {
    const refresh = () => setListings(listHireListings());
    refresh();
    return subscribeToDemoData(refresh);
  }, []);

  return listings;
}
