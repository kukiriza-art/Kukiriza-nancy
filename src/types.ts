export interface Goal {
  pillar: string;
  milestone: string;
  progress: number;
  status?: 'Planned' | 'In Progress' | 'Completed' | 'Blocked';
  targetDate?: string;
  notes?: string;
}

export interface Project {
  name: string;
  status: 'In Progress' | 'Planning' | 'Completed' | 'Blocked';
  due: string;
  pct: number;
}

export interface DailyTask {
  time: string;
  text: string;
}

export interface YearScores {
  productivity: number;
  happiness: number;
  health: number;
  financial: number;
  relationships: number;
  growth: number;
  fun: number;
  environment: number;
}

export interface PlannerState {
  annualGoals: Goal[];
  projects: Project[];
  dailyTasks: DailyTask[];
  yearScores: YearScores;
  // Let the user edit arbitrary page texts (by pageId and textId or element index) so their customizations persist!
  customTexts: { [key: string]: string };
}

export interface PageConfig {
  id: number;
  title: string;
  type: string;
  section: string;
  desc?: string;
  q?: number;
  month?: string;
  num?: string;
}
