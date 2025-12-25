import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { username, mode, score } = JSON.parse(event.body);

    if (!username || !mode || typeof score !== "number") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid fields" })
      };
    }

    const { error } = await supabase
      .from("leaderboard")
      .insert([{ username, mode, score }]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error("addScore error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
