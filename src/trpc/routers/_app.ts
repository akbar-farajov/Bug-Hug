import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          value: input.value,
        },
      });
      return {
        message: `invoking ${input.value}`,
      };
    }),
  hello: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.value}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
