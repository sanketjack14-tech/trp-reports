import React, { useState } from 'react';
import { Save, X, Bookmark, Sparkles } from 'lucide-react';

export default function SaveReportModal({ isOpen, onClose, onSave, currentReportName }) {
  const [name, setName] = useState(currentReportName || 'Custom Overseas Education Report');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Custom Reports');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-[#C8102E]">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Save Report Configuration</h3>
              <p className="text-xs text-slate-500">Save layout, active filters, and graph choices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Report Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Fall 2025 High IELTS USA Candidates"
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-[#C8102E] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category Folder</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-[#C8102E] focus:outline-hidden"
            >
              <option value="Custom Reports">Custom Reports</option>
              <option value="Counselor Performance">Counselor Performance</option>
              <option value="High Potential Students">High Potential Students</option>
              <option value="Visa Operations">Visa Operations</option>
              <option value="Target Destination">Target Destination</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this report tracks..."
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-[#C8102E] focus:outline-hidden resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#C8102E] hover:bg-[#A00C23] rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Report
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
