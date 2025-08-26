(function () {
  function loadAll() {
    return JSON.parse(localStorage.getItem("workflows") || "[]");
  }

  function saveAll(workflows) {
    localStorage.setItem("workflows", JSON.stringify(workflows));
  }

  function createWorkflow(name) {
    const wf = {
      id: `wf-${Date.now()}`,
      name: name || "Untitled Workflow",
      steps: [],
    };
    const all = loadAll();
    all.push(wf);
    saveAll(all);
    return wf;
  }

  function getWorkflow(id) {
    return loadAll().find((w) => w.id === id) || null;
  }

  function saveWorkflow(workflow) {
    const all = loadAll();
    const idx = all.findIndex((w) => w.id === workflow.id);
    if (idx >= 0) {
      all[idx] = workflow;
    } else {
      all.push(workflow);
    }
    saveAll(all);
  }

  function createStep(type, x, y) {
    return {
      id: `step-${Date.now()}`,
      type,
      x,
      y,
      title: type,
      description: "",
    };
  }

  function addStep(workflow, step) {
    workflow.steps.push(step);
  }

  window.WorkflowModel = {
    loadAll,
    createWorkflow,
    getWorkflow,
    saveWorkflow,
    createStep,
    addStep,
  };
})();
