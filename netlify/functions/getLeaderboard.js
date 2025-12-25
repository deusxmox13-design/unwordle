let scores = []; // TEMPORARY in-memory storage

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const mode = params.mode || "daily";

  try {
    const filtered = scores
      .filter(s => s.mode === mode)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return {
      statusCode: 200,
      body: JSON.stringify(filtered)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
