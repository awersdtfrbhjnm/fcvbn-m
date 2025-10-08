import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { conversationService } from '../services/conversationService';
import type { Message } from '../lib/gemini';

interface ChatInterfaceProps {
  userId: string;
  onAnalysisComplete?: (analysis: any) => void;
}

export function ChatInterface({ userId, onAnalysisComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeSession();
  }, [userId]);

  const initializeSession = async () => {
    try {
      let session = await conversationService.getActiveSession(userId);

      if (!session) {
        const newSessionId = await conversationService.createSession(userId);
        setSessionId(newSessionId);

        const welcomeMessage: Message = {
          role: 'assistant',
          content: "Hello! I'm your AI Chartered Accountant, here to help you minimize your tax liability legally. I'll ask you some questions about your finances, and together we'll find the best tax-saving strategies for you. Let's start with a simple question: What is your primary source of income?"
        };
        setMessages([welcomeMessage]);
      } else {
        setSessionId(session.id);
        setMessages(session.messages);
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const assistantMessage = await conversationService.sendMessage(
        sessionId,
        userId,
        input
      );

      setMessages(prev => [...prev, assistantMessage]);

      if (assistantMessage.content.toLowerCase().includes('generate analysis') ||
          assistantMessage.content.toLowerCase().includes('tax plan')) {
        const analysis = await conversationService.generateTaxAnalysis(userId, sessionId);
        if (onAnalysisComplete) {
          onAnalysisComplete(analysis);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the Gemini API key is configured in your .env file.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">AI Tax Advisor</h2>
        <p className="text-blue-100 text-sm mt-1">Intelligent tax planning powered by AI</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div
              className={`flex-1 p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-12'
                  : 'bg-slate-100 text-slate-900 mr-12'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="flex-1 p-4 rounded-lg bg-slate-100 mr-12">
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 size={16} className="animate-spin" />
                <span>Analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Send size={18} />
            Send
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
