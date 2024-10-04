"use client";
// components/PdfPreview.js
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

const PdfPreview = ({ buffer }) => {
  const [numPages, setNumPages] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    if (buffer) {
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfData(url);

      // Clean up the object URL when the component unmounts or buffer changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [buffer]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-preview">
      {pdfData && (
        <Document
          file={pdfData}
          onLoadSuccess={onDocumentLoadSuccess}
          className="pdf-document"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
      {numPages && <p className="page-indicator">Page 1 of {numPages}</p>}
      <style jsx>{`
        .pdf-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
        }
        .pdf-document {
          width: 100%;
          height: auto;
        }
        .page-indicator {
          text-align: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default PdfPreview;
