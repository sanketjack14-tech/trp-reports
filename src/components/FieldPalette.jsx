import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Check, 
  Columns, 
  Filter, 
  BarChart2,
  ChevronLeft,
  GripVertical,
  Info
} from 'lucide-react';
import { FIELD_CATEGORIES, ALL_FIELDS } from '../data/fieldsData';

export default function FieldPalette({ 
  isOpen, 
  onClose,
  selectedColumns,
  setSelectedColumns,
  groupByField,
  setGroupByField,
  onAddFieldToFilter 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const filteredFields = ALL_FIELDS.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || field.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleColumn = (fieldId) => {
    if (selectedColumns.includes(fieldId)) {
      setSelectedColumns(selectedColumns.filter(id => id !== fieldId));
    } else {
      setSelectedColumns([...selectedColumns, fieldId]);
    }
  };

  const handleDragStart = (e, field) => {
    e.dataTransfer.setData('application/json', JSON.stringify(field));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-105px)] shrink-0 animate-fade-in shadow-xs">
      
      {/* Header */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Drag & Drop Fields</h3>
          <p className="text-[10px] text-slate-400">Drag pills or click check to add</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="p-2.5 border-b border-slate-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fields (e.g. IELTS, Country)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-[#C8102E] focus:outline-hidden text-slate-800"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-100 overflow-x-auto bg-slate-50/50">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-2 py-0.5 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'all' ? 'bg-[#C8102E] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All
        </button>
        {FIELD_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === cat.id ? 'bg-[#C8102E] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Field List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredFields.map(field => {
          const isSelected = selectedColumns.includes(field.id);
          const isGrouped = groupByField === field.id;

          return (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all cursor-grab active:cursor-grabbing group ${
                isSelected 
                  ? 'bg-rose-50/60 border-rose-200 text-slate-900 font-semibold' 
                  : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => toggleColumn(field.id)}
            >
              <div className="flex items-center gap-1.5">
                <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#C8102E] shrink-0" />
                <div className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                  isSelected ? 'bg-[#C8102E] border-[#C8102E] text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5" />}
                </div>
                <span className="truncate">{field.label}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGroupByField(isGrouped ? '' : field.id);
                  }}
                  title={isGrouped ? "Remove Grouping" : "Group Report by this field"}
                  className={`p-1 rounded-md transition-colors ${
                    isGrouped ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <BarChart2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFieldToFilter(field.id);
                  }}
                  title="Add as Filter"
                  className="p-1 text-slate-400 hover:text-[#C8102E] rounded-md transition-colors"
                >
                  <Filter className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-rose-50/40 border-t border-rose-100 text-[10px] text-slate-500 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
        <span>Drag any field pill above onto Table Columns, Grouping, or Filter targets.</span>
      </div>

    </div>
  );
}
