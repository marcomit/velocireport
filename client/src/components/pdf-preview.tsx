'use client'
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfPreview = ({ buffer }: { buffer: Record<string, number> | null }) => {
  const createPdfBlob = (data: Record<string, number>): Blob => {
    const byteNumbers = Object.values(data);
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  };

  return buffer ? (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
    >
      <Viewer
        fileUrl={window.URL.createObjectURL(createPdfBlob(buffer))}
      />
    </Worker>
  ) : (
    <p>No PDF to display</p>
  );
};

export default PdfPreview;
