"use client";
import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { Loader2, SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Message is required" })
    .max(10000, { message: "Message is too long" }),
});

type FormSchema = z.infer<typeof formSchema>;

export const MessageForm: React.FC<Props> = ({ projectId }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        );
      },
      onError: (error) => {
        toast.error("Error creating message");
      },
    })
  );

  const onSubmit = async (values: FormSchema) => {
    await createMessage.mutateAsync({ projectId, value: values.value });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createMessage.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative  border rounded-lg p-4 pt-1 bg-sidebar "
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              disabled={isPending}
              {...field}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              minRows={2}
              maxRows={4}
              className="w-full  resize-none border-none pt-4 outline-none bg-transparent"
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex gap-2 items-end justify-between pt-2">
          <div className="text-sm text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground ">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp;to send
          </div>
          <Button
            className={cn("size-8 rounded-full")}
            disabled={isDisabled}
            onClick={() => form.handleSubmit(onSubmit)(undefined)}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
