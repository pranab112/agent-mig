
export enum ReferralStatus {
  PENDING = 'PENDING',
  CONVERTED = 'CONVERTED',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

export enum ProjectStage {
  LEAD = 'LEAD',
  NEGOTIATION = 'NEGOTIATION',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum PaymentType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING'
}

export enum CommissionType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
}

export interface Referral {
  id: string;
  name: string;
  email: string;
  date: string;
  status: ReferralStatus;
  paymentType: PaymentType;
  commissionType: CommissionType;
  potentialCommission: number; // For recurring, this is the monthly amount. For percentage, this is the rate.
  
  // Admin fields
  agentName?: string; // To know which agent referred this
  projectStage: ProjectStage;
  finalDealValue?: number; // The actual price set by Admin
  adminNotes?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;
  totalRevenue: number;
}

export interface AgentStats {
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  totalReferrals: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export enum NetworkNodeType {
  ME = 'ME',
  TIER1 = 'TIER1',
  TIER2 = 'TIER2'
}

export interface NetworkNode {
  id: string;
  name: string;
  image?: string; // Optional URL/Data for profile image
  type: NetworkNodeType;
  value: number; // Commission generated
  children?: NetworkNode[];
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  NETWORK = 'NETWORK',
  REFERRALS = 'REFERRALS',
  CALCULATOR = 'CALCULATOR',
  AI_COACH = 'AI_COACH',
  
  // Admin Tabs
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_DEALS = 'ADMIN_DEALS',
  ADMIN_AGENTS = 'ADMIN_AGENTS',
}

export type UserRole = 'AGENT' | 'ADMIN';
