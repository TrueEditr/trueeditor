import BasePlugin from './BasePlugin.js';

export default class SlashCommandPlugin extends BasePlugin {
    constructor(editor) {
        super(editor);
        this.menu = null;
        this.active = false;
    }

    init() {
        this.editor.editor.addEventListener('keydown', (e) => {
            // Changed to Ctrl+/ or Cmd+/ to avoid conflicts with typing
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                // REMOVED: Initial 'slash' feature check to allow free users to see menu
                // if (!this.editor.hasFeature('slash')) ...

                // Prevent insertion of '/' and show menu
                e.preventDefault();
                this.showMenu();
            } else if (this.active) {
                if (e.key === 'Escape') this.hideMenu();
            }
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (this.active && !this.menu.contains(e.target)) {
                this.hideMenu();
            }
        });
    }

    showMenu() {
        if (this.menu) return;

        this.menu = document.createElement('div');
        this.menu.className = 'true-slash-menu';

        const groups = {
            "Essentials": [
                { cmd: 'h1', label: 'Heading 1', icon: 'Type' },
                { cmd: 'h2', label: 'Heading 2', icon: 'Type' },
                { cmd: 'image', label: 'Image', icon: 'Image' },
                { cmd: 'link', label: 'Link', icon: 'Link' }
            ],
            "Pro Features": [
                { cmd: 'ai', label: 'AI Assistant', icon: 'Sparkles', color: '#7c3aed' },
                { cmd: 'table', label: 'Table', icon: 'Grid' },
                { cmd: 'code', label: 'Code Block', icon: 'Code' },
                { cmd: 'source', label: 'Source Code', icon: 'FileCode' }
            ]
        };

        // Icons map (simple SVGs or text)
        const getIcon = (name, color) => {
            const style = color ? `style="color: ${color}"` : '';
            if (name === 'Sparkles') return `<svg ${style} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2"/><path d="m19 21 1-2"/><path d="m5 21 1-2"/><path d="m19 3 1-2"/></svg>`;
            if (name === 'Grid') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`;
            if (name === 'Code') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
            if (name === 'FileCode') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>`;
            if (name === 'Type') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`;
            if (name === 'Image') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
            if (name === 'Link') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
            return name;
        };

        let html = '';
        for (const [group, items] of Object.entries(groups)) {
            html += `<div class="true-slash-group-title">${group}</div>`;
            html += items.map(item => {
                const isLocked = !this.editor.hasFeature(item.cmd);
                const lockIcon = isLocked ? '<span class="true-slash-lock">🔒</span>' : '';
                const style = isLocked ? 'opacity: 0.6;' : '';
                return `
                <div class="true-slash-item" data-cmd="${item.cmd}" style="${style}">
                    <span class="true-slash-icon">${getIcon(item.icon, item.color)}</span>
                    <span class="true-slash-label">
                        ${item.label}
                        ${item.cmd === 'ai' ? '<span class="true-slash-badge">FREE</span>' : ''}
                    </span>
                    ${lockIcon}
                </div>`;
            }).join('');
        }

        this.menu.innerHTML = html;

        this.editor.scrollArea.appendChild(this.menu);
        this.active = true;
        this.positionMenu();

        this.menu.addEventListener('click', (e) => {
            const item = e.target.closest('.true-slash-item');
            if (item) {
                e.stopPropagation();
                this.handleCommand(item.dataset.cmd);
                this.hideMenu();
            }
        });
    }

    positionMenu() {
        const selection = this.editor.shadow ? this.editor.shadow.getSelection() : window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const wrapperRect = this.editor.wrapper.getBoundingClientRect();

            // Calculate relative position within the wrapper
            // rect.bottom is viewport-relative. wrapperRect.top is viewport-relative.
            // We want top relative to wrapper, but accounting for scrollArea's position if needed.
            // Actually, simply appending to wrapper and using absolute might be safer if wrapper is relative.
            // But menu is in scrollArea. 

            // Let's rely on wrapper for stable positioning context
            // Move menu to wrapper instead of scrollArea to avoid overflow clipping issues?
            // User said it "disappears", likely due to overflow:hidden on scrollArea or similar/

            // BETTER FIX: Append to wrapper, position absolute relative to wrapper.
            if (this.menu.parentElement !== this.editor.wrapper) {
                this.editor.wrapper.appendChild(this.menu);
            }

            let top = rect.bottom - wrapperRect.top + 5; // 5px below cursor line
            let left = rect.left - wrapperRect.left;

            // Boundary checks
            if (left + 260 > wrapperRect.width) {
                left = wrapperRect.width - 270; // Keep it inside
            }
            if (top + 300 > wrapperRect.height) {
                // If close to bottom, show above
                top = rect.top - wrapperRect.top - 310;
            }

            this.menu.style.top = `${top}px`;
            this.menu.style.left = `${left}px`;
        }
    }

    hideMenu() {
        if (this.menu) {
            this.menu.remove();
            this.menu = null;
            this.active = false;
        }
    }

    handleCommand(cmd) {
        // Enforce Pro Checks on Click
        if (!this.editor.hasFeature(cmd)) {
            let label = cmd;
            if (cmd === 'code') label = "Code Block";
            if (cmd === 'source') label = "Source Code";
            this.editor.showUpgradeModal(label.charAt(0).toUpperCase() + label.slice(1), 'pro');
            return;
        }

        const insertPlugin = this.editor.plugins.get('insert');
        if (cmd === 'h1') this.editor.execCommand('formatBlock', 'h1');
        else if (cmd === 'h2') this.editor.execCommand('formatBlock', 'h2');
        else if (cmd === 'image') insertPlugin.insertImage();
        else if (cmd === 'link') insertPlugin.insertLink();
        else if (cmd === 'table') insertPlugin.insertTable();
        else if (cmd === 'code') this.editor.execCommand('formatBlock', 'pre');
        else if (cmd === 'ai') this.editor.plugins.get('toolbar')?.showAIPrompt();
        else if (cmd === 'source') this.editor.toggleSourceMode();
    }
}
