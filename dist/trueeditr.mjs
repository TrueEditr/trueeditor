class x {
  constructor(e) {
    this.editor = e;
  }
  /**
   * Called when the plugin is registered.
   */
  init() {
  }
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
  updateState() {
  }
  /**
   * Handle custom commands.
   */
  handleCommand(e, r) {
    return !1;
  }
  /**
   * Clean up when editor is destroyed.
   */
  destroy() {
  }
}
class M extends x {
  constructor(e) {
    super(e), this.buttons = [];
  }
  init() {
    this.renderToolbar();
  }
  renderToolbar() {
    const e = this.editor.toolbar, r = this.editor.plugins.get("insert"), o = [
      { cmd: "bold", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>', title: "Bold" },
      { cmd: "italic", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>', title: "Italic" },
      { cmd: "underline", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>', title: "Underline" },
      {
        type: "dropdown",
        title: "Text Size",
        options: [
          { label: "Tiny", value: "1" },
          { label: "Small", value: "2" },
          { label: "Normal", value: "3" },
          { label: "Large", value: "4" },
          { label: "Extra Large", value: "5" },
          { label: "Huge", value: "6" },
          { label: "Gigantic", value: "7" }
        ],
        action: (t) => {
          if (!this.editor.hasFeature("typography")) {
            this.editor.showUpgradeModal("Text Size", "pro");
            return;
          }
          this.editor.execCommand("fontSize", t);
        }
      },
      { type: "sep" },
      { cmd: "justifyLeft", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>', title: "Align Left" },
      { cmd: "justifyCenter", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>', title: "Align Center" },
      { cmd: "justifyRight", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>', title: "Align Right" },
      { cmd: "justifyFull", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>', title: "Justify" },
      { type: "sep" },
      { cmd: "insertUnorderedList", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', title: "Bullet List" },
      { cmd: "insertOrderedList", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>', title: "Numbered List" },
      { type: "sep" },
      { cmd: "insertImage", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', title: "Image", action: () => r.insertImage() },
      { cmd: "insertLink", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', title: "Link", action: () => r.insertLink() },
      { cmd: "insertTable", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', title: "Table", action: () => r.insertTable() },
      { type: "sep" },
      {
        cmd: "export",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        title: "Export",
        action: async () => {
          if (!this.editor.hasFeature("export")) {
            this.editor.showUpgradeModal("Global Export", "pro");
            return;
          }
          const t = await this.editor.showPrompt("Export as: 1 for PDF, 2 for DOCX", "1"), i = this.editor.plugins.get("export");
          t === "1" ? i.exportPDF() : t === "2" && i.exportDOCX();
        }
      },
      { cmd: "save", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>', title: "Save to Draft", action: () => this.editor.saveLocalContent() },
      { type: "sep" },
      { cmd: "source", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', title: "Source Code", action: () => this.editor.toggleSourceMode() }
    ];
    o.push({ type: "sep" }), o.push({
      cmd: "ai",
      id: "true-ai-toolbar-btn",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#7c3aed"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2"/><path d="m19 21 1-2"/><path d="m5 21 1-2"/><path d="m19 3 1-2"/></svg>',
      title: "AI Assistant",
      action: () => this.showAIPrompt()
    }), o.forEach((t) => {
      if (t.type === "sep") {
        const n = document.createElement("div");
        n.className = "true-toolbar-sep", e.appendChild(n);
        return;
      }
      if (t.type === "dropdown") {
        const n = document.createElement("select");
        n.className = "true-toolbar-select", n.title = t.title, t.options.forEach((s) => {
          const l = document.createElement("option");
          l.value = s.value, l.textContent = s.label, s.value === "3" && (l.selected = !0), n.appendChild(l);
        }), n.onchange = (s) => {
          t.action(s.target.value);
        }, e.appendChild(n), this.buttons.push({ ...t, element: n });
        return;
      }
      const i = document.createElement("button");
      i.className = "true-editor-btn", t.id && (i.id = t.id), i.innerHTML = t.icon, i.title = t.title, i.onclick = () => {
        if (t.cmd && !this.editor.hasFeature(t.cmd)) {
          this.editor.showUpgradeModal(t.title, "pro");
          return;
        }
        t.action ? t.action() : this.editor.execCommand(t.cmd);
      }, e.appendChild(i), this.buttons.push({ ...t, element: i });
    });
  }
  async showAIPrompt() {
    var h, p;
    console.log("🔵 AI Button Clicked!"), console.log("AI Config:", this.editor.aiConfig);
    const e = (h = this.editor.aiConfig) == null ? void 0 : h.enabled, r = (p = this.editor.aiConfig) == null ? void 0 : p.configured;
    if (console.log("AI Enabled:", e, "AI Configured:", r), !e) {
      console.log("❌ AI NOT ENABLED - Showing settings modal"), await this.editor.showSettingsModal("AI features are currently disabled. Please enable AI in Dashboard Settings and configure your Gemini API key.");
      return;
    }
    if (!r) {
      console.log("❌ AI NOT CONFIGURED - Showing settings modal"), await this.editor.showSettingsModal("AI is enabled but not configured. Please add your Gemini API key in Dashboard Settings.");
      return;
    }
    console.log("✅ AI is enabled and configured. Creating popover...");
    const o = this.editor.plugins.get("ai"), t = this.editor.shadow.getSelection();
    console.log("🟢 Selection object:", t);
    const i = t && t.rangeCount > 0 && !t.getRangeAt(0).collapsed;
    console.log("🟢 Has selection:", i);
    const n = i ? t.toString() : this.editor.editor.innerText;
    console.log("🟢 Context:", n ? n.substring(0, 50) + "..." : "empty");
    let s = null;
    i && (s = t.getRangeAt(0).cloneRange(), console.log("🟢 Saved range:", s));
    const l = async (m, g, b) => (console.log("🟢 onGenerate called with prompt:", m, "action:", b), await o.generateResponse(m, g, b));
    console.log("🟢 Calling showAIPopover with context:", n ? n.substring(0, 50) + "..." : "empty");
    const u = await this.editor.showAIPopover(n, l);
    if (console.log("🟢 showAIPopover returned:", u), u && u.action === "accept") {
      if (s) {
        this.editor.editor.focus();
        const m = this.editor.shadow.getSelection();
        m.removeAllRanges(), m.addRange(s);
      }
      o.handleAIResponse(u.text);
    }
  }
  updateState() {
    const e = this.editor.isSourceMode;
    this.buttons.forEach((r) => {
      if (r.cmd === "source") {
        e ? r.element.classList.add("active") : r.element.classList.remove("active");
        return;
      }
      r.element.disabled = e, r.element.style.opacity = e ? "0.5" : "1", r.element.style.pointerEvents = e ? "none" : "auto", e ? r.element.classList.remove("active") : document.queryCommandState(r.cmd) ? r.element.classList.add("active") : r.element.classList.remove("active");
    });
  }
}
class P extends x {
  constructor(e) {
    super(e), this.history = [], this.index = -1, this.maxHistory = 50, this.isLocked = !1;
  }
  init() {
    this.save(), this.editor.wrapper.addEventListener("keydown", (e) => {
      (e.ctrlKey || e.metaKey) && (e.key === "z" ? (e.preventDefault(), this.undo()) : e.key === "y" && (e.preventDefault(), this.redo()));
    });
  }
  save() {
    if (this.isLocked) return;
    const e = this.editor.editor.innerHTML;
    this.index >= 0 && this.history[this.index] === e || (this.index++, this.history.splice(this.index), this.history.push(e), this.history.length > this.maxHistory && (this.history.shift(), this.index--));
  }
  undo() {
    this.index > 0 && (this.isLocked = !0, this.index--, this.apply(this.history[this.index]), this.isLocked = !1);
  }
  redo() {
    this.index < this.history.length - 1 && (this.isLocked = !0, this.index++, this.apply(this.history[this.index]), this.isLocked = !1);
  }
  apply(e) {
    this.editor.editor.innerHTML = e, this.editor.updateToolbar();
  }
}
class R extends x {
  constructor(e) {
    super(e), this.menu = null, this.active = !1, this.savedRange = null;
  }
  init() {
    this.editor.editor.addEventListener("keydown", (e) => {
      (e.ctrlKey || e.metaKey) && e.key === "/" ? (e.preventDefault(), this.showMenu()) : this.active && e.key === "Escape" && this.hideMenu();
    }), this.editor.editor.addEventListener("keyup", (e) => {
      if (e.key === "/" && !this.active) {
        const r = this.editor.shadow.getSelection();
        r.rangeCount > 0 && (r.getRangeAt(0).startContainer.textContent || "") === "/" && this.showMenu();
      }
    }), document.addEventListener("mousedown", (e) => {
      if (this.active) {
        const r = e.composedPath();
        this.menu && !r.includes(this.menu) && this.hideMenu();
      }
    });
  }
  showMenu() {
    if (this.menu) return;
    const e = this.editor.shadow.getSelection();
    e.rangeCount > 0 && (this.savedRange = e.getRangeAt(0).cloneRange()), this.menu = document.createElement("div"), this.menu.className = "true-slash-menu";
    const r = {
      Formatting: [
        { cmd: "bold", label: "Bold", icon: "Bold" },
        { cmd: "italic", label: "Italic", icon: "Italic" },
        { cmd: "underline", label: "Underline", icon: "Underline" }
      ],
      Essentials: [
        { cmd: "h1", label: "Heading 1", icon: "Type" },
        { cmd: "h2", label: "Heading 2", icon: "Type" },
        { cmd: "image", label: "Image", icon: "Image" },
        { cmd: "link", label: "Link", icon: "Link" }
      ],
      "Pro Features": [
        { cmd: "ai", label: "AI Assistant", icon: "Sparkles", color: "#7c3aed" },
        { cmd: "table", label: "Table", icon: "Grid" },
        { cmd: "code", label: "Code Block", icon: "Code" },
        { cmd: "source", label: "Source Code", icon: "FileCode" }
      ]
    }, o = (i, n) => {
      const s = n ? `style="color: ${n}"` : "";
      return i === "Sparkles" ? `<svg ${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2"/><path d="m19 21 1-2"/><path d="m5 21 1-2"/><path d="m19 3 1-2"/></svg>` : i === "Grid" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>' : i === "Code" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' : i === "FileCode" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>' : i === "Type" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>' : i === "Bold" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>' : i === "Italic" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>' : i === "Underline" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>' : i === "Image" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>' : i === "Link" ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' : i;
    };
    let t = "";
    for (const [i, n] of Object.entries(r))
      t += `<div class="true-slash-group-title">${i}</div>`, t += n.map((s) => {
        const l = !this.editor.hasFeature(s.cmd), u = l ? '<span class="true-slash-lock">🔒</span>' : "", h = l ? "opacity: 0.6;" : "";
        return `
                <div class="true-slash-item" data-cmd="${s.cmd}" style="${h}">
                    <span class="true-slash-icon">${o(s.icon, s.color)}</span>
                    <span class="true-slash-label">
                        ${s.label}
                        ${s.cmd === "ai" ? '<span class="true-slash-badge">FREE</span>' : ""}
                    </span>
                    ${u}
                </div>`;
      }).join("");
    this.menu.innerHTML = t, this.editor.scrollArea.appendChild(this.menu), this.active = !0, this.positionMenu(), this.menu.addEventListener("mousedown", (i) => {
      const n = i.target.closest(".true-slash-item");
      if (n) {
        if (i.preventDefault(), i.stopPropagation(), this.savedRange) {
          const s = this.savedRange.startContainer;
          s.textContent === "/" && (s.textContent = "");
        }
        this.handleCommand(n.dataset.cmd), this.hideMenu();
      }
    });
  }
  positionMenu() {
    if (!this.menu) return;
    const e = this.editor.shadow.getSelection();
    if (e.rangeCount > 0) {
      const o = e.getRangeAt(0).getBoundingClientRect(), t = this.editor.scrollArea.getBoundingClientRect();
      let i = o.bottom - t.top + this.editor.scrollArea.scrollTop + 8, n = o.left - t.left + this.editor.scrollArea.scrollLeft;
      const s = 260, l = 350;
      n + s > this.editor.scrollArea.clientWidth && (n = Math.max(10, this.editor.scrollArea.clientWidth - s - 20));
      const u = this.editor.scrollArea.scrollTop + 10;
      this.editor.scrollArea.scrollTop + this.editor.scrollArea.clientHeight - l - 10, this.editor.scrollArea.clientHeight - (o.bottom - t.top) < l && o.top - t.top > l && (i = o.top - t.top + this.editor.scrollArea.scrollTop - l - 8), this.menu.style.top = `${Math.max(u, i)}px`, this.menu.style.left = `${Math.max(10, n)}px`, this.menu.style.zIndex = "9999";
    }
  }
  hideMenu() {
    this.menu && (this.menu.remove(), this.menu = null, this.active = !1, this.savedRange = null);
  }
  handleCommand(e) {
    var o;
    if (!this.editor.hasFeature(e)) {
      let t = e;
      e === "code" && (t = "Code Block"), e === "source" && (t = "Source Code"), this.editor.showUpgradeModal(t.charAt(0).toUpperCase() + t.slice(1), "pro");
      return;
    }
    if (this.editor.editor.focus(), this.savedRange) {
      const t = this.editor.shadow.getSelection();
      t.removeAllRanges(), t.addRange(this.savedRange);
    }
    const r = this.editor.plugins.get("insert");
    e === "bold" ? this.editor.execCommand("bold") : e === "italic" ? this.editor.execCommand("italic") : e === "underline" ? this.editor.execCommand("underline") : e === "h1" ? this.editor.execCommand("formatBlock", "h1") : e === "h2" ? this.editor.execCommand("formatBlock", "h2") : e === "image" ? r.insertImage() : e === "link" ? r.insertLink() : e === "table" ? r.insertTable() : e === "code" ? this.editor.execCommand("formatBlock", "pre") : e === "ai" ? (o = this.editor.plugins.get("toolbar")) == null || o.showAIPrompt() : e === "source" && this.editor.toggleSourceMode();
  }
}
class B extends x {
  init() {
    this.setupImageResizing();
  }
  setupImageResizing() {
    this.editor.editor.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        if (!this.editor.hasFeature("resize")) {
          this.editor.showUpgradeModal("Image Resizing", "pro");
          return;
        }
        this.selectImage(e.target);
      } else
        this.deselectImage();
    });
  }
  selectImage(e) {
    this.deselectImage(), this.selectedImg = e, e.style.outline = "2px solid var(--primary)", e.style.cursor = "nwse-resize";
    let r = !1, o, t;
    const i = (n) => {
      n.preventDefault(), r = !0, o = n.clientX, t = e.clientWidth;
      const s = (u) => {
        if (!r) return;
        const h = u.clientX - o;
        e.style.width = t + h + "px", e.style.height = "auto";
      }, l = () => {
        r = !1, document.removeEventListener("mousemove", s), document.removeEventListener("mouseup", l), this.editor.saveHistory();
      };
      document.addEventListener("mousemove", s), document.addEventListener("mouseup", l);
    };
    e.onmousedown = i;
  }
  deselectImage() {
    this.selectedImg && (this.selectedImg.style.outline = "none", this.selectedImg.onmousedown = null, this.selectedImg = null);
  }
  async insertImage() {
    const e = await this.editor.showPrompt("Image Source: 1 for URL, 2 for Local File", "1");
    if (e === "1") {
      const r = await this.editor.showPrompt("Image URL", "https://");
      if (!r) return;
      this.doInsertImage(r);
    } else if (e === "2") {
      const r = document.createElement("input");
      r.type = "file", r.accept = "image/*", r.onchange = (o) => {
        const t = o.target.files[0];
        if (t) {
          const i = new FileReader();
          i.onload = (n) => {
            this.doInsertImage(n.target.result);
          }, i.readAsDataURL(t);
        }
      }, r.click();
    }
  }
  async doInsertImage(e) {
    const r = await this.editor.showPrompt("Alt Text (for SEO)", ""), o = `<img src="${e}" alt="${r || ""}" style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0;">`;
    this.editor.execCommand("insertHTML", o);
  }
  async insertLink() {
    const e = await this.editor.showPrompt("Link URL", "https://");
    if (!e) return;
    const r = await this.editor.showPrompt("Link Text", "Click here"), o = `<a href="${e}" target="_blank" style="color: #2563eb; text-decoration: underline;">${r || e}</a>`;
    this.editor.execCommand("insertHTML", o);
  }
  async insertTable() {
    if (!this.editor.hasFeature("table")) {
      this.editor.showUpgradeModal("Table Builder", "pro");
      return;
    }
    const e = await this.editor.showPrompt("Rows", "3");
    if (e === null) return;
    const r = await this.editor.showPrompt("Columns", "3");
    if (r === null) return;
    let o = '<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #e2e8f0;">';
    for (let t = 0; t < parseInt(e); t++) {
      o += "<tr>";
      for (let i = 0; i < parseInt(r); i++)
        o += '<td style="border: 1px solid #e2e8f0; padding: 0.5rem;">Cell</td>';
      o += "</tr>";
    }
    o += "</table><p><br></p>", this.editor.execCommand("insertHTML", o);
  }
}
class z extends x {
  init() {
    this.initGhostText();
  }
  initGhostText() {
    if (!this.editor.shadow.querySelector("#true-ai-ghost-style")) {
      const r = document.createElement("style");
      r.id = "true-ai-ghost-style", r.textContent = ".true-ghost { color: #94a3b8; pointer-events: none; opacity: 0.7; }", this.editor.shadow.appendChild(r);
    }
    let e;
    this.editor.editor.addEventListener("input", () => {
      var t;
      if (!((t = this.editor.aiConfig) == null ? void 0 : t.enabled)) return;
      clearTimeout(e), this.clearGhost();
      const o = this.editor.shadow.getSelection();
      o.rangeCount > 0 && !o.getRangeAt(0).collapsed || (e = setTimeout(() => this.triggerGhost(), 1500));
    }), this.editor.editor.addEventListener("keydown", (r) => {
      const o = this.editor.shadow.querySelector(".true-ghost");
      o && (r.key === "Tab" ? (r.preventDefault(), this.acceptGhost(o)) : this.clearGhost());
    });
  }
  clearGhost() {
    this.editor.shadow.querySelectorAll(".true-ghost").forEach((e) => e.remove());
  }
  async triggerGhost() {
    const e = this.editor.shadow.getSelection();
    if (!e.rangeCount) return;
    e.getRangeAt(0);
    const r = this.editor.editor.innerText;
    if (r.length < 5) return;
    const o = await this.generateResponse("Complete the sentence/paragraph naturally. Return ONLY the completion text, no quotes.", r);
    o && o.success && o.text && this.showGhost(o.text);
  }
  showGhost(e) {
    if (!e) return;
    e = e.replace(/^ /, "");
    const r = document.createElement("span");
    r.className = "true-ghost", r.contentEditable = "false", r.innerText = e;
    const o = this.editor.shadow.getSelection();
    if (o.rangeCount > 0) {
      const t = o.getRangeAt(0);
      t.insertNode(r), t.setStartBefore(r), t.setEndBefore(r), o.removeAllRanges(), o.addRange(t);
    }
  }
  acceptGhost(e) {
    const r = e.innerText;
    e.remove(), this.editor.editor.focus(), this.insertAtCursor(r);
  }
  async generateResponse(e, r, o = "complete") {
    try {
      return await (await fetch(`${this.editor.apiUrl}/editor/ai-completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: this.editor.apiKey,
          prompt: e,
          context: r,
          action: o
        })
      })).json();
    } catch (t) {
      return console.error("AI Connection Error:", t), { success: !1, error: t.message };
    }
  }
  async handleAIResponse(e) {
    this.editor.editor.focus(), this.clearGhost(), await this.typeEffect(e);
  }
  // Helper for direct insertion without type effect if needed
  insertAtCursor(e) {
    const r = this.editor.shadow.getSelection();
    if (r.rangeCount) {
      const o = r.getRangeAt(0);
      o.deleteContents();
      const t = document.createTextNode(e);
      o.insertNode(t), o.setStartAfter(t), o.setEndAfter(t), r.removeAllRanges(), r.addRange(o), this.editor.saveHistory();
    }
  }
  async typeEffect(e) {
    const r = this.editor.plugins.get("history");
    r && (r.isLocked = !0);
    const o = document.createElement("div");
    o.innerHTML = e;
    const t = Array.from(o.childNodes);
    this.editor.editor.focus();
    const i = this.editor.shadow.getSelection();
    i.rangeCount > 0 && !i.getRangeAt(0).collapsed && i.getRangeAt(0).deleteContents();
    for (const n of t)
      if (n.nodeType === Node.TEXT_NODE) {
        const s = n.textContent.split("");
        for (const l of s) {
          this.editor.editor.focus(), document.execCommand("insertText", !1, l);
          const u = Math.floor(Math.random() * 15) + 5;
          await new Promise((h) => setTimeout(h, u));
        }
      } else {
        this.editor.editor.focus();
        const s = n.nodeType === Node.ELEMENT_NODE ? n.outerHTML : n.textContent;
        document.execCommand("insertHTML", !1, s), await new Promise((l) => setTimeout(l, 20));
      }
    r && (r.isLocked = !1, r.save()), this.editor.saveLocalContent(), this.editor.updateToolbar();
  }
  checkPlan() {
    return !0;
  }
}
class j extends x {
  constructor(e) {
    super(e), this.statusElement = null;
  }
  init() {
    this.renderStatus(), this.editor.editor.addEventListener("input", () => this.updateMetrics()), this.updateMetrics();
  }
  renderStatus() {
    this.statusElement = document.createElement("div"), this.statusElement.className = "true-editor-status", this.statusElement.innerHTML = `
            <div class="true-status-metrics">
                <span id="true-word-count">0 words</span>
                <span id="true-char-count">0 chars</span>
            </div>
            <div class="true-status-info" id="true-save-status">Ready</div>
        `, this.editor.footer.appendChild(this.statusElement);
  }
  updateMetrics() {
    const e = this.editor.editor.innerText || "", r = e.trim() ? e.trim().split(/\s+/).length : 0, o = e.length;
    this.statusElement.querySelector("#true-word-count").innerText = `${r} words`, this.statusElement.querySelector("#true-char-count").innerText = `${o} chars`;
  }
  setStatus(e, r = !1) {
    const o = this.statusElement.querySelector("#true-save-status");
    o.innerText = e, o.style.opacity = r ? "0.6" : "1";
  }
  updateState() {
  }
}
class N extends x {
  constructor(e) {
    super(e), this.shortcuts = {
      "# ": "h1",
      "## ": "h2",
      "### ": "h3",
      "> ": "blockquote",
      "- ": "insertUnorderedList",
      "* ": "insertUnorderedList",
      "1. ": "insertOrderedList",
      "a. ": "insertOrderedList:a",
      "i. ": "insertOrderedList:i"
    }, this.lastConvertedRange = null;
  }
  init() {
    this.editor.hasFeature("markdown") && this.editor.editor.addEventListener("keydown", (e) => {
      e.key === " " ? this.checkMarkdown(e) : e.key === "Backspace" ? this.handleBackspace(e) : e.key === "Tab" && this.handleTab(e);
    });
  }
  checkMarkdown(e) {
    const r = this.editor.shadow.getSelection();
    if (!r.rangeCount) return;
    const o = r.getRangeAt(0), t = o.startContainer;
    if (t.nodeType !== Node.TEXT_NODE) return;
    const i = t.textContent.substring(0, o.startOffset) + " ";
    for (const [n, s] of Object.entries(this.shortcuts))
      if (i.endsWith(n)) {
        e.preventDefault();
        const l = o.startOffset - (n.length - 1);
        t.textContent = t.textContent.substring(0, l) + t.textContent.substring(o.startOffset);
        const u = document.createRange();
        u.setStart(t, l), u.collapse(!0), r.removeAllRanges(), r.addRange(u);
        let h = s, p = null;
        if (s.includes(":") && ([h, p] = s.split(":")), this.editor.execCommand(h), p) {
          const m = this.editor.shadow.getSelection();
          if (m.rangeCount > 0) {
            let g = m.getRangeAt(0).startContainer;
            for (; g && g !== this.editor.editor; ) {
              if (g.tagName === "OL") {
                g.setAttribute("type", p);
                break;
              }
              g = g.parentElement;
            }
          }
        }
        this.lastConvertedRange = {
          node: t,
          text: n,
          command: h
        };
        break;
      }
  }
  handleBackspace(e) {
    if (!this.lastConvertedRange) return;
    const r = this.editor.shadow.getSelection();
    if (!r.rangeCount) return;
    const o = r.getRangeAt(0);
    if (o.collapsed && o.startOffset === 0) {
      let i = o.startContainer;
      for (; i && i.tagName !== "LI" && i !== this.editor.editor; )
        i = i.parentElement;
      i && i.tagName === "LI" && i.textContent.trim() === "" && (e.preventDefault(), this.editor.execCommand(this.lastConvertedRange.command), document.execCommand("insertText", !1, this.lastConvertedRange.text), this.lastConvertedRange = null);
    } else
      this.lastConvertedRange = null;
  }
  handleTab(e) {
    e.preventDefault();
    const r = this.editor.shadow.getSelection();
    if (!r.rangeCount) return;
    let t = r.getRangeAt(0).startContainer;
    for (; t && t.tagName !== "LI" && t !== this.editor.editor; )
      t = t.parentElement;
    t && t.tagName === "LI" ? e.shiftKey ? this.editor.execCommand("outdent") : this.editor.execCommand("indent") : document.execCommand("insertText", !1, "    ");
  }
  updateState() {
  }
}
class H extends x {
  init() {
  }
  exportPDF() {
    if (!this.editor.hasFeature("export")) {
      this.editor.showUpgradeModal("PDF Export", "pro");
      return;
    }
    const e = this.editor.getContent(), r = window.open("", "_blank");
    r.document.write(`
            <html>
                <head>
                    <title>Export PDF - TrueEditr</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; line-height: 1.6; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>${e}</body>
            </html>
        `), r.document.close(), r.print();
  }
  exportDOCX() {
    if (!this.editor.hasFeature("export")) {
      this.editor.showUpgradeModal("DOCX Export", "pro");
      return;
    }
    const t = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export DOCX</title></head><body>" + this.editor.getContent() + "</body></html>", i = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(t), n = document.createElement("a");
    document.body.appendChild(n), n.href = i, n.download = "document.doc", n.click(), document.body.removeChild(n);
  }
}
class $ {
  constructor(e) {
    if (this.apiKey = e.key, this.selector = e.selector, this.apiUrl = e.apiUrl || (typeof window < "u" ? `${window.location.origin}/api` : "https://trueeditr.in/api"), this.plugins = /* @__PURE__ */ new Map(), this.isSourceMode = !1, this.history = [], this.historyIndex = -1, this.plan = "free", this.tierFeatures = {
      free: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "h1",
        "h2",
        "h3",
        "formatBlock",
        "insertUnorderedList",
        "insertOrderedList",
        "createLink",
        "insertLink",
        "unlink",
        "link",
        "insertImage",
        "image_url",
        "image",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "align",
        "autosave",
        "status",
        "history",
        "undo",
        "redo",
        "source",
        "ai",
        "save"
      ],
      pro: [
        "slash",
        "upload",
        "resize",
        "table",
        "insertTable",
        "code",
        "insertCode",
        "markdown",
        "export",
        "typography",
        "fontSize"
      ],
      enterprise: ["collab", "white_label"]
    }, this.container = typeof document < "u" ? document.querySelector(this.selector) : null, !this.container) {
      console.error("TrueEditr: Container not found");
      return;
    }
    this.init();
  }
  async init() {
    try {
      const e = await fetch(`${this.apiUrl}/editor/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: this.apiKey })
      });
      if (!e.ok) {
        const o = await e.json();
        this.renderError(o.error || "Initialization failed", o.upgrade);
        return;
      }
      const r = await e.json();
      this.config = r.config, this.aiConfig = r.config.ai, this.plan = (r.config.plan || "free").toLowerCase(), console.log("TrueEditr Config:", {
        plan: this.plan,
        features: this.config.features,
        ai: this.aiConfig
      }), typeof localStorage < "u" && localStorage.setItem(`trueeditr_config_${this.apiKey}`, JSON.stringify(r)), this.renderEditor();
    } catch (e) {
      console.error("TrueEditr: Connection error", e);
      const r = typeof localStorage < "u" ? localStorage.getItem(`trueeditr_config_${this.apiKey}`) : null;
      if (r) {
        const o = JSON.parse(r);
        this.config = o.config, this.aiConfig = o.config.ai, this.plan = (o.config.plan || "free").toLowerCase(), this.renderEditor(), console.warn("TrueEditr: Offline mode.");
      } else
        console.warn("TrueEditr: API connection failed. Falling back to default config for local testing."), this.config = { features: ["bold", "italic", "underline", "ai"], ai: { enabled: !0, configured: !0 } }, this.aiConfig = { enabled: !0, configured: !0 }, this.plan = "pro", this.renderEditor();
    }
  }
  renderError(e, r) {
    this.container.innerHTML = `
            <div style="border: 1px solid #ef4444; background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 0.5rem; font-family: sans-serif;">
                <strong>Editor Error:</strong> ${e}
                ${r ? `<br><a href="${r}" target="_blank" style="color: #b91c1c; text-decoration: underline;">Upgrade Plan</a>` : ""}
            </div>
        `;
  }
  renderEditor() {
    this.shadow = this.container.attachShadow({ mode: "open" }), this.wrapper = document.createElement("div"), this.wrapper.className = "true-editor-wrapper", this.injectStyles(), this.toolbar = document.createElement("div"), this.toolbar.className = "true-editor-toolbar", this.wrapper.appendChild(this.toolbar), this.scrollArea = document.createElement("div"), this.scrollArea.className = "true-editor-scroll-area", this.wrapper.appendChild(this.scrollArea), this.editor = document.createElement("div"), this.editor.className = "true-editor-content", this.editor.contentEditable = !0, this.scrollArea.appendChild(this.editor), this.sourceArea = document.createElement("textarea"), this.sourceArea.className = "true-editor-content true-editor-source", this.sourceArea.style.display = "none", this.scrollArea.appendChild(this.sourceArea), this.footer = document.createElement("div"), this.footer.className = "true-editor-footer", this.wrapper.appendChild(this.footer), this.shadow.appendChild(this.wrapper), this.registerPlugin("history", P), this.registerPlugin("status", j), this.registerPlugin("insert", B), this.registerPlugin("ai", z), this.registerPlugin("markdown", N), this.registerPlugin("export", H), this.registerPlugin("toolbar", M), this.registerPlugin("slash", R), this.updateUIForPlan(), this.loadLocalContent(), this.setupEventListeners();
  }
  injectStyles() {
    const e = document.createElement("style");
    e.textContent = `
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
        `, this.shadow.appendChild(e);
  }
  showPrompt(e, r = "") {
    return new Promise((o) => {
      const t = document.createElement("div");
      t.className = "true-modal-overlay", t.innerHTML = `
                <div class="true-modal">
                    <div class="true-modal-title">${e}</div>
                    <input type="text" class="true-modal-input" value="${r}">
                    <div class="true-modal-actions">
                        <button class="true-modal-btn true-modal-btn-secondary" id="true-cancel">Cancel</button>
                        <button class="true-modal-btn true-modal-btn-primary" id="true-ok">OK</button>
                    </div>
                </div>
            `, this.wrapper.appendChild(t);
      const i = t.querySelector("input");
      i.focus(), i.select();
      const n = (s) => {
        t.remove(), o(s);
      };
      t.querySelector("#true-ok").onclick = () => n(i.value), t.querySelector("#true-cancel").onclick = () => n(null), i.onkeydown = (s) => {
        s.key === "Enter" && n(i.value), s.key === "Escape" && n(null);
      }, t.onclick = (s) => {
        s.target === t && n(null);
      };
    });
  }
  showAIPopover(e = "", r = null) {
    return console.log("🟡 showAIPopover called with:", { context: e == null ? void 0 : e.substring(0, 30), onGenerate: !!r }), console.log("🟡 this.wrapper:", this.wrapper), console.log("🟡 this.shadow:", this.shadow), new Promise((o) => {
      var T, A;
      const t = document.createElement("div");
      t.className = "true-ai-popover", console.log("🟡 Popover element created:", t);
      const i = this.shadow.getSelection(), n = i && i.rangeCount > 0 && !i.getRangeAt(0).collapsed, s = n ? "Replace Selection" : "Insert";
      if (t.innerHTML = `
                <div class="true-ai-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                    <span>TrueEditr AI Assistant</span>
                    <button class="true-ai-close-btn" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.5rem;">&times;</button>
                </div>

                <div class="true-ai-special-actions" style="display:flex; gap:0.5rem; padding:0 0.5rem 0.5rem 0.5rem; flex-wrap:wrap;">
                    <button class="true-ai-action-chip" data-action="grammar">✨ Fix Grammar</button>
                    <button class="true-ai-action-chip" data-action="improve">📝 Improve</button>
                    ${n ? '<button class="true-ai-action-chip" data-action="summarize">📊 Summarize</button>' : ""}
                    <button class="true-ai-action-chip" data-action="translate">🌍 Translate</button>
                </div>

                <!-- Custom Prompts Quick Actions -->
                <div class="true-ai-prompts" style="display:flex; gap:0.5rem; padding:0 0.5rem 0.75rem 0.5rem; flex-wrap:wrap; border-bottom: 1px solid #f1f5f9; margin-bottom: 0.5rem;">
                    ${((A = (T = this.aiConfig) == null ? void 0 : T.customPrompts) == null ? void 0 : A.map((a, d) => `
                        <button class="true-ai-prompt-chip" data-index="${d}" title="${a.text.replace(/"/g, "&quot;")}">${a.title}</button>
                    `).join("")) || ""}
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
                        <button class="true-ai-gen-btn" id="true-ai-confirm">${s}</button>
                    </div>

                    <button class="true-ai-gen-btn" id="true-ai-generate">Generate</button>
                </div>
            `, console.log("🟡 Popover HTML set"), this.wrapper.appendChild(t), !this.shadow.querySelector("#true-ai-styles")) {
        const a = document.createElement("style");
        a.id = "true-ai-styles", a.textContent = `
                    .true-ai-btn-sec { background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.4rem 0.8rem; font-size: 0.85rem; cursor: pointer; color: #475569; transition: all 0.2s; }
                    .true-ai-btn-sec:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
                    .true-ai-prompt-chip, .true-ai-action-chip { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; padding: 0.25rem 0.75rem; font-size: 0.75rem; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                    .true-ai-prompt-chip:hover, .true-ai-action-chip:hover { background: #e2e8f0; color: #0f172a; border-color: #cbd5e1; }
                    .true-ai-action-chip { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; font-weight: 600; }
                    .true-ai-action-chip:hover { background: #ede9fe; }
                `, this.shadow.appendChild(a);
      }
      const l = t.querySelector("#true-ai-field");
      t.querySelectorAll(".true-ai-prompt-chip").forEach((a) => {
        a.onclick = () => {
          const d = a.getAttribute("data-index"), c = this.aiConfig.customPrompts[d];
          c && (l.value = c.text, l.focus());
        };
      }), t.querySelectorAll(".true-ai-action-chip").forEach((a) => {
        a.onclick = () => {
          const d = a.getAttribute("data-action");
          let c = "";
          d === "grammar" ? c = "Fix grammar and spelling mistakes." : d === "improve" ? c = "Improve the writing style and clarity." : d === "summarize" ? c = "Summarize this content briefly." : d === "translate" && (c = "Translate this to Hindi (or specify language in prompt)."), l.value = c, L(d);
        };
      });
      const u = t.querySelector(".true-ai-result"), h = t.querySelector(".true-ai-actions"), p = t.querySelector("#true-ai-generate"), m = t.querySelector("#true-ai-hints"), g = t.querySelector(".true-ai-close-btn");
      setTimeout(() => l.focus(), 50);
      const b = this.wrapper.querySelector("#true-ai-toolbar-btn"), y = this.wrapper.getBoundingClientRect(), C = 380, v = 350;
      if (t.style.maxHeight = `${v}px`, t.style.zIndex = "9999", b) {
        const a = b.getBoundingClientRect();
        let d = a.bottom - y.top + 8, c = a.left - y.left;
        if (c + C > y.width && (c = y.width - C - 10), d + v > y.height) {
          const I = a.top - y.top - v - 8;
          I > 0 ? d = I : d = Math.max(10, y.height - v - 10);
        }
        t.style.top = `${d}px`, t.style.left = `${Math.max(10, c)}px`;
      } else {
        const a = (y.height - v) / 2, d = (y.width - C) / 2;
        t.style.top = `${Math.max(20, a)}px`, t.style.left = `${Math.max(20, d)}px`;
      }
      t.addEventListener("mousedown", (a) => a.stopPropagation()), t.addEventListener("click", (a) => a.stopPropagation());
      const w = (a) => {
        t.remove(), document.removeEventListener("mousedown", S), o(a);
      }, S = (a) => {
        a.composedPath().includes(t) || w(null);
      };
      setTimeout(() => document.addEventListener("mousedown", S), 10);
      let k = "";
      const L = async (a = "complete") => {
        const d = l.value.trim();
        if (d) {
          l.disabled = !0, p.innerText = "Thinking...", p.disabled = !0;
          try {
            if (r) {
              const c = await r(d, e, a);
              c && c.success ? (k = c.text, l.style.display = "none", m.style.display = "none", p.style.display = "none", t.querySelector(".true-ai-special-actions").style.display = "none", t.querySelector(".true-ai-prompts").style.display = "none", u.style.display = "block", u.innerHTML = k, h.style.display = "flex") : (await this.showSettingsModal((c == null ? void 0 : c.error) || "Failed to generate AI response. Please try again."), E());
            } else
              w(d);
          } catch (c) {
            console.error(c), await this.showSettingsModal("An error occurred while generating content. Please try again."), E();
          } finally {
          }
        }
      }, E = () => {
        l.style.display = "block", l.disabled = !1, l.focus(), m.style.display = "flex", p.style.display = "block", p.innerText = "Generate", p.disabled = !1, t.querySelector(".true-ai-special-actions").style.display = "flex", t.querySelector(".true-ai-prompts").style.display = "flex", u.style.display = "none", h.style.display = "none";
      };
      p.onclick = () => L("complete"), g.onclick = () => w(null), l.onkeydown = (a) => {
        a.key === "Enter" && !a.shiftKey && (a.preventDefault(), L("complete")), a.key === "Escape" && w(null);
      }, t.querySelector("#true-ai-confirm").onclick = () => {
        w({ action: "accept", text: k });
      }, t.querySelector("#true-ai-copy").onclick = () => {
        navigator.clipboard.writeText(k.replace(/<[^>]*>/g, ""));
        const a = t.querySelector("#true-ai-copy"), d = a.innerText;
        a.innerText = "Copied!", setTimeout(() => a.innerText = d, 1e3);
      }, t.querySelector("#true-ai-retry").onclick = E;
    });
  }
  showUpgradeModal(e, r) {
    return new Promise((o) => {
      const t = document.createElement("div");
      t.className = "true-modal-overlay", t.innerHTML = `
                <div class="true-modal true-upgrade-modal">
                    <div class="true-upgrade-icon">🚀</div>
                    <div class="true-modal-title">${e} is a ${r.toUpperCase()} Feature</div>
                    <div class="true-upgrade-text">
                        Unlock advanced tools, AI automation, and professional editing capabilities by upgrading your plan.
                    </div>
                    <div class="true-modal-actions" style="flex-direction: column;">
                        <a href="https://trueeditr.in/dashboard/settings" target="_blank" class="true-modal-btn true-modal-btn-primary true-upgrade-btn">Upgrade Now</a>
                        <button class="true-modal-btn true-modal-btn-secondary" id="true-close" style="width: 100%;">Maybe Later</button>
                    </div>
                </div>
            `, this.wrapper.appendChild(t), t.querySelector("#true-close").onclick = () => {
        t.remove(), o(!1);
      }, t.onclick = (i) => {
        i.target === t && (t.remove(), o(!1));
      };
    });
  }
  showSettingsModal(e) {
    return new Promise((r) => {
      const o = document.createElement("div");
      o.className = "true-modal-overlay", o.innerHTML = `
                <div class="true-modal true-upgrade-modal">
                    <div class="true-upgrade-icon">⚙️</div>
                    <div class="true-modal-title">AI is Disabled</div>
                    <div class="true-upgrade-text">
                        ${e || "To use AI features, please enable them in your Dashboard Settings."}
                    </div>
                    <div class="true-modal-actions" style="flex-direction: column;">
                        <a href="https://trueeditr.in/dashboard/settings" target="_blank" class="true-modal-btn true-modal-btn-primary true-upgrade-btn">Go to Settings</a>
                        <button class="true-modal-btn true-modal-btn-secondary" id="true-close" style="width: 100%;">Close</button>
                    </div>
                </div>
            `, this.wrapper.appendChild(o);
      const t = () => {
        o.remove(), r();
      };
      o.querySelector("#true-close").onclick = t, o.onclick = (i) => {
        i.target === o && t();
      };
    });
  }
  hasFeature(e) {
    if ([
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "h1",
      "h2",
      "h3",
      "formatBlock",
      "insertUnorderedList",
      "insertOrderedList",
      "createLink",
      "insertLink",
      "unlink",
      "link",
      "insertImage",
      "image_url",
      "image",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
      "justifyFull",
      "align",
      "autosave",
      "status",
      "history",
      "undo",
      "redo",
      "source",
      "ai",
      "save"
    ].includes(e)) return !0;
    if (this.config && this.config.features && Array.isArray(this.config.features)) {
      const o = this.config.features.includes(e);
      return ["table", "insertTable", "export", "fontSize", "typography"].includes(e) && console.log(`Feature Check: ${e} = ${o} (Plan: ${this.plan}, Server Features:`, this.config.features), o;
    }
    return console.warn(`Using fallback feature check for: ${e}`), !!(this.plan === "enterprise" || this.tierFeatures.free.includes(e) || (this.plan === "pro" || this.plan === "enterprise") && this.tierFeatures.pro.includes(e));
  }
  updateUIForPlan() {
    if (this.plan !== "enterprise") {
      const e = document.createElement("div");
      e.className = "true-badge", e.innerText = "Powered by TrueEditr", this.wrapper.appendChild(e);
    }
  }
  loadLocalContent() {
    if (typeof localStorage > "u") return;
    const e = localStorage.getItem(`trueeditr_draft_${this.apiKey}`);
    e && (this.editor.innerHTML = e, this.updateToolbar());
  }
  getContent() {
    const e = this.editor.cloneNode(!0);
    return e.querySelectorAll(".true-ghost").forEach((r) => r.remove()), e.innerHTML;
  }
  saveLocalContent() {
    var e;
    typeof localStorage > "u" || (localStorage.setItem(`trueeditr_draft_${this.apiKey}`, this.getContent()), (e = this.plugins.get("status")) == null || e.setStatus("Draft saved locally"));
  }
  toggleSourceMode() {
    this.isSourceMode ? (this.editor.innerHTML = this.sourceArea.value, this.sourceArea.style.display = "none", this.editor.style.display = "block", this.isSourceMode = !1) : (this.sourceArea.value = this.getContent(), this.editor.style.display = "none", this.sourceArea.style.display = "block", this.isSourceMode = !0), this.updateToolbar();
  }
  execCommand(e, r = null) {
    this.editor.focus(), !this.isSourceMode && (document.execCommand(e, !1, r), this.updateToolbar(), this.saveHistory());
  }
  registerPlugin(e, r) {
    const o = new r(this);
    this.plugins.set(e, o), o.init();
  }
  setupEventListeners() {
    document.addEventListener("selectionchange", () => this.updateToolbar()), this.editor.addEventListener("input", () => {
      this.updateToolbar(), this.saveHistory(), this.saveLocalContent();
    }), this.editor.addEventListener("keydown", (e) => this.handleShortcuts(e)), this.sourceArea.addEventListener("input", () => this.saveHistory()), this.scrollArea.addEventListener("click", (e) => {
      e.target === this.scrollArea && this.editor.focus();
    });
  }
  handleShortcuts(e) {
    var t, i;
    if (!e.ctrlKey && !e.metaKey) return;
    const o = {
      b: "bold",
      i: "italic",
      u: "underline",
      z: "undo",
      y: "redo"
    }[e.key.toLowerCase()];
    o && (e.preventDefault(), o === "undo" ? (t = this.plugins.get("history")) == null || t.undo() : o === "redo" ? (i = this.plugins.get("history")) == null || i.redo() : this.execCommand(o));
  }
  updateToolbar() {
    this.plugins.forEach((e) => e.updateState());
  }
  saveHistory() {
    const e = this.plugins.get("history");
    e && e.save();
  }
}
export {
  $ as default
};
