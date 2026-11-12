import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  AVAILABILITIES,
  BODY_TYPES,
  CONDITIONS,
  CURRENCIES,
  DRIVE_TYPES,
  FUEL_TYPES,
  INITIAL_CARS,
  LOCATIONS,
  TRANSMISSIONS,
  type Car,
} from "@/services/carsService";

type Props = {
  initial?: Car;
  onSave: (car: Car) => void;
  onCancel: () => void;
};

function TextField({
  label,
  value,
  onChange,
  type = "text",
  min,
  step,
  required = true,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  min?: number;
  step?: number;
  required?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="eyebrow mb-2 block text-[0.6rem]">{label}</span>
      <input
        type={type}
        required={required}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full min-w-0 border bg-background px-3 text-base outline-none focus:border-brand"
      />
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <label className="block min-w-0">
      <span id={`${id}-label`} className="eyebrow mb-2 block text-[0.6rem]">{label}</span>
      <select id={id} aria-labelledby={`${id}-label`} value={value} onChange={(event) => onChange(event.target.value as T)} className="min-h-11 w-full min-w-0 border bg-background px-3 text-base outline-none focus:border-brand">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function blankCar(): Car {
  const sample = INITIAL_CARS[0];
  if (!sample) throw new Error("A default car form value is required.");
  return {
    ...sample,
    id: "",
    name: "",
    model: "",
    manufacturer: "",
    manufacturingYear: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    engineCapacity: 0,
    exteriorColor: "",
    interiorColor: "",
    seats: 5,
    description: "",
    images: [],
  };
}

export function CarForm({ initial, onSave, onCancel }: Props) {
  const [car, setCar] = useState<Car>(() => initial ?? blankCar());
  const set = <K extends keyof Car>(key: K, value: Car[K]) => setCar((current) => ({ ...current, [key]: value }));
  const setNumber = (key: "manufacturingYear" | "price" | "mileage" | "engineCapacity" | "seats", value: string) => {
    set(key, value === "" ? 0 : Number(value));
  };

  function setImage(index: number, value: string) {
    setCar((current) => {
      const images = current.images.slice(0, 4);
      while (images.length <= index) images.push("");
      images[index] = value;
      while (images.length > 0 && !images[images.length - 1]) images.pop();
      return { ...current, images };
    });
  }

  async function chooseImage(index: number, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Unable to prepare the selected car image.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("Unable to compress the selected car image."));
        }, "image/jpeg", 0.82);
      });
      const reader = new FileReader();
      const image = await new Promise<string>((resolve, reject) => {
        reader.onerror = () => reject(reader.error ?? new Error("Unable to read the selected car image."));
        reader.onload = () => typeof reader.result === "string"
          ? resolve(reader.result)
          : reject(new Error("Unable to read the selected car image."));
        reader.readAsDataURL(blob);
      });
      setImage(index, image);
    } catch (error) {
      console.error("Unable to process the selected car image.", error);
      toast.error("Unable to load this image. Try another image file.");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const images = car.images.filter(Boolean).slice(0, 4);
    if (!images[0]) {
      toast.error("Add a main car image before saving.");
      return;
    }
    onSave({ ...car, id: initial?.id ?? `demo-car-${Date.now()}`, images });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField label="Name" value={car.name} onChange={(value) => set("name", value)} />
        <TextField label="Model" value={car.model} onChange={(value) => set("model", value)} />
        <TextField label="Manufacturer" value={car.manufacturer} onChange={(value) => set("manufacturer", value)} />
        <TextField label="Manufacturing year" type="number" min={1900} step={1} value={car.manufacturingYear} onChange={(value) => setNumber("manufacturingYear", value)} />
        <TextField label="Price" type="number" min={0} step={1} value={car.price} onChange={(value) => setNumber("price", value)} />
        <SelectField label="Currency" value={car.currency} options={CURRENCIES} onChange={(value) => set("currency", value)} />
        <TextField label="Mileage (km)" type="number" min={0} step={1} value={car.mileage} onChange={(value) => setNumber("mileage", value)} />
        <SelectField label="Fuel type" value={car.fuelType} options={FUEL_TYPES} onChange={(value) => set("fuelType", value)} />
        <SelectField label="Transmission" value={car.transmission} options={TRANSMISSIONS} onChange={(value) => set("transmission", value)} />
        <TextField label="Engine capacity (cc)" type="number" min={0} step={1} value={car.engineCapacity} onChange={(value) => setNumber("engineCapacity", value)} />
        <SelectField label="Body type" value={car.bodyType} options={BODY_TYPES} onChange={(value) => set("bodyType", value)} />
        <TextField label="Exterior color" value={car.exteriorColor} onChange={(value) => set("exteriorColor", value)} />
        <TextField label="Interior color" value={car.interiorColor} onChange={(value) => set("interiorColor", value)} />
        <TextField label="Seats" type="number" min={1} step={1} value={car.seats} onChange={(value) => setNumber("seats", value)} />
        <SelectField label="Drive type" value={car.driveType} options={DRIVE_TYPES} onChange={(value) => set("driveType", value)} />
        <SelectField label="Condition" value={car.condition} options={CONDITIONS} onChange={(value) => set("condition", value)} />
        <SelectField label="Availability" value={car.availability} options={AVAILABILITIES} onChange={(value) => set("availability", value)} />
        <SelectField label="Location" value={car.location} options={LOCATIONS} onChange={(value) => set("location", value)} />
      </div>
      <label className="block">
        <span className="eyebrow mb-2 block text-[0.6rem]">Description</span>
        <textarea required value={car.description} onChange={(event) => set("description", event.target.value)} rows={4} className="w-full border bg-background p-3 text-base outline-none focus:border-brand" />
      </label>
      <section className="space-y-4">
        <div>
          <p className="eyebrow text-[0.6rem]">Vehicle photos</p>
          <p className="mt-1 text-sm text-muted-foreground">Add up to four images. The main image appears on the car card; the others appear in the gallery and details.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => {
            const image = car.images[index] ?? "";
            return (
              <div key={index} className="min-w-0 space-y-3 border p-3">
                <p className="eyebrow text-[0.6rem]">{index === 0 ? "Main image" : `Gallery image ${index + 1}`}</p>
                <label className="block min-w-0">
                  <span className="eyebrow mb-2 block text-[0.55rem] text-muted-foreground">Image URL</span>
                  <input
                    type="text"
                    value={image.startsWith("data:") ? "" : image}
                    placeholder="Paste an image URL"
                    onChange={(event) => setImage(index, event.target.value)}
                    className="min-h-11 w-full min-w-0 border bg-background px-3 text-base outline-none focus:border-brand"
                  />
                </label>
                <label className="block min-w-0">
                  <span className="eyebrow mb-2 block text-[0.55rem] text-muted-foreground">Or attach an image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => { void chooseImage(index, event.target.files?.[0]); event.currentTarget.value = ""; }}
                    className="min-h-11 w-full min-w-0 border bg-background px-2 py-2 text-sm file:mr-3 file:border-0 file:bg-secondary file:px-3 file:py-1"
                  />
                </label>
                {image && (
                  <div className="relative">
                    <img src={image} alt={`${index === 0 ? "Main" : `Gallery ${index + 1}`} car preview`} className="aspect-[3/2] w-full bg-secondary object-cover" />
                    <button type="button" onClick={() => setImage(index, "")} className="eyebrow mt-2 inline-flex min-h-11 items-center border px-3 py-2">Remove image</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
        <button type="button" onClick={onCancel} className="eyebrow min-h-11 border px-5 py-3">Cancel</button>
        <button type="submit" className="eyebrow min-h-11 bg-brand px-5 py-3 text-primary-foreground">Save car</button>
      </div>
    </form>
  );
}
