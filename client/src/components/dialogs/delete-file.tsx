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
import { useMutation, useQuery } from "@tanstack/react-query";
import useDirectories from "@/stores/directories";

interface DeleteFileDialogProps {
  file: DirectoryTree;

  children: React.ReactNode;
}

export default function DeleteFileDialog({
  file,
  children,
}: DeleteFileDialogProps) {
  const [open, setOpen] = useState(false);

  const { toggleChanged, selected } = useDirectories();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteFile(file);
    },

    onSuccess: () => {
      toggleChanged();
      setOpen(false);
      console.log(selected);
      console.log("deleted succesfully");
    },
    onError: (error) => {
      console.log("onError", error);
    },
  });

  //   const { isPending, error, data } = useQuery({
  //     queryKey: ["deleteFile"],
  //     queryFn: () => deleteFile(file.path),
  //   });

  //   async function onDelete() {
  //     let response = await deleteFile(file.path);
  //     console.log(response);
  //   }

  //   async function handleDelete() {
  //     await deleteFile(file.path);
  //     setOpen(false);
  //   }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogTrigger
        asChild
        onSelect={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        {children}
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
          <Button variant="destructive" onClick={() => deleteMutation.mutate()}>
            {deleteMutation.isPending ? "Deleting..." : "Yes"}
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            No
          </Button>
          {deleteMutation.isError && (
            <p className="text-destructive">{deleteMutation.error.message}</p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
