import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Radio,
  Smartphone,
  Laptop,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'remote' | 'layout' | 'cloudflare'>('remote');
  const [healthData, setHealthData] = useState<{
    clientsConnected?: number;
    cfRay?: string | null;
    status?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then((res) => res.json())
        .then((data) => setHealthData(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-none font-['Kantumruy_Pro',sans-serif] animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#1e293b] rounded-2xl shadow-2xl border-2 border-amber-400/70 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-4 flex items-center justify-between text-white border-b border-amber-400/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900/40 flex items-center justify-center border border-yellow-300/60 shadow-inner">
              <Globe className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '15s' }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-yellow-100 flex items-center gap-2">
                <span>របៀបដំណើរការ & បញ្ជាពីចម្ងាយតាម Cloudflare</span>
                <span className="text-[10px] bg-black/40 text-yellow-300 px-2 py-0.5 rounded-full font-mono border border-yellow-400/40">
                  CLOUDFLARE READY
                </span>
              </h2>
              <p className="text-[11px] text-amber-100 font-medium">
                ស្វែងយល់ពីរបៀបដែល Admin បញ្ជាលទ្ធផលពីចម្ងាយ និងភាពដូចគ្នានៃប្លង់គ្រប់ឧបករណ៍
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 active:scale-95 flex items-center justify-center text-white transition-all border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0f172a] px-4 py-2 flex items-center gap-2 border-b border-slate-700/80 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('remote')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'remote'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>១. ការបញ្ជាពីចម្ងាយ (Remote Control)</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'layout'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>២. ភាពដូចគ្នានៃប្លង់គ្រប់ឧបករណ៍ (Layout Consistency)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>៣. ការកំណត់ Cloudflare & Domain</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-200 text-xs sm:text-sm space-y-4">
          {activeTab === 'remote' && (
            <div className="space-y-4">
              {/* Scenario Explanation Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-amber-400/40 shadow-md">
                <div className="flex items-center gap-2 text-yellow-300 font-extrabold text-sm sm:text-base mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>ឧទាហរណ៍ជាក់ស្តែងនៃការបញ្ជាពីចម្ងាយ (Real-World Remote Control)</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                  ប្រព័ន្ធត្រូវបានបង្កើតឡើងដោយប្រើប្រាស់ <strong className="text-yellow-300">Authoritative Server State</strong> តាមរយៈ WebSocket (Port 3000 /ws) និង HTTP 1-Second Fallback Poller។ នេះមានន័យថាគ្រប់ឧបករណ៍ទាំងអស់ដែលបើកគេហទំព័រគឺមានទិន្នន័យដូចគ្នាបេះបិទក្នុងពេលតែមួយ។
                </p>

                {/* Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-700/80">
                  <div className="bg-slate-800/90 p-3 rounded-lg border border-purple-500/50">
                    <div className="flex items-center gap-2 text-purple-300 font-bold mb-1.5">
                      <Smartphone className="w-4 h-4 text-purple-400" />
                      <span>ឧបករណ៍ទី១: ទូរស័ព្ទដៃ Admin (ពីចម្ងាយ)</span>
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      <li>Admin បើកទំព័រ <span className="text-yellow-300 font-bold">Admin Panel</span> លើទូរស័ព្ទ (នៅផ្ទះ ឬ តាមផ្លូវ 4G)</li>
                      <li>Admin ចុចជ្រើសរើសសត្វ ឧទាហរណ៍: <span className="text-amber-300 font-bold">លេខ ៧ មមី (Horse)</span></li>
                      <li>ប្រព័ន្ធផ្ញើបញ្ជាទៅកាន់ Server ក្នុងពេលភ្លាមៗ (&lt; 20ms)</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/90 p-3 rounded-lg border border-blue-500/50">
                    <div className="flex items-center gap-2 text-blue-300 font-bold mb-1.5">
                      <Laptop className="w-4 h-4 text-blue-400" />
                      <span>ឧបករណ៍ទី២: កុំព្យូទ័រ / ទូរស័ព្ទភ្ញៀវ (Game Page)</span>
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      <li>កំពុងបើកផ្ទាំងភ្នាល់ហ្គេម ឆ្នោត 12 នៅកន្លែងផ្សេង</li>
                      <li>នាឡិការាប់ថយក្រោយដល់ ១០វិនាទី សំឡេងខ្មែររាប់ 10..0 បិទការភ្នាល់</li>
                      <li>ពេលចប់សំឡេង ពានបើកតាមលំដាប់ ហើយពានកណ្តាលលេខ ១២ <span className="text-emerald-300 font-bold">ចេញលេខ ៧ មមី ដូចអ្វីដែល Admin បានកំណត់!</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-2">
                <h4 className="font-bold text-yellow-300 text-xs sm:text-sm">លក្ខណៈពិសេសនៃការបញ្ជា:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>កំណត់ទុកជាមុន:</strong> Admin អាចកំណត់លេខឈ្នះមុនម៉ោងចាប់ឆ្នោតបានគ្រប់ពេល។</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>ចាប់ឆ្នោតភ្លាមៗ:</strong> Admin អាចចុច «បង្ខំចាប់ឆ្នោតភ្លាមៗ» ដើម្បីចាប់ភ្លាមលើគ្រប់ឧបករណ៍។</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>ប្តូរចិត្តមកចៃដន្យ:</strong> Admin អាចចុច «កំណត់ឡើងវិញ (Reset)» ដើម្បីអោយប្រព័ន្ធចេញចៃដន្យវិញ។</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>គ្មានការបាត់បង់ទិន្នន័យ:</strong> ទោះបីទូរស័ព្ទដាច់សេវាបន្តិច ក៏ប្រព័ន្ធ Auto-Reconnecting ក្នុង ២.៥វិនាទី។</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-yellow-300 font-extrabold text-sm sm:text-base">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>ប្លង់ស្តង់ដារ ដូចគ្នាគ្រប់ឧបករណ៍ (Identical Unified Layout)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  ទោះបីជាចូលតាមរយៈ <strong>កុំព្យូទ័រ (Computer/Desktop)</strong>, <strong>ថេប្លេត (Tablet/iPad)</strong>, ឬ <strong>ទូរស័ព្ទដៃ (Mobile Phone)</strong> ក៏ដោយ ក៏ប្លង់ចម្បងនៃវេទិកាឆ្នោត ១២ រក្សាទ្រង់ទ្រាយដូចគ្នាទាំងស្រុង៖
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700">
                    <div className="font-bold text-amber-300 mb-1">១. ផ្ទាំងខាងឆ្វេង (Sidebar)</div>
                    <div className="text-[11px] text-slate-400">
                      បង្ហាញសមតុល្យទឹកប្រាក់ (៛), ប្រវត្តិលទ្ធផលចេញរួច, និងតារាងភ្នាល់ជាក់ស្តែង។
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700">
                    <div className="font-bold text-amber-300 mb-1">២. ពានចាប់ឆ្នោត 4K (Bowls)</div>
                    <div className="text-[11px] text-slate-400">
                      ជួរទី១ (១-៦), ជួរទី២ (៧-១១), និងពានកណ្តាលលេខ ១២ ប្រើប្រាស់រូបភាពច្បាស់ 4K 1:1 ពេញលេញ។
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700">
                    <div className="font-bold text-amber-300 mb-1">៣. ផ្ទាំងភ្នាល់ & ផ្លូវគូស (Roads)</div>
                    <div className="text-[11px] text-slate-400">
                      ប៊ូតុង តូច/ធំ (1.95), សេស/គូ, ក្រហម/បៃតង/ខៀវ (2.95), សត្វទាំង ១២ (11.00), និងផ្លូវគ្រាប់ លេខ/ពណ៌។
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-400/40 rounded-lg text-xs text-amber-200">
                  💡 <strong>នៅលើទូរស័ព្ទដៃ:</strong> អ្នកប្រើប្រាស់អាចជ្រើសរើសរបៀបមើល «ប្លង់ពេញលេញ (Full View)» ឬប្តូររវាង «ផ្ទាំងឆ្នោត» និង «គណនី» យ៉ាងរលូន ដោយមិនបាត់បង់ទិន្នន័យឡើយ។
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloudflare' && (
            <div className="space-y-4">
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-yellow-300 font-extrabold text-sm sm:text-base">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>ការកំណត់ Cloudflare ជាមួយ Domain ផ្ទាល់ខ្លួន</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  ប្រព័ន្ធត្រូវបានបង្កើតឡើងយ៉ាងល្អឥតខ្ចោះដើម្បីដំណើរការនៅក្រោយ Cloudflare Proxy (Orange Cloud) ជាមួយ Domain ផ្ទាល់ខ្លួនរបស់អ្នក:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-700">
                    <div className="font-bold text-emerald-300">✓ WebSockets Support</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      នៅក្នុង Cloudflare Dashboard ចូលទៅកាន់ <strong>Network</strong> → បើក <strong>WebSockets: ON</strong>។ Server មាន 15-second Ping Heartbeat ការពារកុំឱ្យ Cloudflare 100s idle timeout កាត់ផ្តាច់។
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-700">
                    <div className="font-bold text-emerald-300">✓ SSL / HTTPS Encryption</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      នៅក្នុង Cloudflare ចូលទៅកាន់ <strong>SSL/TLS</strong> → ជ្រើសរើស <strong>Full</strong> ឬ <strong>Full (Strict)</strong>។ កម្មវិធីនឹងប្រើប្រាស់ <code>wss://</code> ដោយស្វ័យប្រវត្ត។
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-700">
                    <div className="font-bold text-emerald-300">✓ Cloudflare Cache Bypass លើ API</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Server បានកំណត់ក្បាល <code>Cache-Control: no-store, no-cache</code> លើគ្រប់ <code>/api/*</code> endpoints រារាំង Cloudflare Edge CDN ពីការរក្សាទុកទិន្នន័យចាស់។
                    </div>
                  </div>
                </div>

                {healthData && (
                  <div className="mt-3 p-2.5 bg-slate-950/80 rounded-lg border border-slate-700 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2">
                    <div className="text-slate-400">
                      ឧបករណ៍ដែលកំពុងភ្ជាប់ផ្ទាល់: <span className="text-emerald-400 font-bold">{healthData.clientsConnected ?? 1} ឧបករណ៍</span>
                    </div>
                    {healthData.cfRay && (
                      <div className="text-slate-400">
                        Cloudflare Ray ID: <span className="text-yellow-300">{healthData.cfRay}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-t border-slate-700/80">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>ឆ្នោត 12 • Real-Time Remote Management v2.0</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white text-xs font-bold rounded-lg transition-all"
          >
            យល់ព្រម & បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
