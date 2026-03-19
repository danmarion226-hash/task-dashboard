import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { is_completed?: boolean; due_date?: string | null };
  const updatePayload: { is_completed?: boolean; due_date?: string | null } = {};

  if (typeof body.is_completed === "boolean") {
    updatePayload.is_completed = body.is_completed;
  }

  if (typeof body.due_date === "string" || body.due_date === null) {
    const dueDate = body.due_date?.trim() ? body.due_date.trim() : null;

    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return NextResponse.json({ error: "due_date must be YYYY-MM-DD." }, { status: 400 });
    }

    updatePayload.due_date = dueDate;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json(
      { error: "Provide is_completed and/or due_date to update." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id,title,is_completed,due_date,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not update task." }, { status: 500 });
  }

  return NextResponse.json({ task: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Could not delete task." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
