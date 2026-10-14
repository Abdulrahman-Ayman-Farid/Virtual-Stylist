import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Wand2,
  RefreshCw,
  Download,
  Check,
  CornerDownLeft,
  MessageSquare,
  Bot,
  User,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  ChatMessage,
  GarmentAnalysis,
  OutfitOption,
  DesignedFlatLay,
} from '../types/stylist';

interface StylistChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  garmentContext: GarmentAnalysis | null;
  activeOutfit?: OutfitOption | null;
  onApplyDesignedOutfit?: (designed: DesignedFlatLay) => void;
}

const STARTER_PROMPTS = [
  "Give me your completely honest, unfiltered opinion on this statement piece.",
  "Design a high-fashion casual flat-lay with chunky sneakers and knitwear.",
  "What is the single biggest styling mistake people make with this silhouette?",
  "Design a striking after-dark cocktail look with sculptural metallic accessories.",
];

export const StylistChatDrawer: React.FC<StylistChatDrawerProps> = ({
  isOpen,
  onClose,
  garmentContext,
  activeOutfit,
  onApplyDesignedOutfit,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'model',
      content:
        `Welcome to the atelier. I am Jean-Luc, your editorial fashion director.\n\n` +
        `I don't believe in generic flattery—if a garment silhouette fights your proportions or a color combination falls flat, I will tell you candidly and immediately offer the elevated correction. ` +
        `Ask me for an unfiltered critique, debate footwear pairings, or tell me to design a new custom flat-lay board on demand.`,
      timestamp: 'Just now',
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [modelPreference, setModelPreference] = useState<
    'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'
  >('gemini-3.8-flash');
  const [forceImageDesign, setForceImageDesign] = useState(false);
  const [appliedImageId, setAppliedImageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/stylist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          garmentContext,
          activeOutfit,
          modelPreference,
          requestImageDesign:
            forceImageDesign ||
            /design|flat-lay|flatlay|render|visualize|picture|outfit board/i.test(text),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to receive stylist response.');
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || "Here is my editorial perspective on this look.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        designedImage: data.designedImage || undefined,
        modelUsed: data.modelUsed || modelPreference,
      };

      setMessages((prev) => [...prev, modelMsg]);
      setForceImageDesign(false);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Pardon the pause in consultation: ${error.message || 'Unable to connect to the styling engine. Please check your network and API key.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplyToBoard = (designed: DesignedFlatLay, msgId: string) => {
    if (onApplyDesignedOutfit) {
      onApplyDesignedOutfit(designed);
      setAppliedImageId(msgId);
      setTimeout(() => setAppliedImageId(null), 2500);
    }
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `stylist-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-[#FAF8F5] border-l border-[#E2DDD3] h-full flex flex-col shadow-2xl">
        {/* Editorial Header */}
        <div className="p-5 border-b border-[#E7E2D9] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center font-editorial text-lg font-bold">
              JL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg font-semibold text-[#1C1917] leading-tight">
                  Jean-Luc
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9A3412] bg-[#FAF5EE] px-1.5 py-0.5">
                  Editorial Director
                </span>
              </div>
              <p className="text-[11px] text-[#78716C]">
                Honest fashion critiques & flat-lay image design
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Selector Dropdown */}
            <div className="relative">
              <select
                value={modelPreference}
                onChange={(e) => setModelPreference(e.target.value as any)}
                className="text-[11px] bg-[#FAF8F5] border border-[#DDD6C8] px-2 py-1 text-[#44403C] rounded-none focus:outline-none focus:border-[#9A3412] cursor-pointer"
                title="Select Gemini model intelligence tier"
              >
                <option value="gemini-3.8-flash">Flash 3.8 (Default)</option>
                <option value="gemini-4-argon">Argon 4 (Deep Analysis)</option>
                <option value="gemini-3.1-flash-lite">Flash Lite 3.1 (Fast)</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Staged Garment Context Pill */}
        {garmentContext && (
          <div className="px-5 py-2.5 bg-[#F4F1EA] border-b border-[#E7E2D9] flex items-center justify-between text-xs text-[#57534E]">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] uppercase font-semibold text-[#9A3412]">
                Active Piece:
              </span>
              <span className="font-medium text-[#1C1917] truncate">
                {garmentContext.itemName}
              </span>
              {activeOutfit && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#78716C]">{activeOutfit.occasion}</span>
                </>
              )}
            </div>
            <span className="font-mono text-[10px] text-[#78716C] shrink-0">
              {garmentContext.stylingDifficulty}
            </span>
          </div>
        )}

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 text-[10px] text-[#A8A29E] mb-1 px-1">
                  <span>{isUser ? 'You' : 'Jean-Luc'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{m.timestamp}</span>
                  {!isUser && m.modelUsed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#9A3412]">{m.modelUsed}</span>
                    </>
                  )}
                </div>

                <div
                  className={`p-4 max-w-[88%] text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#1C1917] text-[#FAF8F5]'
                      : 'bg-white border border-[#E7E2D9] text-[#1C1917] shadow-xs'
                  }`}
                >
                  {m.content}
                </div>

                {/* Inline Designed Flat-Lay Card */}
                {m.designedImage && (
                  <div className="mt-3 w-full max-w-[95%] bg-white border border-[#E2DDD3] p-4 shadow-sm text-left">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#EFEBE3]">
                      <div className="flex items-center gap-1.5 text-xs text-[#9A3412] font-semibold uppercase tracking-wider">
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>AI Designed Flat-Lay</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#78716C]">
                        gemini-nano-banana-2.1
                      </span>
                    </div>

                    <div className="relative aspect-square w-full bg-[#F6F4EE] bg-linen-subtle border border-[#E3DDD1] overflow-hidden mb-3">
                      <img
                        src={m.designedImage.url}
                        alt={m.designedImage.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <h4 className="font-editorial text-sm font-semibold text-[#1C1917]">
                      {m.designedImage.title}
                    </h4>

                    {m.designedImage.pieces && m.designedImage.pieces.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#F2ECE3]">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C] mb-1">
                          Curated Coordinates:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.designedImage.pieces.map((p, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#FAF8F5] border border-[#E5E0D8] px-2 py-0.5 text-[#44403C]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-[#F2ECE3] flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleApplyToBoard(m.designedImage!, m.id)}
                        className="flex-1 py-1.5 px-3 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {appliedImageId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Applied to Board</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Set as Active Outfit</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(m.designedImage!.url, m.designedImage!.title)
                        }
                        className="py-1.5 px-2.5 border border-[#DDD6C8] hover:bg-[#F5F2EB] text-[#57534E] text-xs transition-colors cursor-pointer"
                        title="Download flat-lay"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[10px] text-[#A8A29E] px-1">
                Jean-Luc is reviewing & composing...
              </span>
              <div className="p-4 bg-white border border-[#E7E2D9] text-xs text-[#78716C] flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#9A3412] animate-spin" />
                <span>Formulating editorial critique & designing visual layout...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-[#FAF8F5] border-t border-[#EAE5DA] overflow-x-auto">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C] mb-1.5 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
            <span>Suggested Consultations:</span>
          </p>
          <div className="flex gap-2 pb-1">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] text-[#44403C] hover:text-[#9A3412] bg-white border border-[#E2DDD3] hover:border-[#9A3412] px-3 py-1.5 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Formulation Area */}
        <div className="p-4 bg-white border-t border-[#E7E2D9]">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setForceImageDesign(!forceImageDesign)}
              className={`text-[11px] font-medium flex items-center gap-1.5 px-2 py-0.5 border transition-all cursor-pointer ${
                forceImageDesign
                  ? 'bg-[#FAF5EE] border-[#9A3412] text-[#9A3412]'
                  : 'bg-white border-[#DDD6C8] text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Wand2 className="w-3 h-3 text-[#9A3412]" />
              <span>Design Flat-Lay Image With Response</span>
            </button>

            <span className="text-[10px] text-[#A8A29E]">
              Press Enter to send · Shift+Enter for newline
            </span>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Jean-Luc for an honest opinion, styling advice, or a new flat-lay design..."
              className="flex-1 text-xs p-3 bg-[#FAF8F5] border border-[#DDD6C8] text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#9A3412] resize-none"
            />
            <button
              type="button"
              disabled={isSending || !input.trim()}
              onClick={() => handleSend()}
              className="p-3 bg-[#1C1917] hover:bg-[#2E2A27] disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0"
              title="Send to stylist"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
