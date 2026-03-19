import { NextResponse } from "next/server";

const FALLBACK_QUOTES = [
  {
    text: "Small progress each day adds up to big results.",
    author: "Anonymous",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
];

export async function GET() {
  try {
    const response = await fetch("https://api.quotable.io/random", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Quote provider unavailable");
    }

    const data = (await response.json()) as { content?: string; author?: string };
    const text = data.content?.trim();
    const author = data.author?.trim();

    if (!text || !author) {
      throw new Error("Quote response invalid");
    }

    return NextResponse.json({ quote: { text, author } });
  } catch {
    const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    return NextResponse.json({ quote: fallback });
  }
}
