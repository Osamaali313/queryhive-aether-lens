
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-lg"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code 
                className="bg-gray-800 px-1 py-0.5 rounded text-neon-blue" 
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-700 rounded-lg">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-left">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-700 px-4 py-2">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-neon-blue pl-4 italic bg-gray-800/50 py-2 rounded-r">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold text-neon-blue mb-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold text-neon-purple mb-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold text-neon-green mb-2">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1 ml-4">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1 ml-4">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-gray-300">{children}</li>;
          },
          strong({ children }) {
            return <strong className="text-neon-yellow font-bold">{children}</strong>;
          },
          em({ children }) {
            return <em className="text-neon-green italic">{children}</em>;
          },
          a({ href, children }) {
            return (
              <a 
                href={href} 
                className="text-neon-blue hover:text-neon-purple transition-colors underline"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
