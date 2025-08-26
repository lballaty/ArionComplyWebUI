function parseGLLMResponse(provider, response) {
  if (!response) return "";
  switch (provider) {
    case "openai":
      return response.choices && response.choices[0]
        ? response.choices[0].message.content
        : "";
    case "anthropic":
      return response.completion || "";
    default:
      if (typeof response === "string") return response;
      return JSON.stringify(response);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { parseGLLMResponse };
}
