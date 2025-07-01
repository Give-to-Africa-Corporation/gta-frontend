// General API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  ngo: NgoBasic;
}

// NGO types
export interface NgoBasic {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  profileComplete: boolean;
}

export interface NgoProfile {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  orgName?: string;
  officialEmail?: string;
  country?: string;
  phoneNumber?: string;
  website?: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  profileComplete: boolean;
  bankDetails?: BankDetails;
  profileImage?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  registrationDate?: string;
  documents?: {
    registrationCertificate?: string;
    leadershipProof?: string;
    additionalDocument?: string;
  };
}

// NGO Profile Stats
export interface NgoStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  completionRate: number;
  totalRaised: number;
  totalDonations: number;
  uniqueDonors: number;
}

// NGO Profile Donor
export interface NgoProfileDonor {
  name: string;
  email?: string;
  totalDonated: number;
  lastDonation: string | Date;
  donationCount: number;
  status?: "completed" | "pending";
  paymentMethod?: string;
}

// Complete NGO Profile Response
export interface NgoProfileResponse {
  ngo: NgoProfile;
  stats: NgoStats;
  campaigns: Campaign[];
  donors: NgoProfileDonor[];
}

export interface CompleteProfileRequest {
  orgName: string;
  officialEmail: string;
  country: string;
  phoneNumber: string;
  website?: string;
  description: string;
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    swiftCode: string;
    preferredCurrency: string;
  };
}

// Campaign types
export interface Campaign {
  _id: string;
  id?: string; // Added missing property
  title: string;
  description: string;
  ngoId: string;
  fundingGoal: number;
  goal?: number; // Added missing property
  totalRaised: number;
  raised?: number; // Added missing property
  cause: string;
  country: string;
  media: {
    mainImage: string;
    additionalImages?: string[];
  };
  image?: string; // Added missing property
  status: "draft" | "ongoing" | "paused" | "completed";
  donations: Donation[];
  pendingPayments?: {
    orderId: string;
    amount: number;
    donorName: string;
    donorEmail?: string;
    paymentMethod: string;
    timestamp: Date;
  }[];
  donors?: number; // Added missing property
  deadline?: number | null; // Unix timestamp for campaign end date
  campaignSlug: string;
  createdAt: string;
  updatedAt: string;
  isPerpetual?: boolean; // Derived field (no deadline)
}

export interface CampaignsTabProps {
  ngoCampaigns?: Campaign[];
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "admin" | "ngo";
}

export interface CampaignCreate {
  title: string;
  description: string;
  fundingGoal: number;
  cause: string;
  country: string;
  status?: "draft" | "ongoing" | "paused" | "completed";
  deadline?: number | null;
  campaignSlug?: string;
}

export interface CampaignUpdate {
  title?: string;
  description?: string;
  fundingGoal?: number;
  cause?: string;
  country?: string;
  status?: "draft" | "ongoing" | "paused" | "completed";
  media?: {
    mainImage?: string;
    additionalImages?: string[];
  };
  deadline?: number | null;
}

export interface Donation {
  _id: string;
  donorId?: string;
  donorName: string;
  donorEmail?: string;
  amount: number;
  message?: string;
  timestamp: Date;
  campaign?: string;
  status?: "completed" | "pending" | "failed";
  paymentMethod?: string;
}

export interface DonationRequest {
  donorName: string;
  donorEmail?: string;
  amount: number;
  message?: string;
}

// Query parameters types
export interface CampaignQueryParams {
  status?: "draft" | "ongoing" | "paused" | "completed";
  cause?: string;
  country?: string;
}

export interface NgoQueryParams {
  status?: "pending" | "approved" | "rejected";
}

// NGO Profile Update Request
export interface UpdateProfileRequest {
  name?: string;
  orgName?: string;
  officialEmail?: string;
  country?: string;
  phoneNumber?: string;
  website?: string;
  description?: string;
  bankDetails?: BankDetails;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

export interface BankDetails {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  swiftCode?: string;
  preferredCurrency?: string;
}

// Comment type for campaign comments
export interface Comment {
  id: number | string;
  name: string;
  date: string;
  message: string;
  avatar: string;
}

// User type for frontend usage
export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "ngo" | null;
  isVerified?: boolean;
  status?: "pending" | "approved" | "rejected"; // Added missing property
  profileComplete?: boolean; // Added missing property
}

// Campaign cause types for frontend dropdown
export type CampaignCause =
  | "Education & Literacy"
  | "Health & Medical Access"
  | "Clean Water & Sanitation"
  | "Gender Equality & Women Empowerment"
  | "Youth Empowerment & Leadership"
  | "Agriculture & Food Security"
  | "Climate Action & Environmental Sustainability"
  | "Economic Development & Livelihoods"
  | "Orphan & Vulnerable Children Support"
  | "Peacebuilding & Conflict Resolution"
  | "HIV/AIDS Awareness & Support"
  | "Disability Inclusion & Advocacy"
  | "Technology & Digital Inclusion"
  | "Emergency Relief & Humanitarian Aid"
  | "Mental Health & Psychosocial Support"
  | "Other";

export const campaignCauses: CampaignCause[] = [
  "Education & Literacy",
  "Health & Medical Access",
  "Clean Water & Sanitation",
  "Gender Equality & Women Empowerment",
  "Youth Empowerment & Leadership",
  "Agriculture & Food Security",
  "Climate Action & Environmental Sustainability",
  "Economic Development & Livelihoods",
  "Orphan & Vulnerable Children Support",
  "Peacebuilding & Conflict Resolution",
  "HIV/AIDS Awareness & Support",
  "Disability Inclusion & Advocacy",
  "Technology & Digital Inclusion",
  "Emergency Relief & Humanitarian Aid",
  "Mental Health & Psychosocial Support",
  "Other",
];
