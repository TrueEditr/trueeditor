import BasePlugin from './BasePlugin.js';

export default class SlashCommandPlugin extends BasePlugin {
    constructor(editor) {
        super(editor);
        this.menu = null;
        this.active = false;
        this.savedRange = null;
    }

    init() {
        this.editor.editor.addEventListener('keydown', (e) => {
            // Support Ctrl+/ or Cmd+/ (Primary Shortcut)
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showMenu();
            } else if (this.active) {
                if (e.key === 'Escape') this.hideMenu();
            }
        });

        // Add '/' trigger for starting new lines (Standard modern UX)
        this.editor.editor.addEventListener('keyup', (e) => {
            if (e.key === '/' && !this.active) {
                const sel = this.editor.shadow.getSelection();
                if (sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    const container = range.startContainer;

                    // Check if we are at the start of a block/line with just '/'
                    const text = container.textContent || "";
                    if (text === '/') {
                        this.showMenu();
                    }
                }
            }
        });

        // Close menu on click outside (Handle Shadow DOM retargeting)
        document.addEventListener('mousedown', (e) => {
            if (this.active) {
                const path = e.composedPath();
                if (this.menu && !path.includes(this.menu)) {
                    this.hideMenu();
                }
            }
        });
    }

    showMenu() {
        if (this.menu) return;

        // Save current range to ensure we can restore it accurately
        const sel = this.editor.shadow.getSelection();
        if (sel.rangeCount > 0) {
            this.savedRange = sel.getRangeAt(0).cloneRange();
        }

        this.menu = document.createElement('div');
        this.menu.className = 'true-slash-menu';

        const groups = {
            "Formatting": [
                { cmd: 'bold', label: 'Bold', icon: 'Bold' },
                { cmd: 'italic', label: 'Italic', icon: 'Italic' },
                { cmd: 'underline', label: 'Underline', icon: 'Underline' }
            ],
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

        // Icons map
        const getIcon = (name, color) => {
            const style = color ? `style="color: ${color}"` : '';
            if (name === 'Sparkles') return `<svg ${style} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2"/><path d="m19 21 1-2"/><path d="m5 21 1-2"/><path d="m19 3 1-2"/></svg>`;
            if (name === 'Grid') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`;
            if (name === 'Code') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
            if (name === 'FileCode') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>`;
            if (name === 'Type') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`;
            if (name === 'Bold') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>`;
            if (name === 'Italic') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`;
            if (name === 'Underline') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>`;
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

        // Position & Show
        this.editor.scrollArea.appendChild(this.menu);
        this.active = true;
        this.positionMenu();

        this.menu.addEventListener('mousedown', (e) => {
            const item = e.target.closest('.true-slash-item');
            if (item) {
                e.preventDefault();
                e.stopPropagation();

                // Clear the '/' trigger text if it was used
                if (this.savedRange) {
                    const container = this.savedRange.startContainer;
                    if (container.textContent === '/') {
                        container.textContent = '';
                    }
                }

                this.handleCommand(item.dataset.cmd);
                this.hideMenu();
            }
        });
    }

    positionMenu() {
        if (!this.menu) return;
        const selection = this.editor.shadow.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const scrollRect = this.editor.scrollArea.getBoundingClientRect();

            // Calculate position relative to scrollArea
            let top = rect.bottom - scrollRect.top + this.editor.scrollArea.scrollTop + 8;
            let left = rect.left - scrollRect.left + this.editor.scrollArea.scrollLeft;

            // Boundary checks
            const menuWidth = 260;
            const menuHeight = 350; // Max expected height

            // Horizontal bounds
            if (left + menuWidth > this.editor.scrollArea.clientWidth) {
                left = Math.max(10, this.editor.scrollArea.clientWidth - menuWidth - 20);
            }

            // Vertical bounds - Tooltip overlap prevention
            const minTop = this.editor.scrollArea.scrollTop + 10;
            const maxBottomTop = this.editor.scrollArea.scrollTop + this.editor.scrollArea.clientHeight - menuHeight - 10;

            // Flip logic
            const spaceBelow = this.editor.scrollArea.clientHeight - (rect.bottom - scrollRect.top);
            if (spaceBelow < menuHeight && (rect.top - scrollRect.top) > menuHeight) {
                top = rect.top - scrollRect.top + this.editor.scrollArea.scrollTop - menuHeight - 8;
            }

            // Clamping to ensure it stays in the content area
            this.menu.style.top = `${Math.max(minTop, top)}px`;
            this.menu.style.left = `${Math.max(10, left)}px`;
            this.menu.style.zIndex = '9999';
        }
    }

    hideMenu() {
        if (this.menu) {
            this.menu.remove();
            this.menu = null;
            this.active = false;
            this.savedRange = null;
        }
    }

    handleCommand(cmd) {
        if (!this.editor.hasFeature(cmd)) {
            let label = cmd;
            if (cmd === 'code') label = "Code Block";
            if (cmd === 'source') label = "Source Code";
            this.editor.showUpgradeModal(label.charAt(0).toUpperCase() + label.slice(1), 'pro');
            return;
        }

        // Restore focus and precise selection range
        this.editor.editor.focus();
        if (this.savedRange) {
            const sel = this.editor.shadow.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.savedRange);
        }

        const insertPlugin = this.editor.plugins.get('insert');
        if (cmd === 'bold') this.editor.execCommand('bold');
        else if (cmd === 'italic') this.editor.execCommand('italic');
        else if (cmd === 'underline') this.editor.execCommand('underline');
        else if (cmd === 'h1') this.editor.execCommand('formatBlock', 'h1');
        else if (cmd === 'h2') this.editor.execCommand('formatBlock', 'h2');
        else if (cmd === 'image') insertPlugin.insertImage();
        else if (cmd === 'link') insertPlugin.insertLink();
        else if (cmd === 'table') insertPlugin.insertTable();
        else if (cmd === 'code') this.editor.execCommand('formatBlock', 'pre');
        else if (cmd === 'ai') this.editor.plugins.get('toolbar')?.showAIPrompt();
        else if (cmd === 'source') this.editor.toggleSourceMode();
    }
}
