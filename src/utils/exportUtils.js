export function exportToCSV(data, selectedColumns, filename = 'overseas_education_report.csv') {
  if (!data || data.length === 0) return;

  const cols = selectedColumns && selectedColumns.length > 0 ? selectedColumns : Object.keys(data[0]);

  const headers = cols.join(',');
  const rows = data.map(row => {
    return cols.map(c => {
      let val = row[c] ?? '';
      if (typeof val === 'string' && val.includes(',')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data, filename = 'overseas_education_report.json') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
