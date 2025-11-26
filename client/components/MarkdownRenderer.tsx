"use client";

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table({ children }) {
                        return <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-stone-700 border border-stone-700">{children}</table></div>;
                    },
                    thead({ children }) {
                        return <thead className="bg-stone-800">{children}</thead>;
                    },
                    tbody({ children }) {
                        return <tbody className="divide-y divide-stone-700 bg-stone-900/50">{children}</tbody>;
                    },
                    tr({ children }) {
                        return <tr>{children}</tr>;
                    },
                    th({ children }) {
                        return <th className="px-3 py-2 text-left text-xs font-medium text-stone-300 uppercase tracking-wider border-r border-stone-700 last:border-r-0">{children}</th>;
                    },
                    td({ children }) {
                        return <td className="px-3 py-2 whitespace-nowrap text-sm text-stone-300 border-r border-stone-700 last:border-r-0">{children}</td>;
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                                customStyle={{
                                    margin: '0.5rem 0',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    backgroundColor: '#1e1e1e',
                                }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    p({ children }) {
                        return <p className="mb-2 last:mb-0">{children}</p>;
                    },
                    ul({ children }) {
                        return <ul className="list-disc list-inside mb-2">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="list-decimal list-inside mb-2">{children}</ol>;
                    },
                    a({ href, children }) {
                        return (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
}
