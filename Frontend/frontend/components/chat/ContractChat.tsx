
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, FileText } from 'lucide-react';
import { ChatMessage } from '@/types';
import GlassCard from '../ui/GlassCard';

export default function ContractChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I\'m your Contract Intelligence Assistant. Ask me anything about your uploaded contracts, clauses, payment terms, liabilities, and more.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], documents: [] }),
      });
      
      const data = await response.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error('Error sending chat message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <GlassCard className="flex flex-col h-[600px]">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Contract Assistant</h3>
          <p className="text-xs text-zinc-500">AI-Powered Legal Analysis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-blue-500'
                    : 'bg-zinc-700'
                }`}
              >
                {message.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-200'
                } rounded-2xl px-4 py-3`}
              >
                <p className="text-sm">{message.content}</p>
                {message.references && message.references.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-zinc-400 mb-1">References:</p>
                    {message.references.map((ref, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-xs text-zinc-400">
                        <FileText size={12} />
                        <span>{ref.document} - {ref.section}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex gap-1">
                <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your contracts..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </GlassCard>
  );
}
