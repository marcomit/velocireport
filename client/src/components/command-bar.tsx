import axios from "axios";
import { Button } from "./ui/button";
import useTabs from "@/stores/tabs";
import { Play, Save, SaveAll } from "lucide-react";
import { motion } from "framer-motion";

const CommandBar = ({
  setPdfBuffer,
  constraintsRef,
}: {
  constraintsRef: React.RefObject<HTMLDivElement>;
  setPdfBuffer: (buffer: Record<string, number> | null) => void;
}) => {
  const { selected, sync } = useTabs();
  async function handleRun() {
    const response = await axios.get("http://localhost:8000/pdf/scontrini", {});
    console.log(response.data);
    setPdfBuffer(response.data);
  }

  async function handleSave() {
    if (!selected || selected.sync == true) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/templates/${selected.name}`,
        selected.content
      );
      console.log(response.data);
      sync(selected);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  function handleSaveAll() {}
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      className="flex justify-start items-center fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-primary/10 rounded-lg p-2 gap-2 hover:bg-primary/20 transition-colors backdrop-blur-sm"
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
