import React from 'react';
import { 
  Filter, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Zap,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { ALL_FIELDS, FILTER_OPERATORS } from '../data/fieldsData';

export default function FilterEngine({
  filters,
  setFilters,
  globalLogicMode,
  setGlobalLogicMode,
  onAddPresetFilter
}) {
  const getFieldObj = (id) => ALL_FIELDS.find(f => f.id === id);

  const handleAddFilterRow = (defaultFieldId = 'target_country') => {
    const fObj = getFieldObj(defaultFieldId) || ALL_FIELDS[0];
    let defaultOp = 'equals';
    if (fObj.type === 'number') defaultOp = 'greater_than_or_equal';

    const newFilter = {
      id: 'f_' + Date.now() + Math.random().toString(36).substr(2, 4),
      fieldId: fObj.id,
      operator: defaultOp,
      value: fObj.type === 'select' ? (fObj.options[0] || '') : (fObj.type === 'number' ? (fObj.min || 0) : ''),
      logic: 'AND'
    };

    setFilters([...filters, newFilter]);
  };

  const handleUpdateFilter = (id, key, value) => {
    setFilters(filters.map(f => {
      if (f.id !== id) return f;
      const updated = { ...f, [key]: value };

      // If field changed, update operator and default value according to data type
      if (key === 'fieldId') {
        const newField = getFieldObj(value);
        if (newField) {
          updated.operator = newField.type === 'number' ? 'greater_than_or_equal' : 'equals';
          updated.value = newField.type === 'select' ? (newField.options[0] || '') : (newField.type === 'number' ? (newField.min || 0) : '');
        }
      }
      return updated;
    }));
  };

  const handleRemoveFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const handleToggleRowLogic = (id) => {
    setFilters(filters.map(f => {
      if (f.id !== id) return f;
      return { ...f, logic: f.logic === 'AND' ? 'OR' : 'AND' };
    }));
  };

  return (
    <div className="bg-white border-b border-slate-200 p-4">
      {/* Top Filter Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-[#C8102E]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              Advanced Filter Rules Engine
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {filters.length} Rules Active
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Combine multiple field conditions using simple <strong className="text-[#C8102E]">AND / OR</strong> logic connectors.
            </p>
          </div>
        </div>

        {/* Global Match Logic Switcher */}
        <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-600 pl-2">Filter Matching:</span>
          <button
            onClick={() => setGlobalLogicMode('AND')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              globalLogicMode === 'AND'
                ? 'bg-[#C8102E] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Match ALL (AND)
          </button>
          <button
            onClick={() => setGlobalLogicMode('OR')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              globalLogicMode === 'OR'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Match ANY (OR)
          </button>
        </div>
      </div>

      {/* Quick Filter Badges */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3 text-amber-500" />
          Quick Filters:
        </span>
        <button
          onClick={() => onAddPresetFilter('target_country', 'equals', 'USA')}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-[#C8102E] hover:border-rose-200 border border-slate-200 rounded-lg transition-colors shrink-0"
        >
          🇺🇸 Target = USA
        </button>
        <button
          onClick={() => onAddPresetFilter('ielts_score', 'greater_than_or_equal', 7.5)}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-[#C8102E] hover:border-rose-200 border border-slate-200 rounded-lg transition-colors shrink-0"
        >
          📜 IELTS ≥ 7.5
        </button>
        <button
          onClick={() => onAddPresetFilter('gre_score', 'greater_than_or_equal', 320)}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-[#C8102E] hover:border-rose-200 border border-slate-200 rounded-lg transition-colors shrink-0"
        >
          🎓 GRE ≥ 320
        </button>
        <button
          onClick={() => onAddPresetFilter('visa_status', 'equals', 'Approved')}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-[#C8102E] hover:border-rose-200 border border-slate-200 rounded-lg transition-colors shrink-0"
        >
          ✅ Visa Approved
        </button>
      </div>

      {/* Filter Rows Container */}
      <div className="space-y-2.5">
        {filters.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-2">No active filter rules. Showing all records.</p>
            <button
              onClick={() => handleAddFilterRow()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C8102E] bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Filter Rule
            </button>
          </div>
        ) : (
          filters.map((filter, index) => {
            const fieldObj = getFieldObj(filter.fieldId);
            const operatorsList = FILTER_OPERATORS[fieldObj?.type || 'string'] || FILTER_OPERATORS.string;

            return (
              <div key={filter.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                
                {/* Logic Connector Toggle (for 2nd row onwards) */}
                {index > 0 ? (
                  <button
                    onClick={() => handleToggleRowLogic(filter.id)}
                    className={`px-2.5 py-1.5 text-[11px] font-extrabold rounded-lg border transition-all cursor-pointer shrink-0 ${
                      filter.logic === 'OR'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                        : 'bg-rose-100 text-[#C8102E] border-rose-300 hover:bg-rose-200'
                    }`}
                    title="Click to toggle between AND / OR logic"
                  >
                    {filter.logic} ⇅
                  </button>
                ) : (
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg shrink-0 text-center">
                    WHERE
                  </div>
                )}

                {/* Filter Box */}
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center gap-2 shadow-2xs">
                  
                  {/* Field Selector */}
                  <select
                    value={filter.fieldId}
                    onChange={(e) => handleUpdateFilter(filter.id, 'fieldId', e.target.value)}
                    className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#C8102E] focus:outline-hidden cursor-pointer"
                  >
                    {ALL_FIELDS.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>

                  {/* Operator Selector */}
                  <select
                    value={filter.operator}
                    onChange={(e) => handleUpdateFilter(filter.id, 'operator', e.target.value)}
                    className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#C8102E] focus:outline-hidden cursor-pointer"
                  >
                    {operatorsList.map(op => (
                      <option key={op.id} value={op.id}>{op.label}</option>
                    ))}
                  </select>

                  {/* Value Input */}
                  <div className="flex-1 min-w-[160px]">
                    {fieldObj?.type === 'select' ? (
                      <select
                        value={filter.value}
                        onChange={(e) => handleUpdateFilter(filter.id, 'value', e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#C8102E] focus:outline-hidden"
                      >
                        {fieldObj.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : fieldObj?.type === 'number' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={fieldObj.min}
                          max={fieldObj.max}
                          step={fieldObj.step || 1}
                          value={filter.value}
                          onChange={(e) => handleUpdateFilter(filter.id, 'value', Number(e.target.value))}
                          className="w-24 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#C8102E] focus:outline-hidden"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">
                          Range ({fieldObj.min} - {fieldObj.max})
                        </span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={filter.value}
                        onChange={(e) => handleUpdateFilter(filter.id, 'value', e.target.value)}
                        placeholder="Type value..."
                        className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-[#C8102E] focus:outline-hidden placeholder-slate-400"
                      />
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFilter(filter.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Rule Button */}
      {filters.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => handleAddFilterRow()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#C8102E] bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Another Filter Rule
          </button>
          
          <button
            onClick={() => setFilters([])}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
