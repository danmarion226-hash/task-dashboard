"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import type { QuoteData, Task, WeatherData } from "@/lib/types";

type DashboardProps = {
  username: string;
  email: string;
};

export function Dashboard({ username, email }: DashboardProps) {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadTasks = useCallback(async () => {
    setTasksError(null);
    const response = await fetch("/api/tasks", { cache: "no-store" });
    const payload = (await response.json()) as { tasks?: Task[]; error?: string };

    if (!response.ok) {
      setTasksError(payload.error ?? "Could not load tasks.");
      setIsLoadingTasks(false);
      return;
    }

    setTasks(payload.tasks ?? []);
    setIsLoadingTasks(false);
  }, []);

  const loadWeather = useCallback(async () => {
    setWeatherError(null);
    const response = await fetch("/api/weather", { cache: "no-store" });
    const payload = (await response.json()) as { weather?: WeatherData; error?: string };

    if (!response.ok || !payload.weather) {
      setWeatherError(payload.error ?? "Could not load weather.");
      return;
    }

    setWeather(payload.weather);
  }, []);

  const loadQuote = useCallback(async () => {
    setQuoteError(null);
    const response = await fetch("/api/quote", { cache: "no-store" });
    const payload = (await response.json()) as { quote?: QuoteData; error?: string };

    if (!response.ok || !payload.quote) {
      setQuoteError(payload.error ?? "Could not load quote.");
      return;
    }

    setQuote(payload.quote);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadTasks();
      void loadWeather();
      void loadQuote();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadQuote, loadTasks, loadWeather]);

  async function addTask() {
    const title = taskInput.trim();
    if (!title || isSavingTask) return;

    setIsSavingTask(true);
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, due_date: dueDateInput || null }),
    });
    const payload = (await response.json()) as { task?: Task; error?: string };
    setIsSavingTask(false);

    if (!response.ok || !payload.task) {
      setTasksError(payload.error ?? "Could not add task.");
      return;
    }

    setTaskInput("");
    setDueDateInput("");
    setTasks((prev) => [payload.task as Task, ...prev]);
  }

  async function toggleTask(task: Task) {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: !task.is_completed }),
    });
    const payload = (await response.json()) as { task?: Task; error?: string };

    if (!response.ok || !payload.task) {
      setTasksError(payload.error ?? "Could not update task.");
      return;
    }

    setTasks((prev) => prev.map((item) => (item.id === task.id ? payload.task! : item)));
  }

  async function deleteTask(task: Task) {
    const response = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setTasksError(payload.error ?? "Could not delete task.");
      return;
    }

    setTasks((prev) => prev.filter((item) => item.id !== task.id));
  }

  async function signOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#090b11] text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div>
            <p className="text-sm text-zinc-400">Magic Mirror Dashboard</p>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome, {username}</h1>
            <p className="text-sm text-zinc-500">{email}</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-60"
            onClick={signOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        <main className="grid gap-5 lg:grid-cols-3">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="mb-4 text-lg font-semibold">Weather</h2>
            {weatherError ? (
              <p className="text-sm text-red-300">{weatherError}</p>
            ) : weather ? (
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">{weather.location}</p>
                <p className="text-4xl font-bold">{weather.temperature} C</p>
                <p className="text-zinc-300">{weather.condition}</p>
                <p className="text-sm text-zinc-400">
                  H: {weather.high} C / L: {weather.low} C
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">Loading weather...</p>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Quote</h2>
              <button
                type="button"
                className="rounded-lg border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800"
                onClick={() => void loadQuote()}
              >
                Refresh
              </button>
            </div>
            {quoteError ? (
              <p className="text-sm text-red-300">{quoteError}</p>
            ) : quote ? (
              <blockquote className="space-y-3">
                <p className="leading-7 text-zinc-200">&quot;{quote.text}&quot;</p>
                <footer className="text-sm text-zinc-400">- {quote.author}</footer>
              </blockquote>
            ) : (
              <p className="text-sm text-zinc-400">Loading quote...</p>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="mb-4 text-lg font-semibold">Tasks</h2>

            <div className="mb-4 space-y-2">
              <input
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void addTask();
                }}
                placeholder="Add a task..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-500 focus:border-zinc-500"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dueDateInput}
                  onChange={(event) => setDueDateInput(event.target.value)}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 outline-none ring-0 focus:border-zinc-500"
                />
                <button
                  type="button"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-60"
                  onClick={() => void addTask()}
                  disabled={isSavingTask}
                >
                  Add
                </button>
              </div>
            </div>

            {tasksError ? <p className="mb-3 text-sm text-red-300">{tasksError}</p> : null}

            {isLoadingTasks ? (
              <p className="text-sm text-zinc-400">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-zinc-400">No tasks yet. Add your first task.</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
                  >
                    <button type="button" className="mr-2 text-left" onClick={() => void toggleTask(task)}>
                      <p
                        className={`text-sm transition ${
                          task.is_completed ? "text-zinc-500 line-through" : "text-zinc-200"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.due_date ? (
                        <p className="text-xs text-zinc-500">Due {task.due_date}</p>
                      ) : (
                        <p className="text-xs text-zinc-600">No due date</p>
                      )}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-300 transition hover:text-red-200"
                      onClick={() => void deleteTask(task)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
