import BasePlugin from './BasePlugin.js';

export default class StatusPlugin extends BasePlugin {
    constructor(editor) {
        super(editor);
        this.statusElement = null;
    }

    init() {
        this.renderStatus();
        this.editor.editor.addEventListener('input', () => this.updateMetrics());
        this.updateMetrics();
    }

    renderStatus() {
        this.statusElement = document.createElement('div');
        this.statusElement.className = 'true-editor-status';
        this.statusElement.innerHTML = `
            <div class="true-status-metrics">
                <span id="true-word-count">0 words</span>
                <span id="true-char-count">0 chars</span>
            </div>
            <div class="true-status-info" id="true-save-status">Ready</div>
        `;
        this.editor.footer.appendChild(this.statusElement);
    }

    updateMetrics() {
        const text = this.editor.editor.innerText || "";
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;

        this.statusElement.querySelector('#true-word-count').innerText = `${words} words`;
        this.statusElement.querySelector('#true-char-count').innerText = `${chars} chars`;
    }

    setStatus(msg, isLoading = false) {
        const statusEl = this.statusElement.querySelector('#true-save-status');
        statusEl.innerText = msg;
        statusEl.style.opacity = isLoading ? '0.6' : '1';
    }

    updateState() {
        // Required by base class but metrics are handled by input event
    }
}
