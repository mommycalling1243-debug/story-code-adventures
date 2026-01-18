import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, RotateCcw, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeError {
  type: 'syntax' | 'runtime' | 'logic' | 'unknown';
  message: string;
  line?: number;
}

interface InteractiveCodeEditorProps {
  initialCode: string;
  expectedOutput?: string;
  onSuccess?: () => void;
  onSubmit?: () => void;
  onCodeRun?: () => void;
  onError?: (error: CodeError | null) => void;
  hint?: string;
  showSubmitOnSuccess?: boolean;
}

const InteractiveCodeEditor: React.FC<InteractiveCodeEditorProps> = ({
  initialCode,
  expectedOutput,
  onSuccess,
  onSubmit,
  onCodeRun,
  onError,
  hint,
  showSubmitOnSuccess = true,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!isSubmitted) {
      setIsSubmitted(true);
      onSubmit?.();
    }
  };
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Detect error type from code
  const detectErrorType = (code: string, errorMessage: string): CodeError => {
    const lines = code.split('\n');
    
    // Check for common syntax errors
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Missing colon after if/for/while/def
      if (/^(if|for|while|def|elif|else)\s/.test(line) && !line.endsWith(':') && line.length > 0) {
        return {
          type: 'syntax',
          message: "Missing colon (:) at the end of statement",
          line: i + 1,
        };
      }
      
      // Unclosed string
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        return {
          type: 'syntax',
          message: "Unclosed string - check your quotes!",
          line: i + 1,
        };
      }
      
      // Unclosed parentheses
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        return {
          type: 'syntax',
          message: "Mismatched parentheses - check your brackets!",
          line: i + 1,
        };
      }
    }
    
    // Check for runtime-like errors
    if (errorMessage.includes('undefined') || errorMessage.includes('not defined')) {
      return {
        type: 'runtime',
        message: "Variable used before it was defined",
      };
    }
    
    // Logic error (code runs but wrong output)
    if (errorMessage.includes('expected') || errorMessage.includes('output')) {
      return {
        type: 'logic',
        message: "The output doesn't match what we expected",
      };
    }
    
    return {
      type: 'unknown',
      message: errorMessage || "Something went wrong",
    };
  };

  // Simple Python interpreter simulation
  const runCode = () => {
    onCodeRun?.();
    setHasError(false);
    onError?.(null); // Clear previous error
    
    try {
      let result = '';
      const lines = code.split('\n');
      const variables: Record<string, string | number> = {};
      let errorDetected = false;

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Variable assignment
        const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
        if (assignMatch) {
          const [, varName, value] = assignMatch;
          
          // Check for valid variable name
          if (/^\d/.test(varName)) {
            const error: CodeError = {
              type: 'syntax',
              message: "Variable names can't start with a number!",
              line: lineIndex + 1,
            };
            setHasError(true);
            onError?.(error);
            setOutput(`Error on line ${lineIndex + 1}: Variable names can't start with a number!`);
            return;
          }
          
          if (value.startsWith('"') || value.startsWith("'")) {
            // Check if string is properly closed
            if (!value.endsWith('"') && !value.endsWith("'")) {
              const error: CodeError = {
                type: 'syntax',
                message: "String not properly closed with matching quote",
                line: lineIndex + 1,
              };
              setHasError(true);
              onError?.(error);
              setOutput(`Error on line ${lineIndex + 1}: Unclosed string!`);
              return;
            }
            variables[varName] = value.slice(1, -1);
          } else if (!isNaN(Number(value))) {
            variables[varName] = Number(value);
          } else if (value.includes('*')) {
            // Simple multiplication
            const parts = value.split('*').map(p => p.trim());
            const nums = parts.map(p => variables[p] !== undefined ? Number(variables[p]) : Number(p));
            if (nums.some(isNaN)) {
              const error: CodeError = {
                type: 'runtime',
                message: "Can't multiply - one of the values isn't a number",
                line: lineIndex + 1,
              };
              setHasError(true);
              onError?.(error);
              setOutput(`Error on line ${lineIndex + 1}: Invalid multiplication!`);
              return;
            }
            variables[varName] = nums.reduce((a, b) => a * b, 1);
          } else if (value.includes('+')) {
            // Simple addition
            const parts = value.split('+').map(p => p.trim());
            const nums = parts.map(p => variables[p] !== undefined ? Number(variables[p]) : Number(p));
            if (nums.some(isNaN)) {
              const error: CodeError = {
                type: 'runtime',
                message: "Can't add - one of the values isn't a number",
                line: lineIndex + 1,
              };
              setHasError(true);
              onError?.(error);
              setOutput(`Error on line ${lineIndex + 1}: Invalid addition!`);
              return;
            }
            variables[varName] = nums.reduce((a, b) => a + b, 0);
          } else if (variables[value] !== undefined) {
            variables[varName] = variables[value];
          } else {
            // Undefined variable reference
            const error: CodeError = {
              type: 'runtime',
              message: `Variable '${value}' is not defined`,
              line: lineIndex + 1,
            };
            setHasError(true);
            onError?.(error);
            setOutput(`Error on line ${lineIndex + 1}: '${value}' is not defined!`);
            return;
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
          } else {
            // Undefined variable in print
            const error: CodeError = {
              type: 'runtime',
              message: `Variable '${arg}' is not defined`,
              line: lineIndex + 1,
            };
            setHasError(true);
            onError?.(error);
            setOutput(`Error on line ${lineIndex + 1}: '${arg}' is not defined!`);
            return;
          }
        }
        
        // Check for common typos
        if (trimmed.startsWith('Print(') || trimmed.startsWith('PRINT(')) {
          const error: CodeError = {
            type: 'syntax',
            message: "Python is case-sensitive! Use 'print' with lowercase letters",
            line: lineIndex + 1,
          };
          setHasError(true);
          onError?.(error);
          setOutput(`Error on line ${lineIndex + 1}: Use lowercase 'print'!`);
          return;
        }
      }

      setOutput(result.trim() || 'No output');

      // Check success
      if (expectedOutput && result.trim().includes(expectedOutput.trim())) {
        setIsSuccess(true);
        onSuccess?.();
        onError?.(null);
      } else if (expectedOutput && result.trim() && !result.trim().includes(expectedOutput.trim())) {
        // Logic error - code ran but wrong output
        const error: CodeError = {
          type: 'logic',
          message: "Your code ran, but the output isn't quite right",
        };
        setHasError(true);
        onError?.(error);
      }
    } catch {
      const error = detectErrorType(code, 'Something went wrong');
      setHasError(true);
      onError?.(error);
      setOutput('Oops! Something went wrong. Try again!');
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setIsSuccess(false);
    setHasError(false);
    onError?.(null);
  };

  return (
    <div className={cn(
      "bg-card rounded-xl border overflow-hidden transition-all duration-300",
      hasError ? "border-destructive/50" : "border-border"
    )}>
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
        className={cn(
          "font-mono text-sm min-h-[150px] border-0 rounded-none resize-none bg-background focus-visible:ring-0",
          hasError && "bg-destructive/5"
        )}
        placeholder="Write your magic spell here..."
      />

      {output && (
        <div className={cn(
          "border-t border-border p-4",
          isSuccess ? "bg-primary/10" : hasError ? "bg-destructive/10" : "bg-muted/30"
        )}>
          <div className="flex items-center gap-2 mb-2">
            {isSuccess && <Sparkles className="w-5 h-5 text-primary" />}
            <span className={cn(
              "font-medium",
              hasError ? "text-destructive" : "text-foreground"
            )}>
              {isSuccess ? '✨ Magic Result:' : hasError ? '⚠️ Spell Fizzled:' : 'Output:'}
            </span>
          </div>
          <pre className={cn(
            "font-mono text-sm whitespace-pre-wrap",
            hasError ? "text-destructive" : "text-foreground"
          )}>{output}</pre>
          {isSuccess && (
            <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
              <p className="text-primary font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Wonderful! Your spell worked perfectly!
              </p>
              {showSubmitOnSuccess && !isSubmitted && (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Solution
                </Button>
              )}
              {isSubmitted && (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Solution Submitted!
                </div>
              )}
            </div>
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
