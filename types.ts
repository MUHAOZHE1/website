
export enum Step {
  INTRO = 'INTRO',
  FACE = 'FACE',
  DECONSTRUCT = 'DECONSTRUCT',
  RELEASE = 'RELEASE',
  COPE = 'COPE'
}

export interface StressAnalysis {
  categories: {
    name: string;
    score: number;
    description: string;
  }[];
  summary: string;
  sentiment: 'Overwhelmed' | 'Anxious' | 'Fatigued' | 'Uncertain';
}

export interface ActionPlan {
  immediateSteps: string[];
  longTermStrategies: string[];
  usmResources: {
    name: string;
    contact: string;
    link: string;
  }[];
}
