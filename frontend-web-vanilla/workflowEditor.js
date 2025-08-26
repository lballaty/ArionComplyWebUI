(function () {
  let currentWorkflow = null;

  function loadWorkflow(id) {
    currentWorkflow = WorkflowModel.getWorkflow(id);
    if (!currentWorkflow) {
      currentWorkflow = WorkflowModel.createWorkflow("New Workflow");
    }
    return currentWorkflow;
  }

  function createNewWorkflow(name) {
    currentWorkflow = WorkflowModel.createWorkflow(name);
    return currentWorkflow;
  }

  function handleNodeAdded(type, x, y, nodeId) {
    if (!currentWorkflow) {
      currentWorkflow = WorkflowModel.createWorkflow("New Workflow");
    }
    const step = WorkflowModel.createStep(type, x, y);
    step.id = nodeId;
    WorkflowModel.addStep(currentWorkflow, step);
  }

  function saveCurrentWorkflow() {
    if (currentWorkflow) {
      WorkflowModel.saveWorkflow(currentWorkflow);
    }
  }

  function getCurrentWorkflow() {
    return currentWorkflow;
  }

  function getStep(stepId) {
    if (!currentWorkflow) return null;
    return currentWorkflow.steps.find((s) => s.id === stepId) || null;
  }

  window.WorkflowEditor = {
    loadWorkflow,
    createNewWorkflow,
    handleNodeAdded,
    saveCurrentWorkflow,
    getCurrentWorkflow,
    getStep,
  };
})();
