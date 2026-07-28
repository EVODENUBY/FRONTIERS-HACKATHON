import React, { useState, useRef, useEffect } from 'react';
import { CopilotMessage, Project } from '../types/inframind';
import { X, Send, Sparkles, User, Bot, CornerDownLeft, ShieldCheck } from 'lucide-react';

interface CopilotChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSendMessage: (msg: string) => Promise<void>;
  messages: CopilotMessage[];
  isThinking: boolean;
}

export const CopilotChatDrawer: React.FC<CopilotChatDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onSendMessage,
  messages,
  isThinking,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const text = input.trim();
    setInput('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isThinking) return;
    onSendMessage(prompt);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[500] w-full sm:w-[420px] bg-white border-l border-gray-200 shadow-xl flex flex-col font-sans animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-mono uppercase tracking-wider">
              Engineering AI Copilot
            </h3>
            <p className="text-[11px] text-gray-500 font-mono">
              Site: {project.name} ({project.permitId})
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
              {msg.sender === 'user' ? (
                <>
                  <span>Site Engineer</span>
                  <User className="w-3 h-3 text-gray-500" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-blue-600" />
                  <span>InfraMind AI</span>
                </>
              )}
            </div>

            <div
              className={`max-w-[88%] p-3 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm font-sans'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-white border border-gray-200 rounded-lg w-fit animate-pulse font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>Consulting spatial GIS & Gemini models...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2 border-t border-gray-100 bg-white flex gap-1.5 overflow-x-auto text-[11px] font-mono">
        <button
          onClick={() => handleQuickPrompt("What is the safe clearance depth for the 11kV line?")}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-600 whitespace-nowrap transition-colors"
        >
          Clearance depth?
        </button>
        <button
          onClick={() => handleQuickPrompt("Is hydro-potholing mandatory here?")}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-600 whitespace-nowrap transition-colors"
        >
          Hydro-potholing?
        </button>
        <button
          onClick={() => handleQuickPrompt("Generate a contractor safety checklist.")}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-600 whitespace-nowrap transition-colors"
        >
          Safety checklist
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot about excavation risk..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shrink-0 shadow-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-1.5 font-mono">
          Final engineering decisions require human verification.
        </p>
      </div>
    </div>
  );
};
