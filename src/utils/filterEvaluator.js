/**
 * Evaluates a single record against a list of filter rules.
 * Supports row-level AND/OR logic connectors as well as top-level global matching mode.
 */
export function evaluateFilterRule(itemValue, operator, targetValue) {
  if (itemValue === null || itemValue === undefined) return false;

  switch (operator) {
    case 'equals':
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().trim() === String(targetValue).toLowerCase().trim();
      }
      return Number(itemValue) === Number(targetValue);

    case 'not_equals':
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().trim() !== String(targetValue).toLowerCase().trim();
      }
      return Number(itemValue) !== Number(targetValue);

    case 'contains':
      return String(itemValue).toLowerCase().includes(String(targetValue).toLowerCase());

    case 'greater_than':
      return Number(itemValue) > Number(targetValue);

    case 'greater_than_or_equal':
      return Number(itemValue) >= Number(targetValue);

    case 'less_than':
      return Number(itemValue) < Number(targetValue);

    case 'less_than_or_equal':
      return Number(itemValue) <= Number(targetValue);

    case 'between':
      if (Array.isArray(targetValue) && targetValue.length === 2) {
        const val = Number(itemValue);
        return val >= Number(targetValue[0]) && val <= Number(targetValue[1]);
      }
      return true;

    case 'in_list':
      if (Array.isArray(targetValue)) {
        return targetValue.includes(itemValue);
      }
      return String(targetValue).split(',').map(s => s.trim()).includes(String(itemValue));

    default:
      return true;
  }
}

export function filterDataset(dataset, filters, globalLogicMode = 'AND') {
  if (!filters || filters.length === 0) return dataset;

  return dataset.filter(record => {
    // If global logic is AND, all filter conditions (unless chained with OR) must match
    // If global logic is OR, any filter matching will include the record.
    if (globalLogicMode === 'AND') {
      let isMatch = true;
      for (let i = 0; i < filters.length; i++) {
        const f = filters[i];
        if (!f.fieldId || f.value === undefined || f.value === '' || (Array.isArray(f.value) && f.value.length === 0)) {
          continue; // skip incomplete filter inputs
        }
        
        const recordVal = record[f.fieldId];
        const rulePassed = evaluateFilterRule(recordVal, f.operator, f.value);

        // Check if row has an explicit connector (AND / OR)
        const rowLogic = f.logic || 'AND';
        if (i === 0) {
          isMatch = rulePassed;
        } else {
          if (rowLogic === 'OR') {
            isMatch = isMatch || rulePassed;
          } else {
            isMatch = isMatch && rulePassed;
          }
        }
      }
      return isMatch;
    } else {
      // Global OR mode
      let isMatch = false;
      for (let i = 0; i < filters.length; i++) {
        const f = filters[i];
        if (!f.fieldId || f.value === undefined || f.value === '' || (Array.isArray(f.value) && f.value.length === 0)) {
          continue;
        }

        const recordVal = record[f.fieldId];
        const rulePassed = evaluateFilterRule(recordVal, f.operator, f.value);
        if (rulePassed) {
          return true;
        }
      }
      return filters.length === 0 ? true : isMatch;
    }
  });
}
