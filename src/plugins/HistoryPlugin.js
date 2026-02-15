import BasePlugin from './BasePlugin.js';

export default class HistoryPlugin extends BasePlugin {
    constructor(editor) {
        super(editor);
        this.history = [];
        this.index = -1;
        this.maxHistory = 50;
        this.isLocked = false;
    }

    init() {
        this.save();
        this.editor.wrapper.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    this.undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }

    save() {
        if (this.isLocked) return;

        const content = this.editor.editor.innerHTML;
        if (this.index >= 0 && this.history[this.index] === content) return;

        this.index++;
        this.history.splice(this.index);
        this.history.push(content);

        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.index--;
        }
    }

    undo() {
        if (this.index > 0) {
            this.isLocked = true;
            this.index--;
            this.apply(this.history[this.index]);
            this.isLocked = false;
        }
    }

    redo() {
        if (this.index < this.history.length - 1) {
            this.isLocked = true;
            this.index++;
            this.apply(this.history[this.index]);
            this.isLocked = false;
        }
    }

    apply(content) {
        this.editor.editor.innerHTML = content;
        this.editor.updateToolbar();
    }
}
