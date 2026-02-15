import BasePlugin from './BasePlugin.js';

export default class InsertPlugin extends BasePlugin {
    init() {
        // ...
    }

    async insertImage() {
        const url = await this.editor.showPrompt("Image URL", "https://");
        if (!url) return;
        const alt = await this.editor.showPrompt("Alt Text (for SEO)", "");

        const html = `<img src="${url}" alt="${alt || ''}" style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0;">`;
        this.editor.execCommand('insertHTML', html);
    }

    async insertLink() {
        const url = await this.editor.showPrompt("Link URL", "https://");
        if (!url) return;
        const text = await this.editor.showPrompt("Link Text", "Click here");

        const html = `<a href="${url}" target="_blank" style="color: #2563eb; text-decoration: underline;">${text || url}</a>`;
        this.editor.execCommand('insertHTML', html);
    }

    async insertTable() {
        if (!this.checkPlan('table')) return;

        const rows = await this.editor.showPrompt("Rows", "3");
        const cols = await this.editor.showPrompt("Columns", "3");

        if (!rows || !cols) return;

        let html = '<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #e2e8f0;">';
        for (let i = 0; i < rows; i++) {
            html += '<tr>';
            for (let j = 0; j < cols; j++) {
                html += '<td style="border: 1px solid #e2e8f0; padding: 0.5rem;">Cell</td>';
            }
            html += '</tr>';
        }
        html += '</table>';
        this.editor.execCommand('insertHTML', html);
    }

    checkPlan(feature) {
        const features = this.editor.config.features || [];
        if (!features.includes(feature)) {
            alert(`Feature "${feature}" is only available in the Pro plan.`);
            return false;
        }
        return true;
    }
}
