export const FIELD_CATEGORIES = [
  { id: 'student', name: 'Student Profile', icon: 'User', description: 'Demographics, country preferences & degrees' },
  { id: 'academic', name: 'Academics & Test Scores', icon: 'GraduationCap', description: 'GPAs, standardized test scores & experience' },
  { id: 'funnel', name: 'Counseling & Lead Funnel', icon: 'Kanban', description: 'Counselors assigned, lead stages & sources' },
  { id: 'financial', name: 'Financials & Visa', icon: 'DollarSign', description: 'Tuition budgets, scholarships & visa statuses' }
];

export const ALL_FIELDS = [
  // Student Profile
  { 
    id: 'student_name', 
    label: 'Student Name', 
    category: 'student', 
    type: 'string', 
    icon: 'User',
    defaultInTable: true,
    description: 'Full name of applicant'
  },
  { 
    id: 'target_country', 
    label: 'Target Country', 
    category: 'student', 
    type: 'select', 
    icon: 'Globe',
    options: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore'],
    defaultInTable: true,
    defaultGroupBy: true,
    description: 'Primary destination country for higher studies'
  },
  { 
    id: 'target_intake', 
    label: 'Target Intake', 
    category: 'student', 
    type: 'select', 
    icon: 'Calendar',
    options: ['Fall 2027', 'Spring 2027', 'Fall 2026', 'Spring 2026'],
    defaultInTable: true,
    description: 'Academic term user is applying for'
  },
  { 
    id: 'desired_degree', 
    label: 'Desired Degree', 
    category: 'student', 
    type: 'select', 
    icon: 'Award',
    options: ['Bachelors', 'Masters', 'MBA', 'PhD'],
    defaultInTable: true,
    description: 'Level of study target'
  },
  { 
    id: 'target_major', 
    label: 'Target Major', 
    category: 'student', 
    type: 'select', 
    icon: 'BookOpen',
    options: ['Computer Science', 'Data Science', 'Finance & Business', 'Mechanical Engineering', 'Biotechnology', 'Analytics', 'Public Health'],
    defaultInTable: false,
    description: 'Field of study'
  },

  // Academics & Test Scores
  { 
    id: 'gpa', 
    label: 'GPA Score (4.0 Scale)', 
    category: 'academic', 
    type: 'number', 
    icon: 'CheckCircle',
    min: 2.0, 
    max: 4.0, 
    step: 0.1,
    defaultInTable: true,
    description: 'Undergraduate or High School GPA'
  },
  { 
    id: 'ielts_score', 
    label: 'IELTS Band Score', 
    category: 'academic', 
    type: 'number', 
    icon: 'FileText',
    min: 5.0, 
    max: 9.0, 
    step: 0.5,
    defaultInTable: true,
    description: 'English proficiency IELTS score'
  },
  { 
    id: 'toefl_score', 
    label: 'TOEFL Score', 
    category: 'academic', 
    type: 'number', 
    icon: 'FileText',
    min: 60, 
    max: 120, 
    step: 1,
    defaultInTable: false,
    description: 'English proficiency TOEFL score'
  },
  { 
    id: 'gre_score', 
    label: 'GRE Total Score', 
    category: 'academic', 
    type: 'number', 
    icon: 'Activity',
    min: 280, 
    max: 340, 
    step: 1,
    defaultInTable: true,
    description: 'Graduate Record Exam score'
  },
  { 
    id: 'gmat_score', 
    label: 'GMAT Score', 
    category: 'academic', 
    type: 'number', 
    icon: 'BarChart2',
    min: 500, 
    max: 800, 
    step: 10,
    defaultInTable: false,
    description: 'GMAT score for business school'
  },
  { 
    id: 'work_exp_years', 
    label: 'Work Exp (Years)', 
    category: 'academic', 
    type: 'number', 
    icon: 'Briefcase',
    min: 0, 
    max: 12,
    defaultInTable: false,
    description: 'Years of professional work experience'
  },

  // Counseling & Funnel
  { 
    id: 'lead_source', 
    label: 'Lead Source', 
    category: 'funnel', 
    type: 'select', 
    icon: 'Share2',
    options: ['Education Fair', 'Instagram Ads', 'Website Inquiry', 'High School Seminar', 'Alumni Referral', 'Google Search'],
    defaultInTable: true,
    description: 'Marketing / Acquisition channel'
  },
  { 
    id: 'lead_stage', 
    label: 'Application Stage', 
    category: 'funnel', 
    type: 'select', 
    icon: 'TrendingUp',
    options: ['Inquiry', 'Counseling Started', 'Shortlisting', 'Applications Submitted', 'Offer Received', 'Visa Approved', 'Enrolled'],
    defaultInTable: true,
    defaultGroupBy: false,
    description: 'Current status in counseling journey'
  },
  { 
    id: 'counselor_assigned', 
    label: 'Counselor Assigned', 
    category: 'funnel', 
    type: 'select', 
    icon: 'Users',
    options: ['Ananya Sharma', 'Rahul Verma', 'Priya Nair', 'David Miller', 'Siddharth Patel'],
    defaultInTable: true,
    description: 'Red Pen senior advisor managing applicant'
  },
  { 
    id: 'application_fee', 
    label: 'Application Fees ($)', 
    category: 'funnel', 
    type: 'number', 
    icon: 'CreditCard',
    min: 0, 
    max: 1500,
    defaultInTable: false,
    description: 'Total fee spent on university applications'
  },

  // Financials & Visa
  { 
    id: 'target_budget', 
    label: 'Annual Budget ($k)', 
    category: 'financial', 
    type: 'number', 
    icon: 'DollarSign',
    min: 10, 
    max: 100,
    defaultInTable: true,
    description: 'Student estimated annual budget in USD ($k)'
  },
  { 
    id: 'scholarship_amount', 
    label: 'Scholarship Won ($)', 
    category: 'financial', 
    type: 'number', 
    icon: 'Gift',
    min: 0, 
    max: 50000,
    defaultInTable: true,
    defaultAggregate: 'sum',
    description: 'Scholarship or financial grant secured'
  },
  { 
    id: 'university_applied', 
    label: 'Target University', 
    category: 'financial', 
    type: 'string', 
    icon: 'Building',
    defaultInTable: true,
    description: 'Primary dream university application'
  },
  { 
    id: 'visa_status', 
    label: 'Visa Status', 
    category: 'financial', 
    type: 'select', 
    icon: 'ShieldCheck',
    options: ['Not Started', 'Docs Pending', 'Slot Booked', 'Approved', 'Rejected'],
    defaultInTable: true,
    description: 'Student visa processing status'
  },
  { 
    id: 'admission_decision', 
    label: 'Admission Status', 
    category: 'financial', 
    type: 'select', 
    icon: 'CheckSquare',
    options: ['Admitted', 'Conditional Offer', 'Waitlisted', 'Under Review', 'Rejected'],
    defaultInTable: false,
    description: 'Outcome from university admissions committee'
  }
];

export const FILTER_OPERATORS = {
  string: [
    { id: 'equals', label: 'Equals' },
    { id: 'contains', label: 'Contains' },
    { id: 'not_equals', label: 'Does Not Equal' }
  ],
  select: [
    { id: 'equals', label: 'Is Exactly' },
    { id: 'in_list', label: 'Is One Of' },
    { id: 'not_equals', label: 'Is Not' }
  ],
  number: [
    { id: 'equals', label: '=' },
    { id: 'greater_than', label: '>' },
    { id: 'greater_than_or_equal', label: '≥' },
    { id: 'less_than', label: '<' },
    { id: 'less_than_or_equal', label: '≤' },
    { id: 'between', label: 'Between' }
  ]
};
