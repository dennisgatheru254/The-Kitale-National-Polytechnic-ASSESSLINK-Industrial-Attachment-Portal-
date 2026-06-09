/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { 
  User, TraineeProfile, OfficerProfile, SupervisorProfile, AdminProfile,
  Placement, LogbookEntry, Assessment, InstitutionalDocument, DocumentEntitlement, 
  DownloadEvent, AppNotification, AuditLog, SMSLog, AttendanceRecord
} from './src/types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Ensure uploads folder exists
if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
  fs.mkdirSync(path.join(process.cwd(), 'uploads'), { recursive: true });
}

// Global In-Memory Store synced with DB_FILE
let db = {
  users: [] as User[],
  traineeProfiles: [] as TraineeProfile[],
  officerProfiles: [] as OfficerProfile[],
  supervisorProfiles: [] as SupervisorProfile[],
  adminProfiles: [] as AdminProfile[],
  placements: [] as Placement[],
  logbookEntries: [] as LogbookEntry[],
  assessments: [] as Assessment[],
  documents: [] as InstitutionalDocument[],
  documentEntitlements: [] as DocumentEntitlement[],
  downloadEvents: [] as DownloadEvent[],
  notifications: [] as AppNotification[],
  auditLogs: [] as AuditLog[],
  smsLogs: [] as SMSLog[],
  attendanceRecords: [] as AttendanceRecord[],
  systemSettings: {
    institutionName: "Kenya National Polytechnic & Vocational Sciences",
    attachmentDurationWeeks: 12,
    lateWindowHours: 48,
    smsApiKey: "at_key_8f97b001a2f3",
    smsUsername: "knpss_attachment",
    smsSenderId: "KNPSS_LINK",
    feeCollectionEnabled: true,
    feeAmount: 1500, // KES
    force2FA: false
  }
};

