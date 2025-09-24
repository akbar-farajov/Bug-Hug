import { Agent, gemini, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert next.js developer.  You write code in typescript.",
      model: gemini({ model: "gemini-2.0-flash-001" }),
    });

    const { output } = await codeAgent.run(
      `Write code for ${event.data.value}`
    );

    return { output };
  }
);
