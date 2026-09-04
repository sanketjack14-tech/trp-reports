export const PRESET_REPORTS = [
  {
    id: 'preset-1',
    name: 'Fall 2027 High Performers (IELTS ≥ 7.5 & GRE ≥ 315)',
    description: 'Top academic tier candidates targeting Fall 2027 intake with high test scores.',
    category: 'High Potential Students',
    chartType: 'bar',
    columns: ['student_name', 'target_country', 'desired_degree', 'ielts_score', 'gre_score', 'scholarship_amount', 'counselor_assigned', 'visa_status'],
    groupBy: 'target_country',
    aggregateValue: 'scholarship_amount',
    aggregateFunction: 'sum',
    filtersLogic: 'AND',
    filters: [
      { id: 'f1', fieldId: 'target_intake', operator: 'equals', value: 'Fall 2027', logic: 'AND' },
      { id: 'f2', fieldId: 'ielts_score', operator: 'greater_than_or_equal', value: 7.5, logic: 'AND' },
      { id: 'f3', fieldId: 'gre_score', operator: 'greater_than_or_equal', value: 315, logic: 'AND' }
    ]
  },
  {
    id: 'preset-2',
    name: 'Counselor Revenue & Scholarship Distribution',
    description: 'Breakdown of scholarship grants secured and app fees per counselor.',
    category: 'Counselor Performance',
    chartType: 'stacked',
    columns: ['counselor_assigned', 'student_name', 'target_country', 'lead_stage', 'scholarship_amount', 'university_applied'],
    groupBy: 'counselor_assigned',
    aggregateValue: 'scholarship_amount',
    aggregateFunction: 'sum',
    filtersLogic: 'AND',
    filters: [
      { id: 'f1', fieldId: 'lead_stage', operator: 'in_list', value: ['Offer Received', 'Visa Approved', 'Enrolled'], logic: 'AND' }
    ]
  },
  {
    id: 'preset-3',
    name: 'Visa Status Tracker by Country',
    description: 'Track student visa approval, pending docs, and slot bookings across major destinations.',
    category: 'Visa Operations',
    chartType: 'donut',
    columns: ['student_name', 'target_country', 'university_applied', 'visa_status', 'counselor_assigned'],
    groupBy: 'visa_status',
    aggregateValue: 'student_name',
    aggregateFunction: 'count',
    filtersLogic: 'AND',
    filters: []
  },
  {
    id: 'preset-4',
    name: 'USA & UK STEM Applicants (CS, Data Science, Biotech)',
    description: 'Filtered list of applicants aiming for CS/Data/Biotech degrees in the USA or UK.',
    category: 'Target Destination',
    chartType: 'bar',
    columns: ['student_name', 'target_country', 'target_major', 'desired_degree', 'gpa', 'university_applied', 'admission_decision'],
    groupBy: 'target_major',
    aggregateValue: 'gpa',
    aggregateFunction: 'avg',
    filtersLogic: 'AND',
    filters: [
      { id: 'f1', fieldId: 'target_country', operator: 'in_list', value: ['USA', 'UK'], logic: 'AND' },
      { id: 'f2', fieldId: 'target_major', operator: 'in_list', value: ['Computer Science', 'Data Science', 'Biotechnology'], logic: 'AND' }
    ]
  }
];
