import { PageConfig, PlannerState } from '../types';

export const PAGES: PageConfig[] = [
  // Year Planning
  { id: 2, title: 'Year Plan', type: 'annual_vision', section: 'Year Planning', desc: 'Listing goals, projects, and financial objectives for the year.' },
  
  // Monthly Dashboards
  { id: 6, title: 'Monthly Dashboard', type: 'monthly_dashboard', month: 'January', num: '01', section: 'Monthly Dashboards', desc: 'Priorities, calendar, habit sync levels, and monthly budget snapshot.' },

  // Weekly Planning
  { id: 18, title: 'Weekly Planning Roadmap', type: 'weekly_planning_roadmaps', section: 'Weekly Planning', desc: 'Map out weekly priorities, day-by-day focus notes, and review checklists.' },

  // Daily Planning
  { id: 19, title: 'Daily Command Center', type: 'daily_command_center', section: 'Daily Planning', desc: 'Hour-by-hour operational timeline, morning journal, and core checklist.' },

  // Project Management
  { id: 20, title: 'Projects Portfolio Meter', type: 'projects_portfolio', section: 'Project Management', desc: 'Unified view of all strategic projects, completion percentages, and due milestones.' },
  { id: 21, title: 'Project Audit & Lessons', type: 'portfolio_audit', section: 'Project Management', desc: 'Diagnose project blockages and write structured action mitigations.' }
];

export function getInitialPlannerState(): PlannerState {
  return {
    annualGoals: [
      { pillar: '01', milestone: '', progress: 0 },
      { pillar: '02', milestone: '', progress: 0 },
      { pillar: '03', milestone: '', progress: 0 }
    ],
    projects: [
      { name: '', status: 'Planning', due: '', pct: 0 },
      { name: '', status: 'Planning', due: '', pct: 0 },
      { name: '', status: 'Planning', due: '', pct: 0 },
      { name: '', status: 'Planning', due: '', pct: 0 }
    ],
    dailyTasks: [
      { time: '05:00 - 06:00', text: '' },
      { time: '06:00 - 08:30', text: '' },
      { time: '08:30 - 09:30', text: '' },
      { time: '09:30 - 12:00', text: '' },
      { time: '12:00 - 13:00', text: '' },
      { time: '13:00 - 17:00', text: '' }
    ],
    yearScores: {
      productivity: 0,
      happiness: 0,
      health: 0,
      financial: 0,
      relationships: 0,
      growth: 0,
      fun: 0,
      environment: 0
    },
    customTexts: {
      // Cover Metadata
      'cover_owner': '',
      'cover_year': '2026',
      'cover_start': '01/01/2026',
      'cover_end': '12/31/2026',

      // Annual Vision and Goals extra fields (Success Metrics)
      'vision_metric_revenue': '',
      'vision_metric_savings': '',
      'vision_metric_fitness': '',
      'vision_metric_countries': '',
      'vision_words': '',

      // Year Horizon
      'horizon_north_star': '',
      'horizon_mission': '',

      // Quarterly roadmap
      'q1_focus': '',
      'q1_m1': '', 'q1_m1_done': 'false',
      'q1_m2': '', 'q1_m2_done': 'false',
      'q1_status': '0',

      'q2_focus': '',
      'q2_m1': '', 'q2_m1_done': 'false',
      'q2_m2': '', 'q2_m2_done': 'false',
      'q2_status': '0',

      'q3_focus': '',
      'q3_m1': '', 'q3_m1_done': 'false',
      'q3_m2': '', 'q3_m2_done': 'false',
      'q3_status': '0',

      'q4_focus': '',
      'q4_m1': '', 'q4_m1_done': 'false',
      'q4_m2': '', 'q4_m2_done': 'false',
      'q4_status': '0',

      // Projects Portfolio extra
      'projects_stat_active': '',
      'projects_stat_completed': '',
      'projects_stat_delayed': '',
      'projects_stat_rate': '',
      'projects_quarter_focus': '',

      // Daily Command Center extra
      'daily_mission': '',
      'daily_sleep': '',
      'daily_water': '',
      'daily_energy': '',
      'daily_focus': '',
      'daily_act_1': '', 'daily_act_1_done': 'false',
      'daily_act_2': '', 'daily_act_2_done': 'false',
      'daily_act_3': '', 'daily_act_3_done': 'false',
      'daily_completion_score': '',

      // Weekly Roadmaps
      'w1_focus': '', 'w1_p1': '', 'w1_p2': '', 'w1_status': 'Planned',
      'w2_focus': '', 'w2_p1': '', 'w2_p2': '', 'w2_status': 'Planned',
      'w3_focus': '', 'w3_p1': '', 'w3_p2': '', 'w3_status': 'Planned',
      'w4_focus': '', 'w4_p1': '', 'w4_p2': '', 'w4_status': 'Planned',
      'w5_focus': '', 'w5_p1': '', 'w5_p2': '', 'w5_status': 'Planned',

      // Monthly Dashboard January
      'month_priority_1': '', 'month_priority_1_done': 'false',
      'month_priority_2': '', 'month_priority_2_done': 'false',
      'month_priority_3': '', 'month_priority_3_done': 'false',
      'month_priority_4': '', 'month_priority_4_done': 'false',
      'month_priority_5': '', 'month_priority_5_done': 'false',
      'month_biz_goal': '',
      'month_fin_goal': '',
      'month_pers_goal': '',
      'month_budget_planned': '',
      'month_budget_actual': '',
      'month_budget_saved': '',

      // Life Balance Breakdown & Priority
      'life_breakdown_health': '',
      'life_breakdown_career': '',
      'life_breakdown_finance': '',
      'life_blueprint_priority': '',
      'life_year_progress_ratio': '',

      // Next Year Blueprint
      'next_personal_health': '',
      'next_personal_intent_1': '', 'next_personal_intent_1_done': 'false',
      'next_personal_intent_2': '', 'next_personal_intent_2_done': 'false',
      'next_personal_status': 'Planned',

      'next_relations_community': '',
      'next_relations_intent_1': '', 'next_relations_intent_1_done': 'false',
      'next_relations_intent_2': '', 'next_relations_intent_2_done': 'false',
      'next_relations_status': 'Planned',

      'next_career_finance': '',
      'next_career_intent_1': '', 'next_career_intent_1_done': 'false',
      'next_career_intent_2': '', 'next_career_intent_2_done': 'false',
      'next_career_status': 'Planned',

      // Year Review Summary
      'review_win_1_title': '',
      'review_win_1_desc': '',
      'review_win_2_title': '',
      'review_win_2_desc': '',
      'review_win_3_title': '',
      'review_win_3_desc': '',
      'review_perspective': '',
      'review_commitment_text': 'I hereby sign off this operational cycle and commit to executing the next set of strategies with identical rigor.',
      'review_signature_date': ''
    }
  };
}
