import { Card, CardContent } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface UserMessageProps {
  content: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10 ">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
        <CardContent>
          <div>{content}</div>
        </CardContent>
      </Card>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary-foreground hover:text-primary"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5" />
      <div className="flex flex-col gap-y-1 flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-xs text-muted-foreground">Preview</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="size-4" />
      </div>
    </button>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  type: MessageType;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  fragment,
  createdAt,
  type,
  isActiveFragment,
  onFragmentClick,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Vibe"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Vibe</span>
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {format(createdAt, "hh:mm 'on' MMM d, yyyy")}
        </span>
      </div>
      <div className="flex flex-col gap-y-4 pl-8.5">
        <span className="text-sm">{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

interface Props {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  type: MessageType;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

export const MessageCard: React.FC<Props> = ({
  content,
  role,
  fragment,
  createdAt,
  type,
  isActiveFragment,
  onFragmentClick,
}: Props) => {
  if (role === "USER") {
    return <UserMessage content={content} />;
  }

  return (
    <AssistantMessage
      content={content}
      fragment={fragment}
      createdAt={createdAt}
      type={type}
      isActiveFragment={isActiveFragment}
      onFragmentClick={onFragmentClick}
    />
  );
};
