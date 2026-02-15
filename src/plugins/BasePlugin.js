export default class BasePlugin {
    constructor(editor) {
        this.editor = editor;
    }

    /**
     * Called when the plugin is registered.
     */
    init() { }

    /**
     * Called when the editor's toolbar is being rendered.
     * Should return an array of button configurations.
     */
    getToolbarButtons() {
        return [];
    }

    /**
     * Called on 'selectionchange' or 'input' events to update the state.
     */
    updateState() { }

    /**
     * Handle custom commands.
     */
    handleCommand(cmd, val) {
        return false; // Return true if command was handled
    }

    /**
     * Clean up when editor is destroyed.
     */
    destroy() { }
}
