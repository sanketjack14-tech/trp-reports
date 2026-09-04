import React, { useState } from 'react';
import { 
  Filter, 
  Plus, 
  X, 
  SlidersHorizontal, 
  Check, 
  Layers, 
  BarChart2,
  Zap,
  Trash2
} from 'lucide-react';
import { ALL_FIELDS, FILTER_OPERATORS } from '../data/fieldsData';

export default function FilterBar({
  filters,
  setFilters,
  globalLogicMode,
  setGlobalLogicMode,
  groupByField,
  setGroupByField,
  onAddPresetFilter
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState('target_country');
  const [selectedOperator, setSelectedOperator] = useState('equals');
  const [inputValue, setInputValue] = useState('USA');

  const getFieldObj = (id) => ALL_FIELDS.find(f => f.id === id);

  const handleFieldChange = (fieldId) => {
    setSelectedFieldId(fieldId);
    const fObj = getFieldObj(fieldId);
    if (fObj) {
      setSelectedOperator(fObj.type === 'number' ? 'greater_than_or_equal' : 'equals');
      setInputValue(fObj.type === 'select' ? (fObj.options[0] || '') : (fObj.type === 'number' ? (fObj.min || 0) : ''));
    }
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    const newFilter = {
      id: 'f_' + Date.now(),
      fieldId: selectedFieldId,
      operator: selectedOperator,
      value: inputValue,
      logic: 'AND'
    };
    setFilters([...filters, newFilter]);
    setIsAddModalOpen(false);
  };

  const handleRemoveFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const handleToggleRowLogic = (id) => {
    setFilters(filters.map(f => f.id === id ? { ...f, logic: f.logic === 'AND' ? 'OR' : 'AND' } : f));
  };

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-2.5">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left: Active Filters Pills */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Filter Matching Mode Pill */}
          {filters.length > 0 && (
            <button
              onClick={() => setGlobalLogicMode(globalLogicMode === 'AND' ? 'OR' : 'AND')}
              className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] tracking-wider uppercase border transition-all cursor-pointer ${
                globalLogicMode === 'AND' 
                  ? 'bg-rose-50 text-[#C8102E] border-rose-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title="Click to switch global filter logic between AND (All match) and OR (Any match)"
            >
              Match: {globalLogicMode}
            </button>
          )}

          {/* Active Grouping Pill */}
          {groupByField && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-full text-xs font-semibold">
              <BarChart2 className="w-3 h-3 text-rose-400" />
              <span>Group: {getFieldObj(groupByField)?.label}</span>
              <button 
                onClick={() => setGroupByField('')}
                className="hover:text-rose-400 transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Filter Pills */}
          {filters.map((f, idx) => {
            const fObj = getFieldObj(f.fieldId);
            return (
              <span
                key={f.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-full font-medium"
              >
                {idx > 0 && (
                  <button
                    onClick={() => handleToggleRowLogic(f.id)}
                    className="text-[9px] font-extrabold text-[#C8102E] bg-rose-100 px-1.5 py-0.2 rounded-xs hover:bg-rose-200"
                    title="Toggle AND/OR row connector"
                  >
                    {f.logic || 'AND'}
                  </button>
                )}
                <span className="font-semibold text-slate-900">{fObj?.label || f.fieldId}:</span>
                <span className="text-slate-600 font-mono text-[11px]">{f.operator === 'equals' ? '=' : f.operator === 'greater_than_or_equal' ? '≥' : f.operator}</span>
                <span className="font-bold text-[#C8102E]">{String(f.value)}</span>
                <button
                  onClick={() => handleRemoveFilter(f.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {/* Add Filter Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-[#C8102E] border border-rose-200 rounded-full font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Filter Rule
          </button>

          {filters.length > 0 && (
            <button
              onClick={() => setFilters([])}
              className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors ml-1"
            >
              Clear All
            </button>
          )}

        </div>

        {/* Right: Quick Preset Filter Shortcuts */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Quick:</span>
          <button
            onClick={() => onAddPresetFilter('target_country', 'equals', 'USA')}
            className="px-2 py-0.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-[#C8102E] border border-slate-200 rounded-md transition-colors"
          >
            USA
          </button>
          <button
            onClick={() => onAddPresetFilter('ielts_score', 'greater_than_or_equal', 7.5)}
            className="px-2 py-0.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-[#C8102E] border border-slate-200 rounded-md transition-colors"
          >
            IELTS ≥ 7.5
          </button>
          <button
            onClick={() => onAddPresetFilter('visa_status', 'equals', 'Approved')}
            className="px-2 py-0.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-[#C8102E] border border-slate-200 rounded-md transition-colors"
          >
            Visa Approved
          </button>
        </div>

      </div>

      {/* Add Filter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-4 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Add Filter Condition</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Field</label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                >
                  {ALL_FIELDS.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Condition</label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                >
                  {(FILTER_OPERATORS[getFieldObj(selectedFieldId)?.type || 'string'] || FILTER_OPERATORS.string).map(op => (
                    <option key={op.id} value={op.id}>{op.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Value</label>
                {getFieldObj(selectedFieldId)?.type === 'select' ? (
                  <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                  >
                    {getFieldObj(selectedFieldId).options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : getFieldObj(selectedFieldId)?.type === 'number' ? (
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                  />
                ) : (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value..."
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#C8102E] rounded-lg shadow-2xs"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
