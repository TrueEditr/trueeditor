import BasePlugin from './BasePlugin.js';

export default class MarkdownPlugin extends BasePlugin {
    constructor(editor) {
        super(editor);
        this.shortcuts = {
            '# ': 'h1',
            '## ': 'h2',
            '### ': 'h3',
            '> ': 'blockquote',
            '- ': 'insertUnorderedList',
            '* ': 'insertUnorderedList',
            '1. ': 'insertOrderedList',
            'a. ': 'insertOrderedList:a',
            'i. ': 'insertOrderedList:i'
        };
        this.lastConvertedRange = null;
    }

    init() {
        if (!this.editor.hasFeature('markdown')) return;

        this.editor.editor.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                this.checkMarkdown(e);
            } else if (e.key === 'Backspace') {
                this.handleBackspace(e);
            } else if (e.key === 'Tab') {
                this.handleTab(e);
            }
        });
    }

    checkMarkdown(e) {
        const selection = this.editor.shadow.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        // We only care about text nodes inside the editor
        if (node.nodeType !== Node.TEXT_NODE) return;

        const text = node.textContent.substring(0, range.startOffset) + ' ';

        for (const [key, cmdValue] of Object.entries(this.shortcuts)) {
            if (text.endsWith(key)) {
                e.preventDefault();

                // 1. Remove the trigger text (e.g. "a. ")
                const startPos = range.startOffset - (key.length - 1);
                node.textContent = node.textContent.substring(0, startPos) + node.textContent.substring(range.startOffset);

                // Set cursor back to start of line before command
                const newRange = document.createRange();
                newRange.setStart(node, startPos);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);

                // 2. Parse command
                let command = cmdValue;
                let listType = null;
                if (cmdValue.includes(':')) {
                    [command, listType] = cmdValue.split(':');
                }

                // 3. Execute Command
                this.editor.execCommand(command);

                // 4. Apply List Type if needed
                if (listType) {
                    const newSelection = this.editor.shadow.getSelection();
                    if (newSelection.rangeCount > 0) {
                        let current = newSelection.getRangeAt(0).startContainer;
                        while (current && current !== this.editor.editor) {
                            if (current.tagName === 'OL') {
                                current.setAttribute('type', listType);
                                break;
                            }
                            current = current.parentElement;
                        }
                    }
                }

                // 5. Store for undo on backspace
                this.lastConvertedRange = {
                    node: node,
                    text: key,
                    command: command
                };
                break;
            }
        }
    }

    handleBackspace(e) {
        if (!this.lastConvertedRange) return;

        const selection = this.editor.shadow.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        // If cursor is at the very beginning of a newly converted list item
        if (range.collapsed && range.startOffset === 0) {
            const container = range.startContainer;
            // Check if we are in a list item
            let li = container;
            while (li && li.tagName !== 'LI' && li !== this.editor.editor) {
                li = li.parentElement;
            }

            if (li && li.tagName === 'LI' && li.textContent.trim() === '') {
                e.preventDefault();
                // Revert list
                this.editor.execCommand(this.lastConvertedRange.command); // Toggle off
                // Restore text
                document.execCommand('insertText', false, this.lastConvertedRange.text);
                this.lastConvertedRange = null;
            }
        } else {
            this.lastConvertedRange = null;
        }
    }

    handleTab(e) {
        e.preventDefault();
        const selection = this.editor.shadow.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        let li = range.startContainer;
        while (li && li.tagName !== 'LI' && li !== this.editor.editor) {
            li = li.parentElement;
        }

        if (li && li.tagName === 'LI') {
            if (e.shiftKey) {
                this.editor.execCommand('outdent');
            } else {
                this.editor.execCommand('indent');
            }
        } else {
            // Regular tab if not in list
            document.execCommand('insertText', false, '    ');
        }
    }

    updateState() { }
}

