# Mockup Button Actions

This document lists the main buttons found in each HTML mockup screen and what action they perform. It also highlights areas where additional seed data or placeholder views would help the mockups behave more like a full application. All data is currently stored in **localStorage** for simulation purposes.
Seed data for calendars, tasks, workflows, relationship maps and other resources is initialized by `seedData.js` the first time each page loads. The script only writes to localStorage when no data exists so user changes persist.

## dashboard.html

- **Classify AI System** – navigates to `wizzard.html`.
- **Create Risk** – opens `listView.html?type=risks`.
- Risk heat map cells call `showRiskDetails` which displays an alert. A dedicated risk detail page would provide a better simulation.

## listView.html

- **Filter** – toggles the filter panel; **Apply Filters** and **Clear All** modify the list display.
- **Add AI System** – opens `wizzard.html`.
- **Export** and **Grid View** modify the display or show a notification.
- Row actions (**View**, **Edit**) just call `viewItem`/`editItem` with notifications. Creating detail/edit views would complete the workflow.
- Uses `initMockData` to seed AI systems, risks, or assets in localStorage.

## calendarView.html

- **Sync**, **Export**, **New Event** – show notifications.
- Navigation arrows call `previousMonth`/`nextMonth` and the view buttons switch between month/week.
- Clicking events opens a popup via `showEventDetails`.
- Seed data for calendar events could be stored in localStorage to persist new events.

## documentEditor.html

- Toolbar buttons (Bold, Italic, etc.) call `formatText`.
- **Templates**, **Comments**, **Export**, **Save** buttons show sidebars or notifications.
- **New Policy** creates a placeholder document.
- No persistence of edited content; storing documents in localStorage would allow a working demo.

## wizzard.html

- **Back to Inventory** – returns to `listView.html?type=ai`.
- **Save Draft**, **Previous**, **Continue** – show notifications and validate fields.
- Implementing draft storage in localStorage would let users resume assessments.

## searchInterface.html

- **Save Search**, **Export**, **Advanced** – all display notifications.
- Result actions (**View**, **Edit**, **Share**) trigger notifications only.
- Adding a result detail page and saving recent searches in localStorage would improve realism.

## chartView.html

- **Refresh**, **Export**, **New Chart** – update charts or show notifications.
- Individual chart actions (**Fullscreen**, **Configure**, **Download**) also display notifications.
- Charts use static data; consider seeding metric data in localStorage for dynamic updates.

## fileManager.html

- **Sync**, **New Folder**, **Upload** – show notifications.
- Tree actions (**Refresh**, **Collapse All**) update the folder sidebar.
- File actions (**Download**, **Share**, **Delete**) display notifications.
- Seed folders and files in localStorage so uploads or deletions persist during the session.

## formBuilder.html

- **Preview**, **Export**, **Save Form** – show notifications.
- Palette components are drag‑and‑drop; element controls allow moving or deleting fields.
- Storing form definitions in localStorage would allow returning to saved forms.

## treeView.html

- **Expand All**, **Collapse All**, **Export** – modify the tree view or show notifications.
- Node actions (**Refresh**, **Settings**) display notifications.
- A detail page for controls referenced in the matrix would complete the navigation flow.

## timelineView.html

- **Export**, **Share**, **Add Event** – show notifications or open modals.
- Time scale buttons and zoom controls modify the timeline display.
- Uses `initMockData` to create events in localStorage.

## kanbanBoard.html

- **Export**, **Filter**, **Add Task** – show notifications or open the task modal.
- Dragging cards between columns updates counts only visually.
- Seed task data in localStorage so board state persists and new tasks can be added.

## workflowEngine.html

- **Import**, **Deploy**, **New Workflow** – display notifications.
- Toolbar buttons select drawing tools; nodes can be dragged.
- Workflow definitions are not persisted. Saving to localStorage would enable reloading workflows.

## relationshipMapper.html

- **Auto Layout**, **Export**, **Save Map** – show notifications.
- Toolbar buttons choose selection or connection mode.
- No persistence for map nodes or connections; storing these in localStorage would help.

## reportBuilder.html

- **Load Template**, **Preview**, **Generate Report** – update the builder or show notifications.
- **Save Report**, **Share Report** – display notifications.
- Persisting report sections in localStorage would allow editing over multiple sessions.

## notificationCenter.html

- **Add** – adds a notification to localStorage via `addStoredNotification` and re-renders the list.
- Notifications already use localStorage for persistence.

## chatInterface.html

- **Send** and microphone buttons are placeholders; message history is static.
- **Avatar Settings** opens a modal and saves preferences in localStorage.

## timelineEnhancedFeatures.html

- Demo buttons (**Start Demo**, **Reset**, **Simulate Collaboration**) show or reset interactive examples.

## index.html

- Shows a splash screen, then a mock login leading to a settings page.

---

### Where Additional Seed Data or Views Would Help

- **Detail pages** for list items (risks, assets, AI systems, search results, tree controls). Each currently only shows a notification.
- **Persistent storage** for documents, forms, tasks, workflows, and relationship maps so user changes survive page reloads.
- **Calendar events** should be saved to localStorage when created.
- **Kanban board tasks** and **workflow definitions** could load from localStorage using a new `initMockData` helper similar to the tables and timeline events.

Providing these extra seeds or linking to placeholder detail screens would let every button perform a realistic action while still relying solely on localStorage.
