import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { DirectoryTree } from "@/types/directory";
import { Textarea } from "../ui/textarea";

const ConnectDataDialog = ({ selected }: { selected: DirectoryTree }) => {
  const [type, setType] = useState<"rawdata" | "file" | "import" | "fetch">(
    "rawdata"
  );
  const [selectedFile, setSelectedFile] = useState<DirectoryTree | null>(null);
  const [name, setName] = useState<string>(selected.name + "Data");
  const [rawData, setRawData] = useState<string>("");
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [fetchData, setFetchData] = useState({
    url: "",
    method: "",
    headers: "",
    body: "",
  });

  async function handleSubmit() {
    //TODO: send data to server
    console.log({
      name,
      type,
      rawData,
      selectedFile,
      importedFile,
      fetchData,
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
            defaultValue={selected.name + "Data"}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Tabs defaultValue="rawdata" className="flex flex-col">
          <TabsList>
            <TabsTrigger value="rawdata" onClick={(e) => setType("rawdata")}>
              Raw Data
            </TabsTrigger>
            <TabsTrigger value="file" onClick={(e) => setType("file")}>
              Select existing file
            </TabsTrigger>
            <TabsTrigger value="import" onClick={(e) => setType("import")}>
              Import file
            </TabsTrigger>
            <TabsTrigger value="fetch" onClick={(e) => setType("fetch")}>
              Api Endpoint
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rawdata">
            paste your raw data here.
            <Textarea
              id="rawdata"
              className="min-h-[200px]"
              onChange={(e) => setRawData(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="file">
            Select a file:
            {Array.isArray(selected.content) &&
              selected.content.map((file) => (
                <div
                  key={file.name}
                  className={`cursor-pointer rounded-sm px-2 ${
                    selectedFile == file
                      ? "bg-primary/50 "
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  {file.name}
                </div>
              ))}
          </TabsContent>
          <TabsContent value="import">
            <Input
              type="file"
              id="import"
              className="col-span-3"
              onChange={(e) => setImportedFile(e.target.files?.[0] || null)}
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
                  onChange={(e) =>
                    setFetchData({ ...fetchData, url: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <Input
                  id="method"
                  className="col-span-3"
                  onChange={(e) =>
                    setFetchData({ ...fetchData, method: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="headers" className="text-right">
                  Headers
                </Label>
                <Input
                  id="headers"
                  className="col-span-3"
                  onChange={(e) =>
                    setFetchData({ ...fetchData, headers: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="body" className="text-right">
                  Body
                </Label>
                <Input
                  id="body"
                  className="col-span-3"
                  onChange={(e) =>
                    setFetchData({ ...fetchData, body: e.target.value })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDataDialog;
