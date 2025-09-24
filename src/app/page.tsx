import { getQueryClient } from "@/trpc/routers/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Client from "./client";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  // const greeting = await queryClient.fetchQuery(
  //   trpc.hello.queryOptions({ text: "world" })
  // );
  // const greeting = await caller.hello({ text: "world" });
  // const users = await prisma.user.findMany();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
