import { DirectoryTree } from "@/types/directory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { File, Trash } from "lucide-react";
import { useState } from "react";

export default function NewFileDialog() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ContextMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <File className="w-4 h-4 me-2" />
          New File
        </ContextMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create File</DialogTitle>
          <DialogDescription>
            Are you sure you want to create a new file?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" onClick={handleClick}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
