import React, { useState, useEffect } from 'react';
import { Save, Shield, Key, Eye, EyeOff, AlertCircle, RefreshCw, Globe, Server } from 'lucide-react';

export default function Settings({ settings, onSaveSettings }) {
  const [provider, setProvider] = useState(settings.provider || 'Claude');
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [language, setLanguage] = useState(settings.language || 'Hinglish');
  const [currentRole, setCurrentRole] = useState(settings.currentRole || 'Desktop Support L1');
  const [targetRole, setTargetRole] = useState(settings.targetRole || 'Sysadmin L2');
  const [apiEndpoint, setApiEndpoint] = useState(settings.apiEndpoint || 'https://api.anthropic.com');
  const [saveStatus, setSaveStatus] = useState('');

  // Load from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('engineeros_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.provider) setProvider(parsed.provider);
      if (parsed.apiKey !== undefined) setApiKey(parsed.apiKey);
      if (parsed.language) setLanguage(parsed.language);
      if (parsed.currentRole) setCurrentRole(parsed.currentRole);
      if (parsed.targetRole) setTargetRole(parsed.targetRole);
      if (parsed.apiEndpoint) setApiEndpoint(parsed.apiEndpoint);
    }
  }, []);

  // Save to localStorage on change and propagate settings to parent App component
  useEffect(() => {
    const settingsPayload = {
      apiKey,
      language,
      currentRole,
      targetRole,
      apiEndpoint,
      endpoint: apiEndpoint,
      provider,
    };
    localStorage.setItem('engineeros_settings', JSON.stringify(settingsPayload));
    if (onSaveSettings) {
      onSaveSettings(settingsPayload);
    }
  }, [apiKey, language, currentRole, targetRole, apiEndpoint, provider, onSaveSettings]);

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    if (newProvider === 'Groq') {
      if (apiEndpoint === 'https://api.anthropic.com' || apiEndpoint === '') {
        setApiEndpoint('https://api.groq.com/openai/v1/chat/completions');
      }
    } else {
      if (apiEndpoint === 'https://api.groq.com/openai/v1/chat/completions' || apiEndpoint === '') {
        setApiEndpoint('https://api.anthropic.com');
      }
    }
  };

  const handleClearSettings = () => {
    if (window.confirm("Are you sure you want to clear all settings? This will clear your API key, endpoint, and roles.")) {
      localStorage.removeItem('engineeros_settings');
      setProvider('Claude');
      setApiKey('');
      setLanguage('Hinglish');
      setCurrentRole('Desktop Support L1');
      setTargetRole('Sysadmin L2');
      setApiEndpoint('https://api.anthropic.com');
      if (onSaveSettings) {
        onSaveSettings({
          apiKey: '',
          language: 'Hinglish',
          currentRole: 'Desktop Support L1',
          targetRole: 'Sysadmin L2',
          apiEndpoint: 'https://api.anthropic.com',
          provider: 'Claude'
        });
      }
      setSaveStatus('Settings successfully cleared!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all app data? This will delete all saved chats, custom scripts, and knowledge base logs!")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary">Configuration & Settings</h1>
          <p className="text-textMuted mt-1">Configure your Claude API credentials, roles, and preferences.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleClearSettings}
            className="text-xs bg-gray-900 hover:bg-gray-800 text-textSecondary border border-gray-800 px-3 py-2 rounded-md font-semibold transition-colors"
          >
            Clear All Settings
          </button>
          <button
            onClick={handleReset}
            className="text-xs bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 px-3 py-2 rounded-md font-semibold transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="bg-successGreen/15 border border-successGreen text-successGreen px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <Save size={18} />
          <span className="text-sm font-semibold">{saveStatus}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* API Credentials */}
        <div className="bg-cardBg border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-primaryAccent mb-4">
            <Key size={18} />
            API Keys & Authentication
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                API Provider
              </label>
              <select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent transition-colors"
              >
                <option value="Claude">Anthropic Claude</option>
                <option value="Groq">Groq (Llama / Mixtral)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2 flex items-center justify-between">
                <span>{provider === 'Groq' ? 'Groq API Key (gsk_...)' : 'Claude API Key (sk-ant-...)'}</span>
                <span className="text-xs text-textMuted font-mono">Stored locally in your browser</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={isFocused || showKey ? apiKey : (apiKey ? '...' + apiKey.slice(-4) : '')}
                  onChange={(e) => setApiKey(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={provider === 'Groq' ? 'Enter gsk_... API Key' : 'Enter sk-ant-... API Key'}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 pl-4 pr-12 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-textMuted hover:text-textPrimary"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-textMuted mt-2">
                {provider === 'Groq' ? (
                  <span>This key is required to use AI Chat, Doc Generator, and Daily Challenge features. You can get one from the <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-primaryAccent hover:underline">Groq Console</a>.</span>
                ) : (
                  <span>This key is required to use AI Chat, Doc Generator, and Daily Challenge features. You can get one from the <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primaryAccent hover:underline">Anthropic Console</a>.</span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2 flex items-center gap-1.5">
                <Server size={16} className="text-textMuted" />
                API Endpoint / CORS Proxy URL
              </label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder={provider === 'Groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.anthropic.com'}
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent transition-colors font-mono"
              />
              <div className="mt-2.5 p-3.5 bg-darkBg/60 rounded-lg border border-gray-850 flex items-start gap-2.5">
                <AlertCircle size={16} className="text-warningAmber mt-0.5 shrink-0" />
                <div className="text-xs text-textMuted leading-relaxed">
                  <strong className="text-warningAmber font-medium">CORS Warning:</strong> Direct browser calls to {provider === 'Groq' ? 'Groq\'s' : 'Anthropic\'s'} production server will fail due to security settings.
                  To bypass this, you can:
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Use a browser extension to disable CORS preflights (e.g., <code className="text-primaryAccent">Allow CORS: Access-Control-Allow-Origin</code>).</li>
                    <li>Set up a local CORS proxy or Cloudflare Worker and paste its URL here (e.g. <code className="text-primaryAccent">https://your-proxy-domain/</code>).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-cardBg border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-primaryAccent mb-4">
            <Shield size={18} />
            Engineer Profile & Roadmap Target
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Current Role</label>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent transition-colors"
              >
                <option value="Desktop Support L1">Desktop Support L1 (System Maintenance / Hardware)</option>
                <option value="Sysadmin L2">Sysadmin L2 (Active Directory / Windows Server / Core Net)</option>
                <option value="Cloud Engineer L3">Cloud Engineer L3 (Azure / M365 / AWS / Devops)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent transition-colors"
              >
                <option value="Sysadmin L2">Sysadmin L2 (AD, Server, Routing)</option>
                <option value="Cloud Engineer L3">Cloud Engineer L3 (Entra ID, Azure Admin, Intune)</option>
                <option value="Enterprise Solutions Architect">Enterprise Solutions Architect (Multi-cloud / High Availability)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-cardBg border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-primaryAccent mb-4">
            <Globe size={18} />
            Preferences
          </h2>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">Language Translation Preference</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2.5 bg-sidebarBg border border-gray-800 rounded-lg px-4 py-3 cursor-pointer select-none hover:border-gray-700 transition-colors flex-1">
                <input
                  type="radio"
                  name="language"
                  value="Hinglish"
                  checked={language === 'Hinglish'}
                  onChange={() => setLanguage('Hinglish')}
                  className="accent-primaryAccent"
                />
                <div>
                  <span className="block text-sm font-medium text-textPrimary">Hinglish</span>
                  <span className="block text-xs text-textMuted">Hindi + English mix. Jaise, "DNS troubleshoot karne ke liye nslookup check karo."</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 bg-sidebarBg border border-gray-800 rounded-lg px-4 py-3 cursor-pointer select-none hover:border-gray-700 transition-colors flex-1">
                <input
                  type="radio"
                  name="language"
                  value="English"
                  checked={language === 'English'}
                  onChange={() => setLanguage('English')}
                  className="accent-primaryAccent"
                />
                <div>
                  <span className="block text-sm font-medium text-textPrimary">English Only</span>
                  <span className="block text-xs text-textMuted">Standard professional technical explanations.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
