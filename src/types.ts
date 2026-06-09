/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'TRAINEE' | 'OFFICER' | 'SUPERVISOR' | 'ADMIN';
export type PlacementStatus = 'UNPLACED' | 'PLACED' | 'ACTIVE' | 'ASSESSED' | 'COMPLETED';
export type EntryStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CORRECTION_REQUESTED';
export type DocCategory = 'INSURANCE' | 'NITA' | 'LETTER' | 'POLICY' | 'FORM' | 'MANUAL' | 'OTHER';
export type DownloadPolicy = 'UNLIMITED' | 'VIEW_ONLY' | 'SINGLE' | 'N_DOWNLOADS';

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  profilePhotoUrl?: string;
  isActive: boolean;
  isApprovedForLogin?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TraineeProfile {
  id: string;
  userId: string;
  admissionNo: string;
  courseCode: string;
  courseName: string;
  cohort: string;
  attachmentDurationWeeks: number;
  eligibilityStatus: 'PENDING' | 'ELIGIBLE' | 'INELIGIBLE';
  feePaid?: boolean;
  createdAt: string;
}

export interface OfficerProfile {
  id: string;
  userId: string;
  employeeNo: string;
  department: string;
  specialization: string;
  assignedRegions: string[];
  completedAssessmentsCount: number;
  officeRoom: string;
  availabilityStatus: 'AVAILABLE' | 'ON_FIELD_VISIT' | 'ON_LEAVE' | 'BUSY';
  createdAt: string;
}

export interface SupervisorProfile {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  department: string;
  workEmail: string;
  workPhone: string;
  officeLocation: string;
  maxTraineesCapacity: number;
  currentAssignedTraineesCount: number;
  createdAt: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  adminStaffCode: string;
  portfolio: string;
  permissionsRole: 'PRIMARY_OFFICER' | 'AUDITOR' | 'SYSTEM_ADMIN';
  officeExtension: string;
  deskLocation: string;
  createdAt: string;
}

export interface Placement {
  id: string;
  traineeId: string;
  companyName: string;
  companyAddress?: string;
  supervisorId?: string; // Links to supervisor user
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  locationLat?: number;
  locationLng?: number;
  county?: string;
  startDate?: string;
  endDate?: string;
  status: PlacementStatus;
  assignedOfficerId?: string; // Links to officer user
  acceptanceLetterUrl?: string;
  iloLetterUrl?: string;
  isLocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LogbookEntry {
  id: string;
  placementId: string;
  entryDate: string;
  weekNumber: number;
  activitiesDescription: string;
  skillsAcquired?: string;
  toolsUsed?: string;
  supervisorName?: string;
  fileUrls: string[];
  fileHashes: string[];
  status: EntryStatus;
  version: number;
  isLate: boolean;
  parentEntryId?: string;
  officerComments?: string;
  rubricScores?: Record<string, number>; // Competency area -> score (1-5)
  reviewedAt?: string;
  reviewedBy?: string;
  supervisorAcknowledged: boolean;
  supervisorComment?: string;
  supervisorAcknowledgedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  placementId: string;
  officerId: string;
  visitDate: string;
  physicalLogbookPresent: boolean;
  entriesMatchUploads: boolean;
  supervisorConfirmed: boolean;
  discrepancyNotes?: string;
  practicalNotes?: string;
  overallScore: number; // 1 to 10
  siteEvidenceUrls: string[];
  credibilityAuthorized: boolean;
  authorizedAt?: string;
  officerSignatureUrl?: string;
  createdAt: string;
}

export interface InstitutionalDocument {
  id: string;
  title: string;
  category: DocCategory;
  version: string;
  fileUrl: string;
  fileHash: string;
  visibility: 'ALL' | 'COHORT' | 'PROGRAM';
  visibilityFilter?: string; // Cohort or Program name
  effectiveFrom?: string;
  effectiveTo?: string;
  downloadPolicy: DownloadPolicy;
  downloadLimit?: number;
  isActive: boolean;
  uploadedBy: string;
  createdAt: string;
  validationCode?: string;
}

export interface DocumentEntitlement {
  id: string;
  documentId: string;
  userId: string;
  downloadsUsed: number;
  lastDownloadAt?: string;
  resetBy?: string;
  resetAt?: string;
}

export interface DownloadEvent {
  id: string;
  documentId: string;
  userId: string;
  documentVersion: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValues?: string;
  newValues?: string;
  metadata?: string;
  ipAddress: string;
  createdAt: string;
}

export interface SMSLog {
  id: string;
  phoneNumber: string;
  message: string;
  senderId: string;
  status: 'SENT' | 'FAILED';
  createdAt: string;
}

export interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  networkCode?: string;
  serviceCode: string;
  text: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  placementId: string;
  traineeId: string;
  date: string; // YYYY-MM-DD format
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  status: 'Present' | 'Absent' | 'Half-Day';
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

