export type Profile = {
  fullName: string;
  targetRole: string;
  location: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
};

export type JobPosting = {
  title: string;
  company: string;
  description: string;
};

export type MatchStatus = 'match' | 'writing_gap' | 'gap';

export type ScoreDimension = {
  id: string;
  label: string;
  score: number;
  weight: number;
  explanation: string;
};

export type MatchEvidence = {
  id: string;
  requirement: string;
  status: MatchStatus;
  profileEvidence?: string;
  explanation: string;
};

export type OptimizationSuggestion = {
  id: string;
  section: 'summary' | 'experience' | 'skills';
  title: string;
  before: string;
  after: string;
  evidence: string[];
};

export type ApplicationAnalysis = {
  mode: 'ai' | 'demo';
  overallScore: number;
  dimensions: ScoreDimension[];
  evidences: MatchEvidence[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: OptimizationSuggestion[];
  disclaimer: string;
};

export const EMPTY_PROFILE: Profile = {
  fullName: '',
  targetRole: '',
  location: '',
  summary: '',
  experience: '',
  education: '',
  skills: '',
  languages: 'Português',
};

export const EMPTY_JOB: JobPosting = {
  title: '',
  company: '',
  description: '',
};
