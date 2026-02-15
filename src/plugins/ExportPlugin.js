import BasePlugin from './BasePlugin.js';

export default class ExportPlugin extends BasePlugin {
    init() { }

    exportPDF() {
        if (!this.editor.hasFeature('export')) {
            this.editor.showUpgradeModal('PDF Export', 'pro');
            return;
        }

        const content = this.editor.getContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
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
                <body>${content}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    exportDOCX() {
        if (!this.editor.hasFeature('export')) {
            this.editor.showUpgradeModal('DOCX Export', 'pro');
            return;
        }

        const content = this.editor.getContent();
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Export DOCX</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'document.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }
}