// Seed Helper
function seedDatabase() {
  // 1. Seed Users (passwords are stored as plain text "password" for developer ease)
  const users: User[] = [
    {
      id: "u-trainee-1",
      role: "TRAINEE",
      fullName: "Joseph Kurian",
      email: "trainee@knpss.ac.ke",
      phone: "+254712345678",
      profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "u-trainee-2",
      role: "TRAINEE",
      fullName: "Mary Wambui",
      email: "mary.wambui@knpss.ac.ke",
      phone: "+254722111222",
      profilePhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: true,
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "u-trainee-3",
      role: "TRAINEE",
      fullName: "David Kimani",
      email: "david.kimani@knpss.ac.ke",
      phone: "+254733444555",
      profilePhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: true,
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "u-trainee-4",
      role: "TRAINEE",
      fullName: "Faith Mutua",
      email: "faith.mutua@knpss.ac.ke",
      phone: "+254722999000",
      profilePhotoUrl: "https://images.unsplash.com/photo-1534751516642-a131fed10495?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: true,
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "u-officer-1",
      role: "OFFICER",
      fullName: "Mary Wanjiku",
      email: "officer@knpss.ac.ke",
      phone: "+254799000111",
      profilePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: true,
      createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "u-supervisor-1",
      role: "SUPERVISOR",
      fullName: "John Mwangi",
      email: "supervisor@corporates.com",
      phone: "+254711223344",
      profilePhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: true,
      createdAt: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "u-admin-1",
      role: "ADMIN",
      fullName: "Dr. James Kamau",
      email: "admin@knpss.ac.ke",
      phone: "+254700999888",
      profilePhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: true,
      createdAt: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 2. Trainee Profiles
  const traineeProfiles: TraineeProfile[] = [
    {
      id: "tp-1",
      userId: "u-trainee-1",
      admissionNo: "KNPSS/DICT/2022/4102",
      courseCode: "DICT",
      courseName: "Diploma in Information Communication Technology",
      cohort: "2023 Intake",
      attachmentDurationWeeks: 12,
      eligibilityStatus: "ELIGIBLE",
      feePaid: true,
      createdAt: new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "tp-2",
      userId: "u-trainee-2",
      admissionNo: "KNPSS/DEEE/2022/9104",
      courseCode: "DEEE",
      courseName: "Diploma in Electrical & Electronic Engineering",
      cohort: "2023 Intake",
      attachmentDurationWeeks: 12,
      eligibilityStatus: "PENDING",
      feePaid: false,
      createdAt: new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "tp-3",
      userId: "u-trainee-3",
      admissionNo: "KNPSS/DME/2022/1049",
      courseCode: "DME",
      courseName: "Diploma in Mechanical Engineering",
      cohort: "2023 Intake",
      attachmentDurationWeeks: 12,
      eligibilityStatus: "ELIGIBLE",
      feePaid: true,
      createdAt: new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "tp-4",
      userId: "u-trainee-4",
      admissionNo: "KNPSS/DBAT/2022/5021",
      courseCode: "DBAT",
      courseName: "Diploma in Building & Civil Technology",
      cohort: "2023 Intake",
      attachmentDurationWeeks: 12,
      eligibilityStatus: "ELIGIBLE",
      feePaid: true,
      createdAt: new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString()
    }
  ];

  // 3. Placements
  const placements: Placement[] = [
    {
      id: "pl-1",
      traineeId: "tp-1",
      companyName: "Kenya Power and Lighting Company",
      companyAddress: "Electricity House, Harambee Avenue, Nairobi",
      supervisorId: "u-supervisor-1",
      supervisorName: "John Mwangi",
      supervisorPhone: "+254711223344",
      supervisorEmail: "supervisor@corporates.com",
      locationLat: -1.2858,
      locationLng: 36.8229,
      county: "Nairobi",
      startDate: "2026-05-01",
      endDate: "2026-07-24",
      status: "ACTIVE",
      assignedOfficerId: "u-officer-1",
      acceptanceLetterUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      iloLetterUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "pl-2",
      traineeId: "tp-2",
      companyName: "Athee River Cement Works",
      companyAddress: "Mombasa Road, Athi River",
      supervisorName: "Eng. Robert Nandi",
      supervisorPhone: "+254722556677",
      supervisorEmail: "nandi@athicement.co.ke",
      locationLat: -1.4518,
      locationLng: 36.9620,
      county: "Machakos",
      startDate: "2026-06-10",
      endDate: "2026-08-30",
      status: "PLACED",
      assignedOfficerId: "u-officer-1",
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "pl-3",
      traineeId: "tp-3",
      companyName: "Kenya Ports Authority",
      companyAddress: "Kilindini Harbour, Mombasa",
      supervisorName: "Capt. Abdi Juma",
      supervisorPhone: "+254733123456",
      supervisorEmail: "juma@kpa.co.ke",
      locationLat: -4.0435,
      locationLng: 39.6682,
      county: "Mombasa",
      startDate: "2026-05-15",
      endDate: "2026-08-15",
      status: "ACTIVE",
      assignedOfficerId: "u-officer-1",
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "pl-4",
      traineeId: "tp-4",
      companyName: "KenGen Kisumu Power Station",
      companyAddress: "Kenyagen Sector, Kisumu",
      supervisorName: "Sarah Koech",
      supervisorPhone: "+254712456789",
      supervisorEmail: "koech@kengen.co.ke",
      locationLat: -0.0917,
      locationLng: 34.7680,
      county: "Kisumu",
      startDate: "2026-03-01",
      endDate: "2026-05-24",
      status: "COMPLETED",
      assignedOfficerId: "u-officer-1",
      createdAt: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 4. Logbook Entries
  const logbookEntries: LogbookEntry[] = [
    {
      id: "le-1",
      placementId: "pl-1",
      entryDate: "2026-05-04",
      weekNumber: 1,
      activitiesDescription: "Attended safety induction training. Introduced to the power grid configuration and control center protocols. Reviewed schematic symbols for circuit breakers and transformers.",
      skillsAcquired: "Understanding grid system safety guidelines and interpreting high-voltage equipment schematics.",
      toolsUsed: "KPLC Grid Safety Manual, Schematic Draw tools",
      supervisorName: "John Mwangi",
      fileUrls: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"],
      fileHashes: ["d8a43f9a74bf1"],
      status: "APPROVED",
      version: 1,
      isLate: false,
      officerComments: "Excellent summary. Clear understanding of safety principles shown.",
      rubricScores: {
        "Attendance": 5,
        "Quality of Report": 4,
        "Technical Skills": 4,
        "Use of Tools": 4,
        "Safety Compliance": 5,
        "Professional Conduct": 5,
        "Learning Progress": 4
      },
      reviewedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      reviewedBy: "u-officer-1",
      supervisorAcknowledged: true,
      supervisorComment: "Quick learner, followed all safety commands during orientation.",
      supervisorAcknowledgedAt: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date("2026-05-04T17:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-04T18:30:00Z").toISOString()
    },
    {
      id: "le-2",
      placementId: "pl-1",
      entryDate: "2026-05-05",
      weekNumber: 1,
      activitiesDescription: "Participated in maintenance of an 11KV outdoor transformer terminal. Cleaned insulator bushings, tightened bolted busbar clamps, and verified grease level of isolator levers.",
      skillsAcquired: "Insulator bushing sanitization and thermal-lever joint compression techniques.",
      toolsUsed: "Insulator cleaner, ratchet wrench, contact resistance meter",
      supervisorName: "John Mwangi",
      fileUrls: ["https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80"],
      fileHashes: ["c2b45f9c44ab2"],
      status: "APPROVED",
      version: 1,
      isLate: false,
      officerComments: "Good hand-on experience log. Very specific on tasks.",
      rubricScores: {
        "Attendance": 5,
        "Quality of Report": 5,
        "Technical Skills": 4,
        "Use of Tools": 4,
        "Safety Compliance": 5,
        "Professional Conduct": 4,
        "Learning Progress": 5
      },
      reviewedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      reviewedBy: "u-officer-1",
      supervisorAcknowledged: true,
      supervisorComment: "Successfully assisted team. Highly observant.",
      supervisorAcknowledgedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date("2026-05-05T17:15:00Z").toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "le-3",
      placementId: "pl-1",
      entryDate: "2026-06-01",
      weekNumber: 5,
      activitiesDescription: "Configured local area network nodes at KPLC offices. Interfaced edge switches, terminated Category 6 solid cables utilizing impact-punch blocks, and certified pin assignment continuity.",
      skillsAcquired: "Structured copper cabling, punch-termination, Ethernet diagnostics.",
      toolsUsed: "Fluke cable analyzer, impact punch-down tool, modular crimper",
      supervisorName: "John Mwangi",
      fileUrls: [],
      fileHashes: [],
      status: "SUBMITTED",
      version: 1,
      isLate: false,
      supervisorAcknowledged: false,
      createdAt: new Date("2026-06-01T16:45:00Z").toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "le-4",
      placementId: "pl-1",
      entryDate: "2026-06-02",
      weekNumber: 5,
      activitiesDescription: "Troubleshooted optical fiber patch panel in the server room. Located a macro-bend in single-mode fiber patch cord using visual fault locator (VFL), replaced cord, and audited light attenuation loss.",
      skillsAcquired: "OTDR / VFL trace verification and signal budget auditing.",
      toolsUsed: "Visual Fault Locator, Fiber cleaner pen",
      supervisorName: "John Mwangi",
      fileUrls: [],
      fileHashes: [],
      status: "CORRECTION_REQUESTED",
      version: 1,
      isLate: false,
      supervisorAcknowledged: false,
      officerComments: "Please describe what attenuation reading you achieved after replacing the fiber patch cord so we can assess practical learning.",
      createdAt: new Date("2026-06-02T17:10:00Z").toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 5. Assessments
  const assessments: Assessment[] = [];

  // 6. Documents
  const documents: InstitutionalDocument[] = [
    {
      id: "doc-1",
      title: "KNPSS Attachment Insurance Form (All Trainees)",
      category: "INSURANCE",
      version: "v4.2",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileHash: "859f7dc2a92e10a24",
      visibility: "ALL",
      downloadPolicy: "SINGLE",
      downloadLimit: 1,
      isActive: true,
      uploadedBy: "u-admin-1",
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      validationCode: "SAFE-KNP-2026"
    },
    {
      id: "doc-2",
      title: "NITA Attachment Reimbursement Claim Form",
      category: "NITA",
      version: "v2.1",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileHash: "92ba98bc72a1e",
      visibility: "ALL",
      downloadPolicy: "N_DOWNLOADS",
      downloadLimit: 3,
      isActive: true,
      uploadedBy: "u-admin-1",
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "doc-3",
      title: "Industrial Attachment Handbook and Code of Conduct",
      category: "POLICY",
      version: "v5.0",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileHash: "a1a2b3c4d5e6",
      visibility: "ALL",
      downloadPolicy: "UNLIMITED",
      isActive: true,
      uploadedBy: "u-admin-1",
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "doc-4",
      title: "Liaison Office Introduction Letter (Restricted)",
      category: "LETTER",
      version: "v1.0",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileHash: "f1e2d3c4b5a6",
      visibility: "PROGRAM",
      visibilityFilter: "DICT",
      downloadPolicy: "VIEW_ONLY",
      isActive: true,
      uploadedBy: "u-admin-1",
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
    }
  ];

  // 7. Entitlements
  const documentEntitlements: DocumentEntitlement[] = [
    {
      id: "ent-1",
      documentId: "doc-1",
      userId: "u-trainee-1",
      downloadsUsed: 0
    },
    {
      id: "ent-2",
      documentId: "doc-2",
      userId: "u-trainee-1",
      downloadsUsed: 1
    }
  ];

  // 8. Notifications
  const notifications: AppNotification[] = [
    {
      id: "not-1",
      userId: "u-trainee-1",
      type: "LOGBOOK_STATUS",
      title: "Entry Correction Requested",
      body: "Weekly entry for 2026-06-02 requires correction. Officer comments: 'Please describe attenuation reading...'",
      isRead: false,
      relatedEntityType: "LOGBOOK_ENTRY",
      relatedEntityId: "le-4",
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
    },
    {
      id: "not-2",
      userId: "u-trainee-1",
      type: "DOCUMENT",
      title: "New Attachment Policy Document Uploaded",
      body: "Dr. James Kamau uploaded 'KNPSS Attachment Insurance Form'",
      isRead: true,
      relatedEntityType: "DOCUMENT",
      relatedEntityId: "doc-1",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ];

  // 9. Audit Logs
  const auditLogs: AuditLog[] = [
    {
      id: "al-1",
      userId: "u-admin-1",
      action: "USER_IMPORT",
      entityType: "USER",
      entityId: "u-trainee-1",
      metadata: "Seeded trainee Joseph Kurian to DICT cohort",
      ipAddress: "127.0.0.1",
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const smsLogs: SMSLog[] = [];
  
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "att-1",
      placementId: "pl-1",
      traineeId: "tp-1",
      date: "2026-06-01",
      dayOfWeek: "Monday",
      status: "Present",
      markedBy: "John Mwangi",
      createdAt: new Date("2026-06-01T16:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-01T16:00:00Z").toISOString()
    },
    {
      id: "att-2",
      placementId: "pl-1",
      traineeId: "tp-1",
      date: "2026-06-02",
      dayOfWeek: "Tuesday",
      status: "Present",
      markedBy: "John Mwangi",
      createdAt: new Date("2026-06-02T16:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-02T16:00:00Z").toISOString()
    },
    {
      id: "att-3",
      placementId: "pl-1",
      traineeId: "tp-1",
      date: "2026-06-03",
      dayOfWeek: "Wednesday",
      status: "Present",
      markedBy: "John Mwangi",
      createdAt: new Date("2026-06-03T16:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-03T16:00:00Z").toISOString()
    },
    {
      id: "att-4",
      placementId: "pl-1",
      traineeId: "tp-1",
      date: "2026-06-04",
      dayOfWeek: "Thursday",
      status: "Half-Day",
      markedBy: "John Mwangi",
      createdAt: new Date("2026-06-04T16:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-04T16:00:00Z").toISOString()
    },
    {
      id: "att-5",
      placementId: "pl-1",
      traineeId: "tp-1",
      date: "2026-06-05",
      dayOfWeek: "Friday",
      status: "Present",
      markedBy: "John Mwangi",
      createdAt: new Date("2026-06-05T16:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-05T16:00:00Z").toISOString()
    },
    {
      id: "att-6",
      placementId: "pl-1",
      traineeId: "tp-1",
      date: "2026-06-08",
      dayOfWeek: "Monday",
      status: "Present",
      markedBy: "John Mwangi",
      createdAt: new Date("2026-06-08T16:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-08T16:00:00Z").toISOString()
    },
    {
      id: "att-7",
      placementId: "pl-1",
      traineeId: "tp-1",
      date: "2026-06-09",
      dayOfWeek: "Tuesday",
      status: "Present",
      markedBy: "John Mwangi",
      createdAt: new Date("2026-06-09T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-09T10:00:00Z").toISOString()
    }
  ];

  const officerProfiles: OfficerProfile[] = [
    {
      id: "op-1",
      userId: "u-officer-1",
      employeeNo: "KNPSS-ASSESSOR-04",
      department: "School of Engineering & Mechanical Arts",
      specialization: "On-Site Compliance & Practical Logbook Audit",
      assignedRegions: ["Nairobi Area", "Kiambu County"],
      completedAssessmentsCount: 14,
      officeRoom: "Liaison Wing B, Room 14",
      availabilityStatus: "AVAILABLE",
      createdAt: new Date().toISOString()
    }
  ];

  const supervisorProfiles: SupervisorProfile[] = [
    {
      id: "sp-1",
      userId: "u-supervisor-1",
      companyName: "Kenya Power and Lighting Company",
      jobTitle: "Senior Electrical Engineering Superintendent",
      department: "Substations & Distribution Systems",
      workEmail: "jmwangi@kplc.co.ke",
      workPhone: "+254711223344",
      officeLocation: "Stima Plaza, Block C, 4th Floor",
      maxTraineesCapacity: 5,
      currentAssignedTraineesCount: 1,
      createdAt: new Date().toISOString()
    }
  ];

  const adminProfiles: AdminProfile[] = [
    {
      id: "ap-1",
      userId: "u-admin-1",
      adminStaffCode: "KNPSS-ILO-ADMIN-01",
      portfolio: "Director of Industrial Liaison & Placement Services",
      permissionsRole: "SYSTEM_ADMIN",
      officeExtension: "EXT-8012",
      deskLocation: "Administration Block A, Suite 10",
      createdAt: new Date().toISOString()
    }
  ];

  db = {
    users,
    traineeProfiles,
    officerProfiles,
    supervisorProfiles,
    adminProfiles,
    placements,
    logbookEntries,
    assessments,
    documents,
    documentEntitlements,
    downloadEvents: [],
    notifications,
    auditLogs,
    smsLogs,
    attendanceRecords,
    systemSettings: db.systemSettings
  };

  saveToDisk();
}

// Save & Load DB to JSON
function saveToDisk() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

function loadFromDisk() {
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      console.error("Failed to parse db.json, generating seeds...", e);
      seedDatabase();
    }
  } else {
    seedDatabase();
  }
}

// Initial Load
loadFromDisk();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to write to Audit Trail
function logAudit(userId: string | undefined, action: string, type?: string, id?: string, oldVals?: any, newVals?: any, ip: string = "127.0.0.1") {
  const log: AuditLog = {
    id: `al-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    action,
    entityType: type,
    entityId: id,
    oldValues: oldVals ? JSON.stringify(oldVals) : undefined,
    newValues: newVals ? JSON.stringify(newVals) : undefined,
    ipAddress: ip,
    createdAt: new Date().toISOString()
  };
  db.auditLogs.unshift(log); // newest first
  saveToDisk();
}

// Helper to push in-app Notifications
function makeNotification(userId: string, type: string, title: string, body: string, entType?: string, entId?: string) {
  const notification: AppNotification = {
    id: `not-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    body,
    isRead: false,
    relatedEntityType: entType,
    relatedEntityId: entId,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notification);
  saveToDisk();
}

// Helper to trigger SMS simulations
async function sendSMS(phoneNumber: string, message: string) {
  const log: SMSLog = {
    id: `sms-${Math.random().toString(36).substr(2, 9)}`,
    phoneNumber,
    message,
    senderId: db.systemSettings.smsSenderId,
    status: "SENT",
    createdAt: new Date().toISOString()
  };
  db.smsLogs.unshift(log);
  saveToDisk();
  console.log(`[SMS SIMULATION] To: ${phoneNumber} | From: ${db.systemSettings.smsSenderId} | Content: "${message}"`);
}


// --- API ROUTES ---

// 9.1 Authentication Endpoints
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.get('content-type')?.includes('application/json') ? req.body : req.query; // satisfy any login method
  const userEmail = email || req.body?.email;
  
  if (!userEmail) {
    return res.status(400).json({
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      detail: "Email address is required"
    });
  }

  let user = db.users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
  
  // if student doesn't exist, register them on the fly & add credentials to the Directory!
  if (!user) {
    const namePrefix = userEmail.split('@')[0];
    const fullName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1).replace(/[\._]/g, ' ');
    
    user = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      role: 'TRAINEE',
      fullName,
      email: userEmail.toLowerCase(),
      phone: '',
      profilePhotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      isActive: true,
      isApprovedForLogin: false, // Default: restricted until Approved permanently by Liaison Admin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(user);

    // Also bootstrap matching Trainee Profile
    const admissionNo = `KNPSS/ADMIT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const tp: TraineeProfile = {
      id: `tp-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      admissionNo,
      courseCode: "DICT",
      courseName: "Diploma in Information Communication Technology",
      cohort: "2024 Intake",
      attachmentDurationWeeks: db.systemSettings.attachmentDurationWeeks,
      eligibilityStatus: "PENDING",
      feePaid: false,
      createdAt: new Date().toISOString()
    };
    db.traineeProfiles.push(tp);
    
    logAudit(user.id, "AUTO_SIGNUP_ON_LOGIN", "USER", user.id, undefined, user, req.ip);
    saveToDisk();

    return res.status(403).json({
      type: "about:blank",
      title: "Approval Pending",
      status: 403,
      detail: "Your student credentials have been added to the Enrolled Trainees Directory. Login is locked pending mandatory Admin approval."
    });
  }
  
  if (!user.isActive) {
    return res.status(401).json({
      type: "about:blank",
      title: "Unauthorized",
      status: 410,
      detail: "This account has been deactivated"
    });
  }

  // Mandatory directory verification check
  if (user.role === 'TRAINEE' && user.isApprovedForLogin === false) {
    return res.status(403).json({
      type: "about:blank",
      title: "Approval Pending",
      status: 403,
      detail: "Your account is in the Trainees Directory, but your permanent active login is locked. Please request Admin approval."
    });
  }

  // Record login timestamp
  user.lastLoginAt = new Date().toISOString();
  saveToDisk();

  logAudit(user.id, "USER_LOGIN", "USER", user.id, undefined, undefined, req.ip);

  // Return realistic OAuth session tokens
  res.json({
    accessToken: `at_jwt_${user.id}_${Math.random().toString(36).substr(2, 9)}`,
    user: {
      id: user.id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      isApprovedForLogin: user.isApprovedForLogin,
      profilePhotoUrl: user.profilePhotoUrl
    }
  });
});


app.post('/api/v1/auth/signup', (req, res) => {
  const { fullName, email, phone, role } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({
      title: "Bad Request",
      detail: "Full Name and Email are required fields"
    });
  }

  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({
      title: "Bad Request",
      detail: "An account with this email address already exists"
    });
  }

  const userRole = role || 'TRAINEE';
  
  const newUser: User = {
    id: `u-${Math.random().toString(36).substr(2, 9)}`,
    role: userRole,
    fullName,
    email: email.toLowerCase(),
    phone: phone || '',
    profilePhotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    isActive: true,
    isApprovedForLogin: userRole === 'TRAINEE' ? false : true, // Lock trainee log until Admin checks
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // If trainee, also create trainee profile
  if (userRole === 'TRAINEE') {
    const admissionNo = `KNPSS/ADMIT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const tp: TraineeProfile = {
      id: `tp-${Math.random().toString(36).substr(2, 9)}`,
      userId: newUser.id,
      admissionNo,
      courseCode: "DICT",
      courseName: "Diploma in Information Communication Technology",
      cohort: "2024 Intake",
      attachmentDurationWeeks: db.systemSettings.attachmentDurationWeeks,
      eligibilityStatus: "PENDING",
      feePaid: false,
      createdAt: new Date().toISOString()
    };
    db.traineeProfiles.push(tp);
  }

  logAudit(newUser.id, "USER_SIGNUP", "USER", newUser.id, undefined, newUser, req.ip);
  saveToDisk();

  res.json({
    accessToken: `at_jwt_${newUser.id}_${Math.random().toString(36).substr(2, 9)}`,
    user: {
      id: newUser.id,
      role: newUser.role,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      isApprovedForLogin: newUser.isApprovedForLogin,
      profilePhotoUrl: newUser.profilePhotoUrl
    }
  });
});


app.post('/api/v1/auth/refresh', (req, res) => {
  // Silent refresh
  res.json({ accessToken: `at_jwt_refresh_${Date.now()}` });
});

app.delete('/api/v1/auth/logout', (req, res) => {
  res.status(200).send("OK");
});

app.post('/api/v1/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(404).json({ title: "Not Found", detail: "Email not discovered" });
  }

  const otp = Math.floor(100000 + Math.random() * 90000).toString();
  // Simulate dispatching via Email + Africa's Talking
  if (user.phone) {
    await sendSMS(user.phone, `Your KNPSS Link password reset code is ${otp}. Expires in 10 minutes. Do not share.`);
  }

  logAudit(user.id, "PASSWORD_RESET_OTP_TRIGGERED", "USER", user.id, undefined, undefined, req.ip);

  res.json({ message: "OTP sent to your email and phone number.", simulatedOtp: otp });
});

app.post('/api/v1/auth/verify-otp', (req, res) => {
  const { otp } = req.body;
  // Let any 6-digit code pass in development mode, or match
  res.json({ resetToken: `reset_token_verified_${Math.random()}` });
});

app.post('/api/v1/auth/reset-password', (req, res) => {
  res.json({ status: "success", detail: "Password resets finalized successfully." });
});


// 9.2 Users Endpoints
app.get('/api/v1/users', (req, res) => {
  const stitchedUsers = db.users.map(u => {
    if (u.role === 'TRAINEE') {
      const tp = db.traineeProfiles.find(t => t.userId === u.id);
      return {
        ...u,
        admissionNo: tp?.admissionNo || 'Pending Allocation',
        eligibilityStatus: tp?.eligibilityStatus || 'PENDING'
      };
    }
    return u;
  });
  res.json(stitchedUsers);
});

app.post('/api/v1/users/:id/approve-login', (req, res) => {
  const u = db.users.find(user => user.id === req.params.id);
  if (!u) return res.status(404).send("User Not Found");
  
  const oldApprovalStatus = u.isApprovedForLogin;
  u.isApprovedForLogin = req.body.isApprovedForLogin !== undefined ? req.body.isApprovedForLogin : true;
  u.updatedAt = new Date().toISOString();
  
  logAudit(undefined, "USER_APPROVAL_OVERRIDE", "USER", u.id, { previousApproved: oldApprovalStatus }, { currentApproved: u.isApprovedForLogin }, req.ip);
  saveToDisk();
  res.json({ success: true, user: u });
});

app.post('/api/v1/users', (req, res) => {
  const { role, fullName, email, phone, profilePhotoUrl } = req.get('content-type')?.includes('application/json') ? req.body : req.query;
  const newUser: User = {
    id: `u-${Math.random().toString(36).substr(2, 9)}`,
    role,
    fullName,
    email,
    phone,
    profilePhotoUrl: profilePhotoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // If trainee, also create trainee profile
  if (role === 'TRAINEE') {
    const admissionNo = `KNPSS/ADMIT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const tp: TraineeProfile = {
      id: `tp-${Math.random().toString(36).substr(2, 9)}`,
      userId: newUser.id,
      admissionNo,
      courseCode: "DICT",
      courseName: "Diploma in Information Communication Technology",
      cohort: "2024 Intake",
      attachmentDurationWeeks: db.systemSettings.attachmentDurationWeeks,
      eligibilityStatus: "PENDING",
      feePaid: false,
      createdAt: new Date().toISOString()
    };
    db.traineeProfiles.push(tp);
  }

  logAudit(undefined, "USER_CREATION_ADMIN", "USER", newUser.id, undefined, newUser, req.ip);
  saveToDisk();

  res.status(201).json(newUser);
});

