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

  const body = (await request.json()) as { is_completed?: boolean };
  const isCompleted = body.is_completed;

  if (typeof isCompleted !== "boolean") {
    return NextResponse.json({ error: "is_completed must be boolean." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ is_completed: isCompleted })
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
