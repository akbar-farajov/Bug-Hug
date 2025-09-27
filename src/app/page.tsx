"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Message created");
      },
      onError: (error) => {
        toast.error("Error creating message");
      },
    })
  );
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
      <div className="flex  items-center justify-between gap-4 w-full">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1"
        />
        <Button
          disabled={createMessage.isPending}
          onClick={() => createMessage.mutate({ value: value })}
        >
          Create Message
        </Button>
      </div>
      <div>{JSON.stringify(messages, null, 2)}</div>
    </div>
  );
}