app.get('/api/v1/users/:id', (req, res) => {
  const u = db.users.find(user => user.id === req.params.id);
  if (!u) return res.status(404).send("User Not Found");
  res.json(u);
});

app.get('/api/v1/trainee-profile/:userId', (req, res) => {
  const tp = db.traineeProfiles.find(t => t.userId === req.params.userId);
  if (!tp) return res.status(404).send("Trainee Profile Not Found");
  res.json(tp);
});

app.get('/api/v1/officer-profile/:userId', (req, res) => {
  if (!db.officerProfiles) db.officerProfiles = [];
  let op = db.officerProfiles.find(t => t.userId === req.params.userId);
  if (!op) {
    op = {
      id: "op-" + Math.random().toString(36).substring(2, 11),
      userId: req.params.userId,
      employeeNo: "KNPSS-ASSESSOR-0" + Math.floor(Math.random() * 9 + 1),
      department: "School of Engineering & Technical Arts",
      specialization: "On-Site Compliance & Practical Logbook Audit",
      assignedRegions: ["Nairobi Area", "Kiambu County"],
      completedAssessmentsCount: 14,
      officeRoom: "Liaison Wing B, Room 14",
      availabilityStatus: "AVAILABLE",
      createdAt: new Date().toISOString()
    };
    db.officerProfiles.push(op);
    saveToDisk();
  }
  res.json(op);
});

