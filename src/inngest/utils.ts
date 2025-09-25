import { Sandbox } from "e2b";

const getSandbox = async (sandboxId: string) => {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
};

export { getSandbox };
