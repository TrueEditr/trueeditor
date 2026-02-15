import BasePlugin from './plugins/BasePlugin.js';
import ToolbarPlugin from './plugins/ToolbarPlugin.js';
import HistoryPlugin from './plugins/HistoryPlugin.js';
import SlashCommandPlugin from './plugins/SlashCommandPlugin.js';
import InsertPlugin from './plugins/InsertPlugin.js';
import AIPlugin from './plugins/AIPlugin.js';
import StatusPlugin from './plugins/StatusPlugin.js';
import MarkdownPlugin from './plugins/MarkdownPlugin.js';
import ExportPlugin from './plugins/ExportPlugin.js';

class TrueEditr {
    constructor(config) {
        this.apiKey = config.key;
        this.selector = config.selector;
        this.apiUrl = config.apiUrl || (typeof window !== 'undefined' ? `${window.location.origin}/api` : "https://trueeditr.in/api");
        this.plugins = new Map();
        this.isSourceMode = false;
        this.history = [];
        this.historyIndex = -1;
        this.plan = 'free'; // default
        this.tierFeatures = {
            free: [
                'bold', 'italic', 'underline', 'strikethrough',
                'h1', 'h2', 'h3', 'formatBlock',
                'insertUnorderedList', 'insertOrderedList',
                'createLink', 'insertLink', 'unlink', 'link',
                'insertImage', 'image_url', 'image',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'align',
                'autosave', 'status', 'history', 'undo', 'redo', 'source', 'ai', 'save'
            ],
            pro: [
                'slash', 'upload', 'resize',
                'table', 'insertTable',
                'code', 'insertCode',
                'markdown', 'export', 'typography', 'fontSize'
            ],
            enterprise: ['collab', 'white_label']
        };

        this.container = typeof document !== 'undefined' ? document.querySelector(this.selector) : null;

        if (!this.container) {
            console.error("TrueEditr: Container not found");
            return;
        }

        this.init();
    }