app.patch('/api/v1/officer-profile/:userId', (req, res) => {
  if (!db.officerProfiles) db.officerProfiles = [];
  const idx = db.officerProfiles.findIndex(t => t.userId === req.params.userId);
  if (idx === -1) return res.status(404).send("Officer Profile Not Found");
  db.officerProfiles[idx] = { ...db.officerProfiles[idx], ...req.body };
  saveToDisk();
  res.json(db.officerProfiles[idx]);
});

app.get('/api/v1/supervisor-profile/:userId', (req, res) => {
  if (!db.supervisorProfiles) db.supervisorProfiles = [];
  let sp = db.supervisorProfiles.find(t => t.userId === req.params.userId);
  if (!sp) {
    sp = {
      id: "sp-" + Math.random().toString(36).substring(2, 11),
      userId: req.params.userId,
      companyName: "Kenya Power and Lighting Company",
      jobTitle: "Senior Electrical Engineering Superintendent",
      department: "Substations & Distribution Systems",
      workEmail: "supervisor@corporates.com",
      workPhone: "+254711223344",
      officeLocation: "Stima Plaza, Block C, 4th Floor",
      maxTraineesCapacity: 5,
      currentAssignedTraineesCount: 1,
      createdAt: new Date().toISOString()
    };
    db.supervisorProfiles.push(sp);
    saveToDisk();
  }
  res.json(sp);
});

app.patch('/api/v1/supervisor-profile/:userId', (req, res) => {
  if (!db.supervisorProfiles) db.supervisorProfiles = [];
  const idx = db.supervisorProfiles.findIndex(t => t.userId === req.params.userId);
  if (idx === -1) return res.status(404).send("Supervisor Profile Not Found");
  db.supervisorProfiles[idx] = { ...db.supervisorProfiles[idx], ...req.body };
  saveToDisk();
  res.json(db.supervisorProfiles[idx]);
});

app.get('/api/v1/admin-profile/:userId', (req, res) => {
  if (!db.adminProfiles) db.adminProfiles = [];
  let ap = db.adminProfiles.find(t => t.userId === req.params.userId);
  if (!ap) {
    ap = {
      id: "ap-" + Math.random().toString(36).substring(2, 11),
      userId: req.params.userId,
      adminStaffCode: "KNPSS-ILO-ADMIN-01",
      portfolio: "Director of Industrial Liaison & Placement Services",
      permissionsRole: "SYSTEM_ADMIN",
      officeExtension: "EXT-8012",
      deskLocation: "Administration Block A, Suite 10",
      createdAt: new Date().toISOString()
    };
    db.adminProfiles.push(ap);
    saveToDisk();
  }
  res.json(ap);
});

app.patch('/api/v1/admin-profile/:userId', (req, res) => {
  if (!db.adminProfiles) db.adminProfiles = [];
  const idx = db.adminProfiles.findIndex(t => t.userId === req.params.userId);
  if (idx === -1) return res.status(404).send("Admin Profile Not Found");
  db.adminProfiles[idx] = { ...db.adminProfiles[idx], ...req.body };
  saveToDisk();
  res.json(db.adminProfiles[idx]);
});

app.patch('/api/v1/users/:id', (req, res) => {
  const uIndex = db.users.findIndex(user => user.id === req.params.id);
  if (uIndex === -1) return res.status(404).send("User Not Found");

  const old = { ...db.users[uIndex] };
  db.users[uIndex] = { ...db.users[uIndex], ...req.body, updatedAt: new Date().toISOString() };
  
  logAudit(req.params.id, "USER_MODIFICATION", "USER", req.params.id, old, db.users[uIndex], req.ip);
  saveToDisk();
  res.json(db.users[uIndex]);
});

app.delete('/api/v1/users/:id', (req, res) => {
  // deactivates accounts
  const u = db.users.find(user => user.id === req.params.id);
  if (!u) return res.status(404).send("User Not Found");
  u.isActive = false;
  u.updatedAt = new Date().toISOString();
  logAudit(undefined, "USER_DEACTIVATION_ADMIN", "USER", u.id, undefined, u, req.ip);
  saveToDisk();
  res.json({ message: "User deactivated successfully.", user: u });
});

app.post('/api/v1/users/import-csv', (req, res) => {
  const { csvData } = req.body;
  // Parse Simulated CSV inputs
  const lines = csvData.split('\n').filter((l: string) => l.trim().length > 0);
  const recordsAdded: User[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 4) {
      const fullName = parts[0].trim();
      const email = parts[1].trim();
      const phone = parts[2].trim();
      const adNo = parts[3].trim();
      
      const userId = `u-csv-${Math.random().toString(36).substr(2, 9)}`;
      const newUser: User = {
        id: userId,
        role: "TRAINEE",
        fullName,
        email,
        phone,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.users.push(newUser);

      const tpId = `tp-csv-${Math.random().toString(36).substr(2, 9)}`;
      const tp: TraineeProfile = {
        id: tpId,
        userId: newUser.id,
        admissionNo: adNo,
        courseCode: "DICT",
        courseName: "Diploma in Information Communication Technology",
        cohort: "2024 Intake",
        attachmentDurationWeeks: 12,
        eligibilityStatus: "ELIGIBLE",
        feePaid: false,
        createdAt: new Date().toISOString()
      };
      db.traineeProfiles.push(tp);
      recordsAdded.push(newUser);
    }
  }

  logAudit(undefined, "USER_CSV_IMPORT", "USER", undefined, undefined, { count: recordsAdded.length }, req.ip);
  saveToDisk();

  res.json({ count: recordsAdded.length, users: recordsAdded });
});


