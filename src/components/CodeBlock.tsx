import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python', className }) => {
  // Simple syntax highlighting for Python
  const highlightCode = (code: string) => {
    const keywords = ['def', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'import', 'from', 'class', 'True', 'False', 'None', 'and', 'or', 'not', 'print'];
    const lines = code.split('\n');
    
    return lines.map((line, idx) => {
      let highlighted = line;
      
      // Highlight strings
      highlighted = highlighted.replace(/(["'])(.*?)\1/g, '<span class="text-chart-2">$1$2$1</span>');
      
      // Highlight comments
      highlighted = highlighted.replace(/(#.*)$/g, '<span class="text-muted-foreground italic">$1</span>');
      
      // Highlight keywords
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-primary font-medium">$1</span>');
      });
      
      // Highlight numbers
      highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-chart-4">$1</span>');
      
      return (
        <div key={idx} className="flex">
          <span className="w-8 text-muted-foreground/50 select-none text-right pr-4">{idx + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      );
    });
  };

  return (
    <div className={cn("bg-foreground/5 rounded-xl border border-border overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-destructive/60" />
        <div className="w-3 h-3 rounded-full bg-chart-2/60" />
        <div className="w-3 h-3 rounded-full bg-chart-3/60" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">{language}</span>
      </div>
      <pre className="p-4 font-mono text-sm overflow-x-auto text-foreground">
        {highlightCode(code)}
      </pre>
    </div>
  );
};

export default CodeBlock;
