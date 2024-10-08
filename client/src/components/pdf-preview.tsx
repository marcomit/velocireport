import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfPreview = ({ buffer }: { buffer: Blob | null }) => {
  return buffer ? (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
    >
      <Viewer
        fileUrl={URL.createObjectURL(
          buffer
          /* new Blob([buffer], { type: "application/pdf" }) */
        )}
      />
    </Worker>
  ) : (
    <p>No PDF to display</p>
  );
};

export default PdfPreview;
