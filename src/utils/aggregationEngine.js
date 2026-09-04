export function aggregateDataset(dataset, groupByField, aggregateValueField, aggregateFunc = 'count') {
  if (!dataset || dataset.length === 0) return [];

  const groups = {};

  dataset.forEach(item => {
    const rawGroupKey = item[groupByField];
    const groupKey = rawGroupKey !== undefined && rawGroupKey !== null ? String(rawGroupKey) : 'Unspecified';

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });

  const result = Object.keys(groups).map(key => {
    const items = groups[key];
    let val = 0;

    if (aggregateFunc === 'count') {
      val = items.length;
    } else if (aggregateValueField) {
      const numValues = items
        .map(it => Number(it[aggregateValueField]))
        .filter(n => !isNaN(n));

      if (numValues.length > 0) {
        if (aggregateFunc === 'sum') {
          val = numValues.reduce((acc, curr) => acc + curr, 0);
        } else if (aggregateFunc === 'avg') {
          val = numValues.reduce((acc, curr) => acc + curr, 0) / numValues.length;
          val = Math.round(val * 100) / 100;
        } else if (aggregateFunc === 'max') {
          val = Math.max(...numValues);
        } else if (aggregateFunc === 'min') {
          val = Math.min(...numValues);
        }
      }
    }

    return {
      name: key,
      value: val,
      count: items.length
    };
  });

  // Sort descending by value
  return result.sort((a, b) => b.value - a.value);
}

export function computeSummaryMetrics(dataset) {
  if (!dataset || dataset.length === 0) {
    return {
      totalStudents: 0,
      avgGre: 0,
      avgIelts: 0,
      totalScholarships: 0,
      visaApprovalRate: 0,
      totalApplicationsFee: 0
    };
  }

  const totalStudents = dataset.length;

  const greValues = dataset.map(d => d.gre_score).filter(Boolean);
  const avgGre = greValues.length > 0 
    ? Math.round(greValues.reduce((a, b) => a + b, 0) / greValues.length) 
    : 0;

  const ieltsValues = dataset.map(d => d.ielts_score).filter(Boolean);
  const avgIelts = ieltsValues.length > 0 
    ? (ieltsValues.reduce((a, b) => a + b, 0) / ieltsValues.length).toFixed(1) 
    : 0;

  const totalScholarships = dataset.reduce((acc, d) => acc + (d.scholarship_amount || 0), 0);

  const approvedVisas = dataset.filter(d => d.visa_status === 'Approved').length;
  const visaApprovalRate = totalStudents > 0 ? Math.round((approvedVisas / totalStudents) * 100) : 0;

  const totalApplicationsFee = dataset.reduce((acc, d) => acc + (d.application_fee || 0), 0);

  return {
    totalStudents,
    avgGre,
    avgIelts,
    totalScholarships,
    visaApprovalRate,
    totalApplicationsFee
  };
}
