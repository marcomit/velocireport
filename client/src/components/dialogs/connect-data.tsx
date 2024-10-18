import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { imagesForLanguage } from "@/lib/utils";
import useDirectories from "@/stores/directories";
import { Data, FormatSchema } from "@/types/data-schema";
import { DirectoryTree } from "@/types/directory";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const ConnectDataDialog = ({ selected }: { selected: string }) => {
  const { directories } = useDirectories();
  const selectedDirectory = directories.find((dir) => dir.name === selected);
  const [type, setType] = useState<"rawdata" | "file" | "import" | "fetch">(
    "rawdata"
  );
  const [selectedFile, setSelectedFile] = useState<DirectoryTree | null>(null);

  const [data, setData] = useState<Data | null>({
    type: "raw",
    name: selected + "Data",
    format: "txt",
    content: "",
  } as Data);

  const handleSetData = <T extends keyof Data>(key: T, value: Data[T]) => {
    setData((prev) => ({
      ...(prev || ({} as Data)),
      [key]: value,
    }));
  };

  async function handleSubmit() {
    //TODO!: send Data to server
    console.log({
      data,
    });
    await axios
      .post(`http://localhost:8000/data/${selected}`, data)
      .catch((e) => {
        //TODO: handle error
        console.error(e.response.data);
        toast.error(e.response.data);
      })
      .finally(() => {
        toast.success("Data connected successfully");
      });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"custom-dark"} className="mt-2 w-full">
          CONNECT DATA
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Connect data</DialogTitle>
          <DialogDescription>
            Connect your data sources to this template. Click save when you're
            done
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            defaultValue={selected + "Data"}
            onChange={(e) => handleSetData("name", e.target.value)}
          />
        </div>
        <Tabs defaultValue="rawdata" className="flex flex-col">
          <TabsList>
            <TabsTrigger
              value="rawdata"
              onClick={(e) => handleSetData("type", "raw")}
            >
              Raw Data
            </TabsTrigger>
            <TabsTrigger
              value="file"
              onClick={(e) => handleSetData("type", "file")}
            >
              Select existing file
            </TabsTrigger>
            <TabsTrigger
              value="import"
              onClick={(e) => handleSetData("type", "file")}
            >
              Import file
            </TabsTrigger>
            <TabsTrigger
              value="fetch"
              onClick={(e) => handleSetData("type", "fetch")}
            >
              Api Endpoint
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rawdata">
            paste your raw data here.
            <Textarea
              id="rawdata"
              className="min-h-[200px]"
              onChange={(e) => handleSetData("content", e.target.value)}
            />
          </TabsContent>
          <TabsContent value="file">
            Select a file:
            {selectedDirectory &&
              Array.isArray(selectedDirectory.content) &&
              selectedDirectory.content.map((file) => (
                <div
                  key={file.name}
                  className={`cursor-pointer rounded-sm px-2 flex items-center ${
                    selectedFile == file
                      ? "bg-primary/50 "
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => {
                    setSelectedFile(file);
                    const fileName = FormatSchema.safeParse(
                      file.name.split(".").pop()
                    );
                    if (fileName.success) {
                      handleSetData("format", fileName.data);
                    } else {
                      handleSetData("format", "txt");
                    }
                    handleSetData("content", file.content as string);
                  }}
                >
                  <Image
                    src={`/${imagesForLanguage.get(
                      file.name.split(".").pop() || ""
                    )}`}
                    className="w-5 h-5 me-2"
                    alt={file.name}
                    width={20}
                    height={20}
                  />
                  {file.name}
                </div>
              ))}
          </TabsContent>
          <TabsContent value="import">
            <Input
              type="file"
              id="import"
              className="col-span-3"
              onChange={(e) => {
                const fileName = FormatSchema.safeParse(
                  e.target.files?.[0].name.split(".").pop()
                );
                if (fileName.success) {
                  handleSetData("format", fileName.data);
                } else {
                  handleSetData("format", "txt");
                }
                handleSetData("content", e.target.value);
              }}
            />
          </TabsContent>
          <TabsContent value="fetch">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  className="col-span-3"
                  onChange={(e) => {
                    handleSetData("format", "get");
                    handleSetData("type", "fetch");
                    handleSetData("content", e.target.value);
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDataDialog;
