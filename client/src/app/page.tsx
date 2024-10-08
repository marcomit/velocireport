"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import DirectoriesTree from "@/components/directories-tree";
import Tabs from "@/components/tabs";
import TextEditor from "@/components/text-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PdfPreview from "@/components/pdf-preview";

export default function Home() {
  const [directories, setDirectories] = useState([]);
  const [pdfBuffer, setPdfBuffer] = useState<Blob | null>(null);

  const fetchDirectories = async () => {
    const url = "http://localhost:8000/templates";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDirectories(data);
    } catch (error) {
      console.error("Error fetching directories:", error);
    }
  };

  useEffect(() => {
    fetchDirectories();
  }, []);

  return (
    <div className="h-screen flex flex-col font-mono">
      <Header setPdfBuffer={setPdfBuffer} />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={10}
            minSize={5}
            className="h-full overflow-auto"
          >
            {directories.length === 0 ? (
              <p>Loading...</p>
            ) : (
              <DirectoriesTree directories={directories} />
            )}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={45}
            minSize={10}
            className="h-full flex flex-col border-s-2 border-e-2 border-border"
          >
            <Tabs />
            <div className="flex-1 overflow-auto ">
              <TextEditor />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={45} minSize={10} className="h-full">
            <div className="h-full flex justify-center items-center overflow-auto">
              {!pdfBuffer ? (
                <h2>PDF Preview</h2>
              ) : (
                <PdfPreview buffer={pdfBuffer} />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
