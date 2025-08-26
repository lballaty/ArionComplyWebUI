(function () {
    function getParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function init() {
        const wfId = getParam('wf');
        const stepId = getParam('step');
        const wf = WorkflowEditor.loadWorkflow(wfId);
        if (!wf) return;
        const step = WorkflowEditor.getStep(stepId);
        if (!step) return;

        const titleInput = document.getElementById('step-title');
        const descInput = document.getElementById('step-desc');

        titleInput.value = step.title;
        descInput.value = step.description;

        document.getElementById('step-form').addEventListener('submit', (e) => {
            e.preventDefault();
            step.title = titleInput.value;
            step.description = descInput.value;
            WorkflowEditor.saveCurrentWorkflow();
            window.location.href = `workflowEngine.html?id=${wfId}`;
        });

        document.getElementById('cancel').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `workflowEngine.html?id=${wfId}`;
        });
    }

    window.WorkflowStepEdit = { init };
})();
