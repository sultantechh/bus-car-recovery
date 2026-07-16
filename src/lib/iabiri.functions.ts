import { createServerFn } from "@tanstack/react-start";

const BASE = "https://api.iabiri.com/appApiV1";
const AUTH = "4F5D3QC5-C94A-CFD5-87C1-4E2903311DF0";
const TOKEN = "23D233D0-D78A-40C2-A211-19185B0C9E73";

const headers = {
  "content-type": "application/json",
  authorization: AUTH,
  referer: "https://bus-car.co.ke/",
  origin: "https://bus-car.co.ke",
};

async function post<T = unknown>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...body, token: TOKEN }),
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Upstream ${res.status}: ${text.slice(0, 200)}`);
  }
}

export type City = { id: string; city_name: string };

export type TripPrice = {
  currencyCode: string;
  amount: string;
  seatType: string;
};

export type Trip = {
  bus_id: string;
  route_id: string;
  bus_title: string;
  bus_type: string;
  amenities: string;
  departure_time: string;
  arrival_time: string;
  available_seat_count: number;
  total_journey_time: string;
  avg_rating: string;
  rating_count: string;
  defaultTripPriceList: TripPrice[];
  trip_code: string;
  ticket_amount: string;
  highWayDirectRoute: string;
};

export const getCities = createServerFn({ method: "GET" }).handler(async () => {
  const r = await post<{ data?: City[] }>("/common/getCity", {
    city_id: 0,
    city_type: "source",
  });
  return r.data ?? [];
});

export const getDestinations = createServerFn({ method: "POST" })
  .inputValidator((d: { city_id: number }) => d)
  .handler(async ({ data }) => {
    const r = await post<{ data?: City[] }>("/common/getCity", {
      city_id: data.city_id,
      city_type: "destination",
    });
    return r.data ?? [];
  });

export const searchTrips = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { source_city_id: number; destination_city_id: number; travel_date: string }) => d,
  )
  .handler(async ({ data }) => {
    const r = await post<{ data?: Trip[]; isSuccess?: boolean; message?: string }>(
      "/booking/filterBuses",
      {
        source_city_id: data.source_city_id,
        destination_city_id: data.destination_city_id,
        travel_date: data.travel_date,
        avg_rating: null,
        departure_time: null,
        fare: null,
        seat_type: "",
        travels: "",
        boarding_points: [],
        dropping_points: [],
        bus_with_amenities: [],
        high_rating: false,
        bus_with_live_tracking: false,
        cabs: false,
        hot_deals: false,
        on_time: false,
        bus_type: [],
        time_range: [],
        record_type: "data",
        currencyId: "1",
      },
    );
    return {
      trips: r.data ?? [],
      message: r.message ?? null,
    };
  });
