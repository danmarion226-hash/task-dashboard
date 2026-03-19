export type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  created_at: string;
};

export type WeatherData = {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
};

export type QuoteData = {
  text: string;
  author: string;
};
