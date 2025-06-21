import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            return (
              <div className="relative">
                {language && (
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                    {language}
                  </div>
                )}
                <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                  <code 
                    className="text-neon-green font-mono text-sm"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </code>
                </pre>
              </div>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-700 rounded-lg">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-left font-semibold">
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
              <blockquote className="border-l-4 border-neon-blue pl-4 italic bg-gray-800/50 py-2 rounded-r my-4">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold text-neon-blue mb-4 mt-6">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold text-neon-purple mb-3 mt-5">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold text-neon-green mb-2 mt-4">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="text-base font-bold text-neon-yellow mb-2 mt-3">{children}</h4>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1 ml-4 my-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1 ml-4 my-2">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-gray-300">{children}</li>;
          },
          p({ children }) {
            return <p className="mb-3 text-gray-300 leading-relaxed">{children}</p>;
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
                className="text-neon-blue hover:text-neon-purple transition-colors underline decoration-dotted underline-offset-2"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="border-gray-700 my-6" />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
