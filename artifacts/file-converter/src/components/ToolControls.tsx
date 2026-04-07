import type { ControlDef } from "@/lib/tools";

interface ToolControlsProps {
  controls: ControlDef[];
  values: Record<string, string | number>;
  onChange: (id: string, value: string | number) => void;
}

export function ToolControls({ controls, values, onChange }: ToolControlsProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      {controls.map((ctrl) => (
        <div key={ctrl.id}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-muted-foreground">{ctrl.label}</label>
            {ctrl.type === "range" && (
              <span className="text-xs font-mono text-primary">{values[ctrl.id] ?? ctrl.default}%</span>
            )}
            {ctrl.type === "number" && (
              <span className="text-xs font-mono text-primary">{values[ctrl.id] ?? ctrl.default}px</span>
            )}
          </div>

          {ctrl.type === "range" && (
            <input
              type="range"
              min={ctrl.min ?? 0}
              max={ctrl.max ?? 100}
              step={ctrl.step ?? 1}
              value={Number(values[ctrl.id] ?? ctrl.default ?? 70)}
              onChange={(e) => onChange(ctrl.id, Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-border"
            />
          )}

          {ctrl.type === "number" && (
            <input
              type="number"
              min={ctrl.min}
              max={ctrl.max}
              value={Number(values[ctrl.id] ?? ctrl.default ?? 0)}
              onChange={(e) => onChange(ctrl.id, Number(e.target.value))}
              className="
                w-full px-3 py-2 rounded-xl border border-border bg-card
                text-sm text-foreground outline-none
                focus:border-primary/60 transition-colors duration-200
              "
            />
          )}

          {ctrl.type === "select" && (
            <select
              value={String(values[ctrl.id] ?? ctrl.default ?? "")}
              onChange={(e) => onChange(ctrl.id, e.target.value)}
              className="
                w-full px-3 py-2 rounded-xl border border-border bg-card
                text-sm text-foreground outline-none cursor-pointer
                focus:border-primary/60 transition-colors duration-200
              "
            >
              {ctrl.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {ctrl.type === "text-input" && (
            <input
              type="text"
              placeholder={ctrl.placeholder}
              value={String(values[ctrl.id] ?? "")}
              onChange={(e) => onChange(ctrl.id, e.target.value)}
              className="
                w-full px-3 py-2 rounded-xl border border-border bg-card
                text-sm text-foreground placeholder:text-muted-foreground/50 outline-none
                focus:border-primary/60 transition-colors duration-200
              "
            />
          )}
        </div>
      ))}
    </div>
  );
}
