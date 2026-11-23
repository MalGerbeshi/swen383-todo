import { TodoService } from './TodoService.js';
import { TodoRenderer } from './TodoRenderer.js';
import { LocalStorageHandler } from './LocalStorageHandler.js';
import { TodoController } from './TodoController.js';

// Composition root: the only place that decides which storage the app uses.
window.addEventListener('DOMContentLoaded', () => {
    const storage = new LocalStorageHandler();
    const service = new TodoService(storage);
    const renderer = new TodoRenderer('task-container');
    const controller = new TodoController(service, renderer);
    renderer.setController(controller);
    controller.start();

    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const addUrgentBtn = document.getElementById('add-urgent-btn');
    const undoBtn = document.getElementById('undo-btn');

    if (!input || !addBtn || !addUrgentBtn || !undoBtn) return;

    const updateUndoButton = () => {
        undoBtn.disabled = !service.canUndo();
    };

    updateUndoButton();

    addBtn.addEventListener('click', () => {
        if (controller.addTask(input.value, 'simple')) {
            input.value = '';
            updateUndoButton();
        }
    });

    addUrgentBtn.addEventListener('click', () => {
        if (controller.addTask(input.value, 'urgent')) {
            input.value = '';
            updateUndoButton();
        }
    });

    undoBtn.addEventListener('click', () => {
        if (controller.undo()) {
            updateUndoButton();
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addBtn.click();
        }
    });
});
