import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const mode = params.mode || "daily";

  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("mode", mode)
      .order("score", { ascending: false })
      .limit(20);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("getLeaderboard error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
