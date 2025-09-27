import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { messageRouter } from "@/modules/messages/server/procedures";
// import { fragmentRouter } from "@/modules/fragments/server/procedures";
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  // fragments: fragmentRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