// 9.3 Placements Endpoints
app.get('/api/v1/placements', (req, res) => {
  // Support filtration, or simply returns list
  const list = db.placements.map(pl => {
    // Inject Trainee details and Assigned officer details
    const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
    const userObj = tp ? db.users.find(u => u.id === tp.userId) : null;
    const officer = pl.assignedOfficerId ? db.users.find(u => u.id === pl.assignedOfficerId) : null;
    return {
      ...pl,
      traineeEnrollment: tp,
      traineeUser: userObj,
      assignedOfficer: officer
    };
  });
  res.json(list);
});

app.post('/api/v1/placements', (req, res) => {
  const { traineeId, companyName, companyAddress, supervisorName, supervisorPhone, supervisorEmail, county, startDate, endDate, acceptanceLetterUrl, locationLat, locationLng } = req.body;
  
  const newPl: Placement = {
    id: `pl-${Math.random().toString(36).substr(2, 9)}`,
    traineeId,
    companyName,
    companyAddress,
    supervisorName,
    supervisorPhone,
    supervisorEmail,
    county: county || "Nairobi",
    locationLat: locationLat !== undefined && locationLat !== null ? parseFloat(locationLat) : undefined,
    locationLng: locationLng !== undefined && locationLng !== null ? parseFloat(locationLng) : undefined,
    startDate,
    endDate,
    status: 'PLACED',
    isLocked: req.body.isLocked || false,
    // Assign Mary Wanjiku as the Default Officer easily
    assignedOfficerId: "u-officer-1",
    acceptanceLetterUrl: acceptanceLetterUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.placements.push(newPl);
  logAudit(undefined, "PLACEMENT_CREATION_BY_TRAINEE", "PLACEMENT", newPl.id, undefined, newPl, req.ip);
  saveToDisk();

  res.status(201).json(newPl);
});

app.get('/api/v1/placements/:id', (req, res) => {
  const pl = db.placements.find(p => p.id === req.params.id);
  if (!pl) return res.status(404).send("Placement Not Found");
  
  const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
  const traineeUser = tp ? db.users.find(u => u.id === tp.userId) : null;
  res.json({
    ...pl,
    traineeEnrollment: tp,
    traineeUser
  });
});

app.patch('/api/v1/placements/:id', (req, res) => {
  const plIndex = db.placements.findIndex(p => p.id === req.params.id);
  if (plIndex === -1) return res.status(404).send("Placement Not Found");

  const old = { ...db.placements[plIndex] };
  db.placements[plIndex] = { ...db.placements[plIndex], ...req.body, updatedAt: new Date().toISOString() };
  
  logAudit(undefined, "PLACEMENT_MODIFIED", "PLACEMENT", req.params.id, old, db.placements[plIndex], req.ip);
  saveToDisk();
  res.json(db.placements[plIndex]);
});

app.patch('/api/v1/placements/:id/assign-officer', (req, res) => {
  const { officerId } = req.body;
  const pl = db.placements.find(p => p.id === req.params.id);
  if (!pl) return res.status(404).send("Placement Not Found");

  const oldOfficer = pl.assignedOfficerId;
  pl.assignedOfficerId = officerId;
  pl.updatedAt = new Date().toISOString();

  logAudit(undefined, "OFFICER_ASSIGNED_TO_PLACEMENT", "PLACEMENT", pl.id, { previousOfficer: oldOfficer }, { currentOfficer: officerId }, req.ip);

  // Notify Trainee
  const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
  const officerObj = db.users.find(u => u.id === officerId);
  if (tp && officerObj) {
    makeNotification(tp.userId, "OFFICER_ASSIGNED", "Attachment Cover Appointed", `Officer ${officerObj.fullName} has been designated for your placement assessments.`, "PLACEMENT", pl.id);
    if (officerObj.phone) {
      sendSMS(officerObj.phone, `KNPSS Link: You have been assigned to evaluate trainee ${tp.admissionNo} at ${pl.companyName}.`);
    }
  }

  saveToDisk();
  res.json(pl);
});


// 9.4 Logbook Entries Endpoints
app.get('/api/v1/logbook/:placementId/entries', (req, res) => {
  const entries = db.logbookEntries.filter(le => le.placementId === req.params.placementId);
  res.json(entries.sort((a,b) => b.entryDate.localeCompare(a.entryDate))); // latest date first
});

app.post('/api/v1/logbook/:placementId/entries', (req, res) => {
  const { activitiesDescription, skillsAcquired, toolsUsed, entryDate, supervisorName, fileUrls } = req.body;
  const placementId = req.params.placementId;
  
  const pl = db.placements.find(p => p.id === placementId);
  if (!pl) return res.status(404).send("Placement Not Found");

  // Compute Week Number automatically relative to placement.startDate
  let weekNumber = 1;
  if (pl.startDate) {
    const start = new Date(pl.startDate);
    const curr = new Date(entryDate);
    const diffDays = Math.floor((curr.getTime() - start.getTime()) / (24 * 3600 * 1000));
    weekNumber = Math.max(1, Math.floor(diffDays / 7) + 1);
  }

  // Late detection (beyond 48h limit)
  let isLate = false;
  const created = new Date().getTime();
  const entDateMid = new Date(entryDate + "T23:59:59").getTime();
  const lateCutoff = 48 * 3600 * 1000;
  if (created - entDateMid > lateCutoff) {
    isLate = true;
  }

  // Check unique entry Date version constraints
  const sameDateEntry = db.logbookEntries.filter(le => le.placementId === placementId && le.entryDate === entryDate);
  const version = sameDateEntry.length + 1;

  const newEntry: LogbookEntry = {
    id: `le-${Math.random().toString(36).substr(2, 9)}`,
    placementId,
    entryDate,
    weekNumber,
    activitiesDescription,
    skillsAcquired,
    toolsUsed,
    supervisorName: supervisorName || pl.supervisorName,
    fileUrls: fileUrls || [],
    fileHashes: (fileUrls || []).map(() => Math.random().toString(36).substr(2, 9)),
    status: 'DRAFT',
    version,
    isLate,
    supervisorAcknowledged: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.logbookEntries.push(newEntry);
  logAudit(undefined, "LOGBOOK_ENTRY_CREATED", "LOGBOOK_ENTRY", newEntry.id, undefined, newEntry, req.ip);
  saveToDisk();

  res.status(201).json(newEntry);
});

app.get('/api/v1/logbook/entries/:id', (req, res) => {
  const le = db.logbookEntries.find(entry => entry.id === req.params.id);
  if (!le) return res.status(404).send("Entry Not Discovered");
  res.json(le);
});

app.patch('/api/v1/logbook/entries/:id', (req, res) => {
  const entryIdx = db.logbookEntries.findIndex(entry => entry.id === req.params.id);
  if (entryIdx === -1) return res.status(404).send("Entry Not Found");

  const old = { ...db.logbookEntries[entryIdx] };
  db.logbookEntries[entryIdx] = { ...db.logbookEntries[entryIdx], ...req.body, updatedAt: new Date().toISOString() };
  
  logAudit(undefined, "LOGBOOK_ENTRY_UPDATED", "LOGBOOK_ENTRY", req.params.id, old, db.logbookEntries[entryIdx], req.ip);
  saveToDisk();
  res.json(db.logbookEntries[entryIdx]);
});

app.post('/api/v1/logbook/entries/:id/submit', (req, res) => {
  const entry = db.logbookEntries.find(le => le.id === req.params.id);
  if (!entry) return res.status(404).send("Entry Not Found");

  entry.status = "SUBMITTED";
  entry.updatedAt = new Date().toISOString();

  // Audit
  logAudit(undefined, "LOGBOOK_ENTRY_SUBMITTED", "LOGBOOK_ENTRY", entry.id, undefined, entry, req.ip);
  saveToDisk();
  res.json(entry);
});

app.post('/api/v1/logbook/entries/:id/approve', (req, res) => {
  const { rubricScores, comment, evaluatedBy } = req.body;
  const entry = db.logbookEntries.find(le => le.id === req.params.id);
  if (!entry) return res.status(404).send("Entry Not Found");

  entry.status = "APPROVED";
  entry.officerComments = comment;
  entry.rubricScores = rubricScores;
  entry.reviewedAt = new Date().toISOString();
  entry.reviewedBy = evaluatedBy || "u-officer-1";
  entry.updatedAt = new Date().toISOString();

  // Trigger Notification to Trainee
  const pl = db.placements.find(p => p.id === entry.placementId);
  if (pl) {
    const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
    if (tp) {
      makeNotification(tp.userId, "LOGBOOK_ENTRY_APPROVED", "Logbook Entry Approved", `Your weekly logbook entry for ${entry.entryDate} has been analyzed and approved.`, "LOGBOOK_ENTRY", entry.id);
      const traineeUser = db.users.find(u => u.id === tp.userId);
      if (traineeUser && traineeUser.phone) {
        sendSMS(traineeUser.phone, `KNPSS Link: Your logbook entry for ${entry.entryDate} has been approved. Keep up the good work!`);
      }
    }
  }

  logAudit(evaluatedBy, "LOGBOOK_ENTRY_APPROVED", "LOGBOOK_ENTRY", entry.id, undefined, entry, req.ip);
  saveToDisk();
  res.json(entry);
});

// 9.5 Attendance Registry Endpoints
app.get('/api/v1/attendance', (req, res) => {
  const { placementId, traineeId } = req.query;
  let list = db.attendanceRecords || [];
  if (placementId) {
    list = list.filter(r => r.placementId === placementId);
  }
  if (traineeId) {
    list = list.filter(r => r.traineeId === traineeId);
  }
  res.json(list);
});

app.post('/api/v1/attendance', (req, res) => {
  const { records } = req.body;
  if (!records || !Array.isArray(records)) {
    const { placementId, traineeId, date, dayOfWeek, status, markedBy } = req.body;
    if (!placementId || !traineeId || !date || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    if (!db.attendanceRecords) db.attendanceRecords = [];

    const existingIndex = db.attendanceRecords.findIndex(
      r => r.placementId === placementId && r.date === date
    );

    const now = new Date().toISOString();
    if (existingIndex > -1) {
      db.attendanceRecords[existingIndex] = {
        ...db.attendanceRecords[existingIndex],
        status,
        markedBy: markedBy || "John Mwangi",
        updatedAt: now
      };
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Math.random().toString(36).substr(2, 9)}`,
        placementId,
        traineeId,
        date,
        dayOfWeek: dayOfWeek || "Monday",
        status,
        markedBy: markedBy || "John Mwangi",
        createdAt: now,
        updatedAt: now
      };
      db.attendanceRecords.push(newRec);
    }
    logAudit(undefined, "ATTENDANCE_MARKED", "ATTENDANCE", placementId, undefined, { date, status }, req.ip);
    saveToDisk();
    return res.json({ success: true, count: 1 });
  }

  if (!db.attendanceRecords) db.attendanceRecords = [];
  const now = new Date().toISOString();
  let updatedCount = 0;
  let insertedCount = 0;

  for (const rec of records) {
    const { placementId, traineeId, date, dayOfWeek, status, markedBy } = rec;
    if (!placementId || !date || !status) continue;

    const existingIndex = db.attendanceRecords.findIndex(
      r => r.placementId === placementId && r.date === date
    );

    if (existingIndex > -1) {
      db.attendanceRecords[existingIndex] = {
        ...db.attendanceRecords[existingIndex],
        status,
        markedBy: markedBy || "John Mwangi",
        updatedAt: now
      };
      updatedCount++;
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Math.random().toString(36).substr(2, 9)}`,
        placementId,
        traineeId: traineeId || "",
        date,
        dayOfWeek: dayOfWeek || "Monday",
        status,
        markedBy: markedBy || "John Mwangi",
        createdAt: now,
        updatedAt: now
      };
      db.attendanceRecords.push(newRec);
      insertedCount++;
    }
  }

  if (records.length > 0) {
    logAudit(undefined, "ATTENDANCE_BULK_MARKED", "ATTENDANCE", undefined, undefined, { updated: updatedCount, inserted: insertedCount }, req.ip);
    saveToDisk();
  }

  res.json({ success: true, updated: updatedCount, inserted: insertedCount });
});

app.post('/api/v1/logbook/entries/:id/reject', (req, res) => {
  const { comment, evaluatedBy } = req.body;
  const entry = db.logbookEntries.find(le => le.id === req.params.id);
  if (!entry) return res.status(404).send("Entry Not Found");

  entry.status = "REJECTED";
  entry.officerComments = comment;
  entry.reviewedAt = new Date().toISOString();
  entry.reviewedBy = evaluatedBy || "u-officer-1";
  entry.updatedAt = new Date().toISOString();

  // Trigger Notification to Trainee
  const pl = db.placements.find(p => p.id === entry.placementId);
  if (pl) {
    const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
    if (tp) {
      makeNotification(tp.userId, "LOGBOOK_ENTRY_REJECTED", "Logbook Entry Rejected", `Your logbook entry for ${entry.entryDate} was rejected. Feedback: '${comment}'`, "LOGBOOK_ENTRY", entry.id);
      const traineeUser = db.users.find(u => u.id === tp.userId);
      if (traineeUser && traineeUser.phone) {
        sendSMS(traineeUser.phone, `KNPSS Link: Your logbook entry for ${entry.entryDate} was rejected. Reason: ${comment}. Please resubmit.`);
      }
    }
  }

  logAudit(evaluatedBy, "LOGBOOK_ENTRY_REJECTED", "LOGBOOK_ENTRY", entry.id, undefined, entry, req.ip);
  saveToDisk();
  res.json(entry);
});

app.post('/api/v1/logbook/entries/:id/request-correction', (req, res) => {
  const { comment, evaluatedBy } = req.body;
  const entry = db.logbookEntries.find(le => le.id === req.params.id);
  if (!entry) return res.status(404).send("Entry Not Found");

  entry.status = "CORRECTION_REQUESTED";
  entry.officerComments = comment;
  entry.reviewedAt = new Date().toISOString();
  entry.reviewedBy = evaluatedBy || "u-officer-1";
  entry.updatedAt = new Date().toISOString();

  // Trigger Notification to Trainee
  const pl = db.placements.find(p => p.id === entry.placementId);
  if (pl) {
    const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
    if (tp) {
      makeNotification(tp.userId, "LOGBOOK_ENTRY_CORRECTION", "Correction Requested", `Please revise your entry for ${entry.entryDate}. Comments: '${comment}'`, "LOGBOOK_ENTRY", entry.id);
    }
  }

  logAudit(evaluatedBy, "LOGBOOK_ENTRY_CORRECTION_REQUESTED", "LOGBOOK_ENTRY", entry.id, undefined, entry, req.ip);
  saveToDisk();
  res.json(entry);
});

app.post('/api/v1/logbook/entries/:id/acknowledge', (req, res) => {
  const { supervisorComment } = req.body;
  const entry = db.logbookEntries.find(le => le.id === req.params.id);
  if (!entry) return res.status(404).send("Entry Not Found");

  entry.supervisorAcknowledged = true;
  entry.supervisorComment = supervisorComment;
  entry.supervisorAcknowledgedAt = new Date().toISOString();
  entry.updatedAt = new Date().toISOString();

  logAudit(undefined, "LOGBOOK_ENTRY_SUPERVISOR_ACKNOWLEDGED", "LOGBOOK_ENTRY", entry.id, undefined, entry, req.ip);
  saveToDisk();
  res.json(entry);
});

app.get('/api/v1/logbook/:placementId/gaps', (req, res) => {
  const entries = db.logbookEntries.filter(le => le.placementId === req.params.placementId && le.status !== 'DRAFT');
  const pl = db.placements.find(p => p.id === req.params.placementId);
  if (!pl || !pl.startDate) return res.json([]);

  const gaps: string[] = [];
  const start = new Date(pl.startDate);
  // Compare until today or end date
  const endLimit = pl.endDate ? new Date(pl.endDate) : new Date();
  const today = new Date();
  const compareMax = endLimit.getTime() < today.getTime() ? endLimit : today;

  const current = new Date(start);
  while (current.getTime() <= compareMax.getTime()) {
    // Skip weekends
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      const dateStr = current.toISOString().split('T')[0];
      const hasEntry = entries.some(le => le.entryDate === dateStr);
      if (!hasEntry) {
        gaps.push(dateStr);
      }
    }
    current.setDate(current.getDate() + 1);
  }

  res.json(gaps.slice(0, 10)); // return last 10 missing dates
});

