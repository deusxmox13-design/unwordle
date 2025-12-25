import { createClient } from "@supabase/supabase-js";

export async function handler(event, context) {
  const body = JSON.parse(event.body || "{}");
  const { username, score } = body;

  if (!username || typeof score !== "number") {
    return { statusCode: 400, body: "Invalid data" };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const { error } = await supabase
    .from("leaderboard")
    .insert([{ username, score }]);

  if (error) {
    return { statusCode: 500, body: error.message };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}
