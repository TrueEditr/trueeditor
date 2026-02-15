import DOMPurify from 'dompurify';
import BasePlugin from './BasePlugin.js';

export default class SanitizePlugin extends BasePlugin {
    constructor(editor) {
        super(editor);
        this.purify = DOMPurify;
    }

    async init() {
        this.editor.editor.addEventListener('paste', (e) => this.handlePaste(e));
    }

    handlePaste(e) {
        if (!this.purify) return;

        e.preventDefault();
        const html = (e.clipboardData || window.clipboardData).getData('text/html');
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');

        const cleanHtml = this.purify.sanitize(html || text);
        this.editor.execCommand('insertHTML', cleanHtml);
    }
}
