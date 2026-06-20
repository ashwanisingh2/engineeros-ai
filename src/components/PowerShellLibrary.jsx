import React, { useState } from 'react';
import { Search, Plus, Terminal, Copy, Check, Trash2, Edit2, X, Cpu } from 'lucide-react';

const CATEGORIES = ["all", "active_directory", "dns", "dhcp", "group_policy", "m365", "exchange_online", "azure", "intune", "windows", "general"];

export default function PowerShellLibrary({ scripts, onSaveScript, onDeleteScript }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copyStates, setCopyStates] = useState({}); // { [scriptId]: boolean }
  const [editingScript, setEditingScript] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New script states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newType, setNewType] = useState('powershell'); // 'powershell' | 'cmd'

  const filteredScripts = scripts.filter(scr => {
    const matchesSearch =
      scr.title.toLowerCase().includes(search.toLowerCase()) ||
      scr.description.toLowerCase().includes(search.toLowerCase()) ||
      scr.script.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || scr.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopyStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newCode.trim()) return;

    const item = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      script: newCode,
      category: newCategory,
      type: newType
    };

    onSaveScript(item);
    resetAddForm();
  };

  const resetAddForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewCode('');
    setNewCategory('general');
    setNewType('powershell');
    setShowAddForm(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingScript.title.trim() || !editingScript.description.trim() || !editingScript.script.trim()) return;

    onSaveScript(editingScript);
    setEditingScript(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            💻 Terminal Script & Command Library
          </h1>
          <p className="text-textMuted mt-1">Ready-to-use production PowerShell (.ps1) and CMD (.bat) scripts for admin operations.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-sm self-start md:self-auto"
        >
          <Plus size={16} /> Add New Script
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3 text-textMuted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scripts by title, description, or commands..."
            className="w-full bg-cardBg border border-gray-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent focus:ring-1 focus:ring-primaryAccent transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all shrink-0 capitalize ${
                selectedCategory === cat
                  ? 'bg-primaryAccent border-primaryAccent text-white'
                  : 'bg-cardBg border-gray-800 text-textMuted hover:border-gray-700 hover:text-textPrimary'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Add Script Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cardBg border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-textPrimary">Create Shell Script</h3>
              <button onClick={resetAddForm} className="text-textMuted hover:text-textPrimary">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Flush DNS Resolver Cache"
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Script Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                  >
                    <option value="powershell">PowerShell (.ps1)</option>
                    <option value="cmd">Command Prompt (.bat / .cmd)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent capitalize"
                  >
                    {CATEGORIES.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Description / Info</label>
                  <input
                    type="text"
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="e.g. Purges local cache and forces workstation IP release."
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Script Code</label>
                <textarea
                  required
                  rows="8"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder={newType === 'cmd' ? '@echo off\nipconfig /flushdns\npause' : 'Clear-DnsClientCache'}
                  className={`w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primaryAccent font-mono resize-y ${
                    newType === 'cmd' ? 'text-cyan-400' : 'text-green-400'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={resetAddForm}
                  className="px-4 py-2 text-xs font-medium text-textMuted border border-gray-800 rounded-lg hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-primaryAccent text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Script
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Script Modal */}
      {editingScript && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cardBg border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-textPrimary">Edit Shell Script</h3>
              <button onClick={() => setEditingScript(null)} className="text-textMuted hover:text-textPrimary">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={editingScript.title}
                    onChange={(e) => setEditingScript({ ...editingScript, title: e.target.value })}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Script Type</label>
                  <select
                    value={editingScript.type || 'powershell'}
                    onChange={(e) => setEditingScript({ ...editingScript, type: e.target.value })}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                  >
                    <option value="powershell">PowerShell (.ps1)</option>
                    <option value="cmd">Command Prompt (.bat / .cmd)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={editingScript.category}
                    onChange={(e) => setEditingScript({ ...editingScript, category: e.target.value })}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent capitalize"
                  >
                    {CATEGORIES.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Description</label>
                  <input
                    type="text"
                    required
                    value={editingScript.description}
                    onChange={(e) => setEditingScript({ ...editingScript, description: e.target.value })}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Script Code</label>
                <textarea
                  required
                  rows="8"
                  value={editingScript.script}
                  onChange={(e) => setEditingScript({ ...editingScript, script: e.target.value })}
                  className={`w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primaryAccent font-mono ${
                    (editingScript.type || 'powershell') === 'cmd' ? 'text-cyan-400' : 'text-green-400'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingScript(null)}
                  className="px-4 py-2 text-xs font-medium text-textMuted border border-gray-800 rounded-lg hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-primaryAccent text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Script Cards List */}
      {filteredScripts.length === 0 ? (
        <div className="bg-cardBg border border-gray-800 rounded-xl p-12 text-center animate-fadeIn">
          <Terminal className="mx-auto text-textMuted mb-4" size={36} />
          <h3 className="text-lg font-bold text-textPrimary">No Scripts Found</h3>
          <p className="text-textMuted text-sm mt-1">Write your search keyword or change categories.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredScripts.map(scr => {
            const isCmd = scr.type === 'cmd';
            return (
              <div key={scr.id} className="bg-cardBg border border-gray-800 rounded-xl overflow-hidden hover:border-gray-750 transition-all animate-fadeIn">
                {/* Header */}
                <div className="bg-sidebarBg px-5 py-3 border-b border-gray-850 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-textPrimary flex items-center gap-2">
                      <Terminal size={16} className={isCmd ? "text-amber-500 shrink-0" : "text-primaryAccent shrink-0"} />
                      {scr.title}
                    </h3>
                    <p className="text-xs text-textMuted mt-0.5">{scr.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] border rounded-full px-2.5 py-0.5 uppercase font-bold font-mono ${
                      isCmd 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {isCmd ? 'CMD' : 'PS'}
                    </span>
                    <span className="text-[10px] bg-sidebarBg border border-gray-850 text-textMuted rounded-full px-2.5 py-0.5 capitalize font-semibold font-mono">
                      {scr.category.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => setEditingScript(scr)}
                      className="text-textMuted hover:text-primaryAccent p-1.5 rounded hover:bg-gray-800 transition-colors"
                      title="Edit Script"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteScript(scr.id)}
                      className="text-textMuted hover:text-red-400 p-1.5 rounded hover:bg-gray-800 transition-colors"
                      title="Delete Script"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Code block with copy action */}
                <div className="relative group">
                  <button
                    onClick={() => handleCopy(scr.id, scr.script)}
                    className="absolute right-4 top-4 bg-sidebarBg/90 hover:bg-sidebarBg text-textMuted hover:text-white p-2 rounded-lg border border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copyStates[scr.id] ? (
                      <>
                        <Check size={14} className="text-successGreen" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy Code
                      </>
                    )}
                  </button>
                  <pre className="p-5 bg-black/40 overflow-x-auto text-xs font-mono leading-relaxed max-h-[300px]">
                    <code className={isCmd ? 'text-cyan-400' : 'text-green-400'}>{scr.script}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
