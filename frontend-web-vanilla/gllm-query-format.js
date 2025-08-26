const GLLM_QUERY_FORMATS = {
  openai: {
    endpoint: "/api/openai",
    buildPayload: function (question, context = "") {
      return {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: context },
          { role: "user", content: question },
        ],
      };
    },
  },
  anthropic: {
    endpoint: "/api/anthropic",
    buildPayload: function (question, context = "") {
      return {
        prompt: `${context}\n\nHuman: ${question}\n\nAssistant:`,
        model: "claude-v2",
      };
    },
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = GLLM_QUERY_FORMATS;
}
