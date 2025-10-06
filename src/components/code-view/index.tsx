import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import { useEffect } from "react";

import "./code-theme.css";

interface Props {
  code: string;
  language: string;
}
export const CodeView: React.FC<Props> = ({ code, language }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);
  return (
    <pre className="p-2 bg-transparent m-0 border-none rounded-none text-xs">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};
