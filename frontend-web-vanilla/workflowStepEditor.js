/**
 * WorkflowStepEditor provides helper utilities for editing a workflow step.
 * When invoked it navigates to a dedicated edit page for the step.
 */
(function () {
    /**
   * Opens the step editor page for a given step.
   * @param {string} stepId - Identifier of the step to edit
   */
    function open(stepId) {
        const wf = WorkflowEditor.getCurrentWorkflow();
        if (!wf) return;
        const url = `workflowStepEdit.html?wf=${wf.id}&step=${stepId}`;
        window.location.href = url;
    }

    window.WorkflowStepEditor = { open };
})();