    async init() {
        try {
            const res = await fetch(`${this.apiUrl}/editor/init`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey: this.apiKey })
            });

            if (!res.ok) {
                const error = await res.json();
                this.renderError(error.error || "Initialization failed", error.upgrade);
                return;
            }

            const data = await res.json();
            this.config = data.config;
            this.aiConfig = data.config.ai;
            this.plan = (data.config.plan || 'free').toLowerCase();

            // Debug: Log the configuration received from API
            console.log('TrueEditr Config:', {
                plan: this.plan,
                features: this.config.features,
                ai: this.aiConfig
            });

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(`trueeditr_config_${this.apiKey}`, JSON.stringify(data));
            }

            this.renderEditor();
        } catch (err) {
            console.error("TrueEditr: Connection error", err);
            const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(`trueeditr_config_${this.apiKey}`) : null;
            if (cached) {
                const data = JSON.parse(cached);
                this.config = data.config;
                this.aiConfig = data.config.ai;
                this.plan = (data.config.plan || 'free').toLowerCase();
                this.renderEditor();
                console.warn("TrueEditr: Offline mode.");
            } else {
                // Fallback for local testing
                console.warn("TrueEditr: API connection failed. Falling back to default config for local testing.");
                this.config = { features: ['bold', 'italic', 'underline', 'ai'], ai: { enabled: true, configured: true } };
                this.aiConfig = { enabled: true, configured: true };
                this.plan = 'pro'; // Allow dev testing bypass if offline and no cache
                this.renderEditor();
            }
        }
    }

    renderError(msg, upgradeLink) {
        this.container.innerHTML = `
            <div style="border: 1px solid #ef4444; background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 0.5rem; font-family: sans-serif;">
                <strong>Editor Error:</strong> ${msg}
                ${upgradeLink ? `<br><a href="${upgradeLink}" target="_blank" style="color: #b91c1c; text-decoration: underline;">Upgrade Plan</a>` : ''}
            </div>
        `;
    }

    renderEditor() {
        // Create Shadow DOM
        this.shadow = this.container.attachShadow({ mode: 'open' });

        // Create Wrapper
        this.wrapper = document.createElement("div");
        this.wrapper.className = "true-editor-wrapper";

        // Inject Styles (In Shadow DOM)
        this.injectStyles();

        // Create Toolbar
        this.toolbar = document.createElement("div");
        this.toolbar.className = "true-editor-toolbar";
        this.wrapper.appendChild(this.toolbar);

        // Create Scrollable Area
        this.scrollArea = document.createElement("div");
        this.scrollArea.className = "true-editor-scroll-area";
        this.wrapper.appendChild(this.scrollArea);

        this.editor = document.createElement("div");
        this.editor.className = "true-editor-content";
        this.editor.contentEditable = true;
        this.scrollArea.appendChild(this.editor);

        // Create Source Area (hidden by default)
        this.sourceArea = document.createElement("textarea");
        this.sourceArea.className = "true-editor-content true-editor-source";
        this.sourceArea.style.display = "none";
        this.scrollArea.appendChild(this.sourceArea);

        // Create Footer
        this.footer = document.createElement("div");
        this.footer.className = "true-editor-footer";
        this.wrapper.appendChild(this.footer);

        this.shadow.appendChild(this.wrapper);

        this.registerPlugin('history', HistoryPlugin);
        this.registerPlugin('status', StatusPlugin);
        this.registerPlugin('insert', InsertPlugin);
        this.registerPlugin('ai', AIPlugin);
        this.registerPlugin('markdown', MarkdownPlugin);
        this.registerPlugin('export', ExportPlugin);
        this.registerPlugin('toolbar', ToolbarPlugin);
        this.registerPlugin('slash', SlashCommandPlugin);

        this.updateUIForPlan();
        this.loadLocalContent();
        this.setupEventListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
            
            :host { 
                display: block; 
                --primary: #2563eb; 
                --primary-hover: #1d4ed8;
                --gray-50: #f8fafc; 
                --gray-100: #f1f5f9; 
                --gray-200: #e2e8f0; 
                --gray-300: #cbd5e1; 
                --gray-600: #475569; 
                --gray-900: #0f172a; 
                --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            }
            
            .true-editor-wrapper { 
                font-family: 'Inter', system-ui, -apple-system, sans-serif; 
                border: 1px solid var(--gray-200); 
                border-radius: 1rem; 
                overflow: hidden; 
                display: flex; 
                flex-direction: column; 
                height: 750px; 
                background: #fff; 
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                box-shadow: var(--shadow-sm);
            }
            .true-editor-scroll-area {
                flex: 1;
                overflow-y: auto;
                padding-bottom: 5rem;
                position: relative;
            }
            .true-editor-wrapper:focus-within {
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }

            .true-editor-toolbar { 
                background: #fff; 
                border-bottom: 1px solid var(--gray-200); 
                padding: 0.75rem; 
                display: flex; 
                gap: 0.5rem; 
                align-items: center; 
                flex-wrap: wrap; 
                position: sticky; 
                top: 0; 
                z-index: 10;
            }
            
            .true-editor-btn { 
                background: transparent; 
                border: 1px solid transparent; 
                border-radius: 0.5rem; 
                padding: 0.5rem; 
                cursor: pointer; 
                color: var(--gray-600); 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                transition: all 0.2s; 
                min-width: 2.25rem; 
                height: 2.25rem;
            }
            .true-editor-btn:hover { background: var(--gray-100); color: var(--gray-900); }
            .true-editor-btn.active { background: #eff6ff; color: var(--primary); border-color: #dbeafe; }
            .true-editor-btn svg { width: 1.25rem; height: 1.25rem; }

            .true-toolbar-select {
                background: var(--gray-50);
                border: 1px solid var(--gray-200);
                border-radius: 0.5rem;
                padding: 0.25rem 0.5rem;
                font-size: 0.85rem;
                color: var(--gray-900);
                outline: none;
                cursor: pointer;
                transition: all 0.2s;
            }
            .true-toolbar-select:hover { border-color: var(--primary); }

            .true-toolbar-sep {
                width: 1px;
                background: var(--gray-200);
                height: 1.5rem;
                margin: 0 0.25rem;
            }

            .true-editor-content { 
                flex: 1; 
                background: white; 
                margin: 2rem auto; 
                padding: 3rem 4rem; 
                width: 100%; 
                max-width: 800px; 
                box-sizing: border-box; 
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); 
                border-radius: 0.5rem; 
                min-height: 800px; 
                outline: none; 
                color: var(--gray-900); 
                line-height: 1.7;
                font-size: 1.05rem;
                overflow-y: auto;
            }
            .true-editor-content:empty:before { content: "Start writing..."; color: var(--gray-300); pointer-events: none; }

            /* Typography & Pro Elements */
            .true-editor-content h1 { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.025em; margin: 2rem 0 1rem; color: #111827; line-height: 1.1; }
            .true-editor-content h2 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.025em; margin: 1.75rem 0 0.75rem; color: #1f2937; line-height: 1.2; }
            .true-editor-content h3 { font-size: 1.35rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #374151; }
            .true-editor-content p { margin-bottom: 1.25rem; }
            .true-editor-content ul, .true-editor-content ol { 
                margin: 1rem 0; 
                padding-left: 2.5rem; 
            }
            .true-editor-content li { 
                margin-bottom: 0.5rem; 
                padding-left: 0.5rem;
            }
            .true-editor-content li > ul, .true-editor-content li > ol { 
                margin: 0.5rem 0; 
                list-style-type: circle; /* nested bullets */
            }
            .true-editor-content ol[type="a"] { list-style-type: lower-alpha; }
            .true-editor-content ol[type="i"] { list-style-type: lower-roman; }
            
            .true-editor-content blockquote { 
                border-left: 4px solid var(--primary); 
                background: #f8fafc; 
                padding: 1rem 1.5rem; 
                margin: 1.5rem 0; 
                font-style: italic; 
                color: #4b5563; 
                border-radius: 0 0.5rem 0.5rem 0;
            }

            .true-editor-content pre { 
                background: #1e293b; 
                color: #e2e8f0; 
                padding: 1rem; 
                border-radius: 0.5rem; 
                overflow-x: auto; 
                margin: 1.5rem 0; 
                font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                font-size: 0.9em;
            }
            .true-editor-content code { 
                font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                background: #f1f5f9; 
                padding: 0.2rem 0.4rem; 
                border-radius: 0.25rem; 
                font-size: 0.85em; 
                color: #ef4444; 
            }
            .true-editor-content pre code { 
                background: transparent; 
                padding: 0; 
                color: inherit; 
                font-size: inherit; 
            }

            .true-editor-content a { color: var(--primary); text-decoration: underline; text-underline-offset: 2px; }
            .true-editor-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0; }

            .true-editor-content table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 1.5rem 0; 
                font-size: 0.95rem; 
            }
            .true-editor-content th, .true-editor-content td { 
                border: 1px solid var(--gray-200); 
                padding: 0.75rem; 
                text-align: left; 
            }
            .true-editor-content th { 
                background: var(--gray-50); 
                font-weight: 600; 
                color: var(--gray-900); 
            }
            .true-editor-content tr:hover td { background: #f8fafc; }

            .true-editor-content.true-editor-source { 
                display: none; 
                font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                background: #0f172a; 
                color: #e2e8f0; 
                border: none; 
                resize: none; 
                white-space: pre-wrap;
                padding: 2rem;
            }

            .true-slash-menu { 
                position: absolute; 
                background: white; 
                border: 1px solid var(--gray-200); 
                border-radius: 0.75rem; 
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); 
                z-index: 1000; 
                width: 260px; 
                padding: 0.5rem; 
                max-height: 400px;
                overflow-y: auto;
                animation: trueFadeIn 0.2s ease-out; 
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            @keyframes trueFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            
            .true-slash-group-title {
                font-size: 0.7rem;
                font-weight: 600;
                color: var(--gray-600);
                padding: 0.5rem 0.75rem 0.25rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .true-slash-item { 
                padding: 0.6rem 0.75rem; 
                cursor: pointer; 
                border-radius: 0.5rem; 
                display: flex; 
                align-items: center; 
                gap: 0.75rem; 
                font-size: 0.9rem; 
                color: var(--gray-900); 
                transition: all 0.2s; 
            }
            .true-slash-item:hover { background: var(--gray-50); }
            
            .true-slash-icon { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                width: 24px; 
                height: 24px; 
                color: var(--gray-600);
            }
            .true-slash-icon svg { width: 100%; height: 100%; }
            
            .true-slash-label { flex: 1; display: flex; align-items: center; gap: 0.5rem; }
            .true-slash-badge { background: #dbeafe; color: #1e40af; font-size: 0.65rem; padding: 0.1rem 0.3rem; border-radius: 4px; font-weight: 600; }
            .true-slash-lock { font-size: 0.8rem; opacity: 0.5; }

            /* Modals */
            .true-modal-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 2000; border-radius: 0.75rem; }
            .true-modal { background: white; border-radius: 1rem; padding: 1.5rem; width: 90%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
            .true-modal-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--gray-900); }
            .true-modal-input { width: 100%; border: 1px solid var(--gray-200); border-radius: 0.6rem; padding: 0.75rem; margin-bottom: 1.25rem; outline: none; box-sizing: border-box; font-family: inherit; font-size: 0.95rem; }
            .true-modal-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
            .true-modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
            .true-modal-btn { padding: 0.625rem 1.25rem; border-radius: 0.6rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; }
            .true-modal-btn-primary { background: var(--primary); color: white; }
            .true-modal-btn-primary:hover { background: #1d4ed8; }
            .true-modal-btn-secondary { background: white; color: var(--gray-600); border-color: var(--gray-200); }
            .true-modal-btn-secondary:hover { background: var(--gray-50); border-color: var(--gray-300); }

            /* Footer & Status */
            .true-editor-footer { border-top: 1px solid var(--gray-200); background: #fff; padding: 0.5rem 1rem; }
            .true-editor-status { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--gray-600); }
            .true-status-metrics { display: flex; gap: 1rem; }
            .true-status-metrics span { font-weight: 500; }
            .true-status-info { font-style: italic; }

            /* AI Popover */
            .true-ai-popover {
                position: absolute;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(12px) saturate(180%);
                -webkit-backdrop-filter: blur(12px) saturate(180%);
                border: 1px solid rgba(209, 213, 219, 0.4);
                border-radius: 12px;
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                padding: 0.75rem;
                width: 380px;
                max-width: calc(100% - 20px);
                box-sizing: border-box;
                z-index: 2000;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                animation: true-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes true-pop-in {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }

            .true-ai-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 700;
                font-size: 0.85rem;
                color: #7c3aed;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .true-ai-input-wrapper {
                position: relative;
                background: rgba(243, 244, 246, 0.5);
                border-radius: 8px;
                border: 1px solid transparent;
                transition: all 0.2s;
            }

            .true-ai-input-wrapper:focus-within {
                background: #fff;
                border-color: #7c3aed;
                box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
            }

            .true-ai-input {
                width: 100%;
                background: transparent;
                border: none;
                padding: 0.6rem 0.75rem;
                font-size: 0.95rem;
                font-family: inherit;
                color: var(--gray-900);
                outline: none;
                resize: none;
                min-height: 40px;
                max-height: 120px;
                overflow-y: auto; /* ENABLE SCROLL FOR INPUT */
            }

            /* Result area with good scroll */
            .true-ai-result { 
                /* Base styles are inline but we can override or reinforce here if needed. 
                   The inline styles already have overflow-y: auto and max-height. 
                   We will ensure they are robust. */
            }

            .true-ai-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .true-ai-shortcuts {
                display: flex;
                gap: 0.4rem;
            }

            .true-ai-badge {
                font-size: 0.7rem;
                padding: 0.2rem 0.4rem;
                background: #f3f4f6;
                color: #6b7280;
                border-radius: 4px;
                font-family: monospace;
            }

            .true-ai-gen-btn {
                background: #7c3aed;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 0.4rem 0.8rem;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .true-ai-gen-btn:hover { background: #6d28d9; }

            /* Upgrade Modal */
            .true-upgrade-modal { text-align: center; }
            .true-upgrade-icon { font-size: 3rem; margin-bottom: 1rem; }
            .true-upgrade-text { margin-bottom: 1.5rem; color: var(--gray-600); line-height: 1.5; }
            .true-upgrade-btn { width: 89%; display: block; text-decoration: none; text-align: center; }

            /* Badge */
            .true-badge { position: absolute; bottom: 10px; right: 20px; font-size: 0.7rem; color: var(--gray-300); pointer-events: none; opacity: 0.8; transition: opacity 0.3s; }
            .true-editor-wrapper:hover .true-badge { opacity: 1; }
        `;
        this.shadow.appendChild(style);
    }

    showPrompt(title, defaultValue = "") {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.className = 'true-modal-overlay';
            overlay.innerHTML = `
                <div class="true-modal">
                    <div class="true-modal-title">${title}</div>
                    <input type="text" class="true-modal-input" value="${defaultValue}">
                    <div class="true-modal-actions">
                        <button class="true-modal-btn true-modal-btn-secondary" id="true-cancel">Cancel</button>
                        <button class="true-modal-btn true-modal-btn-primary" id="true-ok">OK</button>
                    </div>
                </div>
            `;
            this.wrapper.appendChild(overlay);
            const input = overlay.querySelector('input');
            input.focus();
            input.select();

            const close = (val) => {
                overlay.remove();
                resolve(val);
            };

            overlay.querySelector('#true-ok').onclick = () => close(input.value);
            overlay.querySelector('#true-cancel').onclick = () => close(null);

            input.onkeydown = (e) => {
                if (e.key === 'Enter') close(input.value);
                if (e.key === 'Escape') close(null);
            };

            overlay.onclick = (e) => {
                if (e.target === overlay) close(null);
            };
        });
    }

    showAIPopover(context = "", onGenerate = null) {
        console.log('🟡 showAIPopover called with:', { context: context?.substring(0, 30), onGenerate: !!onGenerate });
        console.log('🟡 this.wrapper:', this.wrapper);
        console.log('🟡 this.shadow:', this.shadow);

        return new Promise(resolve => {
            const popover = document.createElement('div');
            popover.className = 'true-ai-popover';
            console.log('🟡 Popover element created:', popover);

            // Check if we have a selection to determine default label
            const selection = this.shadow.getSelection();
            const hasSelection = selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
            const actionLabel = hasSelection ? "Replace Selection" : "Insert";

            popover.innerHTML = `
                <div class="true-ai-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                    <span>TrueEditr AI Assistant</span>
                    <button class="true-ai-close-btn" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.5rem;">&times;</button>
                </div>

                <div class="true-ai-special-actions" style="display:flex; gap:0.5rem; padding:0 0.5rem 0.5rem 0.5rem; flex-wrap:wrap;">
                    <button class="true-ai-action-chip" data-action="grammar">✨ Fix Grammar</button>
                    <button class="true-ai-action-chip" data-action="improve">📝 Improve</button>
                    ${hasSelection ? `<button class="true-ai-action-chip" data-action="summarize">📊 Summarize</button>` : ''}
                    <button class="true-ai-action-chip" data-action="translate">🌍 Translate</button>
                </div>

                <!-- Custom Prompts Quick Actions -->
                <div class="true-ai-prompts" style="display:flex; gap:0.5rem; padding:0 0.5rem 0.75rem 0.5rem; flex-wrap:wrap; border-bottom: 1px solid #f1f5f9; margin-bottom: 0.5rem;">
                    ${this.aiConfig?.customPrompts?.map((p, i) => `
                        <button class="true-ai-prompt-chip" data-index="${i}" title="${p.text.replace(/"/g, '&quot;')}">${p.title}</button>
                    `).join('') || ''}
                </div>

                <div class="true-ai-input-wrapper">
                    <textarea class="true-ai-input" placeholder="Ask AI to write, summarize, or fix..." id="true-ai-field"></textarea>
                </div>
                
                <!-- Result Area (Hidden initially) -->
                <div class="true-ai-result" style="display:none; margin-top:0.75rem; padding:0.75rem; background:#f8fafc; border-radius:8px; font-size:0.9rem; color:#334155; max-height:250px; overflow-y:auto; line-height:1.5; border: 1px solid #e2e8f0;"></div>

                <div class="true-ai-footer" style="margin-top:0.75rem;">
                    <div class="true-ai-shortcuts" id="true-ai-hints">
                        <span class="true-ai-badge">Esc to close</span>
                        <span class="true-ai-badge">↵ to run</span>
                    </div>
                    
                    <div class="true-ai-actions" style="display:none; gap:0.5rem; width:100%; justify-content:flex-end;">
                        <button class="true-ai-btn-sec" id="true-ai-copy">Copy</button> 
                        <button class="true-ai-btn-sec" id="true-ai-retry">New Prompt</button>
                        <button class="true-ai-gen-btn" id="true-ai-confirm">${actionLabel}</button>
                    </div>

                    <button class="true-ai-gen-btn" id="true-ai-generate">Generate</button>
                </div>
            `;

            console.log('🟡 Popover HTML set');
            this.wrapper.appendChild(popover);

            // Add secondary button styles if not present
            if (!this.shadow.querySelector('#true-ai-styles')) {
                const style = document.createElement('style');
                style.id = 'true-ai-styles';
                style.textContent = `
                    .true-ai-btn-sec { background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.4rem 0.8rem; font-size: 0.85rem; cursor: pointer; color: #475569; transition: all 0.2s; }
                    .true-ai-btn-sec:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
                    .true-ai-prompt-chip, .true-ai-action-chip { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; padding: 0.25rem 0.75rem; font-size: 0.75rem; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                    .true-ai-prompt-chip:hover, .true-ai-action-chip:hover { background: #e2e8f0; color: #0f172a; border-color: #cbd5e1; }
                    .true-ai-action-chip { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; font-weight: 600; }
                    .true-ai-action-chip:hover { background: #ede9fe; }
                `;
                this.shadow.appendChild(style);
            }

            const input = popover.querySelector('#true-ai-field');

            // Bind Custom Prompts
            popover.querySelectorAll('.true-ai-prompt-chip').forEach(btn => {
                btn.onclick = () => {
                    const idx = btn.getAttribute('data-index');
                    const prompt = this.aiConfig.customPrompts[idx];
                    if (prompt) {
                        input.value = prompt.text;
                        input.focus();
                    }
                };
            });

            // Bind Special Actions
            popover.querySelectorAll('.true-ai-action-chip').forEach(btn => {
                btn.onclick = () => {
                    const action = btn.getAttribute('data-action');
                    let prompt = "";
                    if (action === 'grammar') prompt = "Fix grammar and spelling mistakes.";
                    else if (action === 'improve') prompt = "Improve the writing style and clarity.";
                    else if (action === 'summarize') prompt = "Summarize this content briefly.";
                    else if (action === 'translate') prompt = "Translate this to Hindi (or specify language in prompt).";

                    input.value = prompt;
                    performGenerate(action);
                };
            });

            const resultArea = popover.querySelector('.true-ai-result');
            const footerActions = popover.querySelector('.true-ai-actions');
            const generateBtn = popover.querySelector('#true-ai-generate');
            const hints = popover.querySelector('#true-ai-hints');
            const closeBtn = popover.querySelector('.true-ai-close-btn');

            // Ensure focus is applied after any potential editor blur/focus events
            setTimeout(() => input.focus(), 50);

            // SMART POSITIONING: Anchor to AI Button
            const aiBtn = this.wrapper.querySelector('#true-ai-toolbar-btn');
            const wrapperRect = this.wrapper.getBoundingClientRect();

            // Default dimensions
            const popoverWidth = 380;
            const popoverHeight = 350; // Increased for new buttons
            popover.style.maxHeight = `${popoverHeight}px`;
            popover.style.zIndex = '9999';

            if (aiBtn) {
                const btnRect = aiBtn.getBoundingClientRect();
                let top = btnRect.bottom - wrapperRect.top + 8;
                let left = btnRect.left - wrapperRect.left;

                if (left + popoverWidth > wrapperRect.width) {
                    left = wrapperRect.width - popoverWidth - 10;
                }

                if (top + popoverHeight > wrapperRect.height) {
                    const topAbove = btnRect.top - wrapperRect.top - popoverHeight - 8;
                    if (topAbove > 0) top = topAbove;
                    else top = Math.max(10, wrapperRect.height - popoverHeight - 10);
                }

                popover.style.top = `${top}px`;
                popover.style.left = `${Math.max(10, left)}px`;
            } else {
                const centerTop = (wrapperRect.height - popoverHeight) / 2;
                const centerLeft = (wrapperRect.width - popoverWidth) / 2;
                popover.style.top = `${Math.max(20, centerTop)}px`;
                popover.style.left = `${Math.max(20, centerLeft)}px`;
            }

            popover.addEventListener('mousedown', (e) => e.stopPropagation());
            popover.addEventListener('click', (e) => e.stopPropagation());

            const close = (val) => {
                popover.remove();
                document.removeEventListener('mousedown', outsideClick);
                resolve(val);
            };

            const outsideClick = (e) => {
                const path = e.composedPath();
                if (!path.includes(popover)) {
                    close(null);
                }
            };
            setTimeout(() => document.addEventListener('mousedown', outsideClick), 10);

            // Interactive Logic
            let generatedText = "";
            let isGenerating = false;

            const performGenerate = async (action = 'complete') => {
                const prompt = input.value.trim();
                if (!prompt) return;

                isGenerating = true;
                input.disabled = true;
                generateBtn.innerText = "Thinking...";
                generateBtn.disabled = true;

                try {
                    if (onGenerate) {
                        const res = await onGenerate(prompt, context, action);
                        if (res && res.success) {
                            generatedText = res.text;

                            input.style.display = 'none';
                            hints.style.display = 'none';
                            generateBtn.style.display = 'none';
                            popover.querySelector('.true-ai-special-actions').style.display = 'none';
                            popover.querySelector('.true-ai-prompts').style.display = 'none';

                            resultArea.style.display = 'block';
                            resultArea.innerHTML = generatedText; // Already sanitized from server or handle it

                            footerActions.style.display = 'flex';
                        } else {
                            await this.showSettingsModal(res?.error || "Failed to generate AI response. Please try again.");
                            resetUI();
                        }
                    } else {
                        close(prompt);
                    }
                } catch (e) {
                    console.error(e);
                    await this.showSettingsModal("An error occurred while generating content. Please try again.");
                    resetUI();
                } finally {
                    isGenerating = false;
                }
            };

            const resetUI = () => {
                input.style.display = 'block';
                input.disabled = false;
                input.focus();

                hints.style.display = 'flex';
                generateBtn.style.display = 'block';
                generateBtn.innerText = "Generate";
                generateBtn.disabled = false;
                popover.querySelector('.true-ai-special-actions').style.display = 'flex';
                popover.querySelector('.true-ai-prompts').style.display = 'flex';

                resultArea.style.display = 'none';
                footerActions.style.display = 'none';
            };

            generateBtn.onclick = () => performGenerate('complete');
            closeBtn.onclick = () => close(null);

            input.onkeydown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    performGenerate('complete');
                }
                if (e.key === 'Escape') close(null);
            };

            // Result Actions
            popover.querySelector('#true-ai-confirm').onclick = () => {
                close({ action: 'accept', text: generatedText });
            };

            popover.querySelector('#true-ai-copy').onclick = () => {
                navigator.clipboard.writeText(generatedText.replace(/<[^>]*>/g, '')); // Copy clean text
                const btn = popover.querySelector('#true-ai-copy');
                const originalText = btn.innerText;
                btn.innerText = "Copied!";
                setTimeout(() => btn.innerText = originalText, 1000);
            };

            popover.querySelector('#true-ai-retry').onclick = resetUI;
        });
    }

    showUpgradeModal(featureName, requiredTier) {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.className = 'true-modal-overlay';
            overlay.innerHTML = `
                <div class="true-modal true-upgrade-modal">
                    <div class="true-upgrade-icon">🚀</div>
                    <div class="true-modal-title">${featureName} is a ${requiredTier.toUpperCase()} Feature</div>
                    <div class="true-upgrade-text">
                        Unlock advanced tools, AI automation, and professional editing capabilities by upgrading your plan.
                    </div>
                    <div class="true-modal-actions" style="flex-direction: column;">
                        <a href="https://trueeditr.in/dashboard/settings" target="_blank" class="true-modal-btn true-modal-btn-primary true-upgrade-btn">Upgrade Now</a>
                        <button class="true-modal-btn true-modal-btn-secondary" id="true-close" style="width: 100%;">Maybe Later</button>
                    </div>
                </div>
            `;
            this.wrapper.appendChild(overlay);

            overlay.querySelector('#true-close').onclick = () => {
                overlay.remove();
                resolve(false);
            };

            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    resolve(false);
                }
            };
        });
    }

    showSettingsModal(message) {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.className = 'true-modal-overlay';
            overlay.innerHTML = `
                <div class="true-modal true-upgrade-modal">
                    <div class="true-upgrade-icon">⚙️</div>
                    <div class="true-modal-title">AI is Disabled</div>
                    <div class="true-upgrade-text">
                        ${message || "To use AI features, please enable them in your Dashboard Settings."}
                    </div>
                    <div class="true-modal-actions" style="flex-direction: column;">
                        <a href="https://trueeditr.in/dashboard/settings" target="_blank" class="true-modal-btn true-modal-btn-primary true-upgrade-btn">Go to Settings</a>
                        <button class="true-modal-btn true-modal-btn-secondary" id="true-close" style="width: 100%;">Close</button>
                    </div>
                </div>
            `;
            this.wrapper.appendChild(overlay);

            const close = () => {
                overlay.remove();
                resolve();
            };

            overlay.querySelector('#true-close').onclick = close;
            overlay.onclick = (e) => {
                if (e.target === overlay) close();
            };
        });
    }

    hasFeature(feature) {
        // PRIORITY 1: Server-provided features list (Most Reliable)
        // ALWAYS ALLOW these core features regardless of plan or server config
        const alwaysAllowed = [
            'bold', 'italic', 'underline', 'strikethrough',
            'h1', 'h2', 'h3', 'formatBlock',
            'insertUnorderedList', 'insertOrderedList',
            'createLink', 'insertLink', 'unlink', 'link',
            'insertImage', 'image_url', 'image',
            'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'align',
            'autosave', 'status', 'history', 'undo', 'redo', 'source', 'ai', 'save'
        ];
        if (alwaysAllowed.includes(feature)) return true;

        if (this.config && this.config.features && Array.isArray(this.config.features)) {
            const hasIt = this.config.features.includes(feature);
            // Debug log for problematic features
            if (['table', 'insertTable', 'export', 'fontSize', 'typography'].includes(feature)) {
                console.log(`Feature Check: ${feature} = ${hasIt} (Plan: ${this.plan}, Server Features:`, this.config.features);
            }
            return hasIt;
        }

        // FALLBACK: Client-side tier check (used during init or offline)
        console.warn(`Using fallback feature check for: ${feature}`);
        if (this.plan === 'enterprise') return true;
        if (this.tierFeatures.free.includes(feature)) return true;
        if ((this.plan === 'pro' || this.plan === 'enterprise') && this.tierFeatures.pro.includes(feature)) return true;

        return false;
    }

    updateUIForPlan() {
        if (this.plan !== 'enterprise') {
            const badge = document.createElement('div');
            badge.className = 'true-badge';
            badge.innerText = 'Powered by TrueEditr';
            this.wrapper.appendChild(badge);
        }
    }

    loadLocalContent() {
        if (typeof localStorage === 'undefined') return;
        const saved = localStorage.getItem(`trueeditr_draft_${this.apiKey}`);
        if (saved) {
            this.editor.innerHTML = saved;
            this.updateToolbar();
        }
    }

    getContent() {
        const clone = this.editor.cloneNode(true);
        // Remove ghost text/elements
        clone.querySelectorAll('.true-ghost').forEach(el => el.remove());
        return clone.innerHTML;
    }

    saveLocalContent() {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(`trueeditr_draft_${this.apiKey}`, this.getContent());
        this.plugins.get('status')?.setStatus("Draft saved locally");
    }

    toggleSourceMode() {
        if (!this.isSourceMode) {
            this.sourceArea.value = this.getContent();
            this.editor.style.display = 'none';
            this.sourceArea.style.display = 'block';
            this.isSourceMode = true;
        } else {
            this.editor.innerHTML = this.sourceArea.value;
            this.sourceArea.style.display = 'none';
            this.editor.style.display = 'block';
            this.isSourceMode = false;
        }
        this.updateToolbar();
    }

    execCommand(cmd, val = null) {
        this.editor.focus();
        if (this.isSourceMode) return;
        document.execCommand(cmd, false, val);
        this.updateToolbar();
        this.saveHistory();
    }

    registerPlugin(name, PluginClass) {
        const plugin = new PluginClass(this);
        this.plugins.set(name, plugin);
        plugin.init();
    }

    setupEventListeners() {
        document.addEventListener('selectionchange', () => this.updateToolbar());
        this.editor.addEventListener('input', () => {
            this.updateToolbar();
            this.saveHistory();
            this.saveLocalContent();
        });
        this.editor.addEventListener('keydown', (e) => this.handleShortcuts(e));
        this.sourceArea.addEventListener('input', () => this.saveHistory());

        // Focus logic
        this.scrollArea.addEventListener('click', (e) => {
            if (e.target === this.scrollArea) {
                this.editor.focus();
            }
        });
    }

    handleShortcuts(e) {
        if (!e.ctrlKey && !e.metaKey) return;

        const cmdMap = {
            'b': 'bold',
            'i': 'italic',
            'u': 'underline',
            'z': 'undo',
            'y': 'redo'
        };

        const cmd = cmdMap[e.key.toLowerCase()];
        if (cmd) {
            e.preventDefault();
            if (cmd === 'undo') this.plugins.get('history')?.undo();
            else if (cmd === 'redo') this.plugins.get('history')?.redo();
            else this.execCommand(cmd);
        }
    }

    updateToolbar() {
        this.plugins.forEach(plugin => plugin.updateState());
    }

    saveHistory() {
        const historyPlugin = this.plugins.get('history');
        if (historyPlugin) historyPlugin.save();
    }
}

export default TrueEditr;
