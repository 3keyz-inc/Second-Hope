export interface RepoFileTree {
  path: string;
  type: 'blob' | 'tree';
}

export interface Citation {
  uri: string;
  title: string;
}

export interface D3Node {
  id: string;
  label: string;
  group: number;
}

export interface D3Link {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: D3Node[];
  links: D3Link[];
}

export interface DevStudioState {
  repoName: string;
  fileTree: RepoFileTree[];
  graphData: GraphData;
}

export enum ViewMode {
  REPO_ANALYZER = 'RepoAnalyzer',
  DEV_STUDIO = 'DevStudio'
}

export interface ClinicalTrial {
  id: string;
  nctId: string;
  title: string;
  phase: 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Early Phase I';
  status: 'Recruiting' | 'Active, not recruiting' | 'Enrolling by invitation' | 'Completed';
  category: 'Oncology' | 'Immunology' | 'Metabolic' | 'Neurology' | 'Cardiology' | 'Longevity';
  targetMarker?: string;
  leadInstitution: string;
  location: string;
  summary: string;
  intervention: string;
  link: string;
  publishedDate: string;
}

export interface ResearchPaper {
  id: string;
  pmid: string;
  title: string;
  journal: string;
  year: number;
  citations: number;
  category: string;
  keyFindings: string;
  doi?: string;
  link: string;
}

export interface Biomarker {
  id: string;
  code: string;
  name: string;
  category: 'Genomic' | 'Metabolic' | 'Immunological' | 'Inflammatory' | 'Hormonal';
  standardRange: string;
  currentValue: string;
  unit: string;
  status: 'optimal' | 'elevated' | 'low' | 'pending';
  clinicalImpact: string;
  actionableDiet: string;
}

export interface InterventionGoal {
  id: string;
  title: string;
  category: 'Pharmacotherapy' | 'Nutrition' | 'Physical Activity' | 'Sleep & Recovery' | 'Biomarker Target';
  priority: 'high' | 'medium' | 'low';
  impactPercentage: number;
  status: 'active' | 'completed' | 'paused';
  notes?: string;
  startDate?: string;
  evidenceGrade?: 'A (Clinical Trials)' | 'B (Observational)' | 'C (Mechanistic/In Vitro)';
}

export interface VitalRecord {
  date: string;
  activityScore: number;
  sleepHours: number;
  restingHeartRate: number;
  stressIndex: number;
  hrv: number;
  complianceRate: number;
}

export interface MedicalDocument {
  id: string;
  name: string;
  category: 'Lab Report' | 'Physician Note' | 'Genomic Sequencing' | 'Imaging/Pathology' | 'Wearable Export';
  uploadDate: string;
  fileSize: string;
  status: 'Verified' | 'Analyzed' | 'Processing';
  summary?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  createdAt: string;
  bio?: string;
  primaryGoal?: string;
  savedTrialIds?: string[];
  savedBiomarkerIds?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'failed';
  details?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  clinicalTrialsCount: number;
  biomarkersIndexed: number;
  apiRequests24h: number;
  avgResponseTimeMs: number;
  aiTokensUsed: number;
  systemUptimePercentage: number;
}

export interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  allowUserRegistration: boolean;
  enableGoogleOAuth: boolean;
  rateLimitPerMin: number;
  aiModel: string;
  aiTemperature: number;
  maxFileUploadMb: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  persona: 'specialist' | 'vitality' | 'advocate';
  text: string;
  timestamp: number;
  suggestedQuestions?: string[];
}
