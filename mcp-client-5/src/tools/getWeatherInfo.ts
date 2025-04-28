
import { generateText, tool } from 'ai';
import { z } from 'zod';

// getWeatherInfo使って、今日の tokyo の天気。わかりますか？
export const getWeatherInfo = tool({
  description: "特定の場所の現在の天気を取得する。",
  parameters: z.object({
    location: z.string().min(1, { message: '場所は必須です' })
  }),
  execute: async ({ location }) => {
    try{
      return await getWeather(location);
    }catch(e){
      return "Error, response <> OK:";
    }
  },
});
//return "reult : " + location;
//throw new Error("Error, response <> OK:")

const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = await geocodingResponse.json();
 
  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }
 
  const { latitude, longitude, name } = geocodingData.results[0];
 
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;
 
  const response = await fetch(weatherUrl);
  const data: WeatherResponse = await response.json();
 
  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
};
 
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return conditions[code] || "Unknown";
}