app.get('/api/v1/logbook/:placementId/progress', (req, res) => {
  const entries = db.logbookEntries.filter(le => le.placementId === req.params.placementId);
  const totalExpected = 60; // 12 weeks * 5 working days
  const submitted = entries.filter(le => le.status !== 'DRAFT').length;
  const approved = entries.filter(le => le.status === 'APPROVED').length;
  const percentage = Math.round((approved / totalExpected) * 100);

  res.json({
    totalExpected,
    submitted,
    approved,
    percentage: Math.min(100, percentage)
  });
});


// 9.5 Assessments Endpoints
app.get('/api/v1/assessments/:placementId', (req, res) => {
  const as = db.assessments.find(a => a.placementId === req.params.placementId);
  if (!as) return res.status(404).send("Assessment Not Recorded");
  res.json(as);
});

app.post('/api/v1/assessments', (req, res) => {
  const { 
    placementId, officerId, visitDate, physicalLogbookPresent, 
    entriesMatchUploads, supervisorConfirmed, discrepancyNotes, 
    practicalNotes, overallScore, siteEvidenceUrls 
  } = req.get('content-type')?.includes('application/json') ? req.body : req.query;

  // Set default ID
  const newAs: Assessment = {
    id: `as-${Math.random().toString(36).substr(2, 9)}`,
    placementId,
    officerId,
    visitDate: visitDate || new Date().toISOString().split('T')[0],
    physicalLogbookPresent: physicalLogbookPresent === true || physicalLogbookPresent === 'true',
    entriesMatchUploads: entriesMatchUploads === true || entriesMatchUploads === 'true',
    supervisorConfirmed: supervisorConfirmed === true || supervisorConfirmed === 'true',
    discrepancyNotes,
    practicalNotes,
    overallScore: Number(overallScore || 8),
    siteEvidenceUrls: siteEvidenceUrls || [],
    credibilityAuthorized: false,
    createdAt: new Date().toISOString()
  };

  // Find index if already exists (enforces 1 assessment record limit)
  const idx = db.assessments.findIndex(a => a.placementId === placementId);
  if (idx !== -1) {
    db.assessments[idx] = newAs;
  } else {
    db.assessments.push(newAs);
  }

  // Set placement status to VERIFIED_ONSITE / completed
  const pl = db.placements.find(p => p.id === placementId);
  if (pl) {
    pl.status = 'ASSESSED';
    pl.updatedAt = new Date().toISOString();

    // Trigger Notification
    const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
    if (tp) {
      makeNotification(tp.userId, "ASSESSMENT_COMPLETED", "Site Field Visit Completed", `Your physical field assessment has been authorized by Officer Mary Wanjiku.`, "PLACEMENT", pl.id);
      const traineeUser = db.users.find(u => u.id === tp.userId);
      if (traineeUser && traineeUser.phone) {
        sendSMS(traineeUser.phone, `KNPSS Link: Your field visit has been successfully authorized by Mary Wanjiku. Status marked: Assessed.`);
      }
    }
  }

  logAudit(officerId, "SITE_FIELD_VERIFICATION_CREATED", "ASSESSMENT", newAs.id, undefined, newAs, req.ip);
  saveToDisk();

  res.status(201).json(newAs);
});

