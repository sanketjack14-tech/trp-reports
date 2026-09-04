import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  LineChart as LineIcon, 
  PieChart as PieIcon, 
  Layers, 
  Table as TableIcon, 
  Search, 
  ArrowUpDown,
  Download,
  Info,
  Sparkles
} from 'lucide-react';
import { ALL_FIELDS } from '../data/fieldsData';

const COLORS = ['#C8102E', '#0F172A', '#2563EB', '#059669', '#D97706', '#9333EA', '#DC2626', '#475569'];

export default function VisualizationArea({
  chartData,
  filteredDataset,
  selectedColumns,
  groupByField,
  aggregateValue,
  aggregateFunc,
  summaryMetrics
}) {
  const [tableSearch, setTableSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'chart', 'split'
  const [subChartType, setSubChartType] = useState('bar');
  const pageSize = 12;

  const getFieldLabel = (id) => ALL_FIELDS.find(f => f.id === id)?.label || id;

  // Filtered dataset for table view
  const tableData = filteredDataset.filter(item => {
    if (!tableSearch) return true;
    const searchLower = tableSearch.toLowerCase();
    return Object.values(item).some(val => 
      val !== null && val !== undefined && String(val).toLowerCase().includes(searchLower)
    );
  });

  // Sorting logic
  const sortedTableData = [...tableData].sort((a, b) => {
    if (!sortColumn) return 0;
    let aVal = a[sortColumn] ?? '';
    let bVal = b[sortColumn] ?? '';

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal)) 
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sortedTableData.length / pageSize) || 1;
  const paginatedData = sortedTableData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (colId) => {
    if (sortColumn === colId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colId);
      setSortDirection('asc');
    }
  };

  const computeColumnSummary = (colId) => {
    if (filteredDataset.length === 0) return '-';
    
    if (colId === 'scholarship_amount' || colId === 'application_fee') {
      const sum = filteredDataset.reduce((acc, row) => acc + (Number(row[colId]) || 0), 0);
      return `$${sum.toLocaleString()}`;
    }
    if (colId === 'gre_score' || colId === 'gpa' || colId === 'ielts_score') {
      const nums = filteredDataset.map(row => Number(row[colId])).filter(n => !isNaN(n) && n > 0);
      if (nums.length === 0) return '-';
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      return `Avg: ${avg.toFixed(1)}`;
    }
    if (colId === 'student_name') {
      return `${filteredDataset.length} Applicants`;
    }
    return '';
  };

  const renderChartElement = (type) => {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-16 text-slate-400">
          <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">No data matches active filters.</p>
        </div>
      );
    }

    if (type === 'bar') {
      return (
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px' }} />
              <Bar dataKey="value" name={`${aggregateFunc.toUpperCase()} ${getFieldLabel(aggregateValue || '')}`} fill="#C8102E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'line') {
      return (
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#C8102E" strokeWidth={2.5} dot={{ r: 4, fill: '#C8102E' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'donut') {
      return (
        <div className="h-[360px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={115}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'stacked') {
      return (
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px' }} />
              <Bar dataKey="value" name="Metric Value" fill="#C8102E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="count" name="Applicant Count" fill="#0F172A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-4">
      
      {/* Top Inline KPI Metric Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-3.5 px-5 shadow-2xs">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Applicants</div>
            <div className="text-base font-extrabold text-slate-900">{summaryMetrics.totalStudents}</div>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg GRE Score</div>
            <div className="text-base font-extrabold text-slate-900">{summaryMetrics.avgGre || 'N/A'}</div>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg IELTS Band</div>
            <div className="text-base font-extrabold text-slate-900">{summaryMetrics.avgIelts || 'N/A'}</div>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scholarships Won</div>
            <div className="text-base font-extrabold text-emerald-700">${(summaryMetrics.totalScholarships / 1000).toFixed(0)}k</div>
          </div>
          <div className="h-7 w-px bg-slate-200 hidden md:block" />
          <div className="hidden md:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visa Success</div>
            <div className="text-base font-extrabold text-blue-700">{summaryMetrics.visaApprovalRate}%</div>
          </div>
        </div>

        {/* Primary View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-[#C8102E]" />
            Tabular Data
          </button>
          
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'chart' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#C8102E]" />
            Charts
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#C8102E]" />
            Split View
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs p-4 sm:p-5">

        {/* CHART SELECTION SUB-BAR (if chart or split mode) */}
        {(viewMode === 'chart' || viewMode === 'split') && (
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="text-xs font-bold text-slate-800">
              Graph Breakdown by <span className="text-[#C8102E]">{getFieldLabel(groupByField || 'target_country')}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSubChartType('bar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${subChartType === 'bar' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Bar
              </button>
              <button
                onClick={() => setSubChartType('line')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${subChartType === 'line' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Line
              </button>
              <button
                onClick={() => setSubChartType('donut')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${subChartType === 'donut' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Donut
              </button>
              <button
                onClick={() => setSubChartType('stacked')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${subChartType === 'stacked' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Stacked
              </button>
            </div>
          </div>
        )}

        {/* TABULAR DATA VIEW (CLEAN & SIMPLE) */}
        {viewMode === 'table' && (
          <div className="space-y-4">
            
            {/* Table Search & Record Count Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter rows..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-[#C8102E] focus:outline-hidden"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Showing <strong>{sortedTableData.length}</strong> matching rows
              </div>
            </div>

            {/* Clean Data Table */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3 w-10 text-center text-slate-400">#</th>
                    {selectedColumns.map(colId => (
                      <th 
                        key={colId}
                        onClick={() => handleSort(colId)}
                        className="p-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          {getFieldLabel(colId)}
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={selectedColumns.length + 1} className="p-8 text-center text-slate-400">
                        No rows match active search/filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row, idx) => {
                      const rowNum = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr key={row.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{rowNum}</td>
                          {selectedColumns.map(colId => {
                            const val = row[colId];
                            return (
                              <td key={colId} className="p-3 whitespace-nowrap font-medium text-slate-800">
                                {colId === 'visa_status' ? (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    val === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    val === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}>
                                    {val}
                                  </span>
                                ) : colId === 'scholarship_amount' ? (
                                  <span className="font-bold text-emerald-700">
                                    ${Number(val || 0).toLocaleString()}
                                  </span>
                                ) : (
                                  val ?? '-'
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* Footer Rollup Summary */}
                {paginatedData.length > 0 && (
                  <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-slate-900 font-bold text-xs">
                    <tr>
                      <td className="p-3 text-center text-slate-400">Summary</td>
                      {selectedColumns.map(colId => (
                        <td key={colId} className="p-3 whitespace-nowrap text-[#C8102E]">
                          {computeColumnSummary(colId)}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
                <div>Page <strong>{currentPage}</strong> of {totalPages}</div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-medium"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* CHART VIEW */}
        {viewMode === 'chart' && renderChartElement(subChartType)}

        {/* SPLIT VIEW */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 overflow-x-auto">
              <div className="text-xs font-bold text-slate-800 mb-2">📋 Tabular Data Preview</div>
              <table className="w-full text-left text-[11px] text-slate-700 bg-white border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold">
                  <tr>
                    {selectedColumns.slice(0, 4).map(colId => (
                      <th key={colId} className="p-2 whitespace-nowrap">{getFieldLabel(colId)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDataset.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      {selectedColumns.slice(0, 4).map(colId => (
                        <td key={colId} className="p-2 whitespace-nowrap">{row[colId] ?? '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30">
              <div className="text-xs font-bold text-slate-800 mb-2">📊 Graph ({subChartType.toUpperCase()})</div>
              {renderChartElement(subChartType)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
