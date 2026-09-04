import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import FieldPalette from './components/FieldPalette';
import BuilderCanvas from './components/BuilderCanvas';
import FilterBar from './components/FilterBar';
import VisualizationArea from './components/VisualizationArea';
import SaveReportModal from './components/SaveReportModal';

import { ALL_FIELDS } from './data/fieldsData';
import { DUMMY_STUDENTS } from './data/dummyStudentsData';
import { PRESET_REPORTS } from './data/presetReports';
import { filterDataset } from './utils/filterEvaluator';
import { aggregateDataset, computeSummaryMetrics } from './utils/aggregationEngine';
import { exportToCSV } from './utils/exportUtils';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Report State
  const [reportName, setReportName] = useState('Fall 2027 Overseas Admissions Summary');
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [isPaletteOpen, setIsPaletteOpen] = useState(true); // Open by default for instant DND access!
  
  // Columns & Grouping State
  const [selectedColumns, setSelectedColumns] = useState([
    'student_name', 
    'target_country', 
    'desired_degree', 
    'ielts_score', 
    'gre_score', 
    'scholarship_amount', 
    'counselor_assigned', 
    'visa_status'
  ]);
  const [groupByField, setGroupByField] = useState('target_country');
  const [aggregateValue, setAggregateValue] = useState('scholarship_amount');
  const [aggregateFunc, setAggregateFunc] = useState('sum');

  // Filters State
  const [globalLogicMode, setGlobalLogicMode] = useState('AND');
  const [filters, setFilters] = useState([
    { id: 'f_init_1', fieldId: 'target_intake', operator: 'equals', value: 'Fall 2027', logic: 'AND' }
  ]);

  // Modal & Notification State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Preset Selector Loader
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;

    const preset = PRESET_REPORTS.find(p => p.id === presetId);
    if (!preset) return;

    setReportName(preset.name);
    setSelectedColumns(preset.columns || []);
    setGroupByField(preset.groupBy || 'target_country');
    setAggregateValue(preset.aggregateValue || '');
    setAggregateFunc(preset.aggregateFunction || 'count');
    setGlobalLogicMode(preset.filtersLogic || 'AND');
    setFilters(preset.filters || []);
    showToast(`Loaded preset: "${preset.name}"`);
  };

  const handleAddFieldToFilter = (fieldId) => {
    const fObj = ALL_FIELDS.find(f => f.id === fieldId);
    if (!fObj) return;

    const newFilter = {
      id: 'f_' + Date.now(),
      fieldId: fObj.id,
      operator: fObj.type === 'number' ? 'greater_than_or_equal' : 'equals',
      value: fObj.type === 'select' ? (fObj.options[0] || '') : (fObj.type === 'number' ? (fObj.min || 0) : ''),
      logic: 'AND'
    };
    setFilters([...filters, newFilter]);
    showToast(`Added filter rule for ${fObj.label}`);
  };

  const handleAddPresetFilter = (fieldId, operator, value) => {
    const newFilter = {
      id: 'f_' + Date.now(),
      fieldId,
      operator,
      value,
      logic: 'AND'
    };
    setFilters([...filters, newFilter]);
    showToast(`Applied filter: ${fieldId}`);
  };

  const handleResetReport = () => {
    setReportName('Untitled Custom Report');
    setSelectedPresetId('');
    setSelectedColumns(['student_name', 'target_country', 'desired_degree', 'ielts_score', 'counselor_assigned', 'visa_status']);
    setGroupByField('target_country');
    setAggregateValue('scholarship_amount');
    setAggregateFunc('count');
    setGlobalLogicMode('AND');
    setFilters([]);
    showToast('Report reset to defaults');
  };

  // Evaluated dataset in real-time
  const filteredDataset = useMemo(() => {
    return filterDataset(DUMMY_STUDENTS, filters, globalLogicMode);
  }, [filters, globalLogicMode]);

  // Evaluated chart data in real-time
  const chartData = useMemo(() => {
    return aggregateDataset(filteredDataset, groupByField || 'target_country', aggregateValue, aggregateFunc);
  }, [filteredDataset, groupByField, aggregateValue, aggregateFunc]);

  // Evaluated summary metrics in real-time
  const summaryMetrics = useMemo(() => {
    return computeSummaryMetrics(filteredDataset);
  }, [filteredDataset]);

  const handleSaveReport = (metadata) => {
    setReportName(metadata.name);
    showToast(`Report "${metadata.name}" saved successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans antialiased text-slate-800">
      
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        reportName={reportName}
        setReportName={setReportName}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        onExportCSV={() => exportToCSV(filteredDataset, selectedColumns)}
        onResetReport={handleResetReport}
        isPaletteOpen={isPaletteOpen}
        setIsPaletteOpen={setIsPaletteOpen}
        activeFilterCount={filters.length}
      />

      {/* Sleek Horizontal Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        globalLogicMode={globalLogicMode}
        setGlobalLogicMode={setGlobalLogicMode}
        groupByField={groupByField}
        setGroupByField={setGroupByField}
        onAddPresetFilter={handleAddPresetFilter}
      />

      {/* Visual Drag & Drop Target Canvas */}
      <BuilderCanvas
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        groupByField={groupByField}
        setGroupByField={setGroupByField}
        onAddFieldToFilter={handleAddFieldToFilter}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Drag and Drop Field Palette */}
        <FieldPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          groupByField={groupByField}
          setGroupByField={setGroupByField}
          onAddFieldToFilter={handleAddFieldToFilter}
        />

        {/* Clean Report Output Area */}
        <main className="flex-1 overflow-y-auto">
          <VisualizationArea
            chartData={chartData}
            filteredDataset={filteredDataset}
            selectedColumns={selectedColumns}
            groupByField={groupByField}
            aggregateValue={aggregateValue}
            aggregateFunc={aggregateFunc}
            summaryMetrics={summaryMetrics}
          />
        </main>
      </div>

      {/* Save Modal */}
      <SaveReportModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveReport}
        currentReportName={reportName}
      />
    </div>
  );
}
