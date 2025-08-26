document.addEventListener("DOMContentLoaded", function () {
  LayoutManager.initializePage("query-response-test-module.html");

  const askBtn = document.getElementById("askBtn");
  askBtn.addEventListener("click", async () => {
    const provider = document.getElementById("providerSelect").value;
    const question = document.getElementById("questionInput").value.trim();
    const output = document.getElementById("responseOutput");
    if (!question) return;
    output.textContent = "Querying...";
    const answer = await queryGLLM(provider, question);
    output.textContent = answer;
  });
});
