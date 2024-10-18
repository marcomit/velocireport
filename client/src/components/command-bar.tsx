import { runTemplate, saveFiles } from "@/lib/utils";
import usePdfBuffer from "@/stores/pdf-buffer";
import axios from "axios";
import { motion } from "framer-motion";
import { Play, Save, SaveAll } from "lucide-react";
import { Button } from "./ui/button";
import useDirectories from "@/stores/directories";
import { toast } from "sonner";
import { DirectoryTree } from "@/types/directory";

const CommandBar = ({
  constraintsRef,
}: {
  constraintsRef: React.RefObject<HTMLDivElement>;
}) => {
  const { getSelected } = useDirectories();
  const { setPdfBuffer } = usePdfBuffer();
  const selected = getSelected();

  async function handleSave() {
    if (!selected || selected.sync == true) return;

    const response = await saveFiles([selected]);
    toast.success(response);
  }
  async function handleRun() {
    if (!selected) return;
    let templateName = selected.parent.split("/")[0] || "";
    if (templateName === "") templateName = selected.name;
    const buffer = await runTemplate(templateName);
    if (buffer != null) setPdfBuffer(buffer);
  }
  async function handleSaveAll() {
    const directories = useDirectories.getState().directories;
    const changedFiles: DirectoryTree[] = [];
    function dfs(directory: DirectoryTree) {
      if (directory.type === "file" && directory.sync === false) {
        changedFiles.push(directory);
      }
      if (directory.type === "directory") {
        if (typeof directory.content === "string") return;
        directory.content.forEach((d) => dfs(d as DirectoryTree));
      }
    }
    directories.forEach((d) => dfs(d));
    console.log(changedFiles);
    const result = await saveFiles(changedFiles);
    toast.success(result);
  }
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      className="flex justify-start items-center fixed bottom-5 left-1/3 z-50 bg-primary/10 rounded-lg p-2 gap-2 hover:bg-primary/20 transition-colors backdrop-blur-sm"
    >
      <Button
        onClick={handleRun}
        className="flex items-center justify-center space-x-2  "
        variant={"custom-dark"}
      >
        <Play className="w-8 h-w-8" />
        <span className="text-xl">Run</span>
      </Button>
      <Button
        onClick={handleSave}
        className="flex items-center justify-center space-x-2 "
        variant={"custom-dark"}
      >
        <Save className="w-8 h-w-8" />
        <span className="text-xl">Save file</span>
      </Button>
      <Button
        onClick={handleSaveAll}
        className="flex items-center justify-center space-x-2 "
        variant={"custom-dark"}
      >
        <SaveAll className="w-8 h-w-8" />
        <span className="text-xl">Save all</span>
      </Button>
    </motion.div>
  );
};

export default CommandBar;
