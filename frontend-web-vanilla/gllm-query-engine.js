async function queryGLLM(provider, question, context = "") {
  const cfg =
    typeof GLLM_QUERY_FORMATS !== "undefined"
      ? GLLM_QUERY_FORMATS[provider]
      : null;
  if (!cfg) {
    console.error("Unknown provider", provider);
    return "Unknown provider";
  }

  const payload = cfg.buildPayload(question, context);

  if (!cfg.endpoint) {
    return `Mock response from ${provider} for: "${question}"`;
  }

  try {
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (typeof parseGLLMResponse === "function") {
      return parseGLLMResponse(provider, data);
    }
    return data;
  } catch (err) {
    console.error("Failed to query provider", err);
    return "Error contacting provider";
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { queryGLLM };
}
