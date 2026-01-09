import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveCodeEditorProps {
  initialCode: string;
  expectedOutput?: string;
  onSuccess?: () => void;
  hint?: string;
}

const InteractiveCodeEditor: React.FC<InteractiveCodeEditorProps> = ({
  initialCode,
  expectedOutput,
  onSuccess,
  hint,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Simple Python interpreter simulation
  const runCode = () => {
    try {
      let result = '';
      const lines = code.split('\n');
      const variables: Record<string, string | number> = {};

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Variable assignment
        const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
        if (assignMatch) {
          const [, varName, value] = assignMatch;
          if (value.startsWith('"') || value.startsWith("'")) {
            variables[varName] = value.slice(1, -1);
          } else if (!isNaN(Number(value))) {
            variables[varName] = Number(value);
          } else if (variables[value] !== undefined) {
            variables[varName] = variables[value];
          }
          continue;
        }

        // Print statement
        const printMatch = trimmed.match(/^print\((.+)\)$/);
        if (printMatch) {
          const arg = printMatch[1].trim();
          if (arg.startsWith('"') || arg.startsWith("'")) {
            result += arg.slice(1, -1) + '\n';
          } else if (variables[arg] !== undefined) {
            result += variables[arg] + '\n';
          } else if (!isNaN(Number(arg))) {
            result += arg + '\n';
          }
        }
      }

      setOutput(result.trim() || 'No output');

      // Check success
      if (expectedOutput && result.trim().includes(expectedOutput.trim())) {
        setIsSuccess(true);
        onSuccess?.();
      }
    } catch {
      setOutput('Oops! Something went wrong. Try again!');
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setIsSuccess(false);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-chart-2/60" />
          <div className="w-3 h-3 rounded-full bg-chart-3/60" />
          <span className="ml-2 text-sm text-muted-foreground font-mono">magic_spell.py</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCode}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="w-4 h-4 mr-1" />
            Cast Spell
          </Button>
        </div>
      </div>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="font-mono text-sm min-h-[150px] border-0 rounded-none resize-none bg-background focus-visible:ring-0"
        placeholder="Write your magic spell here..."
      />

      {output && (
        <div className={cn(
          "border-t border-border p-4",
          isSuccess ? "bg-primary/10" : "bg-muted/30"
        )}>
          <div className="flex items-center gap-2 mb-2">
            {isSuccess && <Sparkles className="w-5 h-5 text-primary" />}
            <span className="font-medium text-foreground">
              {isSuccess ? '✨ Magic Result:' : 'Output:'}
            </span>
          </div>
          <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
          {isSuccess && (
            <p className="mt-2 text-primary font-medium">
              🎉 Wonderful! Your spell worked perfectly!
            </p>
          )}
        </div>
      )}

      {hint && (
        <div className="border-t border-border p-4 bg-accent/30">
          {!showHint ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(true)}
              className="text-muted-foreground"
            >
              Need a hint? 🤔
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              💡 <strong>Hint:</strong> {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveCodeEditor;
