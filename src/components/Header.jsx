import React from 'react';
import { 
  Bookmark, 
  Download, 
  Save, 
  SlidersHorizontal,
  FolderKanban,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { PRESET_REPORTS } from '../data/presetReports';

export default function Header({ 
  reportName, 
  setReportName, 
  selectedPresetId, 
  onSelectPreset, 
  onOpenSaveModal, 
  onExportCSV, 
  onResetReport,
  isPaletteOpen,
  setIsPaletteOpen,
  activeFilterCount
}) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Report Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C8102E] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            RP
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#C8102E] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              The Red Pen
            </span>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Report Title..."
              className="text-sm font-bold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-[#C8102E] focus:outline-hidden bg-transparent px-1 py-0.5 w-64 sm:w-80 transition-colors"
            />
          </div>
        </div>

        {/* Center: Presets & Controls */}
        <div className="flex items-center gap-2">
          {/* Collapsible Palette Toggle */}
          <button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isPaletteOpen 
                ? 'bg-rose-50 text-[#C8102E] border-rose-200' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Fields</span>
          </button>

          {/* Preset Selector */}
          <div className="relative flex items-center">
            <select
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="">-- Load Saved Report --</option>
              {PRESET_REPORTS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetReport}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Report"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#C8102E] hover:bg-[#A00C23] rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Report
          </button>
        </div>

      </div>
    </header>
  );
}
