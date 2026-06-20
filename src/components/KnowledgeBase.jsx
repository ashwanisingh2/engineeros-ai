import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Check, X, ShieldAlert, Tag, Calendar } from 'lucide-react';

const CATEGORIES = ["all", "windows", "networking", "azure", "m365", "linux", "powershell", "intune", "sccm", "aws", "hardware", "general"];

export default function KnowledgeBase({ knowledgeItems, onSaveItem, onDeleteItem }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingItem, setEditingItem] = useState(null); // Item being edited
  const [showAddForm, setShowAddForm] = useState(false);

  // New Item details form state
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newTags, setNewTags] = useState('');
  const [newSeverity, setNewSeverity] = useState('low');

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.problem.toLowerCase().includes(search.toLowerCase()) ||
      item.solution.toLowerCase().includes(search.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProblem.trim() || !newSolution.trim()) return;

    const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const item = {
      id: Date.now().toString(),
      title: newTitle,
      problem: newProblem,
      solution: newSolution,
      category: newCategory,
      tags: tagsArray,
      severity: newSeverity,
      date: new Date().toLocaleDateString()
    };

    onSaveItem(item);
    resetAddForm();
  };

  const resetAddForm = () => {
    setNewTitle('');
    setNewProblem('');
    setNewSolution('');
    setNewCategory('general');
    setNewTags('');
    setNewSeverity('low');
    setShowAddForm(false);
  };

  const startEdit = (item) => {
    setEditingItem({ ...item, tags: item.tags ? item.tags.join(', ') : '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingItem.title.trim() || !editingItem.problem.trim() || !editingItem.solution.trim()) return;

    const tagsArray = typeof editingItem.tags === 'string'
      ? editingItem.tags.split(',').map(t => t.trim()).filter(Boolean)
      : editingItem.tags;

    onSaveItem({
      ...editingItem,
      tags: tagsArray
    });
    setEditingItem(null);
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'critical': return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'high': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'medium': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default: return 'bg-successGreen/10 border-successGreen/30 text-successGreen';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            📚 Knowledge Base
          </h1>
          <p className="text-textMuted mt-1">SOPs, troubleshooting guides, and configurations saved during studies.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-sm self-start md:self-auto"
        >
          <Plus size={16} /> Add Solution
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
            placeholder="Search solutions by title, problem, keyword, or tags..."
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
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cardBg border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-textPrimary">Add Manual Solution</h3>
              <button onClick={resetAddForm} className="text-textMuted hover:text-textPrimary">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. DNS Resolution failure on Domain Controller"
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent capitalize"
                  >
                    {CATEGORIES.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Problem Description</label>
                <textarea
                  required
                  rows="3"
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="What is the error code or symptoms?"
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Troubleshooting Steps / Solution</label>
                <textarea
                  required
                  rows="5"
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="Steps to resolve or commands to run..."
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="dns, ad, dc, network"
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cardBg border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-textPrimary">Edit Solution</h3>
              <button onClick={() => setEditingItem(null)} className="text-textMuted hover:text-textPrimary">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent capitalize"
                  >
                    {CATEGORIES.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Severity</label>
                  <select
                    value={editingItem.severity}
                    onChange={(e) => setEditingItem({ ...editingItem, severity: e.target.value })}
                    className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Problem Description</label>
                <textarea
                  required
                  rows="3"
                  value={editingItem.problem}
                  onChange={(e) => setEditingItem({ ...editingItem, problem: e.target.value })}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Solution</label>
                <textarea
                  required
                  rows="5"
                  value={editingItem.solution}
                  onChange={(e) => setEditingItem({ ...editingItem, solution: e.target.value })}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingItem.tags}
                  onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value })}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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

      {/* Cards List */}
      {filteredItems.length === 0 ? (
        <div className="bg-cardBg border border-gray-800 rounded-xl p-12 text-center">
          <BookOpen className="mx-auto text-textMuted mb-4" size={36} />
          <h3 className="text-lg font-bold text-textPrimary">No Solutions Found</h3>
          <p className="text-textMuted text-sm mt-1">Pehle chat mein troubleshoot karein ya manual add karein.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-cardBg border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-textMuted">
                    <Calendar size={12} />
                    <span>{item.date || 'Lately'}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-textPrimary mb-2 leading-snug">{item.title}</h3>
                
                <div className="mb-3">
                  <span className="block text-[10px] font-bold text-textMuted uppercase tracking-wider mb-1">Problem:</span>
                  <p className="text-xs text-textPrimary bg-darkBg/60 rounded px-2.5 py-1.5 border border-gray-850 whitespace-pre-wrap">{item.problem}</p>
                </div>

                <div className="mb-4">
                  <span className="block text-[10px] font-bold text-textMuted uppercase tracking-wider mb-1">Solution:</span>
                  <pre className="text-xs text-green-400 bg-black/60 rounded p-2.5 border border-gray-850 font-mono overflow-x-auto whitespace-pre-wrap">{item.solution}</pre>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-850 shrink-0">
                <div className="flex gap-1 overflow-x-auto scrollbar-none">
                  {item.tags && item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-sidebarBg text-textMuted border border-gray-800 rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                  <span className="text-[10px] bg-primaryAccent/10 text-primaryAccent border border-primaryAccent/20 rounded-full px-2 py-0.5 capitalize">
                    {item.category}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-textMuted hover:text-primaryAccent p-1.5 rounded hover:bg-gray-800 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-textMuted hover:text-red-400 p-1.5 rounded hover:bg-gray-800 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
