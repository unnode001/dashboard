// src/app/(dashboard)/dashboard/console/components/chat-messages.jsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy, Cpu, DollarSign, Edit, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');

  const handleCopy = () => {
    const code = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(code);
  };

  return !inline && match ? (
    <div className="relative my-4 rounded-md bg-[#2a2d3a]">
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-300">
        <span>{match[1]}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

// 新增：用量显示组件
const UsageInfo = ({ usage }) => {
  if (!usage) return null;
  return (
    <div className="mt-2 pt-2 border-t border-muted-foreground/20 text-xs text-muted-foreground flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Cpu className="h-3 w-3" />
        <span>总Token: {usage.total_tokens}</span>
      </div>
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        <span>成本: ${usage.cost}</span>
      </div>
    </div>
  );
};



export default function ChatMessages({ messages, onRegenerate, onEdit }) {
  return (
    <div className="space-y-6 p-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            'group flex items-start gap-4',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && <Avatar><AvatarFallback>AI</AvatarFallback></Avatar>}
          <div
            className={cn(
              'relative max-w-[75%] rounded-lg p-3',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            <ReactMarkdown components={{ code: CodeBlock }}>
              {message.content}
            </ReactMarkdown>

            {/* 新增：用量信息 */}
            {message.role === 'assistant' && message.content && <UsageInfo usage={message.usage} />}

            {/* 交互按钮 */}
            {message.role === 'assistant' && (
              <div className="absolute -bottom-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRegenerate(message.id)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
            {message.role === 'user' && (
              <div className="absolute -bottom-4 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(message.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {message.role === 'user' && <Avatar><AvatarFallback>U</AvatarFallback></Avatar>}
        </div>
      ))}
    </div>
  );
}