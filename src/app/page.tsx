"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  const router = useRouter();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error("Error creating project");
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
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ name: value })}
        >
          Create Project
        </Button>
      </div>
      <div>{JSON.stringify(projects, null, 2)}</div>
    </div>
  );
}
