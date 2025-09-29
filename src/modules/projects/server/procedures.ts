import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, { message: "Project name is required" })
          .max(10000, { message: "Project name is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),

          messages: {
            create: {
              content: input.name,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "messages/create",
        data: {
          value: input.name,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
