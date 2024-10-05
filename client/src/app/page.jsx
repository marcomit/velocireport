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
  const [pdfBuffer, setPdfBuffer] = useState(null);
  const [directories, setDirectories] = useState([]);

  const fetchDirectories = async () => {
    try {
      const response = await fetch("http://localhost:80/templates");
      const data = await response.json();
      setDirectories(data);
    } catch (error) {
      console.error("Error fetching directories:", error);
    }
  };

  useEffect(() => {
    fetchDirectories();
  }, []); // Empty dependency array to fetch once on mount

  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* First panel with smaller size */}
        <ResizablePanel defaultSize={8} minSize={5}>
          <h2>Files</h2>
          {/* Pass directories to DirectoriesTree component */}
          <DirectoriesTree directories={directories} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={10}>
          {/* Text editor with content */}
          <TextEditor />
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
