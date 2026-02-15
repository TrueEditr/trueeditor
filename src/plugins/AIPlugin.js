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
        // Actually, we need to see if we need a space. 
        // For MVP, just show it.

        const span = document.createElement('span');
        span.className = 'true-ghost';
        span.contentEditable = "false";
        span.innerText = text;

        const sel = this.editor.shadow.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.insertNode(span);
            // Move cursor BEFORE span? No, cursor is at end of text, span is after.
            // But inserting node moves cursor?
            // Range collapse to start of span?
            range.setStartBefore(span);
            range.setEndBefore(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    acceptGhost(ghostNode) {
        const text = ghostNode.innerText;
        ghostNode.remove(); // Remove ghost

        // Insert real text
        this.editor.execCommand('insertText', text);
    }

    async generateResponse(promptText, context) {
        try {
            const res = await fetch(`${this.editor.apiUrl}/editor/ai-completion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: this.editor.apiKey,
                    prompt: promptText,
                    context: context
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
        await this.typeEffect(text);
    }

    // Deprecated but kept for compatibility if needed
    async handleAIRequest(promptText, context) {
        const res = await this.generateResponse(promptText, context);
        if (res.success) {
            await this.handleAIResponse(res.text);
        }
    }

    async typeEffect(html) {
        const historyPlugin = this.editor.plugins.get('history');
        if (historyPlugin) historyPlugin.isLocked = true; // Lock history to prevent flooding

        // We use a temporary container to parse the HTML string
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const nodes = Array.from(temp.childNodes);

        this.editor.editor.focus();

        // 1. Initial cleanup: If there's a selection, delete it once before typing
        const selection = this.editor.shadow.getSelection();
        if (selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed) {
            document.execCommand('delete');
        }

        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                // Type text character by character
                const chars = node.textContent.split('');
                for (const char of chars) {
                    // Check if we need to abort? (Future: Add abort controller)
                    document.execCommand('insertText', false, char);
                    // 10-30ms random delay for natural feel
                    const delay = Math.floor(Math.random() * 20) + 10;
                    await new Promise(r => setTimeout(r, delay));
                }
            } else {
                // For elements, insert the whole tag at once (can be improved to type inner text later)
                // We use insertHTML to let browser handle the node insertion at cursor
                const outerHTML = node.nodeType === Node.ELEMENT_NODE ? node.outerHTML : node.textContent;
                document.execCommand('insertHTML', false, outerHTML);
                await new Promise(r => setTimeout(r, 20));
            }
        }

        if (historyPlugin) {
            historyPlugin.isLocked = false;
            historyPlugin.save(); // Save final state once
        }
        this.editor.saveLocalContent();
    }

    checkPlan() {
        return true; // Trust API for plan-based AI gating
    }
}
