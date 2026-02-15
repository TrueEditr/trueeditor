import BasePlugin from './BasePlugin.js';

export default class ToolbarPlugin extends BasePlugin {
    constructor(editor) {
        super(editor);
        this.buttons = [];
    }

    init() {
        this.renderToolbar();
    }

    renderToolbar() {
        const toolbar = this.editor.toolbar;
        const insertPlugin = this.editor.plugins.get('insert');

        // Default Buttons
        const defaultButtons = [
            { cmd: 'bold', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>', title: 'Bold' },
            { cmd: 'italic', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>', title: 'Italic' },
            { cmd: 'underline', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>', title: 'Underline' },
            {
                type: 'dropdown',
                title: 'Text Size',
                options: [
                    { label: 'Tiny', value: '1' },
                    { label: 'Small', value: '2' },
                    { label: 'Normal', value: '3' },
                    { label: 'Large', value: '4' },
                    { label: 'Extra Large', value: '5' },
                    { label: 'Huge', value: '6' },
                    { label: 'Gigantic', value: '7' }
                ],
                action: (val) => {
                    if (!this.editor.hasFeature('typography')) {
                        this.editor.showUpgradeModal('Text Size', 'pro');
                        return;
                    }
                    this.editor.execCommand('fontSize', val);
                }
            },
            { type: 'sep' },
            { cmd: 'justifyLeft', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>', title: 'Align Left' },
            { cmd: 'justifyCenter', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>', title: 'Align Center' },
            { cmd: 'justifyRight', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>', title: 'Align Right' },
            { cmd: 'justifyFull', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>', title: 'Justify' },
            { type: 'sep' },
            { cmd: 'insertUnorderedList', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', title: 'Bullet List' },
            { cmd: 'insertOrderedList', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>', title: 'Numbered List' },
            { type: 'sep' },
            { cmd: 'insertImage', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', title: 'Image', action: () => insertPlugin.insertImage() },
            { cmd: 'insertLink', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', title: 'Link', action: () => insertPlugin.insertLink() },
            { cmd: 'insertTable', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', title: 'Table', action: () => insertPlugin.insertTable() },
            { type: 'sep' },
            {
                cmd: 'export',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
                title: 'Export',
                action: async () => {
                    if (!this.editor.hasFeature('export')) {
                        this.editor.showUpgradeModal('Global Export', 'pro');
                        return;
                    }
                    const choice = await this.editor.showPrompt("Export as: 1 for PDF, 2 for DOCX", "1");
                    const exportPlugin = this.editor.plugins.get('export');
                    if (choice === '1') exportPlugin.exportPDF();
                    else if (choice === '2') exportPlugin.exportDOCX();
                }
            },
            { cmd: 'save', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>', title: 'Save to Draft', action: () => this.editor.saveLocalContent() },
            { type: 'sep' },
            { cmd: 'source', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', title: 'Source Code', action: () => this.editor.toggleSourceMode() }
        ];

        // Always show AI button (clicking it will show proper error if disabled)
        defaultButtons.push({ type: 'sep' });
        defaultButtons.push({
            cmd: 'ai',
            id: 'true-ai-toolbar-btn',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#7c3aed"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2"/><path d="m19 21 1-2"/><path d="m5 21 1-2"/><path d="m19 3 1-2"/></svg>',
            title: 'AI Assistant',
            action: () => this.showAIPrompt()
        });


        defaultButtons.forEach(btnCfg => {
            if (btnCfg.type === 'sep') {
                const sep = document.createElement('div');
                sep.className = 'true-toolbar-sep';
                toolbar.appendChild(sep);
                return;
            }

            if (btnCfg.type === 'dropdown') {
                const select = document.createElement('select');
                select.className = 'true-toolbar-select';
                select.title = btnCfg.title;
                btnCfg.options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.value;
                    o.textContent = opt.label;
                    if (opt.value === '3') o.selected = true; // Default Normal
                    select.appendChild(o);
                });
                select.onchange = (e) => {
                    btnCfg.action(e.target.value);
                };
                toolbar.appendChild(select);
                this.buttons.push({ ...btnCfg, element: select });
                return;
            }

            const btn = document.createElement('button');
            btn.className = 'true-editor-btn';
            if (btnCfg.id) btn.id = btnCfg.id;
            btn.innerHTML = btnCfg.icon;
            btn.title = btnCfg.title;
            btn.onclick = () => {
                if (btnCfg.cmd && !this.editor.hasFeature(btnCfg.cmd)) {
                    this.editor.showUpgradeModal(btnCfg.title, 'pro');
                    return;
                }
                if (btnCfg.action) btnCfg.action();
                else this.editor.execCommand(btnCfg.cmd);
            };
            toolbar.appendChild(btn);
            this.buttons.push({ ...btnCfg, element: btn });
        });
    }

    async showAIPrompt() {
        console.log('🔵 AI Button Clicked!');
        console.log('AI Config:', this.editor.aiConfig);

        // Check if AI is actually enabled (NO fallback to true!)
        const aiEnabled = this.editor.aiConfig?.enabled;
        const aiConfigured = this.editor.aiConfig?.configured;

        console.log('AI Enabled:', aiEnabled, 'AI Configured:', aiConfigured);

        if (!aiEnabled) {
            console.log('❌ AI NOT ENABLED - Showing settings modal');
            await this.editor.showSettingsModal("AI features are currently disabled. Please enable AI in Dashboard Settings and configure your Gemini API key.");
            return;
        }

        if (!aiConfigured) {
            console.log('❌ AI NOT CONFIGURED - Showing settings modal');
            await this.editor.showSettingsModal("AI is enabled but not configured. Please add your Gemini API key in Dashboard Settings.");
            return;
        }

        console.log('✅ AI is enabled and configured. Creating popover...');

        const aiPlugin = this.editor.plugins.get('ai');

        // Context: Selection or Full Text
        const selection = this.editor.shadow.getSelection();
        console.log('🟢 Selection object:', selection);

        const hasSelection = selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
        console.log('🟢 Has selection:', hasSelection);

        const context = hasSelection ? selection.toString() : this.editor.editor.innerText;
        console.log('🟢 Context:', context ? context.substring(0, 50) + '...' : 'empty');

        // Save range to restore after popover interaction
        let savedRange = null;
        if (hasSelection) {
            savedRange = selection.getRangeAt(0).cloneRange();
            console.log('🟢 Saved range:', savedRange);
        }

        // Callback to bridge Popover UI with AI Plugin
        const onGenerate = async (prompt, textContext, action) => {
            console.log('🟢 onGenerate called with prompt:', prompt, 'action:', action);
            return await aiPlugin.generateResponse(prompt, textContext, action);
        };

        console.log('🟢 Calling showAIPopover with context:', context ? context.substring(0, 50) + '...' : 'empty');
        const result = await this.editor.showAIPopover(context, onGenerate);
        console.log('🟢 showAIPopover returned:', result);

        if (result && result.action === 'accept') {
            // Restore selection if we had one
            if (savedRange) {
                // We need to focus the editor first
                this.editor.editor.focus();
                const sel = this.editor.shadow.getSelection();
                sel.removeAllRanges();
                sel.addRange(savedRange);

                // EXPLICIT DELETE for "Replace Selection" logic
                // This ensures we don't just append if typeEffect gets confused
                // But AIPlugin.typeEffect now handles this internally too.
            }
            // Now insert the new text (typeEffect will just insert at cursor now)
            aiPlugin.handleAIResponse(result.text);
        }
    }

    updateState() {
        const isSource = this.editor.isSourceMode;
        this.buttons.forEach(btn => {
            if (btn.cmd === 'source') {
                if (isSource) btn.element.classList.add('active');
                else btn.element.classList.remove('active');
                return;
            }

            // Disable all other buttons in source mode
            btn.element.disabled = isSource;
            btn.element.style.opacity = isSource ? '0.5' : '1';
            btn.element.style.pointerEvents = isSource ? 'none' : 'auto';

            if (!isSource) {
                const isActive = document.queryCommandState(btn.cmd);
                if (isActive) btn.element.classList.add('active');
                else btn.element.classList.remove('active');
            } else {
                btn.element.classList.remove('active');
            }
        });
    }
}
