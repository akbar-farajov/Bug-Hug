import { Agent, gemini, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "e2b";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("bug-hug-test-2");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert next.js developer.  You write code in typescript.",
      model: gemini({ model: "gemini-2.0-flash-001" }),
    });

    const { output } = await codeAgent.run(
      `Write code for ${event.data.value}`
    );
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
