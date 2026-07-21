import { PageConfig, PlannerState } from '../types';

export const PAGES: PageConfig[] = [
  // Year Planning
  { id: 1, title: 'Planner Cover Page', type: 'cover_page', section: 'Year Planning', desc: "Execute Personal Planner cover sheet." },
  { id: 2, title: 'Annual Vision & Goals', type: 'annual_vision', section: 'Year Planning', desc: 'Declare your primary targets across key pillars of life and operation.' },
  { id: 3, title: '2027 Year Horizon Map', type: 'year_horizon', section: 'Year Planning', desc: 'Your entire high-level roadmap and structural alignment mapped out at a single glance.' },
  { id: 4, title: 'Quarterly Strategy Roadmap', type: 'quarterly_roadmap', section: 'Year Planning', q: 1, desc: 'Breakdown your strategic vision into quarterly, manageable sprints.' },
  { id: 5, title: 'System Performance OKRs', type: 'system_performance', section: 'Year Planning', desc: 'Configure strict annual operational metrics and milestone scorecards.' },
  
  // Monthly Dashboards
  { id: 6, title: 'January Monthly Dashboard', type: 'monthly_dashboard', month: 'January', num: '01', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for January.' },
  { id: 7, title: 'February Monthly Dashboard', type: 'monthly_dashboard', month: 'February', num: '02', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for February.' },
  { id: 8, title: 'March Monthly Dashboard', type: 'monthly_dashboard', month: 'March', num: '03', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for March.' },
  { id: 9, title: 'April Monthly Dashboard', type: 'monthly_dashboard', month: 'April', num: '04', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for April.' },
  { id: 10, title: 'May Monthly Dashboard', type: 'monthly_dashboard', month: 'May', num: '05', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for May.' },
  { id: 11, title: 'June Monthly Dashboard', type: 'monthly_dashboard', month: 'June', num: '06', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for June.' },
  { id: 12, title: 'July Monthly Dashboard', type: 'monthly_dashboard', month: 'July', num: '07', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for July.' },
  { id: 13, title: 'August Monthly Dashboard', type: 'monthly_dashboard', month: 'August', num: '08', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for August.' },
  { id: 14, title: 'September Monthly Dashboard', type: 'monthly_dashboard', month: 'September', num: '09', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for September.' },
  { id: 15, title: 'October Monthly Dashboard', type: 'monthly_dashboard', month: 'October', num: '10', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for October.' },
  { id: 16, title: 'November Monthly Dashboard', type: 'monthly_dashboard', month: 'November', num: '11', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for November.' },
  { id: 17, title: 'December Monthly Dashboard', type: 'monthly_dashboard', month: 'December', num: '12', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot for December.' },

  // Weekly Planning
  { id: 18, title: 'Weekly Planning Roadmap', type: 'weekly_planning_roadmaps', section: 'Weekly Planning', desc: 'Map out weekly priorities, day-by-day focus notes, and review checklists.' },

  // Daily Planning
  { id: 19, title: 'Daily Command Center', type: 'daily_command_center', section: 'Daily Planning', desc: 'Hour-by-hour operational timeline, morning journal, and core checklist.' },

  // Project Management
  { id: 20, title: 'Projects Portfolio Meter', type: 'projects_portfolio', section: 'Project Management', desc: 'Unified view of all strategic projects, completion percentages, and due milestones.' },
  { id: 21, title: 'Project Audit & Lessons', type: 'portfolio_audit', section: 'Project Management', desc: 'Diagnose project blockages and write structured action mitigations.' },

  // Reviews (placed in Year Planning section)
  { id: 22, title: 'Life Balance Wheel Review', type: 'life_balance_wheel', section: 'Year Planning', desc: 'Drag the scores and map your balanced scorecard rating coordinates.' },
  { id: 23, title: 'Next Year Blueprint', type: 'next_year_blueprint', section: 'Year Planning', desc: 'Set up future vision pillars, declarations, and transition milestones.' },
  { id: 24, title: 'Year Review Summary', type: 'year_review_summary', section: 'Year Planning', desc: 'Formulate your year-end retrospective and sign off your commitments.' }
];

export function getInitialPlannerState(): PlannerState {
  return {
    annualGoals: [
      { pillar: '01', milestone: 'Scale annual business revenue to targets', progress: 85 }, // Note: we'll render these columns perfectly matching Screenshot 2
      { pillar: '02', milestone: 'Maintain sub 12% body fat & athletic standard', progress: 80 },
      { pillar: '03', milestone: 'Read 24 business, tech & psychology books', progress: 25 },
      { pillar: '04', milestone: 'Complete Advanced System Architecture Course', progress: 0 }
    ],
    projects: [
      { name: 'Q3 Revenue Initiative', status: 'In Progress', due: 'Q3 End', pct: 65 },
      { name: 'App UI Redesign', status: 'In Progress', due: 'Ongoing', pct: 30 },
      { name: 'Athletic Optimization', status: 'In Progress', due: 'Dec 15', pct: 85 },
      { name: 'Financial Pipeline Sync', status: 'Completed', due: 'Q2 End', pct: 100 }
    ],
    dailyTasks: [
      { time: '05:00 - 06:00', text: 'Initiation & Morning Intention Setup' },
      { time: '06:00 - 08:30', text: 'DEEP WORK SPRINT [Project Prototype Deployment]' },
      { time: '08:30 - 09:30', text: 'Athletic Training Protocol Block' },
      { time: '09:30 - 12:00', text: 'Team Sync Meetings & Inbox Pipeline Clearance' },
      { time: '12:00 - 13:00', text: 'Structured Strategy Reflection Checkpoint' },
      { time: '13:00 - 17:00', text: 'Secondary Execution Sprint & Client Review Work' }
    ],
    yearScores: {
      productivity: 65,
      happiness: 70,
      health: 85,
      financial: 55,
      relationships: 75,
      growth: 90,
      fun: 60,
      environment: 80
    },
    customTexts: {
      // Cover Metadata
      'cover_owner': 'John Doe',
      'cover_year': '2027',
      'cover_start': '01/01/2027',
      'cover_end': '12/31/2027',

      // Annual Vision and Goals extra fields (Success Metrics)
      'vision_metric_revenue': '$150,000',
      'vision_metric_savings': '$45,000',
      'vision_metric_fitness': '< 12%',
      'vision_metric_countries': '4 Visited',
      'vision_words': 'SYSTEMS, DISCIPLINE, REVENUE',

      // Year Horizon
      'horizon_north_star': 'Become the type of person who executes flawlessly every day with standardized high-performance habits.',
      'horizon_mission': 'Launch version 2 of POS-Productivity toolkit and secure 3 strategic brand partners before Q3.',

      // Quarterly roadmap
      'q1_focus': 'Core infrastructure setup, app logic design, client proposal iterations.',
      'q1_m1': 'Tech stack selection', 'q1_m1_done': 'true',
      'q1_m2': 'Client contract signed', 'q1_m2_done': 'true',
      'q1_status': '100',

      'q2_focus': 'Core system deployment, initial product beta launch, performance testing.',
      'q2_m1': 'Beta user testing', 'q2_m1_done': 'true',
      'q2_m2': 'Production deployment', 'q2_m2_done': 'false',
      'q2_status': '45',

      'q3_focus': 'Active monetization scaling, business development & pipeline execution.',
      'q3_m1': 'Scale advertising spend', 'q3_m1_done': 'false',
      'q3_m2': 'Affiliate partnership integration', 'q3_m2_done': 'false',
      'q3_status': '0',

      'q4_focus': 'Comprehensive systems audits, strategic analysis, next-year plan preparation.',
      'q4_m1': 'Year-end portfolio review', 'q4_m1_done': 'false',
      'q4_m2': 'Financial projection sync', 'q4_m2_done': 'false',
      'q4_status': '0',

      // Projects Portfolio extra
      'projects_stat_active': '5 Projects',
      'projects_stat_completed': '3 Projects',
      'projects_stat_delayed': '1 Project',
      'projects_stat_rate': '72%',
      'projects_quarter_focus': 'REVENUE SYSTEM DEPLOYMENT',

      // Daily Command Center extra
      'daily_mission': 'Finalize functional database architecture and deploy to secure staging platform.',
      'daily_sleep': '7.5 Hours',
      'daily_water': '3 Liters',
      'daily_energy': 'Optimal',
      'daily_focus': 'High',
      'daily_act_1': 'Execute Database Dry Runs', 'daily_act_1_done': 'true',
      'daily_act_2': 'Complete Team Standup Loop', 'daily_act_2_done': 'true',
      'daily_act_3': 'Update Budget Pipeline Tracker', 'daily_act_3_done': 'false',
      'daily_completion_score': '85%',

      // Weekly Roadmaps
      'w1_focus': 'Prototype architecture, draft schema patterns, establish endpoints.',
      'w1_p1': 'DB Setup', 'w1_p2': 'Auth Module', 'w1_status': 'Completed',
      
      'w2_focus': 'Design system, core UI grids implementation, logic functions.',
      'w2_p1': 'Component Kit', 'w2_p2': 'Responsive Layout', 'w2_status': 'Completed',
      
      'w3_focus': 'Integrate API connections, run system audits, optimize slow queries.',
      'w3_p1': 'API Connection', 'w3_p2': 'Query Speed Check', 'w3_status': 'In Progress',
      
      'w4_focus': 'Perform production dry runs, launch closed testing, document code.',
      'w4_p1': 'Secure Testing', 'w4_p2': 'Code Review', 'w4_status': 'Planned',
      
      'w5_focus': 'Initiate strategic retrospectives, plan next cycle metrics and sprints.',
      'w5_p1': 'Retrospective Loop', 'w5_p2': 'Next Cycle Setup', 'w5_status': 'Planned',

      // Monthly Dashboard January
      'month_priority_1': 'Deploy tech stack prototype', 'month_priority_1_done': 'true',
      'month_priority_2': 'Refine target metrics', 'month_priority_2_done': 'true',
      'month_priority_3': 'Initiate athletic protocol', 'month_priority_3_done': 'false',
      'month_priority_4': 'Clear personal blockers', 'month_priority_4_done': 'false',
      'month_priority_5': 'Outline content roadmap', 'month_priority_5_done': 'false',
      'month_biz_goal': 'BUSINESS: System beta complete.',
      'month_fin_goal': 'FINANCE: Save $3,000 baseline.',
      'month_pers_goal': 'PERSONAL: Read 2 classic biographies.',
      'month_budget_planned': '$4,200',
      'month_budget_actual': '$3,850',
      'month_budget_saved': '$1,200',

      // Life Balance Breakdown & Priority
      'life_breakdown_health': '8.5 / 10',
      'life_breakdown_career': '7.0 / 10',
      'life_breakdown_finance': '6.5 / 10',
      'life_blueprint_priority': 'Address shortfalls in the Finance sector immediately by executing secondary revenue pipelines and capping discretionary outflows.',
      'life_year_progress_ratio': '76%',

      // Next Year Blueprint
      'next_personal_health': 'Establish solid foundations for physical stamina. Transition into specialized endurance parameters.',
      'next_personal_intent_1': 'Complete marathon cycle', 'next_personal_intent_1_done': 'false',
      'next_personal_intent_2': 'Adopt clean pescatarian plan', 'next_personal_intent_2_done': 'false',
      'next_personal_status': 'TARGETED',

      'next_relations_community': 'Devote specific hours to mastermind networks, strategic client cohorts, and value-driven local ecosystems.',
      'next_relations_intent_1': 'Launch strategic community', 'next_relations_intent_1_done': 'false',
      'next_relations_intent_2': 'Plan bi-monthly sync meets', 'next_relations_intent_2_done': 'false',
      'next_relations_status': 'TARGETED',

      'next_career_finance': 'Expand target market penetration. Maximize passive dividend assets, automate secondary portfolio growth.',
      'next_career_intent_1': 'Create $50k asset pool', 'next_career_intent_1_done': 'false',
      'next_career_intent_2': 'Author comprehensive ebook', 'next_career_intent_2_done': 'false',
      'next_career_status': 'DECLARED',

      // Year Review Summary
      'review_win_1_title': 'System Framework Architecture Complete:',
      'review_win_1_desc': 'Deployed v2 system prototype 3 weeks ahead of scheduled timeline.',
      'review_win_2_title': 'Revenue Milestone Secured:',
      'review_win_2_desc': 'Unlocked additional secondary client pipeline values by Q3.',
      'review_win_3_title': 'Athletic Strategy Optimization:',
      'review_win_3_desc': 'Achieved target index body parameter configurations.',
      'review_perspective': 'RETROSPECTIVE PERSPECTIVE: Establishing automated planning loops significantly improved consistent execution discipline across multiple projects.',
      'review_commitment_text': 'I hereby sign off this operational cycle and commit to executing the next set of strategies with identical rigor.',
      'review_signature_date': '12 / 31 / 2027'
    }
  };
}
