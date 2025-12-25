let scores = []; // TEMPORARY in-memory storage

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { username, mode, score } = data;

    if (!username || !mode || typeof score !== "number") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid fields" })
      };
    }

    scores.push({ username, mode, score });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
