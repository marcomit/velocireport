"use client";
import PdfPreview from "@/components/pdfPreview";
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
    const response = await fetch("http://localhost:80/templates");
    const data = await response.json();
    setDirectories(data);
  };

  useEffect(() => {
    fetchDirectories();
    console.log(directories);
  }, []);

  // Simulate PDF buffer for testing purposes (replace this with actual buffer logic)
  /*   const blob = new Blob([text], { type: "application/pdf" });
  const reader = new FileReader();
  reader.onload = () => {
    setPdfBuffer(reader.result);
  };
  reader.readAsArrayBuffer(blob); */

  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* First panel with smaller size */}
        <ResizablePanel defaultSize={8} minSize={5}>
          <h2>Files</h2>
          <DirectoriesTree directories={directories} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={10}>
          {/* Text editor with content based on selected file */}
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