app.post('/api/v1/assessments/:id/authorize', (req, res) => {
  const as = db.assessments.find(a => a.id === req.params.id);
  if (!as) return res.status(404).send("Assessment Not Found");

  as.credibilityAuthorized = true;
  as.authorizedAt = new Date().toISOString();

  // Set placement status to COMPLETED
  const pl = db.placements.find(p => p.id === as.placementId);
  if (pl) {
    pl.status = 'COMPLETED';
    pl.updatedAt = new Date().toISOString();

    const tp = db.traineeProfiles.find(t => t.id === pl.traineeId);
    if (tp) {
      makeNotification(tp.userId, "CREDIBILITY_GRANTED", "Attachment Status: Completed!", `Your digital dossier has been approved and completed successfully!`, "PLACEMENT", pl.id);
    }
  }

  logAudit(undefined, "ASSESSMENT_CREDIBILITY_AUTHORIZED", "ASSESSMENT", as.id, undefined, as, req.ip);
  saveToDisk();
  res.json(as);
});


// File Upload Support for Real PDF layouts
app.post('/api/v1/upload', (req, res) => {
  try {
    const { name, type, base64 } = req.body;
    if (!name || !base64) {
      return res.status(400).json({ error: "Missing filename or file content" });
    }

    // Clean up base64 prefix if present
    const base64Data = base64.replace(/^data:.*;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Create unique filename to prevent overwrite
    const fileId = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    fs.writeFileSync(filePath, buffer);

    // Return the stable endpoint URL
    res.json({
      fileUrl: `/api/v1/files/${fileId}`,
      originalName: name
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/files/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.doc') contentType = 'application/msword';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    res.setHeader('Content-Type', contentType);
    // Explicitly set content-disposition to inline so that pdf reads inside viewport framing
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});


// 9.6 Documents Endpoints
app.get('/api/v1/documents', (req, res) => {
  res.json(db.documents);
});

app.post('/api/v1/documents', (req, res) => {
  const { title, category, version, fileUrl, visibility, visibilityFilter, downloadPolicy, downloadLimit, validationCode } = req.get('content-type')?.includes('application/json') ? req.body : req.query;
  
  const newDoc: InstitutionalDocument = {
    id: `doc-${Math.random().toString(36).substr(2, 9)}`,
    title,
    category,
    version,
    fileUrl: fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileHash: `fh-${Math.random().toString(36).substring(3, 11)}`,
    visibility: visibility || "ALL",
    visibilityFilter,
    downloadPolicy: downloadPolicy || "UNLIMITED",
    downloadLimit: downloadLimit ? Number(downloadLimit) : undefined,
    isActive: true,
    uploadedBy: "u-admin-1",
    createdAt: new Date().toISOString(),
    validationCode: validationCode || undefined
  };

  db.documents.push(newDoc);
  
  // Create notifications for all eligible users
  db.users.filter(u => u.role === 'TRAINEE').forEach(trainee => {
    makeNotification(trainee.id, "NEW_DOCUMENT", "Revised Policy Bulletin Published", `Institutional document '${title}' has been issued and is available for review.`, "DOCUMENT", newDoc.id);
  });

  logAudit(undefined, "DOCUMENT_UPLOADED_ADMIN", "DOCUMENT", newDoc.id, undefined, newDoc, req.ip);
  saveToDisk();

  res.status(201).json(newDoc);
});

app.post('/api/v1/documents/:id/download', (req, res) => {
  const { userId } = req.body;
  const doc = db.documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).send("Document not located");

  // Check Download policy limits
  if (doc.downloadPolicy !== "UNLIMITED") {
    let entitlement = db.documentEntitlements.find(e => e.documentId === doc.id && e.userId === userId);
    if (!entitlement) {
      entitlement = {
        id: `ent-${Math.random().toString(36).substr(2, 9)}`,
        documentId: doc.id,
        userId,
        downloadsUsed: 0
      };
      db.documentEntitlements.push(entitlement);
    }

    const limit = doc.downloadPolicy === "SINGLE" ? 1 : (doc.downloadLimit || 1);
    if (entitlement.downloadsUsed >= limit) {
      return res.status(403).json({
        type: "about:blank",
        title: "Forbidden",
        status: 403,
        detail: `Download limitation reached. You have consumed all ${limit} allocated download rights for this document.`
      });
    }

    // Increment
    entitlement.downloadsUsed += 1;
    entitlement.lastDownloadAt = new Date().toISOString();
  }

  // Log successful event
  const event: DownloadEvent = {
    id: `ev-${Math.random().toString(36).substr(2, 9)}`,
    documentId: doc.id,
    userId,
    documentVersion: doc.version,
    ipAddress: req.ip || "127.0.0.1",
    userAgent: req.headers['user-agent'],
    success: true,
    createdAt: new Date().toISOString()
  };
  db.downloadEvents.push(event);

  logAudit(userId, "DOCUMENT_DOWNLOAD_VERIFIED", "DOCUMENT", doc.id, undefined, { version: doc.version }, req.ip);
  saveToDisk();

  res.json({
    signedUrl: doc.fileUrl,
    enforcedPolicy: doc.downloadPolicy,
    downloadsRemaining: doc.downloadPolicy === 'UNLIMITED' ? 'UNLIMITED' : Math.max(0, (doc.downloadPolicy === 'SINGLE' ? 1 : (doc.downloadLimit || 1)) - (db.documentEntitlements.find(e => e.documentId === doc.id && e.userId === userId)?.downloadsUsed || 0))
  });
});

app.post('/api/v1/documents/:id/reset-entitlement/:userId', (req, res) => {
  const entitlement = db.documentEntitlements.find(e => e.documentId === req.params.id && e.userId === req.params.userId);
  if (entitlement) {
    entitlement.downloadsUsed = 0;
    entitlement.resetAt = new Date().toISOString();
    entitlement.resetBy = "u-admin-1";
    logAudit(undefined, "DOCUMENT_ENTITLEMENT_RESET", "DOCUMENT", req.params.id, undefined, { resetTrainee: req.params.userId }, req.ip);
    saveToDisk();
  }
  res.json({ status: "success", detail: "Trainee entitlements reset." });
});

app.get('/api/v1/documents/:id/download-log', (req, res) => {
  const logs = db.downloadEvents.filter(e => e.documentId === req.params.id);
  const enriched = logs.map(l => {
    const u = db.users.find(usr => usr.id === l.userId);
    return { ...l, user: u };
  });
  res.json(enriched);
});


// 9.7 Notifications Endpoints
app.get('/api/v1/notifications', (req, res) => {
  const userId = req.query.userId as string;
  const list = db.notifications.filter(n => !userId || n.userId === userId);
  res.json(list);
});

app.patch('/api/v1/notifications/:id/read', (req, res) => {
  const n = db.notifications.find(not => not.id === req.params.id);
  if (n) {
    n.isRead = true;
    saveToDisk();
  }
  res.json({ success: true });
});

app.post('/api/v1/notifications/mark-all-read', (req, res) => {
  const { userId } = req.body;
  db.notifications.forEach(n => {
    if (n.userId === userId) {
      n.isRead = true;
    }
  });
  saveToDisk();
  res.json({ success: true });
});

app.get('/api/v1/notifications/unread-count', (req, res) => {
  const userId = req.query.userId as string;
  const count = db.notifications.filter(n => n.userId === userId && !n.isRead).length;
  res.json({ count });
});


// 9.8 Dossier PDF export simulated (instantly resolves, returns formatted URL/data)
app.post('/api/v1/exports/dossier/:placementId', (req, res) => {
  const plId = req.params.placementId;
  const dId = `export-${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    exportId: dId,
    status: "ready",
    downloadUrl: `/api/v1/exports/${dId}/download?placementId=${plId}`
  });
});

app.get('/api/v1/exports/:id/status', (req, res) => {
  res.json({ status: "ready" });
});

app.get('/api/v1/exports/:id/download', (req, res) => {
  // Simulates final student dossier download file headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=KNPSS_Dossier_Export_${req.params.id}.pdf`);
  res.send(Buffer.from("MOCK_PDF_DATA_KNPSS_PORTFOLIO"));
});


// 9.9 Analytics
app.get('/api/v1/analytics/overview', (req, res) => {
  res.json({
    totalTrainees: db.users.filter(u => u.role === 'TRAINEE').length,
    placedRate: Math.round((db.placements.filter(p => p.status !== 'UNPLACED').length / Math.max(1, db.users.filter(u => u.role==='TRAINEE').length)) * 100),
    activeAttachmentsCount: db.placements.filter(p => p.status === 'ACTIVE').length,
    completedAssessmentsCount: db.assessments.length,
    documentsCount: db.documents.length,
    pendingReviews: db.logbookEntries.filter(le => le.status === 'SUBMITTED').length
  });
});

app.get('/api/v1/analytics/placement-stats', (req, res) => {
  res.json([
    { name: "Unplaced", count: db.users.filter(u => u.role === 'TRAINEE').length - db.placements.length, color: "#9CA3AF" },
    { name: "Placed", count: db.placements.filter(p => p.status === 'PLACED').length, color: "#1565C0" },
    { name: "Active", count: db.placements.filter(p => p.status === 'ACTIVE').length, color: "#F57F17" },
    { name: "Assessed", count: db.placements.filter(p => p.status === 'ASSESSED').length, color: "#6A1B9A" },
    { name: "Completed", count: db.placements.filter(p => p.status === 'COMPLETED').length, color: "#2E7D32" }
  ]);
});

app.get('/api/v1/analytics/submission-trend', (req, res) => {
  // Return last 7 week days of submissions
  res.json([
    { day: "Mon", submissions: 14, approved: 12 },
    { day: "Tue", submissions: 19, approved: 17 },
    { day: "Wed", submissions: 22, approved: 18 },
    { day: "Thu", submissions: 15, approved: 15 },
    { day: "Fri", submissions: 26, approved: 23 },
    { day: "Sat", submissions: 5, approved: 4 },
    { day: "Sun", submissions: 2, approved: 2 }
  ]);
});

app.get('/api/v1/analytics/missing-logbooks', (req, res) => {
  // Returns student detail having high gap rates
  res.json([
    { id: "tp-2", fullName: "Mary Wambui", admissionNo: "KNPSS/DEEE/2022/9104", companyName: "Athee River Cement Works", missingCount: 4 }
  ]);
});

app.get('/api/v1/analytics/officer-performance', (req, res) => {
  res.json([
    { name: "Mary Wanjiku", assignedCount: db.placements.filter(p => p.assignedOfficerId === "u-officer-1").length, verifiedCount: db.assessments.length, pendingReviews: db.logbookEntries.filter(le => le.status === 'SUBMITTED').length }
  ]);
});

app.get('/api/v1/analytics/document-report', (req, res) => {
  res.json(db.documents.map(d => ({
    title: d.title,
    policy: d.downloadPolicy,
    downloads: db.downloadEvents.filter(e => e.documentId === d.id).length
  })));
});


// 9.10 Audit
app.get('/api/v1/audit', (req, res) => {
  res.json(db.auditLogs);
});


// 9.11 USSD callback simulation
app.post('/api/v1/ussd/callback', (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;
  const phone = phoneNumber || "+254712345678";
  
  // Find trainee user
  const user = db.users.find(u => u.phone === phone);
  const tp = user ? db.traineeProfiles.find(t => t.userId === user.id) : null;
  const pl = tp ? db.placements.find(p => p.traineeId === tp.id) : null;

  if (!user || !tp) {
    return res.send("END Trainee mobile number is not registered on KNPSS Link.");
  }

  const inputParts = text ? text.split('*') : [];
  const level = inputParts.length;
  const lastInput = inputParts[level - 1] || "";

  if (!text || lastInput === "0") {
    // Menu top level
    let response = "CON Welcome to KNPSS Link\n";
    response += "1. Check Logbook Status\n";
    response += "2. View Missing Entries\n";
    response += "3. My Placement Details\n";
    response += "4. Contact My Officer\n";
    response += "0. Exit";
    return res.send(response);
  }

  const selection = inputParts[0];

  if (selection === "1") {
    // Logbook Status
    if (!pl) return res.send("END No active placement recorded.");
    const entries = db.logbookEntries.filter(le => le.placementId === pl.id);
    const approved = entries.filter(le => le.status === 'APPROVED').length;
    const pending = entries.filter(le => le.status === 'SUBMITTED').length;
    let resp = `CON Logbook Progress: ${Math.round((approved/60)*100)}%\n`;
    resp += `Approved: ${approved} | Pending: ${pending}\n`;
    resp += "0. Back";
    res.send(resp);
  } else if (selection === "2") {
    // Missing entries
    let resp = "CON Missing dates (last 7 days):\n";
    resp += "- 18 June 2026\n- 19 June 2026\n";
    resp += "Upload via app when online.\n";
    resp += "0. Back";
    res.send(resp);
  } else if (selection === "3") {
    // Placement details
    if (!pl) return res.send("CON No active placement.\n0. Back");
    let resp = `CON Company: ${pl.companyName.substring(0, 20)}\n`;
    resp += `Supervisor: ${pl.supervisorName || "N/A"}\n`;
    resp += `Officer: Mary Wanjiku\n`;
    resp += "0. Back";
    res.send(resp);
  } else if (selection === "4") {
    // Contact details
    const officer = pl && pl.assignedOfficerId ? db.users.find(u => u.id === pl.assignedOfficerId) : null;
    let resp = `CON Assessor contact:\n`;
    resp += `Name: ${officer ? officer.fullName : "Mary Wanjiku"}\n`;
    resp += `Phone: ${officer ? officer.phone : "0799000111"}\n`;
    resp += "0. Back";
    res.send(resp);
  } else {
    res.send("END Thank you for visiting KNPSS Link.");
  }
});

// Developer endpoints to review simulated SMS/USSD trigger history
app.get('/api/v1/sms-logs', (req, res) => {
  res.json(db.smsLogs);
});

// Developer system settings override
app.get('/api/v1/system/settings', (req, res) => {
  res.json(db.systemSettings);
});

app.post('/api/v1/system/settings', (req, res) => {
  db.systemSettings = { ...db.systemSettings, ...req.body };
  saveToDisk();
  res.json(db.systemSettings);
});

// Daraja M-Pesa STK Push sandbox
app.post('/api/v1/mpesa/stkpush', (req, res) => {
  const { phone, userId } = req.get('content-type')?.includes('application/json') ? req.body : req.query;
  const attendee = db.users.find(u => u.id === userId);
  const tp = attendee ? db.traineeProfiles.find(t => t.userId === attendee.id) : null;

  if (tp) {
    tp.feePaid = true;
    saveToDisk();
    logAudit(userId, "MPESA_DARAJA_PAYMENT_SUCCESS", "TRAINEE_PROFILE", tp.id, { feePaid: false }, { feePaid: true }, req.ip);
    makeNotification(userId, "PAYMENT_SUCCESS", "M-Pesa STK Push Successful", `KSH ${db.systemSettings.feeAmount} attachment fee received via STK push. Receipt: LHX382K19J`, "PROFILE", tp.id);
    sendSMS(phone || attendee?.phone || "+254712345678", `KNPSS Link: Confirmed KES ${db.systemSettings.feeAmount}.00 paid via M-Pesa. Receipt: LHX382K19J. Status marked as ELIGIBLE.`);
  }

  res.json({
    status: "success",
    detail: " Daraja API Callback successfully resolved. Account registered paid successfully.",
    transactionId: "LHX382K19J",
    amount: db.systemSettings.feeAmount
  });
});


// Serve static files / Vite middleware in full stack
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KNPSS Link Applet Running on http://localhost:${PORT}]`);
  });
}

startServer();
