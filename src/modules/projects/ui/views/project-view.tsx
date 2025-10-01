"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense } from "react";
interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading messages...</div>}>
            <MessagesContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          Todo: Project view
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
