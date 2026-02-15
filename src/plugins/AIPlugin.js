import BasePlugin from './BasePlugin.js';

export default class AIPlugin extends BasePlugin {
    init() {
        // AI logic from original implementation, refactored
        this.initGhostText();
    }

    initGhostText() {
        if (!this.editor.shadow.querySelector('#true-ai-ghost-style')) {
            const style = document.createElement('style');
            style.id = 'true-ai-ghost-style';
            style.textContent = `.true-ghost { color: #94a3b8; pointer-events: none; opacity: 0.7; }`;
            this.editor.shadow.appendChild(style);
        }

        let debounceTimer;
        this.editor.editor.addEventListener('input', () => {
            // Check if AI enabled (NO fallback - must be explicitly enabled)
            const aiEnabled = this.editor.aiConfig?.enabled;
            if (!aiEnabled) return;

            clearTimeout(debounceTimer);
            this.clearGhost();

            // Only trigger if no selection
            const sel = this.editor.shadow.getSelection();
            if (sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed) return;

            debounceTimer = setTimeout(() => this.triggerGhost(), 1500);
        });

        this.editor.editor.addEventListener('keydown', (e) => {
            const ghost = this.editor.shadow.querySelector('.true-ghost');
            if (ghost) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.acceptGhost(ghost);
                } else {
                    this.clearGhost();
                }
            }
        });
    }

    clearGhost() {
        this.editor.shadow.querySelectorAll('.true-ghost').forEach(el => el.remove());
    }

    async triggerGhost() {
        // Get last few words
        const sel = this.editor.shadow.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);

        // Simple context: Get text content of current block?
        // Or just the editor text?
        const text = this.editor.editor.innerText;
        if (text.length < 5) return; // Need some context

        const res = await this.generateResponse("Complete the sentence/paragraph naturally. Return ONLY the completion text, no quotes.", text);

        if (res && res.success && res.text) {
            this.showGhost(res.text);
        }
    }

    showGhost(text) {
        if (!text) return;
        // Clean text
        text = text.replace(/^ /, ''); // Remove leading space if implies continuation? 

        const span = document.createElement('span');
        span.className = 'true-ghost';
        span.contentEditable = "false";
        span.innerText = text;

        const sel = this.editor.shadow.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.insertNode(span);
            range.setStartBefore(span);
            range.setEndBefore(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    acceptGhost(ghostNode) {
        const text = ghostNode.innerText;
        ghostNode.remove(); // Remove ghost

        // Insert real text at proper position
        this.editor.editor.focus();
        this.insertAtCursor(text);
    }

    async generateResponse(promptText, context, action = 'complete') {
        try {
            const res = await fetch(`${this.editor.apiUrl}/editor/ai-completion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: this.editor.apiKey,
                    prompt: promptText,
                    context: context,
                    action: action
                })
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("AI Connection Error:", err);
            return { success: false, error: err.message };
        }
    }

    async handleAIResponse(text) {
        // Ensure focus is back in the editor area
        this.editor.editor.focus();
        
        // Remove any residual ghost text before typing
        this.clearGhost();
        
        await this.typeEffect(text);
    }

    // Helper for direct insertion without type effect if needed
    insertAtCursor(text) {
        const sel = this.editor.shadow.getSelection();
        if (sel.rangeCount) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            sel.removeAllRanges();
            sel.addRange(range);
            this.editor.saveHistory();
        }
    }

    async typeEffect(html) {
        const historyPlugin = this.editor.plugins.get('history');
        if (historyPlugin) historyPlugin.isLocked = true;

        // We use a temporary container to parse the HTML string
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const nodes = Array.from(temp.childNodes);

        this.editor.editor.focus();

        // Ensure we are working with the shadow selection
        const selection = this.editor.shadow.getSelection();
        
        // 1. Initial cleanup: If there's a selection, delete it once before typing
        if (selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
        }

        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const chars = node.textContent.split('');
                for (const char of chars) {
                    // Use document.execCommand for better undo history and browser compatibility
                    // but ensure focus is correct
                    this.editor.editor.focus();
                    document.execCommand('insertText', false, char);
                    const delay = Math.floor(Math.random() * 15) + 5; // Slightly faster typing
                    await new Promise(r => setTimeout(r, delay));
                }
            } else {
                this.editor.editor.focus();
                const outerHTML = node.nodeType === Node.ELEMENT_NODE ? node.outerHTML : node.textContent;
                document.execCommand('insertHTML', false, outerHTML);
                await new Promise(r => setTimeout(r, 20));
            }
        }

        if (historyPlugin) {
            historyPlugin.isLocked = false;
            historyPlugin.save();
        }
        this.editor.saveLocalContent();
        this.editor.updateToolbar();
    }

    checkPlan() {
        return true; 
    }
}
