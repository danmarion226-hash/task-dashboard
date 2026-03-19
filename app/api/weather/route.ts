import { NextResponse } from "next/server";

const DEFAULT_LAT = 41.3874;
const DEFAULT_LON = 2.1686;
const DEFAULT_LOCATION = "Barcelona";

function weatherCodeToCondition(code: number): string {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? DEFAULT_LAT);
  const lon = Number(searchParams.get("lon") ?? DEFAULT_LON);
  const location = searchParams.get("location") ?? DEFAULT_LOCATION;

  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,weather_code" +
    "&daily=temperature_2m_max,temperature_2m_min" +
    "&timezone=auto";

  const response = await fetch(weatherUrl, { next: { revalidate: 900 } });

  if (!response.ok) {
    return NextResponse.json({ error: "Could not load weather." }, { status: 502 });
  }

  const data = (await response.json()) as {
    current?: { temperature_2m?: number; weather_code?: number };
    daily?: { temperature_2m_max?: number[]; temperature_2m_min?: number[] };
  };

  const temperature = Math.round(data.current?.temperature_2m ?? 0);
  const weatherCode = data.current?.weather_code ?? -1;
  const high = Math.round(data.daily?.temperature_2m_max?.[0] ?? temperature);
  const low = Math.round(data.daily?.temperature_2m_min?.[0] ?? temperature);

  return NextResponse.json({
    weather: {
      location,
      temperature,
      condition: weatherCodeToCondition(weatherCode),
      high,
      low,
    },
  });
}
