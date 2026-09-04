import React, { useState } from 'react';
import { 
  Columns, 
  Layers, 
  Filter, 
  X, 
  GripVertical, 
  BarChart2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ALL_FIELDS } from '../data/fieldsData';

export default function BuilderCanvas({
  selectedColumns,
  setSelectedColumns,
  groupByField,
  setGroupByField,
  onAddFieldToFilter
}) {
  const [activeDragTarget, setActiveDragTarget] = useState(null);

  const getFieldObj = (id) => ALL_FIELDS.find(f => f.id === id);

  const handleDragOver = (e, targetName) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (activeDragTarget !== targetName) {
      setActiveDragTarget(targetName);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setActiveDragTarget(null);
  };

  const handleDrop = (e, targetName) => {
    e.preventDefault();
    setActiveDragTarget(null);

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const field = JSON.parse(data);
      if (!field || !field.id) return;

      if (targetName === 'columns') {
        if (!selectedColumns.includes(field.id)) {
          setSelectedColumns([...selectedColumns, field.id]);
        }
      } else if (targetName === 'groupBy') {
        setGroupByField(field.id);
      } else if (targetName === 'filter') {
        onAddFieldToFilter(field.id);
      }
    } catch (err) {
      console.error("Drop error", err);
    }
  };

  const removeColumn = (colId) => {
    setSelectedColumns(selectedColumns.filter(c => c !== colId));
  };

  return (
    <div className="bg-white border-b border-slate-200/80 p-3 px-4">
      <div className="max-w-[1600px] mx-auto space-y-2">
        
        {/* Header Helper Line */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8102E]" />
            Drag & Drop Report Canvas
          </span>
          <span className="text-[11px]">
            Drag fields from the left palette directly into the drop targets below:
          </span>
        </div>

        {/* 3 Clean Drag & Drop Targets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          {/* Target 1: Columns Drop Zone */}
          <div
            onDragOver={(e) => handleDragOver(e, 'columns')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'columns')}
            className={`p-2.5 rounded-xl border transition-all ${
              activeDragTarget === 'columns'
                ? 'border-[#C8102E] bg-rose-50 ring-2 ring-rose-200 shadow-sm'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Columns className="w-3.5 h-3.5 text-[#C8102E]" />
                1. Table Columns ({selectedColumns.length})
              </span>
              {selectedColumns.length > 0 && (
                <button 
                  onClick={() => setSelectedColumns([])}
                  className="text-[10px] text-slate-400 hover:text-rose-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1 min-h-[36px] items-center">
              {selectedColumns.length === 0 ? (
                <div className="text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg w-full py-1.5 text-center bg-white">
                  Drop fields here to add table columns
                </div>
              ) : (
                selectedColumns.map(colId => (
                  <span
                    key={colId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-800 shadow-2xs"
                  >
                    <span>{getFieldObj(colId)?.label || colId}</span>
                    <button onClick={() => removeColumn(colId)} className="text-slate-400 hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Target 2: Group By Drop Zone */}
          <div
            onDragOver={(e) => handleDragOver(e, 'groupBy')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'groupBy')}
            className={`p-2.5 rounded-xl border transition-all ${
              activeDragTarget === 'groupBy'
                ? 'border-[#C8102E] bg-rose-50 ring-2 ring-rose-200 shadow-sm'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-[#C8102E]" />
                2. Group / Slice Chart
              </span>
            </div>

            <div className="min-h-[36px] flex items-center">
              {groupByField ? (
                <div className="flex items-center justify-between w-full p-1.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-800">
                  <span>Grouped by: <strong className="text-[#C8102E]">{getFieldObj(groupByField)?.label}</strong></span>
                  <button onClick={() => setGroupByField('')} className="text-slate-400 hover:text-rose-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg w-full py-1.5 text-center bg-white">
                  Drop field here to group graph (e.g., Country)
                </div>
              )}
            </div>
          </div>

          {/* Target 3: Quick Filter Drop Zone */}
          <div
            onDragOver={(e) => handleDragOver(e, 'filter')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'filter')}
            className={`p-2.5 rounded-xl border transition-all ${
              activeDragTarget === 'filter'
                ? 'border-[#C8102E] bg-rose-50 ring-2 ring-rose-200 shadow-sm'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#C8102E]" />
                3. Create Filter Rule
              </span>
            </div>

            <div className="min-h-[36px] flex items-center justify-center border border-dashed border-rose-200 rounded-lg bg-rose-50/40 text-center p-1">
              <span className="text-[11px] font-bold text-[#C8102E]">
                + Drop any field here to filter
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
