import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Cloud } from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vercelJsonSnippet = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}`;

  const cliCommands = `# 1. Install Vercel CLI
npm i -g vercel

# 2. Login & Link Project
vercel login
vercel link

# 3. Add Environment Variable
vercel env add GEMINI_API_KEY

# 4. Deploy to Production
vercel --prod`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FAF8F5] border border-[#E2DDD3] w-full max-w-3xl p-6 sm:p-10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-4 mb-6 border-b border-[#E7E2D9]">
          <div className="flex items-center gap-1.5 text-xs text-[#9A3412] font-semibold uppercase tracking-widest mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Production Deployment</span>
          </div>
          <h3 className="font-editorial text-3xl font-semibold text-[#1C1917]">
            Deploy Virtual Stylist on Vercel
          </h3>
          <p className="text-xs text-[#57534E] mt-1">
            Follow this guide to deploy your React app with full-stack Gemini API capabilities on Vercel in 3 minutes.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="p-4 bg-white border border-[#E7E2D9]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Configure Environment Secrets on Vercel</span>
              </h4>
            </div>
            <p className="text-xs text-[#57534E] mb-2 leading-relaxed">
              In your Vercel Project Settings &gt; <strong>Environment Variables</strong>, add your Gemini API key:
            </p>
            <div className="p-2.5 bg-[#1C1917] text-[#FAF8F5] font-mono text-xs flex items-center justify-between">
              <span>GEMINI_API_KEY = your_api_key_here</span>
              <button
                onClick={() => copyCode('GEMINI_API_KEY', 'env')}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                {copiedSection === 'env' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'env' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-white border border-[#E7E2D9]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Vercel Configuration (vercel.json)</span>
              </h4>
              <button
                onClick={() => copyCode(vercelJsonSnippet, 'json')}
                className="text-xs text-[#9A3412] hover:underline flex items-center gap-1"
              >
                {copiedSection === 'json' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'json' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#F8F6F1] border border-[#E2DDD3] font-mono text-xs text-[#1C1917] overflow-x-auto">
              {vercelJsonSnippet}
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-white border border-[#E7E2D9]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Deploy via Vercel CLI (or GitHub integration)</span>
              </h4>
              <button
                onClick={() => copyCode(cliCommands, 'cli')}
                className="text-xs text-[#9A3412] hover:underline flex items-center gap-1"
              >
                {copiedSection === 'cli' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'cli' ? 'Copied' : 'Copy CLI Commands'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#1C1917] text-[#FAF8F5] font-mono text-xs overflow-x-auto leading-relaxed">
              {cliCommands}
            </pre>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#EAE5DA] flex items-center justify-between">
          <span className="text-[11px] text-[#78716C]">
            A complete deployment guide is also provided in <strong className="text-[#1C1917]">README.md</strong>.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#2E2A27] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
