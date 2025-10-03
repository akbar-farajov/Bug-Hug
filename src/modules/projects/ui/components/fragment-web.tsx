import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import React, { useState } from "react";

interface Props {
  data: Fragment;
}

export const FragmentWeb: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="top" align="start">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCcwIcon className="size-4" />
          </Button>
        </Hint>
        <Hint text="Copy URL" side="top" align="start">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1 justify-start text-start font-normal"
            disabled={!data.sandboxUrl}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side="top" align="start">
          <Button
            variant="outline"
            size="sm"
            disabled={!data.sandboxUrl}
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        src={data.sandboxUrl}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
      />
    </div>
  );
};
