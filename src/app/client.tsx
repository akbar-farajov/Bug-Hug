"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

export default function Client() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: "world" }));
  return <div>{JSON.stringify(data)}</div>;
}
