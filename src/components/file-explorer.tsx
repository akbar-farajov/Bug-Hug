import { convertFilesToTreeItems } from "@/lib/utils";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { CodeView } from "./code-view";
import { Hint } from "./hint";
import { TreeView } from "./tree-view";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

export type FileCollection = { [path: string]: string };

function getLanguageFromFileName(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension) {
    return "plaintext";
  }

  return extension;
}

interface FileBreadcrumbProps {
  filePath: string;
}

const FileBreadcrumb: FC<FileBreadcrumbProps> = ({ filePath }) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 3;

  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="font-medium">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegment = pathSegments[pathSegments.length - 1];

      return (
        <Fragment>
          <BreadcrumbItem>
            <span className="font-medium">{firstSegment}</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium">{lastSegment}</span>
          </BreadcrumbItem>
        </Fragment>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};

interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer: FC<FileExplorerProps> = ({ files }) => {
  const [activeFile, setActiveFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const [copied, setCopied] = useState(false);
  const treeItems = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setActiveFile(filePath);
      }
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (activeFile) {
      navigator.clipboard.writeText(files[activeFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [activeFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treeItems}
          value={activeFile || ""}
          onValueChange={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors duration-200" />
      <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar">
        {activeFile && files[activeFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar py-2 px-4 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={activeFile} />
              <Hint text="Copy to clipboard" side="bottom" align="start">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={false}
                >
                  {copied ? (
                    <CopyCheckIcon className="size-4" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <CodeView
                code={files[activeFile]}
                language={getLanguageFromFileName(activeFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a file to view the code
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
