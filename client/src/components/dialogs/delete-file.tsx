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
import { Trash } from "lucide-react";
import { useState } from "react";
import { deleteFile } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface DeleteFileDialogProps {
  file: DirectoryTree;
}

export default function DeleteFileDialog({ file }: DeleteFileDialogProps) {
  const [open, setOpen] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["deleteFile"],
    queryFn: () => deleteFile(file.path),
  });

  async function onDelete() {
    let response = await deleteFile(file.path);
    console.log(response);
  }

  async function handleDelete() {
    await onDelete();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ContextMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <Trash className="w-4 h-4 me-2" />
          Delete
        </ContextMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{file.name}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            {isPending ? "Deleting..." : "Yes"}
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
