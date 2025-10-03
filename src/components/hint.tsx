import { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  children: ReactNode;
  text: string;
  side: "top" | "bottom" | "left" | "right";
  align: "start" | "center" | "end";
}

export const Hint: FC<Props> = ({ children, text, side, align }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} className="">
        <p className="font-semibold">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};
