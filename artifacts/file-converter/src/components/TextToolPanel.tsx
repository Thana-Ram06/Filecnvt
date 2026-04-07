import { useState } from "react";
import { ArrowRight, Loader, Copy, Check, Download } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { ToolControls } from "@/components/ToolControls";

interface TextToolPanelProps {
  tool: Tool;
}

type State = "idle" | "processing" | "done" | "error";

export function TextToolPanel({ tool }: TextToolPanelProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize control values from defaults
  const [controlValues, setControlValues] = useState<Record<string, string | number>>(() => {
    const defaults: Record<string, string | number> = {};
    tool.controls?.forEach((c) => { defaults[c.id] = c.default ?? ""; });
    return defaults;
  });

  const handleProcess = async () => {
    if (!input.trim()) return;
    setState("processing");
    setError(null);
    setOutput("");

    try {
      const {
        formatJson, jsonToCsv, csvToJson,
        base64Encode, base64Decode,
        urlEncode, urlDecode,
        convertCase,
      } = await import("@/lib/text-tools");

      let result = "";
      switch (tool.id) {
        case "json-format":   result = formatJson(input); break;
        case "json-to-csv":   result = jsonToCsv(input); break;
        case "csv-to-json":   result = csvToJson(input); break;
        case "base64-encode": result = base64Encode(input); break;
        case "base64-decode": result = base64Decode(input); break;
        case "url-encode":    result = urlEncode(input); break;
        case "url-decode":    result = urlDecode(input); break;
        case "text-case":
          result = convertCase(input, String(controlValues.case ?? "upper") as Parameters<typeof convertCase>[1]);
          break;
        default:
          throw new Error("Unknown text tool");
      }

      setOutput(result);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
      setState("error");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = tool.to.toLowerCase() === "csv" ? "csv" : tool.to.toLowerCase() === "json" ? "json" : "txt";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setState("idle");
    setError(null);
  };

  return (
    <div className="space-y-5 animate-fade-in-up stagger-3">
      {/* Input */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Input · {tool.from}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setState("idle"); setOutput(""); setError(null); }}
          placeholder={`Paste your ${tool.from} here…`}
          rows={8}
          className="
            w-full px-4 py-3 rounded-xl border border-border bg-card
            text-sm text-foreground font-mono placeholder:text-muted-foreground/40
            outline-none focus:border-primary/60 transition-colors duration-200
            resize-y min-h-[160px]
          "
        />
      </div>

      {/* Controls (e.g. case selector) */}
      {tool.controls && tool.controls.length > 0 && (
        <ToolControls
          controls={tool.controls}
          values={controlValues}
          onChange={(id, val) => setControlValues((prev) => ({ ...prev, [id]: val }))}
        />
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Process button */}
      <button
        onClick={handleProcess}
        disabled={!input.trim() || state === "processing"}
        className="
          w-full flex items-center justify-center gap-2 py-3 rounded-xl
          bg-primary text-primary-foreground font-medium text-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:opacity-90 transition-all duration-300
          hover:enabled:scale-[1.01]
        "
      >
        {state === "processing" ? (
          <><Loader size={15} className="animate-spin-slow" />Processing…</>
        ) : (
          <>{tool.title}<ArrowRight size={15} /></>
        )}
      </button>

      {/* Output */}
      {state === "done" && output && (
        <div className="animate-fade-in space-y-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-muted-foreground">Output · {tool.to}</label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-muted-foreground border border-border hover:text-foreground hover:border-primary/40 transition-all duration-200"
              >
                <Download size={11} />
                Download
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  copied
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="
              w-full px-4 py-3 rounded-xl border border-primary/30 bg-primary/5
              text-sm text-foreground font-mono
              outline-none resize-y min-h-[160px]
            "
          />
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            ← Clear and start over
          </button>
        </div>
      )}
    </div>
  );
}
