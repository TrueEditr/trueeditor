import BasePlugin from './BasePlugin.js';

export default class InsertPlugin extends BasePlugin {
    init() {
        this.setupImageResizing();
    }

    setupImageResizing() {
        this.editor.editor.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                if (!this.editor.hasFeature('resize')) {
                    this.editor.showUpgradeModal('Image Resizing', 'pro');
                    return;
                }
                this.selectImage(e.target);
            } else {
                this.deselectImage();
            }
        });
    }

    selectImage(img) {
        this.deselectImage();
        this.selectedImg = img;
        img.style.outline = '2px solid var(--primary)';
        img.style.cursor = 'nwse-resize';

        let isResizing = false;
        let startX, startWidth;

        const onMouseDown = (e) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startWidth = img.clientWidth;

            const onMouseMove = (moveEvent) => {
                if (!isResizing) return;
                const delta = moveEvent.clientX - startX;
                img.style.width = (startWidth + delta) + 'px';
                img.style.height = 'auto';
            };

            const onMouseUp = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                this.editor.saveHistory();
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        img.onmousedown = onMouseDown;
    }

    deselectImage() {
        if (this.selectedImg) {
            this.selectedImg.style.outline = 'none';
            this.selectedImg.onmousedown = null;
            this.selectedImg = null;
        }
    }

    async insertImage() {
        const choice = await this.editor.showPrompt("Image Source: 1 for URL, 2 for Local File", "1");

        if (choice === "1") {
            const url = await this.editor.showPrompt("Image URL", "https://");
            if (!url) return;
            this.doInsertImage(url);
        } else if (choice === "2") {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.doInsertImage(event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        }
    }

    async doInsertImage(url) {
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
        if (!this.editor.hasFeature('table')) {
            this.editor.showUpgradeModal('Table Builder', 'pro');
            return;
        }
        const rows = await this.editor.showPrompt("Rows", "3");
        if (rows === null) return;
        const cols = await this.editor.showPrompt("Columns", "3");
        if (cols === null) return;

        let html = '<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #e2e8f0;">';
        for (let i = 0; i < parseInt(rows); i++) {
            html += '<tr>';
            for (let j = 0; j < parseInt(cols); j++) {
                html += '<td style="border: 1px solid #e2e8f0; padding: 0.5rem;">Cell</td>';
            }
            html += '</tr>';
        }
        html += '</table><p><br></p>';
        this.editor.execCommand('insertHTML', html);
    }


}
