import { createClient } from "@supabase/supabase-js";

export async function handler(event, context) {
  const supabase = createClient(
    process.env.https://grtfmpjuktcabembuzla.supabase.co,
    process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydGZtcGp1a3RjYWJlbWJ1emxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MjIwMzEsImV4cCI6MjA4MjE5ODAzMX0.sk3cQv8XpcVGMrqSVgeGgW-kbu5oiNQBGRxe2z46wLE
  );

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    return { statusCode: 500, body: error.message };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}

