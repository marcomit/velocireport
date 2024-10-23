"use client";
import usePdfBuffer from "@/stores/pdf-buffer";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfPreview = () => {
  const createPdfBlob = (data: Record<string, number>): Blob => {
    const byteNumbers = Object.values(data);
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  };

  const { pdfBuffer, error } = usePdfBuffer();
  if (error) {
    console.error(error);
    return <p>{error}</p>;
  }

  return pdfBuffer ? (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
    >
      <Viewer fileUrl={window.URL.createObjectURL(createPdfBlob(pdfBuffer))} />
    </Worker>
  ) : (
    <p>No PDF to display</p>
  );
};

export default PdfPreview;
