'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { API_BASE_URL } from '@/lib/config'; // ✨ 1. 引入后端API地址
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessages from './components/chat-messages';
import SessionSidebar from './components/session-sidebar';

// 创建一个新会话的辅助函数
const createNewSession = () => ({
  id: uuidv4(),
  // 为会话设置一个默认标题或基于时间戳的名称
  name: `新对话 ${new Date().toLocaleTimeString()}`,
  messages: [],
  settings: {
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: '你是一个乐于助人的AI助手。',
  },
});

export default function ConsolePage() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // 1. 初始化：从 localStorage 加载会话
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        if (Array.isArray(parsedSessions) && parsedSessions.length > 0) {
          setSessions(parsedSessions);
          setActiveSessionId(parsedSessions[0].id); // 默认激活第一个
          return;
        }
      }
    } catch (e) {
      console.error("无法从localStorage解析会话", e)
    }
    // 如果没有有效的已保存会话，则创建一个新的
    const newSession = createNewSession();
    setSessions([newSession]);
    setActiveSessionId(newSession.id);
  }, []);

  // 2. 持久化：当会话数据变化时，保存到 localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem('chatSessions', JSON.stringify(sessions));
      } catch (e) {
        console.error("无法向localStorage保存会话", e);
      }
    }
  }, [sessions]);

  // 获取当前激活的会话对象
  const activeSession = sessions.find(s => s.id === activeSessionId);

  // 更新当前激活会话的辅助函数
  const updateActiveSession = (updateFn) => {
    setSessions(prevSessions =>
      prevSessions.map(s => (s.id === activeSessionId ? updateFn(s) : s))
    );
  };

  // 自动滚动到聊天底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);


  // --- 事件处理器 ---

  const handleSendMessage = async (prompt, contextMessages) => {
    setIsLoading(true);
    setError(null);
    const assistantMessageId = uuidv4();

    updateActiveSession(s => ({
      ...s,
      messages: [...contextMessages, { id: assistantMessageId, role: 'assistant', content: '' }]
    }));

    try {
      // ✨ 2. 将URL和请求体修改为指向Express后端
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          ...activeSession.settings, // 包含 model, temperature, maxTokens, systemPrompt
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.body) {
        throw new Error("响应体为空");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const METADATA_PREFIX = "METADATA::";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let chunk = decoder.decode(value, { stream: true });

        if (chunk.includes(METADATA_PREFIX)) {
          const parts = chunk.split(METADATA_PREFIX);
          const textPart = parts[0];
          const metadataJson = parts[1];

          if (textPart) {
            updateActiveSession(s => ({
              ...s,
              messages: s.messages.map(msg =>
                msg.id === assistantMessageId ? { ...msg, content: msg.content + textPart } : msg
              )
            }));
          }

          if (metadataJson) {
            const metadata = JSON.parse(metadataJson);
            updateActiveSession(s => ({
              ...s,
              messages: s.messages.map(msg =>
                msg.id === assistantMessageId ? { ...msg, ...metadata } : msg
              )
            }));
          }

        } else {
          updateActiveSession(s => ({
            ...s,
            messages: s.messages.map(msg =>
              msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg
            )
          }));
        }
      }
    } catch (error) {
      console.error('Chat API error:', error);
      setError('与聊天服务通信失败，请确保后端服务正在运行。');
      updateActiveSession(s => ({
        ...s,
        messages: s.messages.map(msg =>
          msg.id === assistantMessageId ? { ...msg, content: `错误: ${error.message}` } : msg
        )
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeSession) return;
    const userMessage = { id: uuidv4(), role: 'user', content: input };
    const newMessages = [...activeSession.messages, userMessage];
    updateActiveSession(s => ({ ...s, messages: newMessages, name: input.substring(0, 20) }));
    setInput('');
    handleSendMessage(input, newMessages);
  };

  const handleNewSession = () => {
    if (isLoading) return;
    const newSession = createNewSession();
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSwitchSession = (sessionId) => {
    if (isLoading) return;
    setActiveSessionId(sessionId);
  }

  const handleDeleteSession = (sessionId) => {
    if (isLoading) return;
    // 从会话列表中移除
    const remainingSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(remainingSessions);
    // 如果删除的是当前会话，则切换到另一个会话或清空
    if (activeSessionId === sessionId) {
      if (remainingSessions.length > 0) {
        setActiveSessionId(remainingSessions[0].id);
      } else {
        // 如果所有会话都被删除了, 创建一个新的
        const newSession = createNewSession();
        setSessions([newSession]);
        setActiveSessionId(newSession.id);
      }
    }
  };

  const handleRegenerate = (assistantMessageId) => {
    const messageIndex = activeSession.messages.findIndex(m => m.id === assistantMessageId);
    if (messageIndex < 1 || isLoading) return; // 必须有之前的用户消息

    const contextMessages = activeSession.messages.slice(0, messageIndex - 1);
    const userPromptMessage = activeSession.messages[messageIndex - 1];

    if (userPromptMessage.role !== 'user') return; // 确保前一条是用户的消息

    updateActiveSession(s => ({ ...s, messages: contextMessages }));
    handleSendMessage(userPromptMessage.content, contextMessages);
  };

  const handleEdit = (userMessageId) => {
    if (isLoading) return;
    const messageToEdit = activeSession.messages.find(m => m.id === userMessageId);
    if (!messageToEdit) return;

    const newContent = window.prompt("编辑您的消息:", messageToEdit.content);

    if (newContent && newContent.trim() && newContent.trim() !== messageToEdit.content) {
      const messageIndex = activeSession.messages.findIndex(m => m.id === userMessageId);
      const contextMessages = activeSession.messages.slice(0, messageIndex);
      const updatedUserMessage = { ...messageToEdit, content: newContent };

      updateActiveSession(s => ({ ...s, messages: [...contextMessages, updatedUserMessage] }));
      handleSendMessage(newContent, [...contextMessages, updatedUserMessage]);
    }
  };

  // 初始加载状态
  if (!activeSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-lg text-muted-foreground">没有活动的会话</p>
        <Button onClick={handleNewSession} className="mt-4">开始新对话</Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {error && <div className="text-red-500 p-4 border border-destructive rounded-md mb-4">{error}</div>}
          <ChatMessages
            messages={activeSession.messages}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
          />
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4 bg-background">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="按 Shift + Enter 换行"
              className="pr-16 resize-none text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute top-1/2 right-3 -translate-y-1/2"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSwitchSession={handleSwitchSession}
        onDeleteSession={handleDeleteSession}
        settings={activeSession.settings}
        setSettings={(newSettings) => updateActiveSession(s => ({ ...s, settings: { ...s.settings, ...newSettings } }))}
        isLoading={isLoading}
      />
    </div>
  );
}
