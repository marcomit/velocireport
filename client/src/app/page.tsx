"use client";
import dynamic from "next/dynamic";

// Dynamically load PdfPreview
const PdfPreview = dynamic(() => import("@/components/pdfPreview"), {
  ssr: false, // Disable server-side rendering
});

import TextEditor from "@/components/textEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import DirectoriesTree from "@/components/directoriesTree";

export default function Home() {
  const [pdfBuffer, setPdfBuffer] = useState<Buffer | null>(null);
  const [directories, setDirectories] = useState([]);

  const fetchDirectories = async () => {
    const url = "http://localhost:8000/templates";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data:", data); // Log the data received
      setDirectories(data);
    } catch (error) {
      console.error("Error fetching directories:", error);
    }
  };

  useEffect(() => {
    fetchDirectories();
  }, []);

  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* First panel with smaller size */}
        <ResizablePanel defaultSize={8} minSize={5}>
          {directories.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <DirectoriesTree directories={directories} />
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={10}>
          {/* Text editor with content */}
          <TextEditor value="" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={10}>
          <h2>PDF Preview</h2>
          <PdfPreview buffer={pdfBuffer} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
