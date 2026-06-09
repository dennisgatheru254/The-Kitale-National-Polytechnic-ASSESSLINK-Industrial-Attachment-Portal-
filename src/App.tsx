/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, User as UserIcon, BookOpen, FileText, CheckCircle, 
  XSquare, Calendar, Award, HardHat, FileBadge, Settings, 
  Bell, FileDown, UploadCloud, ChevronRight, ChevronLeft, AlertCircle, 
  MapPin, Check, Plus, Users, Send, CreditCard, RefreshCw, BarChart3, Lock, Compass, Navigation,
  Sun, Moon, ArrowUp, ArrowDown, ArrowUpDown, Search, LogOut, FolderOpen, Eye, ExternalLink, Clock
} from 'lucide-react';
import { User, UserRole, TraineeProfile, OfficerProfile, SupervisorProfile, AdminProfile, Placement, LogbookEntry, Assessment, InstitutionalDocument, AppNotification, AuditLog } from './types';
import { jsPDF } from 'jspdf';
import PlacementMap from './components/PlacementMap';
import CapturePreviewMap from './components/CapturePreviewMap';
import { LoginBackgroundSlideshow } from './components/LoginBackgroundSlideshow';

const KnpLogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full text-[#7B1C2E]" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clean Maroon Shield Base */}
    <path d="M60 10 L25 22 C25 55 45 88 60 110 C75 88 95 55 95 22 L60 10 Z" fill="#7B1C2E" />
    <path d="M60 15 L30 25 C30 52 48 82 60 102 C72 82 90 52 90 25 L60 15 Z" fill="white" />
    
    {/* Gothic Style Brand Initials */}
    <text x="60" y="44" fill="#7B1C2E" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="Georgia, serif">KNP</text>
    
    {/* Isometric Graduation Cap (Mortarboard) */}
    <path d="M60 52 L85 60 L60 68 L35 60 Z" fill="#7B1C2E" />
    <path d="M47 64 V74 C47 77 60 79 60 79 C60 79 73 77 73 74 V64" stroke="#7B1C2E" strokeWidth="2.5" fill="none" />
    <path d="M76 60 V71" stroke="#7B1C2E" strokeWidth="1.5" />
    <circle cx="76" cy="71" r="2" fill="#7B1C2E" />
    
    {/* Scroll/Banner */}
    <path d="M22 84 C30 81 90 81 98 84 L98 94 C90 91 30 91 22 94 Z" fill="#7B1C2E" />
    <text x="60" y="90" fill="white" fontSize="4.2" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.15">KITALE POLYTECHNIC</text>
  </svg>
);

// Alert banner helper
function Alert({ children, variant = 'info' }: { children: React.ReactNode, variant?: 'error' | 'success' | 'info' | 'warning' }) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  return (
    <div className={`p-4 border-l-4 rounded-r-md flex gap-3 text-sm my-2 ${styles[variant]}`}>
      <AlertCircle className="w-5 h-5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

function RotatingTypingText() {
  const phrases = [
    "Welcome to the Kitale National Polytechnic Industrial Attachment Management Portal",
    "Connecting Kitale National Polytechnic Students with Industry Opportunities Across Kenya and Beyond",
    "Empowering Future Professionals Through Practical Industrial Training and Workplace Experience",
    "Bridging Academic Excellence at Kitale National Polytechnic with Real-World Industry Exposure",
    "Your Gateway to Industrial Attachment Placement, Progress Tracking, and Professional Growth"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(60);

  useEffect(() => {
    let timer: any;
    const fullText = phrases[currentPhraseIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
        setTypingSpeed(25);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => fullText.slice(0, prev.length + 1));
        setTypingSpeed(60);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      setTypingSpeed(100);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, typingSpeed]);

  return (
    <span className="inline-block relative min-h-[4.5rem] md:min-h-[3.75rem]">
      <span className="text-white drop-shadow-sm transition-all duration-300">{currentText}</span>
      <span className="inline-block w-[2.5px] h-[1.125em] bg-[#FF8F9F] ml-1.5 align-middle animate-pulse opacity-90" />
    </span>
  );
}

const backgroundImages = [
  {
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200",
    role: "Medical Student / Doctor",
    desc: "Healthcare & Therapeutics Track"
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
    role: "Software Engineer & Trainee",
    desc: "Computer Science & IT Track"
  },
  {
    url: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=1200",
    role: "Doctor & Medical Scholar",
    desc: "Healthcare & Therapeutics Track"
  },
  {
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200",
    role: "TVET Technical Educator",
    desc: "Academic Mentorship & Guidance"
  },
  {
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
    role: "Civil Engineering Supervisor",
    desc: "Safety Protocols & Worksite Operations"
  },
  {
    url: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=1200",
    role: "Laboratory Scientist",
    desc: "Applied Biology & Chemistry Track"
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    role: "Collaborative Study Group",
    desc: "Trainee Peer Review & Innovation"
  },
  {
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200",
    role: "Electrical & Hardware Technician",
    desc: "Mechatronics & Electronics Track"
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200",
    role: "Infrastructure Architect",
    desc: "Structural Design & Drafting"
  },
  {
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200",
    role: "Bio-Tech Agronomist Analyst",
    desc: "Agricultural Sciences & Engineering"
  },
  {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    role: "Senior Engineering Project Director",
    desc: "Industrial Management Track"
  }
];

export default function App() {
  // Global States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState<number>(0);

  // Background slide changer
  useEffect(() => {
    if (!currentUser) {
      const interval = setInterval(() => {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
      }, 5000); // 5 seconds slow transition
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Theme states
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode && currentUser) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, currentUser]);
  const [traineeProfile, setTraineeProfile] = useState<TraineeProfile | null>(null);
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile | null>(null);
  const [supervisorProfile, setSupervisorProfile] = useState<SupervisorProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  // Forms states for Assessor (Officer) Profile
  const [officerEmployeeNo, setOfficerEmployeeNo] = useState('');
  const [officerDepartment, setOfficerDepartment] = useState('');
  const [officerSpecialization, setOfficerSpecialization] = useState('');
  const [officerAssignedRegions, setOfficerAssignedRegions] = useState<string[]>([]);
  const [officerOfficeRoom, setOfficerOfficeRoom] = useState('');
  const [officerAvailabilityStatus, setOfficerAvailabilityStatus] = useState<'AVAILABLE' | 'ON_FIELD_VISIT' | 'ON_LEAVE' | 'BUSY'>('AVAILABLE');

  // Forms states for Supervisor Profile
  const [supervisorCompanyName, setSupervisorCompanyName] = useState('');
  const [supervisorJobTitle, setSupervisorJobTitle] = useState('');
  const [supervisorDepartment, setSupervisorDepartment] = useState('');
  const [supervisorWorkEmail, setSupervisorWorkEmail] = useState('');
  const [supervisorWorkPhone, setSupervisorWorkPhone] = useState('');
  const [supervisorOfficeLocation, setSupervisorOfficeLocation] = useState('');
  const [supervisorMaxCapacity, setSupervisorMaxCapacity] = useState(5);

  // Forms states for Admin (ILO) Profile
  const [adminStaffCodeDraft, setAdminStaffCodeDraft] = useState('');
  const [adminPortfolioDraft, setAdminPortfolioDraft] = useState('');
  const [adminPermissionsRoleDraft, setAdminPermissionsRoleDraft] = useState<'PRIMARY_OFFICER' | 'AUDITOR' | 'SYSTEM_ADMIN'>('SYSTEM_ADMIN');
  const [adminOfficeExtensionDraft, setAdminOfficeExtensionDraft] = useState('');
  const [adminDeskLocationDraft, setAdminDeskLocationDraft] = useState('');

  // Sync profile data to edit states
  useEffect(() => {
    if (officerProfile) {
      setOfficerEmployeeNo(officerProfile.employeeNo || '');
      setOfficerDepartment(officerProfile.department || '');
      setOfficerSpecialization(officerProfile.specialization || '');
      setOfficerAssignedRegions(officerProfile.assignedRegions || []);
      setOfficerOfficeRoom(officerProfile.officeRoom || '');
      setOfficerAvailabilityStatus(officerProfile.availabilityStatus || 'AVAILABLE');
    }
  }, [officerProfile]);

  useEffect(() => {
    if (supervisorProfile) {
      setSupervisorCompanyName(supervisorProfile.companyName || '');
      setSupervisorJobTitle(supervisorProfile.jobTitle || '');
      setSupervisorDepartment(supervisorProfile.department || '');
      setSupervisorWorkEmail(supervisorProfile.workEmail || '');
      setSupervisorWorkPhone(supervisorProfile.workPhone || '');
      setSupervisorOfficeLocation(supervisorProfile.officeLocation || '');
      setSupervisorMaxCapacity(supervisorProfile.maxTraineesCapacity || 5);
    }
  }, [supervisorProfile]);

  useEffect(() => {
    if (adminProfile) {
      setAdminStaffCodeDraft(adminProfile.adminStaffCode || '');
      setAdminPortfolioDraft(adminProfile.portfolio || '');
      setAdminPermissionsRoleDraft(adminProfile.permissionsRole || 'SYSTEM_ADMIN');
      setAdminOfficeExtensionDraft(adminProfile.officeExtension || '');
      setAdminDeskLocationDraft(adminProfile.deskLocation || '');
    }
  }, [adminProfile]);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>([]);
  const [logbookSortOrder, setLogbookSortOrder] = useState<'asc' | 'desc'>('desc');
  const [logbookSearchQuery, setLogbookSearchQuery] = useState<string>('');

  const filteredLogbookEntries = logbookEntries.filter(entry => {
    if (!logbookSearchQuery.trim()) return true;
    const q = logbookSearchQuery.toLowerCase();
    return (
      (entry.activitiesDescription || "").toLowerCase().includes(q) ||
      (entry.skillsAcquired || "").toLowerCase().includes(q) ||
      (entry.toolsUsed || "").toLowerCase().includes(q) ||
      (entry.entryDate || "").toLowerCase().includes(q)
    );
  });
  const [documents, setDocuments] = useState<InstitutionalDocument[]>([]);
  const [isInsuranceCodeValidated, setIsInsuranceCodeValidated] = useState<boolean>(false);
  const [viewingDoc, setViewingDoc] = useState<InstitutionalDocument | null>(null);
  const [typedValidationCode, setTypedValidationCode] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      const isVal = localStorage.getItem(`knp_insurance_validated_${currentUser.id}`) === 'true';
      setIsInsuranceCodeValidated(isVal);
    } else {
      setIsInsuranceCodeValidated(false);
    }
  }, [currentUser]);

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [placementsList, setPlacementsList] = useState<any[]>([]); // Admin view
  const [usersList, setUsersList] = useState<User[]>([]); // Admin view
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]); // Admin view
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [selectedTraineeForAttendance, setSelectedTraineeForAttendance] = useState<string>('');
  const [attendancePivotDate, setAttendancePivotDate] = useState<Date>(new Date("2026-06-09"));
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(5); // June (0-indexed)
  
  // UI states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loginEmail, setLoginEmail] = useState<string>('admin@knpss.ac.ke');
  const [loginPassword, setLoginPassword] = useState<string>('password');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLifecycleExpanded, setIsLifecycleExpanded] = useState(false);
  const [isLogbookFormOpenMobile, setIsLogbookFormOpenMobile] = useState(false);

  // Trainee Profile specific states
  const [profileToast, setProfileToast] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPlacement, setIsEditingPlacement] = useState(false);
  const [isEditingPlacementInProfile, setIsEditingPlacementInProfile] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  
  // Signup UI / Form States
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState<'STUDENT' | 'ASSESSOR' | 'SUPERVISOR' | 'ADMIN'>('ADMIN');
  const [signUpFullName, setSignUpFullName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPhone, setSignUpPhone] = useState<string>('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('TRAINEE');
  
  // Custom expandable properties for sections
  const [profilePersonalExpanded, setProfilePersonalExpanded] = useState(true);
  const [profileAcademicExpanded, setProfileAcademicExpanded] = useState(true);
  const [profilePlacementExpanded, setProfilePlacementExpanded] = useState(true);

  // Photo uploading / Cropping simulator states
  const [photoSelectedUrl, setPhotoSelectedUrl] = useState<string | null>(null);
  const [photoPreviewFile, setPhotoPreviewFile] = useState<File | null>(null);
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);
  const [cropScale, setCropScale] = useState(1);

  const handleDownloadReport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Approved logs only
      const approvedEntries = logbookEntries.filter(e => e.status === 'APPROVED');

      // Set fill color - Maroon color #7B1C2E
      doc.setFillColor(123, 28, 46);
      doc.rect(0, 0, 210, 35, 'F');

      // Document Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("KITALE POLYTECHNIC ATTACHMENT PORTAL", 15, 15);
      doc.setFontSize(11);
      doc.setFont("Helvetica", "normal");
      doc.text("Official Student Attachment Progress & Evaluation Report", 15, 22);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 28);

      // Trainee Section Box
      let y = 45;
      doc.setTextColor(33, 37, 41);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TRAINEE PROFILE", 15, y);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y + 2, 195, y + 2);
      
      y += 8;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Full Name:", 15, y);
      doc.setFont("Helvetica", "normal");
      doc.text(currentUser?.fullName || "N/A", 45, y);
      
      doc.setFont("Helvetica", "bold");
      doc.text("Admission No:", 115, y);
      doc.setFont("Helvetica", "normal");
      doc.text(traineeProfile?.admissionNo || "N/A", 150, y);
      
      y += 6;
      doc.setFont("Helvetica", "bold");
      doc.text("Course Name:", 15, y);
      doc.setFont("Helvetica", "normal");
      const courseStr = traineeProfile?.courseName || "Industrial Attachment Program";
      const courseLines = doc.splitTextToSize(courseStr, 65);
      doc.text(courseLines, 45, y);
      
      doc.setFont("Helvetica", "bold");
      doc.text("Cohort / Intake:", 115, y);
      doc.setFont("Helvetica", "normal");
      doc.text(traineeProfile?.cohort || "N/A", 150, y);

      y += Math.max(courseLines.length * 5, 8);
      
      // Placement Section Box
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("COMPANY PLACEMENT INFORMATION", 15, y);
      doc.line(15, y + 2, 195, y + 2);
      
      y += 8;
      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("Host Organization:", 15, y);
      doc.setFont("Helvetica", "normal");
      doc.text(placement?.companyName || "No Placement Registered", 52, y);

      doc.setFont("Helvetica", "bold");
      doc.text("Status:", 115, y);
      doc.setFont("Helvetica", "normal");
      doc.text(placement?.status || "UNPLACED", 150, y);

      y += 6;
      doc.setFont("Helvetica", "bold");
      doc.text("Industry Location:", 15, y);
      doc.setFont("Helvetica", "normal");
      doc.text(placement?.companyAddress || "N/A", 52, y);

      doc.setFont("Helvetica", "bold");
      doc.text("Supervisor:", 115, y);
      doc.setFont("Helvetica", "normal");
      doc.text(placement?.supervisorName || "N/A", 150, y);

      y += 6;
      doc.setFont("Helvetica", "bold");
      doc.text("Placement Period:", 15, y);
      doc.setFont("Helvetica", "normal");
      const pStartDate = placement?.startDate || "Pending";
      const pEndDate = placement?.endDate || "Pending";
      doc.text(`${pStartDate} to ${pEndDate}`, 52, y);

      doc.setFont("Helvetica", "bold");
      doc.text("County Location:", 115, y);
      doc.setFont("Helvetica", "normal");
      doc.text(placement?.county || "N/A", 150, y);

      y += 15;

      // Logbook Entries Ledger Header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("APPROVED DAILY LOGBOOK ENTRIES", 15, y);
      doc.line(15, y + 2, 195, y + 2);
      
      y += 10;

      if (approvedEntries.length === 0) {
        doc.setFont("Helvetica", "italic");
        doc.setFontSize(10);
        doc.text("No approved entries recorded in the logbook yet (Reports are generated for APPROVED items only).", 15, y);
      } else {
        approvedEntries.forEach((entry, i) => {
          if (y > 250) {
            doc.addPage();
            y = 25;
          }

          const actsText = entry.activitiesDescription || "No description.";
          const skillsText = entry.skillsAcquired || "N/A";
          const toolsText = entry.toolsUsed || "N/A";

          const actsLines = doc.splitTextToSize(actsText, 170);
          const skillsLines = doc.splitTextToSize(`Skills: ${skillsText}`, 170);
          const toolsLines = doc.splitTextToSize(`Tools Utilized: ${toolsText}`, 170);

          const contentHeight = (actsLines.length + skillsLines.length + toolsLines.length) * 5 + 18;

          if (y + contentHeight > 275) {
            doc.addPage();
            y = 25;
          }

          doc.setDrawColor(230, 230, 230);
          doc.setFillColor(248, 249, 250);
          doc.rect(15, y, 180, contentHeight, 'F');
          doc.rect(15, y, 180, contentHeight, 'S');

          // Box Header
          doc.setFillColor(235, 240, 245);
          doc.rect(15, y, 180, 8, 'F');
          
          doc.setTextColor(123, 28, 46);
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(9);
          doc.text(`ENTRY DATE: ${entry.entryDate} | WEEK ${entry.weekNumber}`, 18, y + 5.5);
          
          doc.setTextColor(46, 125, 50);
          doc.text(`[ APPROVED ASSESSOR STATUS ]`, 135, y + 5.5);

          y += 13;
          doc.setTextColor(33, 37, 41);
          doc.setFont("Helvetica", "bold");
          doc.text("Daily Activities:", 18, y);
          doc.setFont("Helvetica", "normal");
          doc.text(actsLines, 18, y + 4.5);
          y += (actsLines.length * 5) + 3;

          doc.setFont("Helvetica", "bold");
          doc.text("Skills Developed:", 18, y);
          doc.setFont("Helvetica", "normal");
          doc.text(skillsLines, 18, y + 4.5);
          y += (skillsLines.length * 5) + 3;

          doc.setFont("Helvetica", "bold");
          doc.text("Hardware & Instrumentation Utilized:", 18, y);
          doc.setFont("Helvetica", "normal");
          doc.text(toolsLines, 18, y + 4.5);
          
          y += (toolsLines.length * 5) + 12;
        });
      }

      doc.save(`KNP_Logbook_Report_${currentUser?.fullName?.replace(/\s+/g, '_') || 'Trainee'}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      alert("Could not generate report. Please try again.");
    }
  };

  // Form submission states for Trainee with automated drafts local storage.
  const [newEntryDate, setNewEntryDate] = useState<string>(() => {
    try {
      return localStorage.getItem('knpss_draft_newEntryDate') || new Date().toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  });
  const [activitiesDescription, setActivitiesDescription] = useState<string>(() => {
    try {
      return localStorage.getItem('knpss_draft_activitiesDescription') || '';
    } catch {
      return '';
    }
  });
  const [skillsAcquired, setSkillsAcquired] = useState<string>(() => {
    try {
      return localStorage.getItem('knpss_draft_skillsAcquired') || '';
    } catch {
      return '';
    }
  });
  const [toolsUsed, setToolsUsed] = useState<string>(() => {
    try {
      return localStorage.getItem('knpss_draft_toolsUsed') || '';
    } catch {
      return '';
    }
  });

  // Track the draft autosave timestamp
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Auto-save form contents to localStorage as the developer details update
  useEffect(() => {
    try {
      localStorage.setItem('knpss_draft_newEntryDate', newEntryDate);
      localStorage.setItem('knpss_draft_activitiesDescription', activitiesDescription);
      localStorage.setItem('knpss_draft_skillsAcquired', skillsAcquired);
      localStorage.setItem('knpss_draft_toolsUsed', toolsUsed);
      if (activitiesDescription || skillsAcquired || toolsUsed) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setDraftSavedAt(timeStr);
      }
    } catch (e) {
      console.warn("Storage auto-draft failed:", e);
    }
  }, [newEntryDate, activitiesDescription, skillsAcquired, toolsUsed]);

  // Unified safe tab-navigation handler with dirty check
  const navigateTo = (tab: string) => {
    if (currentUser?.role === 'TRAINEE' && activeTab === 'logbook' && tab !== 'logbook') {
      if (activitiesDescription || skillsAcquired || toolsUsed) {
        const confirmLeave = window.confirm("You have unsaved changes in your Digital Logbook form. Are you sure you want to leave and discard your unsaved draft?");
        if (!confirmLeave) return;
      }
    }
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Safe header profile click handler directing to Profile screen
  const handleProfileClick = () => {
    navigateTo('profile');
  };

  // Browser reload/window close detector for unsaved draft
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentUser?.role === 'TRAINEE' && activeTab === 'logbook' && (activitiesDescription || skillsAcquired || toolsUsed)) {
        const warningText = "You have unsaved changes in your Digital Logbook form.";
        e.preventDefault();
        e.returnValue = warningText;
        return warningText;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser, activeTab, activitiesDescription, skillsAcquired, toolsUsed]);

  const [selectedLetterFile, setSelectedLetterFile] = useState<string>('');
  const [acceptanceCompany, setAcceptanceCompany] = useState<string>('');
  const [acceptanceAddress, setAcceptanceAddress] = useState<string>('');
  const [acceptanceSupervisor, setAcceptanceSupervisor] = useState<string>('');
  const [acceptancePhone, setAcceptancePhone] = useState<string>('');
  const [acceptanceEmail, setAcceptanceEmail] = useState<string>('');
  const [acceptanceCounty, setAcceptanceCounty] = useState<string>('Nairobi');
  const [acceptanceLat, setAcceptanceLat] = useState<string>('');
  const [acceptanceLng, setAcceptanceLng] = useState<string>('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [showLockConfirmModal, setShowLockConfirmModal] = useState<boolean>(false);

  // Review states for Official
  const [reviewingEntry, setReviewingEntry] = useState<LogbookEntry | null>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    "Attendance": 5,
    "Quality of Report": 4,
    "Technical Skills": 4,
    "Use of Tools": 4,
    "Safety Compliance": 5,
    "Professional Conduct": 5,
    "Learning Progress": 4
  });

  // Physical assessment form
  const [selectedTraineeForVisit, setSelectedTraineeForVisit] = useState<any | null>(null);
  const [selectedTraineeForMap, setSelectedTraineeForMap] = useState<any | null>(null);
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logbookPresent, setLogbookPresent] = useState<boolean>(true);
  const [matchUploads, setMatchUploads] = useState<boolean>(true);
  const [supervisorConfirmed, setSupervisorConfirmed] = useState<boolean>(true);
  const [discrepancies, setDiscrepancies] = useState<string>('');
  const [practicalObs, setPracticalObs] = useState<string>('');
  const [overallScore, setOverallScore] = useState<number>(8);
  const [evidencePhoto, setEvidencePhoto] = useState<string>('https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&auto=format&fit=crop&q=80');
  
  // Custom document creation (Admin)
  const [newDocTitle, setNewDocTitle] = useState<string>('');
  const [newDocCategory, setNewDocCategory] = useState<string>('POLICY');
  const [newDocVersion, setNewDocVersion] = useState<string>('v1.0');
  const [newDocPolicy, setNewDocPolicy] = useState<string>('UNLIMITED');
  const [newDocLimit, setNewDocLimit] = useState<number>(3);
  const [newDocValidationCode, setNewDocValidationCode] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // M-Pesa STK simulation state
  const [mpesaNumber, setMpesaNumber] = useState<string>('254712345678');
  const [isPaying, setIsPaying] = useState(false);

  // Load baseline on state login
  useEffect(() => {
    if (currentUser) {
      loadUserData();
      setEditPhone(currentUser.phone || '');
      setEditEmail(currentUser.email || '');
      // Poll notifications every 30s
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedTraineeForAttendance) {
      loadAttendance(selectedTraineeForAttendance);
    }
  }, [selectedTraineeForAttendance]);

  const loadUserData = async () => {
    try {
      loadNotifications();
      
      // Load available documents
      const docsRes = await fetch('/api/v1/documents');
      if (docsRes.ok) {
        setDocuments(await docsRes.json());
      }

      if (currentUser?.role === 'TRAINEE') {
        // Fetch placement info
        const placementsRes = await fetch('/api/v1/placements');
        if (placementsRes.ok) {
          const allPlacements = await placementsRes.json();
          setPlacementsList(allPlacements);
          // Find placement for current user
          const myProfileRes = await fetch('/api/v1/users');
          if (myProfileRes.ok) {
            const users = await myProfileRes.json();
          }
          // Query current trainee details
          const matchedPl = allPlacements.find((p: any) => p.traineeUser?.id === currentUser.id);
          if (matchedPl) {
            setPlacement(matchedPl);
            setTraineeProfile(matchedPl.traineeEnrollment);
            loadLogbookEntries(matchedPl.id);
            // Pre-populate input states for easy editing/re-submitting
            setAcceptanceCompany(matchedPl.companyName || '');
            setAcceptanceAddress(matchedPl.companyAddress || '');
            setAcceptanceSupervisor(matchedPl.supervisorName || '');
            setAcceptancePhone(matchedPl.supervisorPhone || '');
            setAcceptanceEmail(matchedPl.supervisorEmail || '');
            setAcceptanceCounty(matchedPl.county || 'Nairobi');
            setAcceptanceLat(matchedPl.locationLat ? String(matchedPl.locationLat) : '');
            setAcceptanceLng(matchedPl.locationLng ? String(matchedPl.locationLng) : '');
          } else {
            // Find just profile
            const tpRes = await fetch(`/api/v1/trainee-profile/${currentUser.id}`);
            if (tpRes.ok) {
              const tp = await tpRes.json();
              setTraineeProfile(tp);
            }
          }
        }
      } else if (currentUser?.role === 'OFFICER') {
        const placementsRes = await fetch('/api/v1/placements');
        if (placementsRes.ok) {
          const fetched = await placementsRes.json();
          setPlacementsList(fetched);
          if (fetched && fetched.length > 0) {
            // Find first trainee with coordinates, or fall back to first trainee
            const firstWithCoords = fetched.find((p: any) => p.locationLat !== null && p.locationLat !== undefined);
            setSelectedTraineeForMap(prev => prev || firstWithCoords || fetched[0]);
          }
        }
        // Fetch Officer Profile
        const opRes = await fetch(`/api/v1/officer-profile/${currentUser.id}`);
        if (opRes.ok) {
          setOfficerProfile(await opRes.json());
        }
      } else if (currentUser?.role === 'ADMIN') {
        const placementsRes = await fetch('/api/v1/placements');
        if (placementsRes.ok) setPlacementsList(await placementsRes.json());
        
        const usersRes = await fetch('/api/v1/users');
        if (usersRes.ok) setUsersList(await usersRes.json());
        
        const auditRes = await fetch('/api/v1/audit');
        if (auditRes.ok) setAuditLogs(await auditRes.json());

        // Fetch Admin Profile
        const apRes = await fetch(`/api/v1/admin-profile/${currentUser.id}`);
        if (apRes.ok) {
          setAdminProfile(await apRes.json());
        }
      } else if (currentUser?.role === 'SUPERVISOR') {
        const placementsRes = await fetch('/api/v1/placements');
        if (placementsRes.ok) {
          const list = await placementsRes.json();
          const filtered = list.filter((p: any) => p.supervisorEmail === currentUser.email);
          setPlacementsList(filtered);
          if (filtered.length > 0) {
            setSelectedTraineeForAttendance(filtered[0].id);
            loadAttendance(filtered[0].id);
          }
        }
        // Fetch Supervisor Profile
        const spRes = await fetch(`/api/v1/supervisor-profile/${currentUser.id}`);
        if (spRes.ok) {
          setSupervisorProfile(await spRes.json());
        }
      }
    } catch (err) {
      console.error("Error loading user state data:", err);
    }
  };

  const loadNotifications = async () => {
    if (!currentUser) return;
    try {
      const resp = await fetch(`/api/v1/notifications?userId=${currentUser.id}`);
      if (resp.ok) {
        const list = await resp.json();
        setNotifications(list);
        setUnreadCount(list.filter((n: any) => !n.isRead).length);
      }
    } catch (e) {
      console.warn("Notifications poll info: backend server not yet fully online or polled prematurely.", e);
    }
  };

  const loadAttendance = async (placementId?: string) => {
    try {
      const url = placementId ? `/api/v1/attendance?placementId=${placementId}` : `/api/v1/attendance`;
      const resp = await fetch(url);
      if (resp.ok) {
        setAttendanceList(await resp.json());
      }
    } catch (e) {
      console.error("Error loading attendance:", e);
    }
  };

  const loadLogbookEntries = async (placementId: string) => {
    try {
      const resp = await fetch(`/api/v1/logbook/${placementId}/entries`);
      if (resp.ok) {
        setLogbookEntries(await resp.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auth logins
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setActiveTab('dashboard');
      } else {
        const errObj = await res.json();
        setErrorMsg(errObj.detail || 'Incorrect sign-in details');
      }
    } catch (err) {
      setErrorMsg('Server cluster inaccessible.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: signUpFullName, 
          email: signUpEmail, 
          phone: signUpPhone,
          role: signUpRole 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setActiveTab('dashboard');
        // Clear sign up inputs
        setSignUpFullName('');
        setSignUpEmail('');
        setSignUpPhone('');
        setSignUpRole('TRAINEE');
        setIsSignUp(false);
      } else {
        const errObj = await res.json();
        setErrorMsg(errObj.detail || 'Sign up registration failed');
      }
    } catch (err) {
      setErrorMsg('Server cluster inaccessible.');
    }
  };

  const logout = () => {
    if (currentUser?.role === 'TRAINEE' && activeTab === 'logbook') {
      if (activitiesDescription || skillsAcquired || toolsUsed) {
        const confirmLeave = window.confirm("You have unsaved changes in your Digital Logbook form. Are you sure you want to sign out and discard your unsaved draft?");
        if (!confirmLeave) return;
      }
    }
    setCurrentUser(null);
    setTraineeProfile(null);
    setOfficerProfile(null);
    setSupervisorProfile(null);
    setAdminProfile(null);
    setPlacement(null);
    setLogbookEntries([]);
    setActiveTab('dashboard');
  };

  // Demo Login bypass helpers
  const handleQuickLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password');
    // programmatically trigger submit
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const handleRoleSelect = (role: 'STUDENT' | 'ASSESSOR' | 'SUPERVISOR' | 'ADMIN') => {
    setSelectedRoleTab(role);
    if (role === 'STUDENT') {
      setLoginEmail('trainee@knpss.ac.ke');
    } else if (role === 'ASSESSOR') {
      setLoginEmail('officer@knpss.ac.ke');
    } else if (role === 'SUPERVISOR') {
      setLoginEmail('supervisor@corporates.com');
    } else if (role === 'ADMIN') {
      setLoginEmail('admin@knpss.ac.ke');
    }
    setLoginPassword('password');
  };

  // Trainee profile updates
  const handleUpdateUser = async (updatedFields: Partial<any>) => {
    if (!currentUser) return;
    try {
      const resp = await fetch(`/api/v1/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (resp.ok) {
        const updated = await resp.json();
        setCurrentUser(updated);
        setProfileToast("Profile updated successfully.");
        setIsEditingProfile(false);
        setTimeout(() => setProfileToast(null), 4000);
        // Reload details
        loadUserData();
      } else {
        setErrorMsg("Failed to update profile information from registry.");
      }
    } catch (e) {
      console.error("error patching user details", e);
    }
  };

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [adminLockoutSearch, setAdminLockoutSearch] = useState('');
  const [adminLockoutFilter, setAdminLockoutFilter] = useState<'ALL' | 'LOCKED_OUT' | 'ACTIVE'>('ALL');

  const handleUpdateOfficerProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    try {
      const resp = await fetch(`/api/v1/officer-profile/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeNo: officerEmployeeNo,
          department: officerDepartment,
          specialization: officerSpecialization,
          assignedRegions: officerAssignedRegions,
          officeRoom: officerOfficeRoom,
          availabilityStatus: officerAvailabilityStatus
        })
      });
      if (resp.ok) {
        const updated = await resp.json();
        setOfficerProfile(updated);
        setProfileToast("Assessor Profile updated successfully in institution database.");
        setTimeout(() => setProfileToast(null), 4000);
        loadUserData();
      } else {
        setErrorMsg("Failed to synchronize assessor profile properties.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Database sync failure.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateSupervisorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    try {
      const resp = await fetch(`/api/v1/supervisor-profile/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: supervisorCompanyName,
          jobTitle: supervisorJobTitle,
          department: supervisorDepartment,
          workEmail: supervisorWorkEmail,
          workPhone: supervisorWorkPhone,
          officeLocation: supervisorOfficeLocation,
          maxTraineesCapacity: Number(supervisorMaxCapacity)
        })
      });
      if (resp.ok) {
        const updated = await resp.json();
        setSupervisorProfile(updated);
        setProfileToast("Corporate Supervisor Profile updated successfully.");
        setTimeout(() => setProfileToast(null), 4000);
        loadUserData();
      } else {
        setErrorMsg("Failed to register corporate supervisor fields.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Server registry offline.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    try {
      const resp = await fetch(`/api/v1/admin-profile/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminStaffCode: adminStaffCodeDraft,
          portfolio: adminPortfolioDraft,
          permissionsRole: adminPermissionsRoleDraft,
          officeExtension: adminOfficeExtensionDraft,
          deskLocation: adminDeskLocationDraft
        })
      });
      if (resp.ok) {
        const updated = await resp.json();
        setAdminProfile(updated);
        setProfileToast("Institutional Administrator Profile successfully synchronized.");
        setTimeout(() => setProfileToast(null), 4000);
        loadUserData();
      } else {
        setErrorMsg("Failed to update system administration parameters.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Regulatory database read/write lock error.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleUserLockout = async (userToToggle: User) => {
    try {
      const nextActiveVal = !userToToggle.isActive;
      const resp = await fetch(`/api/v1/users/${userToToggle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextActiveVal })
      });
      if (resp.ok) {
        setProfileToast(`User "${userToToggle.fullName}" ${nextActiveVal ? 'restored/unlocked' : 'deactivated/locked out'} successfully.`);
        setTimeout(() => setProfileToast(null), 4000);
        // Refresh users list and audit logs
        const usersRes = await fetch('/api/v1/users');
        if (usersRes.ok) setUsersList(await usersRes.json());
        const auditRes = await fetch('/api/v1/audit');
        if (auditRes.ok) setAuditLogs(await auditRes.json());
      } else {
        setErrorMsg("Failed to override database security status.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to communicate lock override signal.");
    }
  };

  const handleToggleUserApproval = async (userToToggle: User) => {
    try {
      const nextApprovalVal = !userToToggle.isApprovedForLogin;
      const resp = await fetch(`/api/v1/users/${userToToggle.id}/approve-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApprovedForLogin: nextApprovalVal })
      });
      if (resp.ok) {
        setProfileToast(`Trainee "${userToToggle.fullName}" login approval status ${nextApprovalVal ? 'GRANTED' : 'REVOKED'}.`);
        setTimeout(() => setProfileToast(null), 4000);
        // Refresh users list and audit logs
        const usersRes = await fetch('/api/v1/users');
        if (usersRes.ok) setUsersList(await usersRes.json());
        const auditRes = await fetch('/api/v1/audit');
        if (auditRes.ok) setAuditLogs(await auditRes.json());
      } else {
        setErrorMsg("Failed to override login authorization state.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to communicate authorization override signal.");
    }
  };

  const handleExportAuditLogsToCSV = () => {
    try {
      if (!auditLogs || auditLogs.length === 0) {
        setErrorMsg("No audit logs are currently loaded to export.");
        return;
      }

      const headers = [
        "Audit Log ID",
        "Timestamp",
        "Operator (User ID)",
        "Security Event Action",
        "Affected Module",
        "Affected Entity ID",
        "Network IP Address",
        "Previous Value State Snapshot",
        "Updated Value State Snapshot"
      ];

      const escapeCSVAndQuote = (val: any) => {
        if (val === undefined || val === null) return '""';
        let strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        strVal = strVal.replace(/"/g, '""');
        return `"${strVal}"`;
      };

      const rows = auditLogs.map(log => [
        escapeCSVAndQuote(log.id),
        escapeCSVAndQuote(new Date(log.createdAt).toISOString()),
        escapeCSVAndQuote(log.userId || 'SYSTEM_DAEMON'),
        escapeCSVAndQuote(log.action),
        escapeCSVAndQuote(log.entityType || 'CORE_LOGICAL_UNIT'),
        escapeCSVAndQuote(log.entityId || 'N/A'),
        escapeCSVAndQuote(log.ipAddress || '127.0.0.1'),
        escapeCSVAndQuote(log.oldValues),
        escapeCSVAndQuote(log.newValues)
      ]);

      const csvContent = "\ufeff" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `KNPSS_Liaison_Security_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setProfileToast("Liaison Audit Report CSV downloaded successfully.");
      setTimeout(() => setProfileToast(null), 4000);
    } catch (err) {
      console.error("CSV Export failure:", err);
      setErrorMsg("Failed to generate and download CSV spreadsheet.");
    }
  };

  const handleConfirmCropAndUpload = async () => {
    if (photoSelectedUrl) {
      await handleUpdateUser({ profilePhotoUrl: photoSelectedUrl });
    }
    setIsCroppingOpen(false);
    setPhotoSelectedUrl(null);
    setPhotoPreviewFile(null);
  };

  // Submit Daily Logbook Entry
  const handleAddLogbookEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placement) return;
    if (activitiesDescription.length < 50) {
      alert("Activities description must be at least 50 characters to justify practical work.");
      return;
    }

    try {
      const res = await fetch(`/api/v1/logbook/${placement.id}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activitiesDescription,
          skillsAcquired,
          toolsUsed,
          entryDate: newEntryDate,
          supervisorName: placement.supervisorName,
          fileUrls: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80"] // Mock evidence upload
        })
      });

      if (res.ok) {
        const newEntry = await res.json();
        // Instantly submit for assessment review
        await fetch(`/api/v1/logbook/entries/${newEntry.id}/submit`, { method: 'POST' });
        
        // Reset and clear forms
        setActivitiesDescription('');
        setSkillsAcquired('');
        setToolsUsed('');
        try {
          localStorage.removeItem('knpss_draft_activitiesDescription');
          localStorage.removeItem('knpss_draft_skillsAcquired');
          localStorage.removeItem('knpss_draft_toolsUsed');
          setDraftSavedAt(null);
        } catch (e) {
          console.warn("Could not clear local draft storage:", e);
        }
        loadLogbookEntries(placement.id);
        alert("Daily Logbook Entry submitted successfully and routed to Officer's Queue.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Document download policy handler
  const handleDownloadDocument = async (doc: InstitutionalDocument) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/v1/documents/${doc.id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });

      if (res.ok) {
        const body = await res.json();
        // Increment document state or triggers download
        alert(`Document verification success! Enforced Policy: ${body.enforcedPolicy}. Remaining downloads permitted: ${body.downloadsRemaining}`);
        loadUserData();

        // Trigger native download/opening of the original layout PDF file
        if (body.signedUrl) {
          const downloadLink = document.createElement('a');
          downloadLink.href = body.signedUrl;
          downloadLink.target = '_blank';
          downloadLink.setAttribute('download', doc.title.replace(/[^a-zA-Z0-9.-]/g, '_') + '.pdf');
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      } else {
        const body = await res.json();
        alert(`ACCESS CONTROL DENIED: ${body.detail}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Capture current GPS position and reverse-geocode address
  const detectMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("⚠️ Browser Geolocation is not supported by your current device.");
      return;
    }
    
    setGpsAccuracy(null);
    setIsReverseGeocoding(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        setAcceptanceLat(lat.toFixed(6));
        setAcceptanceLng(lng.toFixed(6));
        setGpsAccuracy(accuracy);
        
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
          const res = await fetch(url, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setAcceptanceAddress(data.display_name);
            } else {
              setAcceptanceAddress(`Office Block, GPS Verified coordinates at Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`);
            }
          } else {
            setAcceptanceAddress(`Office Block, GPS Verified coordinates at Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`);
          }
        } catch (err) {
          console.error("Osm reverse-geocoding error:", err);
          setAcceptanceAddress(`Office Block, GPS Verified coordinates at Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`);
        } finally {
          setIsReverseGeocoding(false);
          alert(`🛰️ GPS Captured: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)} with an accuracy of ±${accuracy.toFixed(1)}m. Reverse-geocoded address matches your current registered workspace area.`);
        }
      },
      (err) => {
        setIsReverseGeocoding(false);
        alert(`❌ Geolocation Capture Failed: ${err.message}. Please check your device location settings, permit the application and try again.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Trainee records or updates placement company
  const handleRegisterPlacement = async (e?: React.FormEvent, forceLock: boolean = false) => {
    if (e) e.preventDefault();
    if (!currentUser) return;
    try {
      const isEdit = !!placement && (isEditingPlacement || isEditingPlacementInProfile);
      const url = isEdit ? `/api/v1/placements/${placement.id}` : '/api/v1/placements';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeId: placement?.traineeId || traineeProfile?.id || "tp-1", // default primary seeded trainee profile
          companyName: acceptanceCompany,
          companyAddress: acceptanceAddress,
          supervisorName: acceptanceSupervisor,
          supervisorPhone: acceptancePhone,
          supervisorEmail: acceptanceEmail,
          county: acceptanceCounty,
          locationLat: acceptanceLat ? parseFloat(acceptanceLat) : undefined,
          locationLng: acceptanceLng ? parseFloat(acceptanceLng) : undefined,
          startDate: placement?.startDate || "2026-06-08",
          endDate: placement?.endDate || "2026-08-28",
          isLocked: forceLock || placement?.isLocked || false
        })
      });

      if (res.ok) {
        if (isEdit) {
          alert(forceLock ? "Institutional placement finalized and permanently locked." : "Institutional placement updated successfully under standard validation.");
          setIsEditingPlacement(false);
          setIsEditingPlacementInProfile(false);
        } else {
          alert(forceLock ? "Institutional placement registered and permanently locked." : "Institutional placement registered successfully under standard validation.");
        }
        setShowLockConfirmModal(false);
        loadUserData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Officer review determination
  const handleReviewDecision = async (status: 'approve' | 'reject' | 'request-correction') => {
    if (!reviewingEntry) return;
    try {
      const res = await fetch(`/api/v1/logbook/entries/${reviewingEntry.id}/${status}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: reviewComment,
          rubricScores,
          evaluatedBy: currentUser?.id
        })
      });

      if (res.ok) {
        alert(`Entry evaluation successfully updated: ${status.toUpperCase()}`);
        setReviewingEntry(null);
        setReviewComment('');
        loadUserData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Officer physically verifies site and authorizes credibility
  const handlePhysicalVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraineeForVisit) return;

    try {
      const res = await fetch('/api/v1/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placementId: selectedTraineeForVisit.id,
          officerId: currentUser?.id,
          visitDate,
          physicalLogbookPresent: logbookPresent,
          entriesMatchUploads: matchUploads,
          supervisorConfirmed,
          discrepancyNotes: discrepancies,
          practicalNotes: practicalObs,
          overallScore,
          siteEvidenceUrls: [evidencePhoto]
        })
      });

      if (res.ok) {
        const assessmentResult = await res.json();
        
        // Auto-Authorize credibility of portfolio and mark Completed
        await fetch(`/api/v1/assessments/${assessmentResult.id}/authorize`, { method: 'POST' });

        alert(`On-Site Field Verification finalized. Attachment credential has been fully AUTHORIZED with Status: Completed.`);
        setSelectedTraineeForVisit(null);
        setDiscrepancies('');
        setPracticalObs('');
        loadUserData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // M-Pesa sandbox payment processing
  const triggerMpesaSTKPush = async () => {
    if (!currentUser) return;
    setIsPaying(true);
    try {
      const res = await fetch('/api/v1/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mpesaNumber,
          userId: currentUser.id
        })
      });
      if (res.ok) {
        const dat = await res.json();
        alert(`[DARAJA SIMULATOR] M-Pesa STK Push acknowledged. Transaction ${dat.transactionId} verified. Status set to ELIGIBLE!`);
        loadUserData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPaying(false);
    }
  };

  // Admin registers new document
  const handleAdminDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate real upload progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 15;
      });
    }, 150);

    try {
      let fileUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      
      if (selectedFile) {
        // Convert file to Base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
        reader.readAsDataURL(selectedFile);
        const base64Content = await base64Promise;

        setUploadProgress(50);

        // Post to the upload backend to get a persistent URL!
        const uploadRes = await fetch('/api/v1/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: selectedFile.name,
            type: selectedFile.type,
            base64: base64Content
          })
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          fileUrl = uploadData.fileUrl;
        } else {
          throw new Error("Failed to store file on backend filesystem.");
        }
      }

      setUploadProgress(90);

      const res = await fetch('/api/v1/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDocTitle,
          category: newDocCategory,
          version: newDocVersion,
          visibility: "ALL",
          downloadPolicy: newDocPolicy,
          downloadLimit: newDocLimit,
          validationCode: newDocCategory === 'INSURANCE' ? newDocValidationCode : '',
          fileUrl: fileUrl
        })
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (res.ok) {
        alert("✓ SECURE UPLOAD COMPLETED: New Institutional document released to trainees and enrolled categories.");
        setNewDocTitle('');
        setNewDocValidationCode('');
        setSelectedFile(null);
        setUploadProgress(0);
        loadUserData();
      }
    } catch (e: any) {
      clearInterval(interval);
      setUploadProgress(0);
      alert(`Upload failed: ${e.message || e}`);
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/v1/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      if (res.ok) {
        loadNotifications();
        setNotifOpen(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Notifications toggle helper
  const handleNotificationClick = async (notif: AppNotification) => {
    try {
      await fetch(`/api/v1/notifications/${notif.id}/read`, { method: 'PATCH' });
      loadNotifications();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={`min-h-screen bg-[#F7F8FA] font-sans flex flex-col antialiased ${!currentUser ? 'h-screen max-h-screen overflow-hidden' : ''}`}>
      {/* Top Header */}
      {currentUser && (
        <header className="h-16 bg-white border-b border-[#E8E8E8] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {currentUser && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition active:scale-95"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-md flex items-center justify-center shrink-0 overflow-hidden border border-[#7B1C2E]/20 p-0.5">
            <KnpLogo />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg text-[#7B1C2E] tracking-tight leading-none block">KITALE ACCESSLINK</span>
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium whitespace-nowrap hidden sm:block">INDUSTRIAL ATTACHMENT PORTAL</span>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 dark:text-gray-300 transition flex items-center justify-center cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              type="button"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500 animate-pulse" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification drop */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-1.5 hover:bg-gray-100 rounded-full relative text-gray-600 transition"
                id="notification-bell-btn"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50">
                  <div className="px-4 py-2 border-b flex justify-between items-center bg-gray-50">
                    <span className="font-semibold text-sm text-gray-800">Notifications ({unreadCount})</span>
                    <button onClick={handleMarkAllNotificationsRead} className="text-xs text-[#7B1C2E] font-medium hover:underline">Mark read</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-gray-400 text-xs py-4 text-center">No alerts recorded.</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`px-4 py-2 text-xs border-b cursor-pointer transition hover:bg-gray-50 ${!n.isRead ? 'bg-[#F5E8EB]/30' : ''}`}
                        >
                          <div className="font-semibold text-gray-800 flex justify-between">
                            <span>{n.title}</span>
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#7B1C2E]"></span>}
                          </div>
                          <p className="text-gray-600 mt-1">{n.body}</p>
                          <span className="text-[10px] text-gray-400 block mt-1">{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile display */}
            <div className="flex items-center gap-2 sm:gap-3 border-l-0 sm:border-l sm:pl-4 border-gray-200">
              <button
                type="button"
                onClick={handleProfileClick}
                title="View My Profile"
                className="focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/30 rounded-full transition hover:scale-105 active:scale-95 duration-150 shrink-0 cursor-pointer"
              >
                <img 
                  src={currentUser.profilePhotoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"} 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-[#7B1C2E]/20" 
                  alt="Avatar" 
                />
              </button>
              <button
                type="button"
                onClick={handleProfileClick}
                title="View My Profile"
                className="hidden sm:block text-left focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/20 rounded-md px-1.5 py-0.5 transition hover:bg-gray-100 hover:text-[#7B1C2E] active:scale-98 cursor-pointer"
              >
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-none hover:text-[#7B1C2E] transition-colors">{currentUser.fullName}</p>
                <span className="text-[10px] font-semibold text-gray-500 uppercase mt-1 block">
                  {currentUser.role === 'OFFICER' ? 'ASSESSMENT OFFICER' : currentUser.role}
                </span>
              </button>
              <button 
                onClick={logout} 
                className="hidden sm:inline-flex items-center justify-center text-xs font-semibold px-2.5 py-1.5 bg-gray-100 hover:bg-[#7B1C2E] hover:text-white rounded-md text-gray-600 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-500 hidden sm:inline">Ministry of Education TVET Portal</span>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 dark:text-gray-300 transition flex items-center justify-center cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              type="button"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500 animate-pulse" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        )}
      </header>
      )}

      {/* Main Core Router */}
      {!currentUser ? (
        <div className="flex-1 flex items-center justify-center lg:justify-end h-screen max-h-screen w-full relative bg-[#120204] py-4 px-4 lg:pr-24 xl:pr-40 selection:bg-[#7B1C2E]/20 selection:text-white overflow-hidden">
          
          {/* Background Images with presentation-style transitions */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            {backgroundImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 w-full h-full transition-all duration-[2500ms] ease-in-out ${
                  idx === currentBgIndex ? 'opacity-75 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.role}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center select-none"
                />
              </div>
            ))}
          </div>
 
          {/* Dynamic Rich Maroon Tint Overlay & Gradient Wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#500A0A]/90 via-[#250105]/50 to-[#120204]/40 z-10 pointer-events-none"></div>
 
          {/* Ambient Soft Red/Maroon Spotlights that pulse slowly behind */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
            <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#7B1C2E]/20 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '9s' }}></div>
            <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#500A0A]/30 blur-[110px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }}></div>
          </div>
 
          {/* Dynamic high-fidelity glassmorphism container in the left highlight box */}
          <div className="absolute bottom-72 left-8 lg:left-12 xl:left-24 z-20 hidden lg:flex flex-col gap-2 backdrop-blur-xl bg-black/25 border border-white/10 rounded-2xl py-4 px-5 w-[25rem] xl:w-[30rem] transition-all duration-1000 shadow-[0_8px_32px_rgba(0,0,0,0.5)] select-none text-left">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
            
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight leading-snug drop-shadow-sm">
                <RotatingTypingText />
              </h3>
            </div>
          </div>
          <div className="w-full max-w-md bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-20 transition-all duration-500">
            <div className="flex flex-col items-center text-center mb-5 select-none">
              <div className="w-12 h-12 bg-[#7B1C2E] rounded-full flex items-center justify-center p-2.5 shadow-md mb-3">
                <Shield className="w-7 h-7 text-white fill-white/10" />
              </div>
              <h2 className="text-[13px] font-black uppercase tracking-wider text-[#7B1C2E] leading-tight text-center">
                THE KITALE NATIONAL POLYTECHNIC
              </h2>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
                Industrial Placement Portal
              </span>
            </div>

            <div className="-mx-6 sm:-mx-8 my-5 h-[3px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)] animate-pulse" />

            <div className="w-full">
              {!isSignUp ? (
                // Login View
                <form 
                  onSubmit={handleLogin} 
                  id="login-form" 
                  className="space-y-4 md:space-y-5"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight leading-none">
                      Portal Access
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm mt-2">
                      Identify yourself to enter the institutional node.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-100 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* ROLE TOGGLE segmented control */}
                  <div>
                    <div className="grid grid-cols-4 gap-1 bg-[#F3F4F6] p-1 rounded-full w-full">
                      <button
                        type="button"
                        onClick={() => handleRoleSelect('STUDENT')}
                        className={`py-2 px-1 text-center text-[9px] md:text-[10px] font-black uppercase rounded-full transition-all duration-200 cursor-pointer ${
                          selectedRoleTab === 'STUDENT'
                            ? 'bg-white text-gray-950 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        STUDENT
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSelect('ASSESSOR')}
                        className={`py-2 px-1 text-center text-[9px] md:text-[10px] font-black uppercase rounded-full transition-all duration-200 cursor-pointer ${
                          selectedRoleTab === 'ASSESSOR'
                            ? 'bg-white text-gray-950 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        ASSESSOR
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSelect('SUPERVISOR')}
                        className={`py-2 px-1 text-center text-[9px] md:text-[10px] font-black uppercase rounded-full transition-all duration-200 cursor-pointer ${
                          selectedRoleTab === 'SUPERVISOR'
                            ? 'bg-white text-gray-950 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        SUPERVISOR
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSelect('ADMIN')}
                        className={`py-2 px-1 text-center text-[9px] md:text-[10px] font-black uppercase rounded-full transition-all duration-200 cursor-pointer ${
                          selectedRoleTab === 'ADMIN'
                            ? 'bg-white text-gray-950 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        ILO ADMIN
                      </button>
                    </div>
                  </div>

                  {/* INSTITUTIONAL EMAIL field */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      INSTITUTIONAL EMAIL
                    </label>
                    <input 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full h-[52px] px-4 border border-[#E5E7EB] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/20 focus:border-[#7B1C2E] bg-white text-gray-800 transition-colors" 
                      placeholder="name@polytechnic.ac.ke"
                      required
                    />
                  </div>

                  {/* PASSPHRASE field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        PASSPHRASE
                      </label>
                      <button 
                        type="button"
                        onClick={() => alert(`[DEMO PRESETS DETECTED] Present accounts on segments have password: 'password'.`)}
                        className="text-[11px] text-[#6B1020] font-bold uppercase tracking-wider hover:underline"
                      >
                        LOST KEY?
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type={showLoginPassword ? "text" : "password"} 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full h-[52px] pl-4 pr-12 border border-[#E5E7EB] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/20 focus:border-[#7B1C2E] bg-white text-gray-800 transition-colors" 
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                        title={showLoginPassword ? "Hide passphrase" : "Show passphrase"}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER ME CHECKBOX ROW */}
                  <div className="flex items-start gap-2.5 py-1">
                    <input 
                      type="checkbox" 
                      id="remember-me"
                      className="w-4 h-4 rounded border-gray-300 text-[#6B1020] focus:ring-[#7B1C2E] mt-0.5" 
                      defaultChecked
                    />
                    <div>
                      <label htmlFor="remember-me" className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider leading-none select-none">
                        REMEMBER ME
                      </label>
                      <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase tracking-wider leading-none">
                        PERSISTENT SESSION KEY
                      </span>
                    </div>
                  </div>

                  {/* PRIMARY BUTTON */}
                  <button 
                    type="submit"
                    className="w-full h-[52px] bg-[#6B1020] hover:bg-[#8C1D2F] text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg shadow-sm hover:shadow active:scale-[0.99] transition-all cursor-pointer"
                  >
                    AUTHORIZE ACCESS
                  </button>

                  {/* FOOTER text */}
                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-500 font-medium tracking-wide">
                      NEED INSTITUTIONAL ACCESS?{" "}
                    </span>
                    <button 
                      type="button"
                      onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
                      className="text-xs text-gray-950 font-extrabold tracking-wide hover:underline cursor-pointer"
                    >
                      Register
                    </button>
                  </div>
                </form>
              ) : (
                // Sign Up View
                <form 
                  onSubmit={handleSignUp} 
                  id="signup-form" 
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
                      Request Access
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">
                      Register your institutional credentials to enroll.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-100 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Full Name field */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      FULL NAME
                    </label>
                    <input 
                      type="text" 
                      value={signUpFullName} 
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      className="w-full h-[52.5px] px-4 border border-[#E5E7EB] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/20 focus:border-[#7B1C2E] bg-white text-gray-800 transition-colors" 
                      placeholder="e.g. John Mwangi"
                      required
                    />
                  </div>

                  {/* Institutional Email field */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      INSTITUTIONAL EMAIL
                    </label>
                    <input 
                      type="email" 
                      value={signUpEmail} 
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full h-[52.5px] px-4 border border-[#E5E7EB] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/20 focus:border-[#7B1C2E] bg-white text-gray-800 transition-colors" 
                      placeholder="name@knpss.ac.ke"
                      required
                    />
                  </div>

                  {/* Phone Number field */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      PHONE NUMBER (SMS ALERTS)
                    </label>
                    <input 
                      type="text" 
                      value={signUpPhone} 
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      className="w-full h-[52.5px] px-4 border border-[#E5E7EB] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/20 focus:border-[#7B1C2E] bg-white text-gray-800 transition-colors" 
                      placeholder="e.g. +254712345678"
                      required
                    />
                  </div>

                  {/* Role field */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      SELECT SYSTEM ROLE
                    </label>
                    <select 
                      value={signUpRole} 
                      onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                      className="w-full h-[52px] px-4 border border-[#E5E7EB] rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7B1C2E]/20 focus:border-[#7B1C2E] bg-white text-gray-800 transition-colors"
                    >
                      <option value="TRAINEE">Enrolled Trainee / Student</option>
                      <option value="SUPERVISOR">Industry Host Supervisor</option>
                      <option value="OFFICER">Assessment Dispatch Officer</option>
                    </select>
                  </div>

                  {/* Create Account primary button */}
                  <button 
                    type="submit"
                    className="w-full h-[52px] bg-[#6B1020] hover:bg-[#8C1D2F] text-white font-bold text-xs uppercase tracking-[0.1em] rounded-lg active:scale-[0.99] transition mt-2 cursor-pointer"
                  >
                    CREATE ACCOUNT & LOGIN
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-500 font-medium">Already registered? </span>
                    <button 
                      type="button"
                      onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
                      className="text-xs text-gray-950 font-extrabold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Authenticated Shell Grid
        <div className="flex-1 flex relative overflow-x-hidden">
          {/* Mobile backdrop blackout screen overlay */}
          {isMobileMenuOpen && (
            <div 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 top-16 bg-black/45 backdrop-blur-sm z-30 transition-opacity"
            />
          )}

          {/* Sidebar Navigation */}
          <aside className={`bg-[#7B1C2E] text-white flex flex-col shrink-0 transition-all duration-300 fixed top-16 bottom-0 left-0 z-40 md:z-20 md:h-[calc(100vh-4rem)] md:overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0 w-60 shadow-2xl' : '-translate-x-full md:translate-x-0'
          } ${isSidebarCollapsed ? 'md:w-16' : 'md:w-60'}`}>
            <div className="p-4 border-b border-[#6A1727] flex items-center justify-between">
              {(!isSidebarCollapsed || isMobileMenuOpen) ? (
                <span className="font-bold text-xs uppercase tracking-wider text-white/70">Role Dashboard</span>
              ) : (
                <span className="md:hidden font-bold text-xs uppercase tracking-wider text-white/70">Menu</span>
              )}
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:block p-1 hover:bg-[#6A1727] rounded text-white/80 scale-105"
                title="Toggle Sidebar Expand"
              >
                ★
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden p-1 hover:bg-[#6A1727] rounded text-white/80"
                title="Close Menu"
              >
                ✕
              </button>
            </div>

            {/* Sidebar Navigation Items depending on User Role */}
            <nav className="flex-1 py-4 space-y-1 px-3">
              {currentUser.role === 'TRAINEE' && (
                <>
                  <button 
                    onClick={() => navigateTo('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <BookOpen className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Trainee Dashboard'}
                  </button>
                  <button 
                    onClick={() => navigateTo('logbook')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'logbook' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <Calendar className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Digital Logbook'}
                  </button>
                  <button 
                    onClick={() => navigateTo('placement')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'placement' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <HardHat className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Placement details'}
                  </button>
                  <button 
                    onClick={() => navigateTo('documents')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'documents' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <FileBadge className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Document Center'}
                  </button>
                  <button 
                    onClick={() => navigateTo('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      activeTab === 'profile' 
                        ? 'bg-white text-[#7B1C2E] font-semibold border-l-4 border-[#7B1C2E] rounded-r-lg rounded-l-none' 
                        : 'hover:bg-[#6A1727] text-[#F5E8EB]'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'My Profile'}
                  </button>
                </>
              )}

              {currentUser.role === 'OFFICER' && (
                <>
                  <button 
                    onClick={() => navigateTo('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <Users className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Assigned Trainees'}
                  </button>
                  <button 
                    onClick={() => navigateTo('reviews')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'reviews' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Evaluation Queue'}
                  </button>
                  <button 
                    onClick={() => navigateTo('field-visit')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'field-visit' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <MapPin className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'On-site verification'}
                  </button>
                  <button 
                    onClick={() => navigateTo('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      activeTab === 'profile' 
                        ? 'bg-white text-[#7B1C2E] font-semibold border-l-4 border-[#7B1C2E] rounded-r-lg rounded-l-none' 
                        : 'hover:bg-[#6A1727] text-[#F5E8EB]'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'My Profile'}
                  </button>
                </>
              )}

              {currentUser.role === 'SUPERVISOR' && (
                <>
                  <button 
                    onClick={() => navigateTo('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <Users className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'My Placement Trainees'}
                  </button>
                  <button 
                    onClick={() => navigateTo('attendance')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'attendance' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Trainee Attendance'}
                  </button>
                  <button 
                    onClick={() => navigateTo('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      activeTab === 'profile' 
                        ? 'bg-white text-[#7B1C2E] font-semibold border-l-4 border-[#7B1C2E] rounded-r-lg rounded-l-none' 
                        : 'hover:bg-[#6A1727] text-[#F5E8EB]'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'My Profile'}
                  </button>
                </>
              )}

              {currentUser.role === 'ADMIN' && (
                <>
                  <button 
                    onClick={() => navigateTo('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Overview metrics'}
                  </button>
                  <button 
                    onClick={() => navigateTo('trainees')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'trainees' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <Users className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Student Management'}
                  </button>
                  <button 
                    onClick={() => navigateTo('admin-docs')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'admin-docs' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <FileBadge className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Issued Policy Registry'}
                  </button>
                  <button 
                    onClick={() => navigateTo('audit-history')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'audit-history' ? 'bg-white text-[#7B1C2E] font-semibold' : 'hover:bg-[#6A1727] text-[#F5E8EB]'}`}
                  >
                    <Settings className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'Immutable Audit Trail'}
                  </button>
                  <button 
                    onClick={() => navigateTo('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      activeTab === 'profile' 
                        ? 'bg-white text-[#7B1C2E] font-semibold border-l-4 border-[#7B1C2E] rounded-r-lg rounded-l-none' 
                        : 'hover:bg-[#6A1727] text-[#F5E8EB]'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    {(!isSidebarCollapsed || isMobileMenuOpen) && 'My Profile'}
                  </button>
                </>
              )}
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition hover:bg-red-800/20 text-[#F5E8EB] mt-4 border-t border-[#6A1727]/50 pt-4 cursor-pointer"
                title="Sign Out of Portal"
              >
                <LogOut className="w-5 h-5 text-red-200" />
                {(!isSidebarCollapsed || isMobileMenuOpen) && 'Sign Out'}
              </button>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-[#6A1727] text-center text-xs text-[#F5E8EB]/70">
              {(!isSidebarCollapsed || isMobileMenuOpen) && (
                <>
                  <p className="font-semibold text-white">Kitale AccessLink v1.2</p>
                  <p className="text-[10px] mt-0.5">Republic of Kenya</p>
                </>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
          }`}>
            
            {/* ==================== 1. TRAINEE DASHBOARD TAB ==================== */}
            {currentUser.role === 'TRAINEE' && activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Lifecycle Progress Bar */}
                {/* Desktop View (Always Visible) */}
                <div className="hidden md:block bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 tracking-wide">Attachment Lifecycle Process Status</h3>
                  <div className="relative flex flex-row items-start justify-between gap-2">
                    {/* Horizontal Connector lines */}
                    <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-200 z-0"></div>
                    <div className="absolute left-4 h-0.5 bg-[#7B1C2E] top-4 z-0 transition-all" style={{ width: placement ? '60%' : '15%' }}></div>

                    {/* Step 1: Eligibility */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? '✓' : '1'}
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">1. Clearance Checks</span>
                        <span className="text-[9.5px] text-[#2E7D32] bg-green-50 px-1.5 py-0.5 rounded mt-0.5 font-bold mx-auto">Eligible Approved</span>
                      </div>
                    </div>

                    {/* Step 2: Placement */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${placement ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {placement ? '✓' : '2'}
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">2. Placement Registered</span>
                        <span className="text-[9.5px] text-gray-500">{placement ? (placement.companyName.length > 18 ? placement.companyName.substring(0,18) + '...' : placement.companyName) : 'Pending Record'}</span>
                      </div>
                    </div>

                    {/* Step 3: Active Logbook tracking */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${logbookEntries.length > 0 ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        3
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">3. Attachment Period</span>
                        <span className="text-[9.5px] text-[#2E7D32] font-semibold">{logbookEntries.filter(l => l.status === 'APPROVED').length} Approved Entries</span>
                      </div>
                    </div>

                    {/* Step 4: Assessment */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${placement?.status === 'ASSESSED' || placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        4
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">4. Assessor On-Site</span>
                        <span className="text-[9.5px] font-bold text-amber-700">{placement?.status === 'ASSESSED' ? 'Visit Completed' : 'Pending visit'}</span>
                      </div>
                    </div>

                    {/* Step 5: Completed */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        5
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">5. Complete Portfolio</span>
                        <span className="text-[9.5px] font-bold text-[#2E7D32]">{placement?.status === 'COMPLETED' ? 'Authorized ✓' : 'Awaiting Review'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile View Accordion Button Opening */}
                <div className="md:hidden bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Attachment Milestones Status</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#7B1C2E] animate-pulse shrink-0"></span>
                        <span className="text-xs font-bold text-[#7B1C2E]">
                          {placement?.status === 'COMPLETED' ? 'Stage 5: Complete Portfolio Authorized' :
                           placement?.status === 'ASSESSED' ? 'Stage 4: Assessor On-Site Completed' :
                           logbookEntries.length > 0 ? 'Stage 3: Attachment Underway' :
                           placement ? 'Stage 2: Workplace Registered' :
                           traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? 'Stage 1: Cleared for Attachment' :
                           'Stage 0: Registration Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setIsLifecycleExpanded(!isLifecycleExpanded)}
                      className="px-3 py-1.5 text-[10px] font-extrabold uppercase rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow-sm border border-red-700 active:scale-95 transition-all shrink-0"
                    >
                      {isLifecycleExpanded ? 'Hide Path ←' : 'View Path •••'}
                    </button>
                  </div>

                  {isLifecycleExpanded && (
                    <div className="pt-2 border-t border-gray-100 space-y-2.5">
                      {/* Step 1 Mobile */}
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition shrink-0 ${traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? '✓' : '1'}
                        </div>
                        <div className="text-[11px] leading-tight">
                          <p className="font-bold text-gray-800">1. Clearance & Eligibility Approved</p>
                          <p className="text-[9.5px] font-semibold text-[#2E7D32]">Eligible student cleared by registrar</p>
                        </div>
                      </div>

                      {/* Step 2 Mobile */}
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition shrink-0 ${placement ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {placement ? '✓' : '2'}
                        </div>
                        <div className="text-[11px] leading-tight">
                          <p className="font-bold text-gray-800">2. Placement Workplace Registered</p>
                          <p className="text-[9.5px] text-gray-500">{placement ? placement.companyName : 'Pending coordinates action'}</p>
                        </div>
                      </div>

                      {/* Step 3 Mobile */}
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition shrink-0 ${logbookEntries.length > 0 ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          3
                        </div>
                        <div className="text-[11px] leading-tight">
                          <p className="font-bold text-gray-800">3. Dynamic Daily Logbook Logged</p>
                          <p className="text-[9.5px] text-[#2E7D32] font-semibold">{logbookEntries.filter(l => l.status === 'APPROVED').length} active logs approved</p>
                        </div>
                      </div>

                      {/* Step 4 Mobile */}
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition shrink-0 ${placement?.status === 'ASSESSED' || placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          4
                        </div>
                        <div className="text-[11px] leading-tight">
                          <p className="font-bold text-gray-800">4. GIS Assessor Site Assessment</p>
                          <p className="text-[9.5px] font-bold text-amber-700">{placement?.status === 'ASSESSED' ? 'Verification successfully completed' : 'Awaiting physical check'}</p>
                        </div>
                      </div>

                      {/* Step 5 Mobile */}
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition shrink-0 ${placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          5
                        </div>
                        <div className="text-[11px] leading-tight">
                          <p className="font-bold text-gray-800">5. Complete Portfolio Signed Off</p>
                          <p className="text-[9.5px] font-medium text-gray-400">{placement?.status === 'COMPLETED' ? 'Fully authorized on portal' : 'Pending final validation'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Summarization Matrix Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-[#7B1C2E] to-[#631422] p-4 rounded-lg border border-[#631422] shadow-xs text-xs hover:shadow-md hover:brightness-105 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group text-white">
                    <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15">
                      <FileBadge className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#F5E8EB]/90 tracking-wider block mb-1">Approved Logbook Entries</span>
                        <h2 className="text-xl font-extrabold text-white">{logbookEntries.filter(v => v.status === 'APPROVED').length} Entries</h2>
                      </div>
                      <div className="p-2 rounded-full bg-white/10 text-[#F5E8EB] group-hover:bg-white group-hover:text-[#7B1C2E] transition-colors duration-200">
                        <FileBadge className="w-4 h-4" />
                      </div>
                    </div>
                    <span className="text-[11px] text-[#F5E8EB] hover:text-white font-bold hover:underline cursor-pointer flex items-center gap-1 mt-2.5 transition-all relative z-10" onClick={() => navigateTo('logbook')}>
                      Go to Logbook <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-[#7B1C2E] shadow-sm text-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group text-white">
                    <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-10">
                      <Calendar className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-white tracking-wider block mb-1">Expected Weeks Progress</span>
                        <h2 className="text-xl font-extrabold text-white">5 / {traineeProfile?.attachmentDurationWeeks || 12} Weeks</h2>
                      </div>
                      <div className="p-2 rounded-full bg-[#7B1C2E]/30 text-white group-hover:bg-[#7B1C2E] group-hover:text-white transition-colors duration-200">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3.5 relative overflow-hidden z-10">
                      <div className="bg-[#7B1C2E] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#7B1C2E]" style={{ width: '41.6%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-[#7B1C2E] shadow-xs text-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#7B1C2E] tracking-wider block mb-1">Assigned Assessor Contact</span>
                        <h2 className="text-sm font-extrabold text-gray-800 mt-0.5">Mary Wanjiku</h2>
                        <p className="text-[10.5px] text-gray-500 font-semibold mt-1">Tel: +254 799 000 111</p>
                      </div>
                      <div className="p-2 rounded-full bg-[#7B1C2E]/10 text-[#7B1C2E] group-hover:bg-[#7B1C2E] group-hover:text-white transition-colors duration-200">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#7B1C2E] p-4 rounded-lg border border-[#6F1424] shadow-xs text-white relative overflow-hidden text-xs hover:shadow-md hover:brightness-105 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15">
                      <Shield className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#F5E8EB]/90 tracking-wider block mb-0.5">Current Nudge</span>
                        <p className="text-[11.5px] font-bold line-clamp-2 md:max-w-[85%]">Fill in your dynamic logbook entries for this week before closure limit.</p>
                      </div>
                      <div className="p-1.5 rounded-full bg-white/10 text-white">
                        <Bell className="w-4 h-4 animate-bounce" />
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold text-[#F5E8EB] block mt-2 hover:underline cursor-pointer relative z-10" onClick={() => navigateTo('logbook')}>
                      Add Entry Now →
                    </span>
                  </div>
                </div>

                {/* Dashboard layout with widget on left and checklists on right */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Left Recent Entries Table Widget */}
                  <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-sm whitespace-nowrap">Recent Logbook Ledger</h3>
                      </div>



                      <button 
                        onClick={() => navigateTo('logbook')}
                        className="bg-[#7B1C2E] hover:bg-[#6A1727] text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" /> Add Daily Entry
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b bg-gray-50 font-bold text-gray-600">
                            <th 
                              className="py-2.5 px-3 cursor-pointer hover:bg-gray-100 hover:text-gray-950 transition-colors select-none"
                              onClick={() => setLogbookSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                              title="Toggle Date Sort Order"
                            >
                              <div className="flex items-center gap-1">
                                Date
                                {logbookSortOrder === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-[#7B1C2E]" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-[#7B1C2E]" />
                                )}
                              </div>
                            </th>
                            <th className="py-2.5 px-3">Activities summary</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Assessor Feedback</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logbookEntries.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center text-gray-400 py-8">No daily progress logs submitted.</td>
                            </tr>
                          ) : filteredLogbookEntries.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center text-gray-400 py-8">
                                <p className="text-gray-500 font-semibold mb-1">No log entries matched: "{logbookSearchQuery}"</p>
                                <button 
                                  onClick={() => setLogbookSearchQuery('')}
                                  className="text-[#7B1C2E] font-bold underline cursor-pointer hover:text-[#611624] text-xs"
                                  type="button"
                                >
                                  Clear Filter Query
                                </button>
                              </td>
                            </tr>
                          ) : (
                            [...filteredLogbookEntries]
                              .sort((a, b) => {
                                return logbookSortOrder === 'asc'
                                  ? a.entryDate.localeCompare(b.entryDate)
                                  : b.entryDate.localeCompare(a.entryDate);
                              })
                              .slice(0, 5)
                              .map(ent => (
                              <tr key={ent.id} className="border-b hover:bg-gray-50 text-gray-700">
                                <td className="py-3 px-3 font-medium whitespace-nowrap">{ent.entryDate}</td>
                                <td className="py-3 px-3 line-clamp-1 max-w-[240px] truncate">{ent.activitiesDescription}</td>
                                <td className="py-3 px-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    ent.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    ent.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                                    'bg-amber-100 text-amber-800'
                                  }`}>
                                    {ent.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3 italic text-gray-500 max-w-[180px] truncate">
                                  {ent.officerComments || 'No feedback yet'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right side checkouts */}
                  <div className="space-y-3">
                    {/* Fee Payment card if required */}
                    {traineeProfile && !traineeProfile.feePaid && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-2.5">
                        <div className="flex gap-2 text-amber-800">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <h4 className="font-bold text-[11px] uppercase tracking-wide">Attachment Administrative Fee</h4>
                        </div>
                        <p className="text-[11px] text-amber-700">All TVET attachment portfolios require a regulatory insurance and audit clearance fee of <b>KES 1,500.00</b>.</p>
                        
                        <div className="space-y-1.5 pt-0.5">
                          <label className="block text-[9px] font-bold text-gray-700 uppercase">M-Pesa payment mobile #</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={mpesaNumber} 
                              onChange={(e) => setMpesaNumber(e.target.value)}
                              className="px-2.5 py-1 border border-gray-300 rounded-md text-xs flex-1 bg-white" 
                              placeholder="2547XXXXXXXX"
                            />
                            <button 
                              onClick={triggerMpesaSTKPush}
                              disabled={isPaying}
                              className="bg-[#2E7D32] text-white px-2.5 py-1 text-xs font-bold rounded-md hover:bg-[#1B5E20] disabled:bg-gray-400 cursor-pointer"
                            >
                              {isPaying ? 'Pushing...' : 'Pay KES 1500'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick navigation */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1.5">
                      <h4 className="font-bold text-[10.5px] text-gray-405 uppercase tracking-wide mb-1.5">Essential Quick Access</h4>
                      <button onClick={() => navigateTo('documents')} className="w-full text-left flex items-center justify-between text-[11px] py-1.5 border-b text-gray-700 hover:text-[#7B1C2E] cursor-pointer">
                        <span>• Download Liability Attachment Insurance</span>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                      <button onClick={() => navigateTo('placement')} className="w-full text-left flex items-center justify-between text-[11px] py-1.5 border-b text-gray-700 hover:text-[#7B1C2E] cursor-pointer">
                        <span>• Print ILO Introduction Letter</span>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                      <button onClick={() => navigateTo('logbook')} className="w-full text-left flex items-center justify-between text-[11px] py-1.5 text-gray-700 hover:text-[#7B1C2E] cursor-pointer">
                        <span>• Check calendar entry omissions</span>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 2. DIGITAL LEGER/LOGBOOK TAB (Trainee) ==================== */}
            {currentUser.role === 'TRAINEE' && activeTab === 'logbook' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side Submission Form - Collapsible on Mobile to Save Display Space */}
                <div className="lg:col-span-1 bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-4 h-fit">
                  <div className="flex flex-col gap-1 border-b pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#7B1C2E]" /> Record Daily Practical log
                      </h3>
                      <button 
                        type="button"
                        onClick={() => setIsLogbookFormOpenMobile(!isLogbookFormOpenMobile)}
                        className="lg:hidden text-[10px] font-bold uppercase px-2 py-1 text-[#7B1C2E] border border-[#7B1C2E] rounded hover:bg-[#F5E8EB]"
                      >
                        {isLogbookFormOpenMobile ? 'Dismiss Form ↑' : 'Open Form ➕'}
                      </button>
                    </div>
                    {draftSavedAt && (
                      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 px-2.5 py-1 rounded-md text-[10px] mt-1.5 font-semibold transition border border-emerald-100/30 dark:border-emerald-800/20 shadow-xs">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Draft local backup enabled — autosaved {draftSavedAt}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to discard your current draft and clear the form?")) {
                              setActivitiesDescription('');
                              setSkillsAcquired('');
                              setToolsUsed('');
                              setNewEntryDate(new Date().toISOString().split('T')[0]);
                              try {
                                localStorage.removeItem('knpss_draft_activitiesDescription');
                                localStorage.removeItem('knpss_draft_skillsAcquired');
                                localStorage.removeItem('knpss_draft_toolsUsed');
                                localStorage.removeItem('knpss_draft_newEntryDate');
                                setDraftSavedAt(null);
                              } catch (e) {
                                console.warn(e);
                              }
                            }
                          }}
                          className="text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer uppercase text-[9px] tracking-wider ml-2"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {!placement ? (
                    <Alert variant="warning">You must register an active company placement details before submitting logbook logs.</Alert>
                  ) : (
                    <div className={`${isLogbookFormOpenMobile ? 'block' : 'hidden lg:block'} space-y-4`}>
                      <form onSubmit={handleAddLogbookEntry} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">Select Entry Date</label>
                          <input 
                            type="date" 
                            value={newEntryDate}
                            onChange={(e) => setNewEntryDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">Activities description (Min 50 chars)</label>
                          <textarea 
                            rows={3}
                            value={activitiesDescription}
                            onChange={(e) => setActivitiesDescription(e.target.value)}
                            placeholder="Describe the technical tasks and hands-on repairs you completed today"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7B1C2E]"
                            required
                          />
                          <span className="text-[10px] text-gray-400">{activitiesDescription.length} chars entered.</span>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">Practical competencies developed</label>
                          <textarea 
                            rows={2}
                            value={skillsAcquired}
                            onChange={(e) => setSkillsAcquired(e.target.value)}
                            placeholder="What real skills did you acquire?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7B1C2E]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">Tools and hardware instrumentation utilized</label>
                          <input 
                            type="text" 
                            value={toolsUsed}
                            onChange={(e) => setToolsUsed(e.target.value)}
                            placeholder="e.g. Multimeter, Fiber optic splices"
                            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7B1C2E]"
                          />
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                          <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <span className="block text-[10px] text-gray-500">Drag or Click to upload practical evidence photo</span>
                          <span className="text-[9px] text-[#2E7D32] bg-green-50 px-1 py-0.5 rounded mt-1 inline-block font-medium">Automatic virus scan enabled</span>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#7B1C2E] hover:bg-[#6A1727] text-white py-2 font-bold rounded-lg uppercase tracking-wide cursor-pointer text-xs"
                        >
                          Authorized Stamp & Submit
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Right side Logs Ledger details */}
                <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
                    <h3 className="font-bold text-gray-800 text-sm">Historical Logbooks & Assessments Index</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        id="download-logbook-report-button"
                        onClick={handleDownloadReport}
                        className="bg-[#2E7D32] hover:bg-[#25632B] text-white px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition leading-none shadow-sm cursor-pointer border border-green-700"
                        title="Download verified logbook reports as a professional PDF document"
                        type="button"
                      >
                        <FileDown className="w-4 h-4 text-emerald-100" /> Download Logbook Report
                      </button>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md dark:bg-gray-800">
                        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block"></span>
                        Late Limit check 48 Hour enforcement on
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 bg-gray-50 p-2.5 rounded-lg border">
                    <span className="col-span-7 text-[10px] font-bold text-gray-400 uppercase tracking-wide">Interactive Calendar Status</span>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                      <span key={d} className="text-center text-[11px] font-bold text-gray-500 py-1">{d}</span>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const dayVal = i - 3;
                      const hasApp = dayVal > 0 && dayVal % 7 === 1;
                      const hasPen = dayVal > 0 && dayVal % 7 === 3;
                      const hasLate = dayVal > 0 && dayVal % 7 === 5;
                      return (
                        <div key={i} className={`h-11 rounded-md flex flex-col justify-between p-1 border text-[10px] ${dayVal > 0 ? 'bg-white' : 'bg-gray-100 text-gray-300'}`}>
                          <span>{dayVal > 0 ? dayVal : ''}</span>
                          {dayVal > 0 && (
                            <span className={`w-full h-1.5 rounded-full ${hasApp ? 'bg-green-600' : hasPen ? 'bg-blue-500' : hasLate ? 'bg-red-500' : 'bg-gray-100'}`}></span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Search and Filters Block */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Keyword filter logs by description, tools used, skills or date..."
                      value={logbookSearchQuery}
                      onChange={(e) => setLogbookSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#7B1C2E] text-gray-800 dark:text-gray-100"
                    />
                    {logbookSearchQuery && (
                      <button 
                        type="button"
                        onClick={() => setLogbookSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-sm"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {filteredLogbookEntries.length === 0 ? (
                      <div className="p-8 border rounded-xl text-center text-gray-400 text-xs">
                        {logbookEntries.length === 0 ? (
                          "No entries submitted yet."
                        ) : (
                          <>
                            <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1">No log entries matched: "{logbookSearchQuery}"</p>
                            <button 
                              onClick={() => setLogbookSearchQuery('')}
                              className="text-[#7B1C2E] font-bold underline cursor-pointer"
                              type="button"
                            >
                              Clear search query filter
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      filteredLogbookEntries.map(ent => (
                        <div key={ent.id} className="p-4 border rounded-xl hover:border-[#7B1C2E]/40 transition text-xs relative space-y-2">
                        <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded px-2.5">
                          <span className="font-bold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#7B1C2E]" /> {ent.entryDate} (Week {ent.weekNumber})
                          </span>
                          <div className="flex items-center gap-1.5">
                            {ent.isLate && <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">LATE SUBMISSION</span>}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ent.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              ent.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              ent.status === 'CORRECTION_REQUESTED' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {ent.status}
                            </span>
                          </div>
                        </div>

                        <p className="font-medium text-gray-800 pt-1 leading-relaxed">{ent.activitiesDescription}</p>
                        
                        {(ent.skillsAcquired || ent.toolsUsed) && (
                          <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded border border-gray-100">
                            {ent.skillsAcquired && <div><b>Acquired competency:</b> {ent.skillsAcquired}</div>}
                            {ent.toolsUsed && <div><b>Instrumentation:</b> {ent.toolsUsed}</div>}
                          </div>
                        )}

                        {ent.officerComments && (
                          <div className="p-2 bg-[#F5E8EB]/30 border-l-2 border-[#7B1C2E] text-gray-700 italic">
                            <b>Officer Evaluation:</b> "{ent.officerComments}"
                          </div>
                        )}
                      </div>
                    ))) }
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 3. PLACEMENT DETAILS TAB (Trainee) ==================== */}
            {currentUser.role === 'TRAINEE' && activeTab === 'placement' && (
              !isInsuranceCodeValidated ? (
                <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-amber-200 shadow-sm text-center space-y-5 my-6">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-150">
                    <Lock className="w-8 h-8 animate-pulse text-[#7B1C2E]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-800 text-sm">🛡️ Institutional Insurance Verification Code Required</h3>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      To safeguard policy guidelines for industrial placement, all trainees must first validate the secure validation code contained in their official <b>KNPSS Attachment Insurance Form</b>.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded-lg text-[11px] space-y-2 text-slate-700 text-left">
                    <span className="font-bold block uppercase text-slate-500 text-[9px] tracking-wider">Verification Checklist:</span>
                    <p>1. Go to the <b>Institutional Documents Registry</b> tab.</p>
                    <p>2. Click on <b>"View Document"</b> next to the KNPSS Attachment Insurance Cover.</p>
                    <p>3. Enter the exact verification code printed on the cover (Seeded Default: <code className="font-mono bg-white border px-1 rounded text-red-700 font-bold">SAFE-KNP-2026</code>).</p>
                    <p>4. Once verified, you will be authorized immediately to proceed with registering your attachment company.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="bg-[#7B1C2E] hover:bg-[#6A1727] text-white px-5 py-2.5 rounded-lg text-xs font-bold w-full transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Go to Document Registry ➔
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Register placement detail Card info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-800 text-sm border-b pb-2 flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-[#7B1C2E]" /> Core Placement Information
                  </h3>

                  {placement && !isEditingPlacement ? (
                    <div className="space-y-3.5 text-xs text-gray-700">
                      <div className="p-4 bg-slate-50 border rounded-lg text-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wide">Host Institution Details</span>
                        <h4 className="font-bold text-sm text-[#7B1C2E]">{placement.companyName}</h4>
                        <p className="font-medium text-gray-600">{placement.companyAddress || 'Electricity House Nairobi Headquarters'}</p>
                        <p>County Hub: <span className="font-semibold text-gray-800">{placement.county}</span></p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-lg border border-dashed">
                        <div>
                          <span className="font-bold text-gray-400 block text-[9px] uppercase">Supervisor Name</span>
                          <span className="font-semibold text-slate-800">{placement.supervisorName || 'Unassigned'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-400 block text-[9px] uppercase">Supervisor Contact</span>
                          <span className="font-semibold text-slate-800">{placement.supervisorPhone || 'Unassigned'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-400 block text-[9px] uppercase">Supervisor Email</span>
                          <span className="font-semibold text-slate-800 break-all">{placement.supervisorEmail || 'Unassigned'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-400 block text-[9px] uppercase">Gis Coordinates</span>
                          <span className="font-mono text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-600 block text-center truncate mt-0.5">
                            {placement.locationLat ? `${Number(placement.locationLat).toFixed(5)}, ${placement.locationLng ? Number(placement.locationLng).toFixed(5) : ''}` : 'No Coordinates captured'}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t col-span-2">
                          <span className="font-bold text-gray-400 block text-[9px] uppercase">Attachment Duration Span</span>
                          <span className="font-medium text-gray-700">{placement.startDate || '2026-06-01'} to {placement.endDate || '2026-08-25'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-b pb-3.5">
                        <span className="font-bold text-gray-500 block">System Verification Status</span>
                        <span className="inline-block mt-1 bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                          Placement Verified & Assigned Assessor
                        </span>
                      </div>

                      {placement.isLocked ? (
                        <div className="mt-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-medium flex flex-col gap-1 items-center justify-center text-center">
                          <span className="flex items-center gap-1.5 font-bold">
                            🔒 Finalized & Permanently Locked
                          </span>
                          <span className="text-[10px] text-emerald-600">Your physical workplace GPS boundaries are permanently locked for TVET field assessing.</span>
                        </div>
                      ) : (
                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAcceptanceCompany(placement.companyName || '');
                              setAcceptanceAddress(placement.companyAddress || '');
                              setAcceptanceSupervisor(placement.supervisorName || '');
                              setAcceptancePhone(placement.supervisorPhone || '');
                              setAcceptanceEmail(placement.supervisorEmail || '');
                              setAcceptanceCounty(placement.county || 'Nairobi');
                              setAcceptanceLat(placement.locationLat ? String(placement.locationLat) : '');
                              setAcceptanceLng(placement.locationLng ? String(placement.locationLng) : '');
                              setIsEditingPlacement(true);
                            }}
                            className="w-full bg-[#1A1A1A] hover:bg-black text-white py-2.5 font-bold rounded-lg transition text-center cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            Edit Placement Details
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!acceptanceCompany || !acceptanceAddress || !acceptanceSupervisor || !acceptancePhone || !acceptanceEmail || !acceptanceLat || !acceptanceLng) {
                          alert("⚠️ You must fill in all placement details and capture your live GPS coordinates first!");
                          return;
                        }
                        setShowLockConfirmModal(true);
                      }} 
                      className="space-y-3.5 text-xs text-gray-700"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#7B1C2E] block tracking-wide mb-1.5">
                          {isEditingPlacement ? "Editing Verified Placement Info" : "Register Intake Placement"}
                        </span>
                        <p className="text-gray-500 mb-2">Provide host workplace details below. Coordinates must be captured live and cannot be typed manually.</p>
                      </div>
                      
                      <div>
                        <label className="block font-bold text-gray-700 uppercase">Registered Workplace Name</label>
                        <input 
                          type="text" 
                          value={acceptanceCompany}
                          onChange={(e) => setAcceptanceCompany(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white mt-1 font-semibold" 
                          placeholder="e.g. Kenya Power Office Headquarter"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 uppercase font-mono">Workplace Physical Address</label>
                        <div className="relative mt-1">
                          <input 
                            type="text" 
                            value={acceptanceAddress}
                            onChange={(e) => setAcceptanceAddress(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-white pr-8 font-medium text-gray-700" 
                            placeholder="Street, Office name (can be auto reverse-geocoded)"
                            required
                          />
                          {isReverseGeocoding && (
                            <span className="absolute right-2.5 top-2.5 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1C2E] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7B1C2E]"></span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase">County location</label>
                          <select 
                            value={acceptanceCounty}
                            onChange={(e) => setAcceptanceCounty(e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                          >
                            <option value="Nairobi">Nairobi</option>
                            <option value="Mombasa">Mombasa</option>
                            <option value="Nakuru">Nakuru</option>
                            <option value="Uasin Gishu">Uasin Gishu</option>
                            <option value="Kisumu">Kisumu</option>
                            <option value="Trans Nzoia">Trans Nzoia</option>
                            <option value="Kakamega">Kakamega</option>
                            <option value="Kiambu">Kiambu</option>
                            <option value="Machakos">Machakos</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 uppercase font-mono">Workplace Supervisor Name</label>
                          <input 
                            type="text" 
                            value={acceptanceSupervisor}
                            onChange={(e) => setAcceptanceSupervisor(e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                            placeholder="Engineering lead name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase">Supervisor Tel #</label>
                          <input 
                            type="text" 
                            value={acceptancePhone}
                            onChange={(e) => setAcceptancePhone(e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                            placeholder="+2547XXXXXXXX"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 uppercase">Supervisor Email</label>
                          <input 
                            type="email" 
                            value={acceptanceEmail}
                            onChange={(e) => setAcceptanceEmail(e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                            placeholder="supervisor@host.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Coordinates Section */}
                      <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF7F7] border border-[#7B1C2E]/10 rounded-xl space-y-0.5">
                        <div className="col-span-2 flex justify-between items-center mb-1">
                          <span className="font-bold text-[#7B1C2E] uppercase text-[10px] tracking-wider">
                            GPS Coordinates (Auto-Captured Only)
                          </span>
                          <span className="text-[10px] text-gray-500 italic font-medium">Strictly Read-Only</span>
                        </div>
                        <div>
                          <label className="block font-bold text-gray-500 uppercase text-[9px]">Captured Latitude</label>
                          <input 
                            type="text" 
                            value={acceptanceLat}
                            readOnly
                            className="w-full px-3 py-1.5 border border-gray-250 rounded-lg bg-gray-100 font-mono text-gray-650 mt-1 cursor-not-allowed"
                            placeholder="Auto captured lat"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-500 uppercase text-[9px]">Captured Longitude</label>
                          <input 
                            type="text" 
                            value={acceptanceLng}
                            readOnly
                            className="w-full px-3 py-1.5 border border-gray-250 rounded-lg bg-gray-100 font-mono text-gray-650 mt-1 cursor-not-allowed"
                            placeholder="Auto captured lng"
                            required
                          />
                        </div>
                        <div className="col-span-2 pt-2">
                          <button
                            type="button"
                            onClick={() => detectMyLocation()}
                            className="w-full bg-[#7B1C2E] hover:bg-[#6A1727] text-white py-2 font-bold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <Navigation className={`w-3.5 h-3.5 ${isReverseGeocoding ? 'animate-spin' : 'animate-pulse'}`} />
                            {isReverseGeocoding ? "Acquiring satellite signal..." : "Detect my location"}
                          </button>
                        </div>

                        {/* GPS Accuracy and strength bar */}
                        {gpsAccuracy !== null && (
                          <div className="col-span-2 bg-[#1E293B] text-white p-2.5 rounded-lg border border-slate-700 space-y-1 mt-2 animate-fadeIn">
                            <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  gpsAccuracy < 15 ? 'bg-emerald-400' : gpsAccuracy < 60 ? 'bg-amber-400' : 'bg-rose-500'
                                } animate-pulse`}></span>
                                GPS SIGNAL: <strong className="uppercase">{
                                  gpsAccuracy < 15 ? 'EXCELLENT' : gpsAccuracy < 60 ? 'MODERATE' : 'WEAK/POOR'
                                }</strong>
                              </span>
                              <span>ACCURACY: ±{gpsAccuracy.toFixed(1)}m</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  gpsAccuracy < 15 ? 'bg-emerald-400 w-full' : gpsAccuracy < 60 ? 'bg-amber-400 w-2/3' : 'bg-rose-500/80 w-1/3'
                                }`}
                              ></div>
                            </div>
                          </div>
                        )}

                        {acceptanceLat && acceptanceLng && !isNaN(parseFloat(acceptanceLat)) && !isNaN(parseFloat(acceptanceLng)) && (
                          <div className="col-span-2 mt-2">
                            <CapturePreviewMap 
                              lat={parseFloat(acceptanceLat)} 
                              lng={parseFloat(acceptanceLng)} 
                              companyName={acceptanceCompany || 'My Captured Placement'}
                              companyAddress={acceptanceAddress || 'Captured Physical Location'}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        {isEditingPlacement && (
                          <button
                            type="button"
                            onClick={() => setIsEditingPlacement(false)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 font-bold rounded-lg border border-gray-200 transition text-center cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                        <button type="submit" className="flex-2 w-full bg-[#7B1C2E] text-white py-2.5 font-bold hover:bg-[#6A1727] rounded-lg transition text-center cursor-pointer font-semibold uppercase tracking-wider">
                          {isEditingPlacement ? "Save & Permanent Lock" : "Register & Lock Placement"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Spatial Map representation of active placements */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">Industrial Placement Spatial Network</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Explore active TVET trainee host company placements mapped dynamically across Kenya counties via satellite OpenStreetMap tiles.</p>
                  </div>
                  
                  <div className="relative">
                    <PlacementMap 
                      placements={placementsList} 
                      currentTraineePlacement={placement}
                      onCaptureCoords={(lat, lng) => {
                        setAcceptanceLat(lat.toFixed(6));
                        setAcceptanceLng(lng.toFixed(6));
                      }}
                    />
                  </div>
                </div>
              </div>
              )
            )}

            {/* ==================== 4. DOCUMENT CENTER TAB (Trainee) ==================== */}
            {currentUser.role === 'TRAINEE' && activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-[#7B1C2E]" />
                      Institutional Documents Registry
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Access certified academic attachment materials, policy guides, and mandatory forms. Some documents are designated by the Liaison Office as "Read-Only" or require compliance screening.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded-lg shrink-0 text-xs">
                    <span className="text-amber-800 font-bold">Insurance Integration status:</span>
                    {isInsuranceCodeValidated ? (
                      <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                        ✓ VERIFIED & UNLOCKED
                      </span>
                    ) : (
                      <span className="bg-amber-600 text-white font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                        🔒 COMPLIANCE PENDING
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map(doc => {
                    const isInsuranceDoc = doc.category === 'INSURANCE';
                    const isLockedInsurance = isInsuranceDoc && !isInsuranceCodeValidated;
                    const isViewOnly = doc.downloadPolicy === 'VIEW_ONLY';

                    return (
                      <div key={doc.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4 relative overflow-hidden">
                        {isLockedInsurance && (
                          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                            <div className="bg-amber-100 text-amber-800 text-[9px] font-bold py-1 text-center rotate-45 transform translate-x-7 translate-y-4 shadow-sm border border-amber-200">
                              LOCKED
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#F5E8EB] text-[#7B1C2E] font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                              {doc.category === 'POLICY' ? 'HANDBOOK / POLICY' : doc.category}
                            </span>
                            
                            {isInsuranceDoc && (
                              isInsuranceCodeValidated ? (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[9px] flex items-center gap-1">
                                  ✓ Cleared
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded text-[9px] flex items-center gap-1">
                                  🔐 Requires Code
                                </span>
                              )
                            )}

                            {isViewOnly ? (
                              <span className="bg-slate-100 text-slate-700 border border-slate-200 font-medium px-2 py-0.5 rounded text-[9px]">
                                👁️ View Only
                              </span>
                            ) : (
                              <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium px-2 py-0.5 rounded text-[9px]">
                                📥 Downloadable
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{doc.title}</h4>
                            <p className="text-slate-500 text-[11px] mt-0.5">Release Version: <b className="text-slate-700">{doc.version || 'v1.0'}</b></p>
                          </div>

                          <div className="bg-slate-50 border p-2.5 rounded-lg text-[11px] text-slate-600 space-y-1">
                            <p className="flex items-center gap-1.5">
                              <b>File Integrity:</b> <span className="font-mono text-[10px] truncate text-slate-500">{doc.fileHash}</span>
                            </p>
                            <p>
                              <b>Access Rules:</b> {isViewOnly ? "Direct download restricted. Read online viewport only." : "Direct local download allowed to Trainee file system."}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center pt-2 border-t border-slate-100">
                          {isLockedInsurance ? (
                            <button 
                              onClick={() => {
                                setViewingDoc(doc);
                                setTypedValidationCode('');
                                setValidationError('');
                              }}
                              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                            >
                              <Lock className="w-3.5 h-3.5" /> View & Unlock Insurance
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => {
                                  setViewingDoc(doc);
                                  setTypedValidationCode('');
                                  setValidationError('');
                                }}
                                className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500" /> View Document
                              </button>
                              
                              {!isViewOnly && (
                                <button 
                                  onClick={() => handleDownloadDocument(doc)}
                                  className="flex-1 bg-[#7B1C2E] hover:bg-[#6A1727] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition"
                                >
                                  <FileDown className="w-3.5 h-3.5" /> Download
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== 4b. MY PROFILE TAB (Trainee) ==================== */}
            {currentUser.role === 'TRAINEE' && activeTab === 'profile' && (
              <div className="space-y-6">
                
                {/* Lifecycle Progress Bar */}
                {/* Desktop View (Always Visible) */}
                <div className="hidden md:block bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 tracking-wide">Attachment Lifecycle Process Status</h3>
                  <div className="relative flex flex-row items-start justify-between gap-2">
                    {/* Horizontal Connector lines */}
                    <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-200 z-0"></div>
                    <div className="absolute left-4 h-0.5 bg-[#7B1C2E] top-4 z-0 transition-all" style={{ width: placement ? '60%' : '15%' }}></div>

                    {/* Step 1: Eligibility */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? '✓' : '1'}
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">1. Clearance Checks</span>
                        <span className="text-[9.5px] text-[#2E7D32] bg-green-50 px-1.5 py-0.5 rounded mt-0.5 font-bold mx-auto">Eligible Approved</span>
                      </div>
                    </div>

                    {/* Step 2: Placement */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${placement ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {placement ? '✓' : '2'}
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">2. Placement Registered</span>
                        <span className="text-[9.5px] text-gray-500">{placement ? (placement.companyName.length > 18 ? placement.companyName.substring(0,18) + '...' : placement.companyName) : 'Pending Record'}</span>
                      </div>
                    </div>

                    {/* Step 3: Active Logbook tracking */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${logbookEntries.length > 0 ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        3
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">3. Attachment Period</span>
                        <span className="text-[9.5px] text-[#2E7D32] font-semibold">{logbookEntries.filter(l => l.status === 'APPROVED').length} Approved Entries</span>
                      </div>
                    </div>

                    {/* Step 4: Assessment */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${placement?.status === 'ASSESSED' || placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        4
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">4. Assessor On-Site</span>
                        <span className="text-[9.5px] font-bold text-amber-700">{placement?.status === 'ASSESSED' ? 'Visit Completed' : 'Pending visit'}</span>
                      </div>
                    </div>

                    {/* Step 5: Completed */}
                    <div className="flex flex-col items-center text-center relative z-10 gap-2 w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition shrink-0 ${placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        5
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-800">5. Complete Portfolio</span>
                        <span className="text-[9.5px] font-bold text-[#2E7D32]">{placement?.status === 'COMPLETED' ? 'Authorized ✓' : 'Awaiting Review'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile View Accordion Button Opening */}
                <div className="md:hidden bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Attachment Milestones Status</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#7B1C2E] animate-pulse shrink-0"></span>
                        <span className="text-xs font-bold text-[#7B1C2E]">
                          {placement?.status === 'COMPLETED' ? 'Stage 5: Complete Portfolio Authorized' :
                           placement?.status === 'ASSESSED' ? 'Stage 4: Assessor On-Site Completed' :
                           logbookEntries.length > 0 ? 'Stage 3: Attachment Underway' :
                           placement ? 'Stage 2: Workplace Registered' :
                           traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? 'Stage 1: Cleared for Attachment' :
                           'Stage 0: Registration Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setIsLifecycleExpanded(!isLifecycleExpanded)}
                      className="px-3 py-1.5 text-[10px] font-extrabold uppercase rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow-sm border border-red-700 active:scale-95 transition-all shrink-0"
                    >
                      {isLifecycleExpanded ? 'Hide Path ←' : 'View Path •••'}
                    </button>
                  </div>

                  {isLifecycleExpanded && (
                    <div className="pt-3 border-t border-gray-100 space-y-4">
                      {/* Step 1 Mobile */}
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? '✓' : '1'}
                        </div>
                        <div className="text-xs leading-none">
                          <p className="font-bold text-gray-800">1. Clearance & Eligibility Approved</p>
                          <p className="text-[10px] font-semibold text-[#2E7D32] mt-0.5">Eligible student cleared by registrar</p>
                        </div>
                      </div>

                      {/* Step 2 Mobile */}
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${placement ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {placement ? '✓' : '2'}
                        </div>
                        <div className="text-xs leading-none">
                          <p className="font-bold text-gray-800">2. Placement Workplace Registered</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{placement ? placement.companyName : 'Pending coordinates action'}</p>
                        </div>
                      </div>

                      {/* Step 3 Mobile */}
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${logbookEntries.length > 0 ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          3
                        </div>
                        <div className="text-xs leading-none">
                          <p className="font-bold text-gray-800">3. Dynamic Daily Logbook Logged</p>
                          <p className="text-[10px] text-[#2E7D32] font-semibold mt-0.5">{logbookEntries.filter(l => l.status === 'APPROVED').length} active logs approved</p>
                        </div>
                      </div>

                      {/* Step 4 Mobile */}
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${placement?.status === 'ASSESSED' || placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          4
                        </div>
                        <div className="text-xs leading-none">
                          <p className="font-bold text-gray-800">4. GIS Assessor Site Assessment</p>
                          <p className="text-[10px] font-bold text-amber-700 mt-0.5">{placement?.status === 'ASSESSED' ? 'Verification successfully completed' : 'Awaiting physical check'}</p>
                        </div>
                      </div>

                      {/* Step 5 Mobile */}
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${placement?.status === 'COMPLETED' ? 'bg-[#7B1C2E] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          5
                        </div>
                        <div className="text-xs leading-none">
                          <p className="font-bold text-gray-800">5. Complete Portfolio Signed Off</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-0.5">{placement?.status === 'COMPLETED' ? 'Fully authorized on portal' : 'Pending final validation'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile incomplete warning banner */}
                {(!currentUser.phone || !currentUser.profilePhotoUrl) && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-950 p-4 rounded-xl shadow-xs flex items-center gap-3 text-xs">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold">Your profile is incomplete.</p>
                      <p className="text-[11px] text-amber-800">Please add your phone number to receive SMS notifications.</p>
                    </div>
                  </div>
                )}

                {/* Profile Header Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#7B1C2E]/5 rounded-full translate-x-12 -translate-y-12"></div>
                  
                  {/* Photo with Edit camera hover icon */}
                  <div className="relative group w-24 h-24 rounded-full border-4 border-[#F5E8EB] shadow-md bg-gray-50 flex-shrink-0 overflow-hidden">
                    <img 
                      src={currentUser.profilePhotoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"} 
                      className="w-full h-full object-cover" 
                      alt="Trainee Avatar" 
                    />
                    <label className="absolute inset-x-0 bottom-0 bg-black/60 h-8 flex items-center justify-center cursor-pointer transition-opacity text-white hover:bg-[#7B1C2E]/90">
                      <span className="text-[9px] uppercase font-bold tracking-tight">Edit Photo</span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!['image/jpeg', 'image/png'].includes(file.type)) {
                            setErrorMsg("Please select a JPG or PNG image.");
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            setErrorMsg("Maximum allowed image file size is 2MB.");
                            return;
                          }
                          const url = URL.createObjectURL(file);
                          setPhotoSelectedUrl(url);
                          setIsCroppingOpen(true);
                        }} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-800 leading-tight">{currentUser.fullName}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mx-auto sm:mx-0 w-fit ${
                        traineeProfile?.eligibilityStatus === 'ELIGIBLE' 
                          ? 'bg-green-100 text-[#2E7D32]' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {traineeProfile?.eligibilityStatus === 'ELIGIBLE' ? '✓ Eligible' : 'Pending Clearance'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold">{traineeProfile?.courseName || "Diploma in Information Communication Technology"}</p>
                    <p className="text-[11px] text-gray-400">Cohort Year: <span className="font-medium text-gray-600">{traineeProfile?.cohort || "2023 Intake"}</span></p>
                  </div>
                </div>

                {/* Collapsible Tabs segments */}
                <div className="space-y-4">
                  
                  {/* Item 1: Personal Information */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button 
                      type="button" 
                      onClick={() => setProfilePersonalExpanded(!profilePersonalExpanded)}
                      className="w-full px-5 py-3.5 bg-gray-50/50 flex justify-between items-center text-xs font-bold text-gray-700 uppercase hover:bg-gray-100/50 transition border-b"
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#7B1C2E]" /> Personal Information
                      </span>
                      <span className="text-gray-400 font-mono">{profilePersonalExpanded ? 'Collapse ▲' : 'Expand ▼'}</span>
                    </button>

                    {profilePersonalExpanded && (
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Contact & Central Registry Details</p>
                          {!isEditingProfile ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditPhone(currentUser.phone || '');
                                setEditEmail(currentUser.email || '');
                                setIsEditingProfile(true);
                              }}
                              className="px-3 py-1 text-xs border border-[#7B1C2E] text-[#7B1C2E] hover:bg-[#F5E8EB] rounded font-semibold transition"
                            >
                              Edit Profile
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="px-3 py-1 text-xs border border-gray-300 text-gray-600 hover:bg-gray-50 rounded font-semibold transition"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await handleUpdateUser({ phone: editPhone, email: editEmail });
                                }}
                                className="px-3 py-1 text-xs bg-[#7B1C2E] hover:bg-[#6A1727] text-white rounded font-semibold transition"
                              >
                                Save Details
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Full Name */}
                          <div className="space-y-1 relative group">
                            <label className="block font-bold text-gray-500 uppercase flex items-center gap-1">
                              Full Name <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </label>
                            <input 
                              type="text" 
                              value={currentUser.fullName} 
                              disabled 
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                            />
                            <p className="text-[9.5px] text-gray-400 mt-0.5">Contact your ILO to update this information.</p>
                          </div>

                          {/* Admission Number */}
                          <div className="space-y-1 relative group">
                            <label className="block font-bold text-gray-500 uppercase flex items-center gap-1">
                              Admission Number <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </label>
                            <input 
                              type="text" 
                              value={traineeProfile?.admissionNo || "KNPSS/DICT/2022/4102"} 
                              disabled 
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed font-medium font-mono"
                            />
                            <p className="text-[9.5px] text-gray-400 mt-0.5">Contact your ILO to update this information.</p>
                          </div>

                          {/* National ID card */}
                          <div className="space-y-1 relative group">
                            <label className="block font-bold text-gray-500 uppercase flex items-center gap-1">
                              National ID <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </label>
                            <input 
                              type="text" 
                              value={currentUser.nationalId || "38459201"} 
                              disabled 
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed font-medium font-mono"
                            />
                            <p className="text-[9.5px] text-gray-400 mt-0.5">Contact your ILO to update this information.</p>
                          </div>

                          {/* DOB */}
                          <div className="space-y-1 relative group">
                            <label className="block font-bold text-gray-500 uppercase flex items-center gap-1">
                              Date of Birth <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </label>
                            <input 
                              type="date" 
                              value={currentUser.dob || "2001-05-18"} 
                              disabled 
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                            />
                            <p className="text-[9.5px] text-gray-400 mt-0.5">Contact your ILO to update this information.</p>
                          </div>

                          {/* Gender */}
                          <div className="space-y-1 relative group">
                            <label className="block font-bold text-gray-500 uppercase flex items-center gap-1">
                              Gender <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </label>
                            <input 
                              type="text" 
                              value={currentUser.gender || "Male"} 
                              disabled 
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                            />
                            <p className="text-[9.5px] text-gray-400 mt-0.5">Contact your ILO to update this information.</p>
                          </div>

                          {/* Phone Number */}
                          <div className="space-y-1">
                            <label className="block font-bold text-gray-700 uppercase flex items-center gap-1.5">
                              Phone Number {isEditingProfile && <span className="text-red-500 font-bold">*</span>}
                            </label>
                            <input 
                              type="text" 
                              value={editPhone} 
                              disabled={!isEditingProfile} 
                              onChange={(e) => setEditPhone(e.target.value)}
                              placeholder="+2547XXXXXXXX"
                              className={`w-full px-3 py-2 border rounded-lg transition text-xs font-semibold ${
                                isEditingProfile 
                                  ? 'border-[#7B1C2E] focus:outline-none focus:ring-1 focus:ring-[#7B1C2E] bg-white text-gray-800' 
                                  : 'border-gray-200 bg-gray-50 text-gray-500'
                              }`}
                            />
                            {isEditingProfile && <span className="text-[10px] text-gray-400 block mt-1">Add phone to ensure Africa's Talking notifications</span>}
                          </div>

                          {/* Email address */}
                          <div className="space-y-1">
                            <label className="block font-bold text-gray-700 uppercase">
                              Institutional Email Address
                            </label>
                            <input 
                              type="email" 
                              value={editEmail} 
                              disabled={!isEditingProfile} 
                              onChange={(e) => setEditEmail(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition text-xs font-semibold ${
                                isEditingProfile 
                                  ? 'border-[#7B1C2E] focus:outline-none focus:ring-1 focus:ring-[#7B1C2E] bg-white text-gray-800' 
                                  : 'border-gray-200 bg-gray-50 text-gray-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item 2: Academic details */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button 
                      type="button" 
                      onClick={() => setProfileAcademicExpanded(!profileAcademicExpanded)}
                      className="w-full px-5 py-3.5 bg-gray-50/50 flex justify-between items-center text-xs font-bold text-gray-700 uppercase hover:bg-gray-100/50 transition border-b"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#7B1C2E]" /> Academic Information
                      </span>
                      <span className="text-gray-400 font-mono">{profileAcademicExpanded ? 'Collapse ▲' : 'Expand ▼'}</span>
                    </button>

                    {profileAcademicExpanded && (
                      <div className="p-5 space-y-4">
                        <div className="bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 text-[11px] leading-relaxed">
                          🛡️ Only the Admin (ILO) can change academic program records. Hover or attempt to modify triggers lock indicators. Contact registrar office for any corrections.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Course name */}
                          <div className="space-y-1">
                            <span className="block font-bold text-gray-400 uppercase">Course/Program Name</span>
                            <div className="p-2.5 bg-gray-50 rounded-lg border text-gray-700 font-semibold">{traineeProfile?.courseName || "Diploma in Information Communication Technology"}</div>
                          </div>

                          {/* Course code */}
                          <div className="space-y-1">
                            <span className="block font-bold text-gray-400 uppercase font-mono">Course Code</span>
                            <div className="p-2.5 bg-gray-50 rounded-lg border text-gray-700 font-mono font-bold uppercase">{traineeProfile?.courseCode || "DICT"}</div>
                          </div>

                          {/* Cohort */}
                          <div className="space-y-1">
                            <span className="block font-bold text-gray-400 uppercase">Cohort/Intake Year</span>
                            <div className="p-2.5 bg-gray-50 rounded-lg border text-gray-700 font-semibold">{traineeProfile?.cohort || "2023 Intake"}</div>
                          </div>

                          {/* Duration weeks */}
                          <div className="space-y-1">
                            <span className="block font-bold text-gray-400 uppercase">Expected duration</span>
                            <div className="p-2.5 bg-gray-50 rounded-lg border text-gray-700 font-semibold">{traineeProfile?.attachmentDurationWeeks || 12} Weeks Attachment</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item 3: host placement details */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button 
                      type="button" 
                      onClick={() => setProfilePlacementExpanded(!profilePlacementExpanded)}
                      className="w-full px-5 py-3.5 bg-gray-50/50 flex justify-between items-center text-xs font-bold text-gray-700 uppercase hover:bg-gray-100/50 transition border-b"
                    >
                      <span className="flex items-center gap-2">
                        <HardHat className="w-4 h-4 text-[#7B1C2E]" /> Placement Information
                      </span>
                      <span className="text-gray-400 font-mono">{profilePlacementExpanded ? 'Collapse ▲' : 'Expand ▼'}</span>
                    </button>

                    {profilePlacementExpanded && (
                      <div className="p-5 space-y-4">
                        {isEditingPlacementInProfile ? (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!acceptanceCompany || !acceptanceAddress || !acceptanceSupervisor || !acceptancePhone || !acceptanceEmail || !acceptanceLat || !acceptanceLng) {
                                alert("⚠️ You must fill in all placement details and capture your live GPS coordinates first!");
                                return;
                              }
                              setShowLockConfirmModal(true);
                            }} 
                            className="space-y-3.5 text-xs text-gray-700"
                          >
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#7B1C2E] block tracking-wide mb-1">
                                Editing Profile Placement Details
                              </span>
                              <p className="text-gray-500 mb-2">Update all required boxes below to save your updated host institution details.</p>
                            </div>
                            
                            <div>
                              <label className="block font-bold text-gray-700 uppercase">Registered Workplace Name</label>
                              <input 
                                type="text" 
                                value={acceptanceCompany}
                                onChange={(e) => setAcceptanceCompany(e.target.value)}
                                className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1" 
                                placeholder="Host Institution name"
                                required
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-gray-700 uppercase font-mono">Workplace Physical Address</label>
                              <div className="relative mt-1">
                                <input 
                                  type="text" 
                                  value={acceptanceAddress}
                                  onChange={(e) => setAcceptanceAddress(e.target.value)}
                                  className="w-full px-3 py-1.5 border rounded-lg bg-white pr-8 font-medium text-gray-700 mt-1" 
                                  placeholder="Street, Office name (can be auto reverse-geocoded)"
                                  required
                                />
                                {isReverseGeocoding && (
                                  <span className="absolute right-2.5 top-2.5 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1C2E] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7B1C2E]"></span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-bold text-gray-700 uppercase">County location</label>
                                <select 
                                  value={acceptanceCounty}
                                  onChange={(e) => setAcceptanceCounty(e.target.value)}
                                  className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                                >
                                  <option value="Nairobi">Nairobi</option>
                                  <option value="Mombasa">Mombasa</option>
                                  <option value="Nakuru">Nakuru</option>
                                  <option value="Uasin Gishu">Uasin Gishu</option>
                                  <option value="Kisumu">Kisumu</option>
                                  <option value="Trans Nzoia">Trans Nzoia</option>
                                  <option value="Kakamega">Kakamega</option>
                                  <option value="Kiambu">Kiambu</option>
                                  <option value="Machakos">Machakos</option>
                                </select>
                              </div>
                              <div>
                                <label className="block font-bold text-gray-700 uppercase font-mono">Workplace Supervisor Name</label>
                                <input 
                                  type="text" 
                                  value={acceptanceSupervisor}
                                  onChange={(e) => setAcceptanceSupervisor(e.target.value)}
                                  className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                                  placeholder="Engineering lead"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-bold text-gray-700 uppercase">Supervisor Tel #</label>
                                <input 
                                  type="text" 
                                  value={acceptancePhone}
                                  onChange={(e) => setAcceptancePhone(e.target.value)}
                                  className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block font-bold text-gray-700 uppercase font-mono">Supervisor Email</label>
                                <input 
                                  type="email" 
                                  value={acceptanceEmail}
                                  onChange={(e) => setAcceptanceEmail(e.target.value)}
                                  className="w-full px-3 py-1.5 border rounded-lg bg-white mt-1"
                                  required
                                />
                              </div>
                            </div>

                            {/* Coordinates and accuracy indicator */}
                            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF7F7] border border-[#7B1C2E]/10 rounded-xl space-y-0.5">
                              <div className="col-span-2 flex justify-between items-center mb-1">
                                <span className="font-bold text-[#7B1C2E] uppercase text-[10px] tracking-wider">
                                  GPS Coordinates (Auto-Captured Only)
                                </span>
                                <span className="text-[10px] text-gray-500 italic font-medium">Strictly Read-Only</span>
                              </div>
                              <div>
                                <label className="block font-bold text-gray-500 uppercase text-[9px]">Captured Latitude</label>
                                <input 
                                  type="text" 
                                  value={acceptanceLat}
                                  readOnly
                                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-100 font-mono text-gray-650 mt-1 cursor-not-allowed"
                                  placeholder="Auto captured lat"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block font-bold text-gray-500 uppercase text-[9px]">Captured Longitude</label>
                                <input 
                                  type="text" 
                                  value={acceptanceLng}
                                  readOnly
                                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-100 font-mono text-gray-650 mt-1 cursor-not-allowed"
                                  placeholder="Auto captured lng"
                                  required
                                />
                              </div>
                              <div className="col-span-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => detectMyLocation()}
                                  className="w-full bg-[#7B1C2E] hover:bg-[#6A1727] text-white py-2 font-bold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                                >
                                  <Navigation className={`w-3.5 h-3.5 ${isReverseGeocoding ? 'animate-spin' : 'animate-pulse'}`} />
                                  {isReverseGeocoding ? "Acquiring satellite signal..." : "Detect my location"}
                                </button>
                              </div>

                              {/* GPS Accuracy and strength bar */}
                              {gpsAccuracy !== null && (
                                <div className="col-span-2 bg-[#1E293B] text-white p-2.5 rounded-lg border border-slate-700 space-y-1 mt-2 animate-fadeIn">
                                  <div className="flex justify-between items-center text-[9px] font-mono">
                                    <span className="flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        gpsAccuracy < 15 ? 'bg-emerald-400' : gpsAccuracy < 60 ? 'bg-amber-400' : 'bg-rose-500'
                                      } animate-pulse`}></span>
                                      GPS SIGNAL: <strong className="uppercase">{
                                        gpsAccuracy < 15 ? 'EXCELLENT' : gpsAccuracy < 60 ? 'MODERATE' : 'WEAK/POOR'
                                      }</strong>
                                    </span>
                                    <span>ACCURACY: ±{gpsAccuracy.toFixed(1)}m</span>
                                  </div>
                                  <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        gpsAccuracy < 15 ? 'bg-emerald-400 w-full' : gpsAccuracy < 60 ? 'bg-amber-400 w-2/3' : 'bg-rose-500/80 w-1/3'
                                      }`}
                                    ></div>
                                  </div>
                                </div>
                              )}

                              {acceptanceLat && acceptanceLng && !isNaN(parseFloat(acceptanceLat)) && !isNaN(parseFloat(acceptanceLng)) && (
                                <div className="col-span-2 mt-2">
                                  <CapturePreviewMap 
                                    lat={parseFloat(acceptanceLat)} 
                                    lng={parseFloat(acceptanceLng)} 
                                    companyName={acceptanceCompany || 'My Captured Placement'}
                                    companyAddress={acceptanceAddress || 'Captured Physical Location'}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2.5 pt-2">
                              <button
                                type="button"
                                onClick={() => setIsEditingPlacementInProfile(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 font-bold rounded-lg border border-gray-200 transition text-center cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button type="submit" className="flex-2 w-full bg-[#7B1C2E] text-white py-2.5 font-bold hover:bg-[#6A1727] rounded-lg transition text-center cursor-pointer font-semibold uppercase tracking-wider">
                                Save Profile Placement
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-200 text-[11px] leading-relaxed">
                              ✨ Placement details can be updated directly below. Ensure all boxes in this container are filled to complete verification.
                            </div>

                            {!placement ? (
                              <div className="space-y-3">
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs font-semibold text-amber-805">
                                  No workplace registration record currently active. Click below to add placement coordinates and supervisor details.
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAcceptanceCompany('');
                                    setAcceptanceAddress('');
                                    setAcceptanceSupervisor('');
                                    setAcceptancePhone('');
                                    setAcceptanceEmail('');
                                    setAcceptanceCounty('Trans Nzoia');
                                    setAcceptanceLat('');
                                    setAcceptanceLng('');
                                    setIsEditingPlacementInProfile(true);
                                  }}
                                  className="w-full bg-[#7B1C2E] text-white py-2.5 font-semibold hover:bg-[#6A1727] rounded-lg transition text-center cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Register Placement Info
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                  <div className="space-y-0.5">
                                    <span className="block font-bold text-gray-400 uppercase">Company Name</span>
                                    <span className="block font-bold text-[#7B1C2E] text-sm">{placement.companyName}</span>
                                  </div>

                                  <div className="space-y-0.5">
                                    <span className="block font-bold text-gray-400 uppercase">Supervisor Name</span>
                                    <span className="block font-bold text-[#7B1C2E] text-sm">{placement.supervisorName || "John Mwangi"}</span>
                                  </div>

                                  <div className="space-y-0.5">
                                    <span className="block font-bold text-gray-400 uppercase">Supervisor Phone</span>
                                    <span className="block font-medium text-gray-700">{placement.supervisorPhone || "+254719082723"}</span>
                                  </div>

                                  <div className="space-y-0.5">
                                    <span className="block font-bold text-gray-400 uppercase">Supervisor Email</span>
                                    <span className="block font-medium text-gray-700">{placement.supervisorEmail || "N/A"}</span>
                                  </div>

                                  <div className="space-y-0.5">
                                    <span className="block font-bold text-gray-400 uppercase">Physical Address</span>
                                    <span className="block font-medium text-gray-700">{placement.companyAddress || "N/A"}</span>
                                  </div>

                                  <div className="space-y-0.5">
                                    <span className="block font-bold text-gray-400 uppercase">County Hub</span>
                                    <span className="block font-medium text-gray-700">{placement.county || "Nairobi"}</span>
                                  </div>

                                  <div className="col-span-1 sm:col-span-2 space-y-0.5">
                                    <span className="block font-bold text-gray-400 uppercase font-mono">Attachment Duration Span</span>
                                    <span className="block font-medium text-gray-700">{placement.startDate || "2026-05-10"} to {placement.endDate || "2026-08-04"}</span>
                                  </div>
                                </div>

                                {placement.locationLat && placement.locationLng && (
                                  <div className="border border-gray-100 rounded-lg overflow-hidden shrink-0 mt-3">
                                    <div className="h-44 w-full relative">
                                      <PlacementMap 
                                        placements={placementsList} 
                                        currentTraineePlacement={placement}
                                        onCaptureCoords={() => {}}
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="pt-2">
                                  {placement.isLocked ? (
                                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-250 font-medium flex flex-col gap-0.5 items-center justify-center text-center">
                                      <span className="flex items-center gap-1.5 font-bold">
                                        🔒 Finalized & Permanently Locked
                                      </span>
                                      <span className="text-[10px] text-emerald-600">Your profile placement coordinates are locked for field assessor audits.</span>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAcceptanceCompany(placement.companyName || '');
                                        setAcceptanceAddress(placement.companyAddress || '');
                                        setAcceptanceSupervisor(placement.supervisorName || '');
                                        setAcceptancePhone(placement.supervisorPhone || '');
                                        setAcceptanceEmail(placement.supervisorEmail || '');
                                        setAcceptanceCounty(placement.county || 'Nairobi');
                                        setAcceptanceLat(placement.locationLat ? String(placement.locationLat) : '');
                                        setAcceptanceLng(placement.locationLng ? String(placement.locationLng) : '');
                                        setIsEditingPlacementInProfile(true);
                                      }}
                                      className="w-full bg-[#1A1A1A] hover:bg-black text-white py-2.5 font-bold rounded-lg transition text-center cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                                    >
                                      <Settings className="w-3.5 h-3.5" />
                                      Edit Placement Details
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 5. ASSESSOR DASHBOARD (Officer Tab) ==================== */}
            {currentUser.role === 'OFFICER' && activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Card 1: Dynamic Black Tech Card */}
                  <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-4 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-[1.02] hover:border-neutral-700 group">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                      <Users className="w-20 h-20 text-white" />
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-neutral-800/10 rounded-full blur-2xl group-hover:bg-neutral-700/20 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col justify-between h-full gap-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">Assigned Trainees</span>
                          <h2 className="text-xl font-black text-white leading-none tracking-tight">{placementsList.length} Students</h2>
                        </div>
                        <div className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 group-hover:bg-white group-hover:text-black transition-all">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-[9px] text-neutral-400 font-medium pt-1.5 border-t border-neutral-800/80">
                        Active site supervision
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Dynamic Maroon Polytechnic Branding Card */}
                  <div className="bg-gradient-to-br from-[#7B1C2E] via-[#5C1320] to-[#400B14] p-4 rounded-2xl border border-[#942E3F]/40 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(123,28,46,0.35)] hover:scale-[1.02] hover:border-[#B13E53]/60 group">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none group-hover:scale-110 group-hover:opacity-15 transition-all duration-500">
                      <FileText className="w-20 h-20 text-rose-200" />
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-rose-400/10 rounded-full blur-2xl group-hover:bg-rose-400/20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full gap-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-rose-200/80 tracking-wider block">Logbook Reviews</span>
                          <h2 className="text-xl font-black text-white leading-none tracking-tight">1 Pending</h2>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/10 text-rose-100 group-hover:bg-white group-hover:text-[#7B1C2E] transition-all">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-[9px] text-rose-200/70 font-medium pt-1.5 border-t border-white/10">
                        Requires action review
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Dynamic Emerald Compliance/Green Design Card */}
                  <div className="bg-gradient-to-br from-emerald-950 via-[#0A261D] to-black p-4 rounded-2xl border border-emerald-900/50 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(16,185,129,0.2)] hover:scale-[1.02] hover:border-emerald-500/40 group">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none group-hover:scale-110 group-hover:opacity-15 transition-all duration-500">
                      <Award className="w-20 h-20 text-emerald-300" />
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full gap-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-emerald-400/90 tracking-wider block flex items-center gap-1">
                            <span className="inline-flex relative h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                            </span>
                            Physical Audit
                          </span>
                          <h2 className="text-xl font-black text-white leading-none tracking-tight">1 On-site Due</h2>
                        </div>
                        <div className="p-1.5 rounded-lg bg-emerald-900/40 border border-emerald-800/40 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black transition-all">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-[9px] text-emerald-400/80 font-bold pt-1.5 border-t border-emerald-900/60">
                        Inspection scheduled
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (7 cols): Trainees List */}
                  <div className="lg:col-span-7 bg-white shadow-sm border rounded-xl p-5 space-y-4">
                    <div className="border-b pb-2">
                      <h3 className="font-bold text-gray-800 text-sm">Assigned Students Attachment Timeline</h3>
                      <p className="text-gray-500 text-[11px] mt-0.5">Select a student row below to locate their registered workplace on the map.</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-700 min-w-[500px]">
                        <thead>
                          <tr className="bg-gray-50 font-bold border-b text-gray-600">
                            <th className="py-2.5 px-2">Student</th>
                            <th className="py-2.5 px-2">Workplace</th>
                            <th className="py-2.5 px-2">GPS Coordinates</th>
                            <th className="py-2.5 px-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {placementsList.map(item => {
                            const isSelected = selectedTraineeForMap?.id === item.id;
                            const hasCoords = item.locationLat !== null && item.locationLat !== undefined;
                            
                            return (
                              <tr 
                                key={item.id} 
                                className={`border-b transition cursor-pointer ${isSelected ? 'bg-[#7B1C2E]/5 border-l-4 border-l-[#7B1C2E] bg-slate-50' : 'hover:bg-gray-50'}`}
                                onClick={() => setSelectedTraineeForMap(item)}
                              >
                                <td className="py-3 px-2">
                                  <div className="font-bold text-[#7B1C2E]">
                                    {item.traineeUser?.fullName || 'Joseph Kurian'}
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-mono">
                                    {item.traineeEnrollment?.admissionNo || 'KNPSS/DICT/2022/4102'}
                                  </div>
                                </td>
                                <td className="py-3 px-2 font-medium">
                                  <div className="text-gray-900">{item.companyName}</div>
                                  <div className="text-[10px] text-gray-400">{item.county || 'Nairobi'} County</div>
                                </td>
                                <td className="py-3 px-2">
                                  {hasCoords ? (
                                    <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                      Active Coords
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-100">
                                      No Lat/Lng
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex gap-2 justify-end">
                                    <button 
                                      onClick={() => setSelectedTraineeForMap(item)}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 text-[10px] font-bold rounded border border-slate-205 transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                                    >
                                      <MapPin className="w-3 h-3 text-[#7B1C2E]" />
                                      Locate
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedTraineeForVisit(item);
                                        setActiveTab('field-visit');
                                      }}
                                      className="bg-[#7B1C2E] hover:bg-[#6A1727] text-white px-2.5 py-1 text-[10px] font-bold rounded transition cursor-pointer whitespace-nowrap"
                                    >
                                      Visit
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column (5 cols): Interactive Map and detailed GIS Locator for Selected Student */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                      <div className="border-b pb-2 flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#7B1C2E] block tracking-wide">
                            Geographical GIS Student Locator
                          </span>
                          <h3 className="font-bold text-gray-800 text-sm mt-0.5">
                            {selectedTraineeForMap ? "Student Placement Locator" : "System GIS Telemetry"}
                          </h3>
                        </div>
                        {selectedTraineeForMap?.locationLat && (
                          <span className="bg-[#7B1C2E]/10 text-[#7B1C2E] text-[10px] px-2 py-0.5 font-bold uppercase rounded">
                            GPS Verified
                          </span>
                        )}
                      </div>

                      {selectedTraineeForMap ? (
                        <div className="space-y-4">
                          {/* Selected student status cards */}
                          <div className="bg-slate-50 border p-3 border-slate-200 rounded-lg text-xs leading-relaxed text-gray-700 space-y-1.5">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Student Name</span>
                              <span className="font-bold text-[#7B1C2E] text-sm">{selectedTraineeForMap.traineeUser?.fullName || 'Joseph Kurian'}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Host Workplace Institution</span>
                              <span className="font-semibold text-slate-800">{selectedTraineeForMap.companyName}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 mt-1">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Supervisor Name</span>
                                <span className="font-medium text-slate-700">{selectedTraineeForMap.supervisorName || "John Mwangi"}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Supervisor Tel #</span>
                                <span className="font-medium text-slate-700">{selectedTraineeForMap.supervisorPhone || "+254719082723"}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Map Point Coordinates</span>
                                <code className="font-mono text-[10px] bg-white border px-1 py-0.5 rounded text-gray-600 block text-center truncate mt-0.5">
                                  {selectedTraineeForMap.locationLat ? `${Number(selectedTraineeForMap.locationLat).toFixed(5)}, ${Number(selectedTraineeForMap.locationLng).toFixed(5)}` : "No coordinates"}
                                </code>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">County Hub</span>
                                <span className="font-semibold text-slate-800 block text-xs mt-0.5">{selectedTraineeForMap.county || 'Nairobi'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Render Leaflet placement map for this student */}
                          {selectedTraineeForMap.locationLat && selectedTraineeForMap.locationLng ? (
                            <div className="border border-gray-150 rounded-xl overflow-hidden shrink-0 shadow-sm">
                              <div className="h-64 w-full relative">
                                <PlacementMap 
                                  placements={placementsList} 
                                  currentTraineePlacement={selectedTraineeForMap}
                                  onCaptureCoords={() => {}}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="p-5 bg-amber-50 rounded-lg border border-amber-200 text-center text-xs font-semibold text-amber-800">
                              ⚠️ This student has not captured or submitted GPS location coordinates. 
                              Please instruct the trainees to update their Placement Coordinates inside their Profile dashboard.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-gray-50 border rounded-lg border-dashed">
                          <MapPin className="w-8 h-8 text-gray-305 mx-auto mb-2" />
                          <span className="block text-xs font-semibold text-gray-400 uppercase">No Student Selected</span>
                          <p className="text-[11px] text-gray-400 mt-1">Select any assigned student in the table on the left to show their location map.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ==================== 6. OFFICER REVIEW QUEUE TAB ==================== */}
            {currentUser.role === 'OFFICER' && activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Review Queue listing */}
                <div id="reviews-queue-panel" className="bg-white border rounded-xl p-5 shadow-sm space-y-4 scroll-mt-20">
                  <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Evaluator Digital Submissions Queue</h3>
                  <p className="text-xs text-gray-500">Unexamined trainee log entries are listed here chronologically.</p>

                  <div className="space-y-3">
                    <div className="p-4 border border-[#7B1C2E] rounded-xl hover:bg-slate-50 cursor-pointer text-xs space-y-2 relative" onClick={() => {
                      setReviewingEntry({
                        id: 'le-3',
                        placementId: 'pl-1',
                        entryDate: '2026-06-01',
                        weekNumber: 5,
                        activitiesDescription: 'Configured local area network nodes at KPLC offices. Interfaced edge switches, terminated Category 6 solid cables utilizing impact-punch blocks, and certified pin assignment continuity.',
                        skillsAcquired: 'Structured copper cabling, punch-termination, Ethernet diagnostics.',
                        toolsUsed: 'Fluke cable analyzer, impact punch-down tool, modular crimper',
                        status: 'SUBMITTED',
                        version: 1,
                        isLate: false,
                        fileUrls: [],
                        fileHashes: [],
                        supervisorAcknowledged: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      });
                    }}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#7B1C2E]">Joseph Kurian (DICT)</span>
                        <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 rounded uppercase">Submitted Log</span>
                      </div>
                      <p className="line-clamp-2 text-gray-700">Configured local area network nodes at KPLC offices. Interfaced edge switches, terminated Category 6 solid cables...</p>
                      <span className="text-[10px] text-gray-400 block pt-1">Dated: 2026-06-01 (Week 5)</span>
                    </div>
                  </div>
                </div>

                {/* Rubric Evaluator Assessment Panel */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Active Entry Rubric Grading</h3>
                  
                  {reviewingEntry ? (
                    <div className="space-y-4 text-xs">
                      <div className="p-3 bg-[#F5E8EB]/40 border rounded-lg">
                        <span className="font-bold block text-gray-700">Trainee Activity Details:</span>
                        <p className="text-gray-800 mt-1">{reviewingEntry.activitiesDescription}</p>
                      </div>

                      {/* CBET Assessment Rubric Sliders 1 to 5 */}
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase font-bold text-gray-400">CBET Formative Assessment Rubric (Score 1-5)</p>
                        {["Attendance", "Quality of Report", "Technical Skills", "Use of Tools", "Safety Compliance", "Learning Progress"].map(competency => (
                          <div key={competency} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="font-medium text-gray-700">{competency}</span>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(val => (
                                <button 
                                  key={val}
                                  type="button"
                                  onClick={() => setRubricScores({ ...rubricScores, [competency]: val })}
                                  className={`w-7 h-7 rounded text-xs font-bold font-mono border transition ${rubricScores[competency] === val ? 'bg-[#7B1C2E] text-white border-[#7B1C2E]' : 'bg-white text-gray-600 border-gray-200'}`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Feedback Observations (Required for edits/rejects)</label>
                        <textarea 
                          rows={2}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Provide specific notes regarding compliance or practical outcomes"
                          className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#7B1C2E]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => handleReviewDecision('approve')}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 font-bold rounded-lg cursor-pointer"
                        >
                          Approve entry
                        </button>
                        <button 
                          onClick={() => handleReviewDecision('request-correction')}
                          className="bg-amber-600 hover:bg-amber-700 text-white py-2 font-bold rounded-lg cursor-pointer"
                        >
                          Request Edit
                        </button>
                        <button 
                          onClick={() => handleReviewDecision('reject')}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 font-bold rounded-lg cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert variant="info">Select a log entry from the queue panel on the left to activate evaluation grading sliders.</Alert>
                      <div className="flex justify-center pt-2">
                        <button
                          onClick={() => {
                            const elem = document.getElementById('reviews-queue-panel');
                            if (elem) {
                              elem.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#7B1C2E] hover:bg-[#681726] text-white font-bold rounded-lg shadow-sm transition active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
                        >
                          <FolderOpen className="w-4 h-4" />
                          Go to Submissions Queue
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== 7. FIELD VISIT VERIFICATION TAB (Officer) ==================== */}
            {currentUser.role === 'OFFICER' && activeTab === 'field-visit' && (
              <div className="w-full space-y-4">
                {!selectedTraineeForVisit ? (
                  <div className="max-w-2xl bg-white border rounded-xl p-6 shadow-sm mx-auto">
                    <div className="border-b pb-3 text-center mb-4">
                      <MapPin className="w-8 h-8 text-[#7B1C2E] mx-auto mb-1 animate-bounce" />
                      <h3 className="font-bold text-gray-800 text-sm">Physical On-Site Field Verification Form</h3>
                      <p className="text-xs text-gray-500">Must be completed during the physical visit at the host company.</p>
                    </div>
                    <Alert variant="info">Please select a trainee from the Assigned Trainees list on the dashboard to execute the Field Verification Form.</Alert>
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => navigateTo('dashboard')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#7B1C2E] hover:bg-[#681726] text-white font-bold rounded-lg shadow-sm transition active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
                      >
                        <Users className="w-4 h-4" />
                        Go to Assigned Trainees List
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left side: Evaluation Form */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                      <div className="border-b pb-3">
                        <span className="text-[10px] uppercase font-bold text-[#7B1C2E]">FIELD VISITS AND EVALUATIONS</span>
                        <h3 className="font-bold text-gray-800 text-base">On-Site Audit & Verification Form</h3>
                        <p className="text-xs text-gray-500">Document physical inspection inputs to confirm placement authenticity.</p>
                      </div>

                      <form onSubmit={handlePhysicalVisitSubmit} className="space-y-4 text-xs font-medium text-gray-700">
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between gap-3">
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-bold">Trainee Name:</span>
                            <span className="font-bold text-[#7B1C2E] text-sm">{selectedTraineeForVisit.traineeUser?.fullName || 'Joseph Kurian'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-bold">Host Company:</span>
                            <span className="font-bold text-slate-800 text-sm">{selectedTraineeForVisit.companyName}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-bold text-gray-700 uppercase">Physical Visit Date</label>
                            <input 
                              type="date" 
                              value={visitDate}
                              onChange={(e) => setVisitDate(e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-lg bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-700 uppercase">Overall site score (1-10 slider)</label>
                            <div className="flex items-center gap-2 pt-1.5">
                              <input 
                                type="range" 
                                min="1" 
                                max="10"
                                value={overallScore}
                                onChange={(e) => setOverallScore(Number(e.target.value))}
                                className="w-full accent-[#7B1C2E] cursor-pointer"
                              />
                              <span className="font-bold text-sm bg-[#7B1C2E] text-white px-2.5 py-0.5 rounded border border-[#7B1C2E]">{overallScore}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          <div className="p-3 border rounded-lg bg-gray-50 flex flex-col justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase text-gray-500">Physical Logbook present?</span>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setLogbookPresent(true)} className={`flex-1 py-1 px-2 rounded text-[10px] font-bold border transition ${logbookPresent ? 'bg-[#7B1C2E] text-white border-[#7B1C2E]' : 'bg-white text-gray-600'}`}>Yes</button>
                              <button type="button" onClick={() => setLogbookPresent(false)} className={`flex-1 py-1 px-2 rounded text-[10px] font-bold border transition ${!logbookPresent ? 'bg-[#7B1C2E] text-white border-[#7B1C2E]' : 'bg-white text-gray-600'}`}>No</button>
                            </div>
                          </div>

                          <div className="p-3 border rounded-lg bg-gray-50 flex flex-col justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase text-gray-500">Entries match uploads?</span>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setMatchUploads(true)} className={`flex-1 py-1 px-2 rounded text-[10px] font-bold border transition ${matchUploads ? 'bg-[#7B1C2E] text-white border-[#7B1C2E]' : 'bg-white text-gray-650'}`}>Yes</button>
                              <button type="button" onClick={() => setMatchUploads(false)} className={`flex-1 py-1 px-2 rounded text-[10px] font-bold border transition ${!matchUploads ? 'bg-[#7B1C2E] text-white border-[#7B1C2E]' : 'bg-white text-gray-650'}`}>No</button>
                            </div>
                          </div>

                          <div className="p-3 border rounded-lg bg-gray-50 flex flex-col justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase text-gray-500">Supervisor confirm?</span>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setSupervisorConfirmed(true)} className={`flex-1 py-1 px-2 rounded text-[10px] font-bold border transition ${supervisorConfirmed ? 'bg-[#7B1C2E] text-white border-[#7B1C2E]' : 'bg-white text-gray-650'}`}>Yes</button>
                              <button type="button" onClick={() => setSupervisorConfirmed(false)} className={`flex-1 py-1 px-2 rounded text-[10px] font-bold border transition ${!supervisorConfirmed ? 'bg-[#7B1C2E] text-white border-[#7B1C2E]' : 'bg-white text-gray-650'}`}>No</button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Discrepancy Notes (if non-matching)</label>
                          <textarea 
                            rows={2} 
                            value={discrepancies}
                            onChange={(e) => setDiscrepancies(e.target.value)}
                            placeholder="Detail any mismatch between actual log and app data"
                            className="w-full p-2 border rounded-lg focus:ring-1 bg-white focus:ring-[#7B1C2E] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Practical competencies witnessed</label>
                          <textarea 
                            rows={2} 
                            value={practicalObs}
                            onChange={(e) => setPracticalObs(e.target.value)}
                            placeholder="Record hands-on activities you audited during site evaluations"
                            className="w-full p-2 border rounded-lg focus:ring-1 bg-white focus:ring-[#7B1C2E] focus:outline-none"
                          />
                        </div>

                        {/* Signature Canvas Simulator */}
                        <div className="p-3.5 border rounded-lg bg-gray-50">
                          <span className="block font-bold text-slate-800 mb-2">Industrial Supervisor Witness Signature Stamp</span>
                          <div className="w-full bg-white border border-gray-300 rounded flex flex-col items-center justify-center p-4 shadow-inner">
                            <div className="font-mono text-[10px] text-gray-400 mb-2">
                              Digital Signature Canvas Secured Key
                            </div>
                            <div className="w-full border-t border-dashed border-gray-200 my-1"></div>
                            <div className="text-center">
                              <span className="block text-gray-400 text-[9px] font-mono mb-1">Signed online at port 3000 via TVET Encrypted Key</span>
                              <span className="text-[#4338CA] font-serif italic text-sm font-semibold">Active Authorized Witness Stamp Verified</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#7B1C2E] text-white py-3 rounded-lg hover:bg-[#6A1727] font-bold uppercase tracking-wide cursor-pointer text-xs transition"
                        >
                          Authorize Credibility & Finalize
                        </button>
                      </form>
                    </div>

                    {/* Right side: Live Placement Location Map */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                      <div className="border-b pb-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#7B1C2E]">GEOGRAPHIC PLACEMENT GIS</span>
                          <h3 className="font-bold text-gray-800 text-base">Trainee Location Map</h3>
                          <p className="text-xs text-gray-500">Live GPS tracking and physical placement identification on satellite tiles.</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[9px] font-bold uppercase rounded border border-emerald-200 animate-pulse">
                          GPS Live
                        </span>
                      </div>

                      <div className="space-y-3 font-sans">
                        <div className="bg-slate-50 border p-3 rounded-lg text-xs leading-relaxed text-gray-700 space-y-1">
                          <p>📍 <b>Registered Coordinates:</b> <code>{selectedTraineeForVisit.locationLat || 'N/A'}, {selectedTraineeForVisit.locationLng || 'N/A'}</code></p>
                          <p>🏢 <b>Host Company Address:</b> {selectedTraineeForVisit.companyAddress || 'No detailed address registered'}</p>
                          <p>🗺️ <b>Placements Hub County:</b> {selectedTraineeForVisit.county || 'Nairobi County'}</p>
                        </div>

                        <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <PlacementMap 
                            placements={placementsList}
                            currentTraineePlacement={selectedTraineeForVisit}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== 7b. ASSESSOR PROFILE TAB (Officer) ==================== */}
            {currentUser.role === 'OFFICER' && activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* Header card with quick statistics */}
                <div className="bg-gradient-to-r from-[#7B1C2E] to-[#4A0E18] text-white p-6 rounded-2xl border border-[#6A1727] shadow-lg flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      src={currentUser.profilePhotoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
                      className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                      alt="Assessor Avatar"
                    />
                    <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full text-[9px] font-bold border-2 border-[#7B1C2E]">
                      {officerAvailabilityStatus === 'AVAILABLE' ? 'Online' : 'Busy'}
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-xl font-extrabold">{currentUser.fullName}</h2>
                    <p className="text-xs text-white/80 font-semibold tracking-wide uppercase mt-0.5">Field Assessment Auditor • {officerEmployeeNo || 'KNPSS-OFFICER'}</p>
                    <div className="flex flex-wrap gap-2.5 mt-3 justify-center md:justify-start">
                      <span className="bg-white/10 px-2.5 py-1 rounded text-[10.5px] font-mono">Completed Records: {officerSpecialization ? '14 audits' : '0'}</span>
                      <span className="bg-white/10 px-2.5 py-1 rounded text-[10.5px] font-mono">Specialty: {officerSpecialization || 'Practical Logbook Audit'}</span>
                    </div>
                  </div>
                  <div className="shrink-0 bg-white/10 p-4 rounded-xl border border-white/10 text-center w-full md:w-auto">
                    <p className="text-[10px] text-white/70 uppercase font-black leading-none tracking-wider">Assigned Placements</p>
                    <p className="text-2xl font-black mt-1">{placementsList?.length || 0}</p>
                    <p className="text-[9px] text-emerald-400 mt-1 font-bold">100% Audit Cohesion</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form for modifying profile */}
                  <form onSubmit={handleUpdateOfficerProfile} className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
                    <div className="border-b pb-3 border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Customizable Assessor Registry Files</h3>
                        <p className="text-[11px] text-gray-500">Edit institutional coordinates, sections, and specialization attributes below.</p>
                      </div>
                      <span className="text-[10px] bg-[#F5E8EB] text-[#7B1C2E] px-2 py-0.5 rounded font-bold uppercase">Database Locked</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Employee Number */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Employee Staff ID Code</label>
                        <input
                          type="text"
                          value={officerEmployeeNo}
                          onChange={(e) => setOfficerEmployeeNo(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden font-mono text-gray-800"
                          placeholder="e.g. KNPSS-ASSESSOR-04"
                        />
                      </div>

                      {/* Availability status */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Duty Status Availability</label>
                        <select
                          value={officerAvailabilityStatus}
                          onChange={(e: any) => setOfficerAvailabilityStatus(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                        >
                          <option value="AVAILABLE">Available on Campus / Site Visits</option>
                          <option value="ON_FIELD_VISIT">Currently on Field Travel Audit</option>
                          <option value="ON_LEAVE">On Official Leave / Off Duty</option>
                          <option value="BUSY">Administrative Office Duty Only</option>
                        </select>
                      </div>

                      {/* Department */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Assessor Department / Division</label>
                        <input
                          type="text"
                          value={officerDepartment}
                          onChange={(e) => setOfficerDepartment(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. School of Engineering"
                        />
                      </div>

                      {/* Specialization */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Audit Core Specialization</label>
                        <input
                          type="text"
                          value={officerSpecialization}
                          onChange={(e) => setOfficerSpecialization(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Mechanical logbook audits"
                        />
                      </div>

                      {/* Office Room Number */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Physical Desk / Room Office Number</label>
                        <input
                          type="text"
                          value={officerOfficeRoom}
                          onChange={(e) => setOfficerOfficeRoom(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden font-mono text-gray-800"
                          placeholder="e.g. Wing B, Room 14"
                        />
                      </div>

                      {/* Assigned counties */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Covered Jurisdictions (Comma separated)</label>
                        <input
                          type="text"
                          value={officerAssignedRegions.join(', ')}
                          onChange={(e) => setOfficerAssignedRegions(e.target.value.split(',').map(s => s.trim()))}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Nairobi Area, Kiambu County"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 border-gray-100 flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 font-mono">Changes log directly into the telemetry audits.</p>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-[#7B1C2E] hover:bg-[#6A1727] text-white rounded-lg text-xs font-bold transition hover:shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingProfile ? 'Synchronizing Archive...' : 'Save Assessor Profile'}
                      </button>
                    </div>
                  </form>

                  {/* Core assessor tasks snapshot card */}
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest text-[#7B1C2E]">Assessment Workflow Scope</h4>
                      <div className="space-y-3 leading-relaxed text-xs text-gray-600">
                        <p>As an institutional assessor, you maintain secure audit controls and evaluate digital logbooks submitted by attachment trainees.</p>
                        <div className="border-l-2 border-[#7B1C2E] pl-2.5 py-1 font-mono text-[10px] bg-red-50 text-[#7B1C2E] rounded-r">
                          <span><b>Telemetry rule:</b> Changes to your active department are instantaneously recorded inside the immutable audit ledger.</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Account Telemetry</h4>
                      <div className="space-y-2 text-[11px] font-mono text-gray-500">
                        <div className="flex justify-between py-1 border-b">
                          <span>User ID:</span>
                          <span className="font-bold text-gray-700">{currentUser.id}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span>Contact Email:</span>
                          <span className="font-bold text-gray-700">{currentUser.email}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Database:</span>
                          <span className="text-emerald-600 font-bold">SQL / FILE-STITCH REPLICA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 8. SUPERVISOR TRAINEES LIST ==================== */}
            {currentUser.role === 'SUPERVISOR' && activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm">My Supervised Trainees (KPLC)</h3>
                  <p className="text-xs text-gray-500">Provide direct supervisor sign-offs for trainee log records here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {placementsList.map(pl => (
                    <div key={pl.id} className="p-5 bg-white shadow-sm border rounded-xl space-y-3 text-xs text-gray-700">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold">Student Trainee</span>
                        <h4 className="font-bold text-sm text-[#7B1C2E]">{pl.traineeUser?.fullName}</h4>
                        <p>{pl.traineeEnrollment?.courseName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded">
                        <span>Expected logs: <b>60 Days</b></span>
                        <span>Designated Assessor: <b>Mary Wanjiku</b></span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveTab('attendance')}
                          className="bg-[#7B1C2E] text-white px-3 py-1.5 font-bold rounded-lg hover:bg-[#6A1727]"
                        >
                          Mark Attendance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== 9. SUPERVISOR ATTENDANCE TAB ==================== */}
            {currentUser.role === 'SUPERVISOR' && activeTab === 'attendance' && (() => {
              const supervisorTrainees = placementsList;
              const activePlacement = supervisorTrainees.find(pl => pl.id === selectedTraineeForAttendance) || supervisorTrainees[0];
              
              const getWeekDates = (pivot: Date) => {
                const dates = [];
                const day = pivot.getDay();
                const diffToMonday = day === 0 ? -6 : 1 - day;
                const m = new Date(pivot);
                m.setDate(pivot.getDate() + diffToMonday);

                const dayNames: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
                ];

                for (let i = 0; i < 5; i++) {
                  const d = new Date(m);
                  d.setDate(m.getDate() + i);
                  
                  const yyyy = d.getFullYear();
                  const mm = String(d.getMonth() + 1).padStart(2, '0');
                  const dd = String(d.getDate()).padStart(2, '0');
                  const dateString = `${yyyy}-${mm}-${dd}`;
                  
                  dates.push({
                    dayOfWeek: dayNames[i],
                    dateString,
                    formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  });
                }
                return dates;
              };

              const getDaysInMonth = (y: number, monthVal: number) => new Date(y, monthVal + 1, 0).getDate();
              const getFirstDayOfMonth = (y: number, monthVal: number) => new Date(y, monthVal, 1).getDay();

              const weekWorkdays = getWeekDates(attendancePivotDate);
              const totalDays = getDaysInMonth(calendarYear, calendarMonth);
              const startDay = getFirstDayOfMonth(calendarYear, calendarMonth);
              
              const blankCells = Array(startDay).fill(null);
              const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
              const calendarCells = [...blankCells, ...daysArray];

              const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];

              const handleMarkAttendance = async (placementId: string, traineeId: string, date: string, dayOfWeek: any, status: 'Present' | 'Absent' | 'Half-Day') => {
                try {
                  const resp = await fetch('/api/v1/attendance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      placementId,
                      traineeId,
                      date,
                      dayOfWeek,
                      status,
                      markedBy: currentUser?.fullName || "Supervisor"
                    })
                  });
                  if (resp.ok) {
                    loadAttendance(placementId);
                  }
                } catch (e) {
                  console.error("Failed storing attendance:", e);
                }
              };

              const handleMarkAllWeekPresent = async (placementId: string, traineeId: string, weekDays: any[]) => {
                const records = weekDays.map(wd => ({
                  placementId,
                  traineeId,
                  date: wd.dateString,
                  dayOfWeek: wd.dayOfWeek,
                  status: 'Present',
                  markedBy: currentUser?.fullName || "Supervisor"
                }));

                try {
                  const resp = await fetch('/api/v1/attendance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ records })
                  });
                  if (resp.ok) {
                    loadAttendance(placementId);
                  }
                } catch (e) {
                  console.error("Failed bulk storing attendance:", e);
                }
              };

              return (
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Top Bar / Actions */}
                  <div className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-700" />
                        Trainee Attendance Systems & Registry
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">Manage daily field attendance registries and monitor monthly historical records physically saved to our database.</p>
                    </div>
                    
                    {/* Trainee Selectors */}
                    {supervisorTrainees.length > 1 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">Active Trainee:</span>
                        <select
                          id="trainee-selector"
                          value={selectedTraineeForAttendance}
                          onChange={(e) => {
                            setSelectedTraineeForAttendance(e.target.value);
                            loadAttendance(e.target.value);
                          }}
                          className="bg-gray-50 border rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#7B1C2E]"
                        >
                          {supervisorTrainees.map(t => (
                            <option key={t.id} value={t.id}>{t.traineeUser?.fullName || "Unlabeled Trainee"}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {!activePlacement ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-6 text-center text-xs">
                      No active trainee placements discovered under your supervisor credentials.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Weekly Attendance Editor (5 cols) */}
                      <div className="lg:col-span-5 bg-white border rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3.5">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm">Weekly Attendance Registry</h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">Trainee: <span className="font-bold text-[#7B1C2E]">{activePlacement.traineeUser?.fullName}</span></p>
                          </div>
                          
                          {/* Week Navigation */}
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border">
                            <button
                              type="button"
                              onClick={() => {
                                const prev = new Date(attendancePivotDate);
                                prev.setDate(prev.getDate() - 7);
                                setAttendancePivotDate(prev);
                              }}
                              className="p-1 text-gray-600 hover:bg-white rounded transition"
                              title="Previous Week"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] uppercase font-bold text-gray-600 px-1">
                              Week View
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = new Date(attendancePivotDate);
                                next.setDate(next.getDate() + 7);
                                setAttendancePivotDate(next);
                              }}
                              className="p-1 text-gray-600 hover:bg-white rounded transition"
                              title="Next Week"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Week Interval Dates Header */}
                        <div className="bg-[#7B1C2E]/5 border border-[#7B1C2E]/10 rounded-lg p-2.5 flex justify-between items-center">
                          <div className="text-[11px] text-gray-700">
                            Showing workdays: <b>{weekWorkdays[0].formattedDate}</b> to <b>{weekWorkdays[4].formattedDate}</b>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleMarkAllWeekPresent(activePlacement.id, activePlacement.traineeId, weekWorkdays)}
                            className="bg-[#7B1C2E] hover:bg-[#6A1727] text-white text-[10px] font-bold px-2 py-1 rounded transition"
                          >
                            Mark All Present
                          </button>
                        </div>

                        {/* Weekly Workday List */}
                        <div className="space-y-2 pt-1 font-sans">
                          {weekWorkdays.map(dayObj => {
                            const currentRecord = attendanceList.find(r => r.date === dayObj.dateString);
                            const activeStatus = currentRecord ? currentRecord.status : 'UNRECORDED';

                            return (
                              <div key={dayObj.dateString} className="p-3 border rounded-lg bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition hover:border-gray-300">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800 text-xs">{dayObj.dayOfWeek}</span>
                                    <span className="text-[10px] font-medium text-gray-400 font-mono">{dayObj.dateString}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-500">Status:</span>
                                    {activeStatus === 'UNRECORDED' ? (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-gray-200 text-gray-600 rounded font-bold font-mono">Unrecorded</span>
                                    ) : activeStatus === 'Present' ? (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-green-100 text-green-700 border border-green-200 rounded font-bold font-mono">Present</span>
                                    ) : activeStatus === 'Absent' ? (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-red-100 text-red-700 border border-red-200 rounded font-bold font-mono">Absent</span>
                                    ) : (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-700 border border-amber-200 rounded font-bold font-mono">Half-Day</span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex bg-white border rounded-lg p-0.5 gap-0.5">
                                  {["Present", "Absent", "Half-Day"].map(status => {
                                    const isSel = activeStatus === status;
                                    let btnStyle = "text-gray-500 hover:bg-gray-100";
                                    if (isSel) {
                                      if (status === 'Present') btnStyle = "bg-green-600 text-white shadow-xs font-bold";
                                      if (status === 'Absent') btnStyle = "bg-red-600 text-white shadow-xs font-bold";
                                      if (status === 'Half-Day') btnStyle = "bg-amber-500 text-white shadow-xs font-bold";
                                    }
                                    return (
                                      <button
                                        key={status}
                                        type="button"
                                        onClick={() => handleMarkAttendance(activePlacement.id, activePlacement.traineeId, dayObj.dateString, dayObj.dayOfWeek, status as any)}
                                        className={`px-2 py-1 text-[9px] rounded-md transition ${btnStyle}`}
                                      >
                                        {status}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Interactive Year-Month Attendance Calendar History (7 cols) */}
                      <div className="lg:col-span-7 bg-white border rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3.5">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm">Attendance Calendar History</h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">Select a workday cell to configure or toggle its registry attendance details.</p>
                          </div>

                          {/* Month Selector Controls */}
                          <div className="flex items-center gap-1.5 bg-gray-50 border rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (calendarMonth === 0) {
                                  setCalendarMonth(11);
                                  setCalendarYear(prev => prev - 1);
                                } else {
                                  setCalendarMonth(prev => prev - 1);
                                }
                              }}
                              className="p-1 hover:bg-white text-gray-600 rounded transition"
                              title="Prev Month"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[11px] font-bold text-gray-700 min-w-20 text-center uppercase tracking-wide">
                              {monthNames[calendarMonth]} {calendarYear}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (calendarMonth === 11) {
                                  setCalendarMonth(0);
                                  setCalendarYear(prev => prev + 1);
                                } else {
                                  setCalendarMonth(prev => prev + 1);
                                }
                              }}
                              className="p-1 hover:bg-white text-gray-600 rounded transition"
                              title="Next Month"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Calendar Grid Container */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-400 uppercase tracking-widest pb-1 border-b">
                            <span>S</span>
                            <span>M</span>
                            <span>T</span>
                            <span>W</span>
                            <span>T</span>
                            <span>F</span>
                            <span>S</span>
                          </div>

                          <div className="grid grid-cols-7 gap-1 font-mono">
                            {calendarCells.map((cell, idx) => {
                              if (cell === null) {
                                return <div key={`empty-${idx}`} className="aspect-square bg-gray-50/50 rounded-lg border border-dashed border-gray-100" />;
                              }

                              const dayNum = cell;
                              const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                              const record = attendanceList.find(r => r.date === dateStr);
                              const cellStatus = record ? record.status : null;
                              
                              // Check if cell corresponds to a weekend day (0 = Sunday, 6 = Saturday)
                              const cellDayOfWeek = new Date(calendarYear, calendarMonth, dayNum).getDay();
                              const isWeekend = cellDayOfWeek === 0 || cellDayOfWeek === 6;

                              let cellBg = "bg-white hover:border-gray-400";
                              let textStyle = "text-gray-800 font-semibold";
                              let borderStyle = "border border-gray-150";
                              let statusLabel = "";

                              if (cellStatus === 'Present') {
                                cellBg = "bg-green-500 hover:bg-green-600 border border-green-600 text-white";
                                textStyle = "text-white font-bold";
                                borderStyle = "border-green-650";
                                statusLabel = "Present";
                              } else if (cellStatus === 'Absent') {
                                cellBg = "bg-red-500 hover:bg-red-650 border border-red-600 text-white";
                                textStyle = "text-white font-bold";
                                borderStyle = "border-red-650";
                                statusLabel = "Absent";
                              } else if (cellStatus === 'Half-Day') {
                                cellBg = "bg-amber-400 hover:bg-amber-500 border border-amber-400 text-white";
                                textStyle = "text-white font-bold";
                                borderStyle = "border-amber-500";
                                statusLabel = "Half-Day";
                              } else if (isWeekend) {
                                cellBg = "bg-gray-100/70 cursor-not-allowed";
                                textStyle = "text-gray-400 font-normal";
                                borderStyle = "border border-gray-150";
                              }

                              const handleCellClick = () => {
                                if (isWeekend) return;
                                const dayOfWeekNames: any[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                const currentDayName = dayOfWeekNames[cellDayOfWeek];

                                let nextStatus: any = 'Present';
                                if (cellStatus === 'Present') nextStatus = 'Absent';
                                else if (cellStatus === 'Absent') nextStatus = 'Half-Day';
                                else if (cellStatus === 'Half-Day') {
                                  nextStatus = 'Present';
                                }
                                
                                handleMarkAttendance(activePlacement.id, activePlacement.traineeId, dateStr, currentDayName, nextStatus);
                              };

                              return (
                                <button
                                  key={`day-${dayNum}`}
                                  type="button"
                                  onClick={handleCellClick}
                                  disabled={isWeekend}
                                  className={`aspect-square rounded-lg flex flex-col justify-between p-1.5 transition text-left cursor-pointer relative ${cellBg} ${borderStyle}`}
                                  title={isWeekend ? "Weekend" : record ? `${dayNum} - ${statusLabel} (Marked by ${record.markedBy})` : `${dayNum} - Click to toggle`}
                                >
                                  <span className={`text-[10px] ${textStyle}`}>{dayNum}</span>
                                  {cellStatus && (
                                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Legend Indicator Map */}
                          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-gray-500 pt-3 border-t">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded bg-green-500 inline-block" />
                              <span>Present</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />
                              <span>Absent</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
                              <span>Half-Day</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded bg-white border inline-block" />
                              <span>Unrecorded Workday</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded bg-gray-100 border text-gray-400 font-sans inline-block text-center text-[7px] leading-tight">S</span>
                              <span>Weekend</span>
                            </div>
                          </div>
                      
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })()}

            {/* ==================== 9b. SUPERVISOR PROFILE TAB ==================== */}
            {currentUser.role === 'SUPERVISOR' && activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* Header card with quick stats */}
                <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      src={currentUser.profilePhotoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80"}
                      className="w-20 h-20 rounded-full border-4 border-slate-800 object-cover"
                      alt="Supervisor Avatar"
                    />
                    <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full text-[9px] font-bold border-2 border-[#1E293B]">
                      Active Mentor
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-xl font-extrabold">{currentUser.fullName}</h2>
                    <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-0.5">{supervisorJobTitle || 'Corporate Attachment Lead'} • {supervisorCompanyName || 'Registered Host Enterprise'}</p>
                    <div className="flex flex-wrap gap-2.5 mt-3 justify-center md:justify-start">
                      <span className="bg-slate-800 px-2.5 py-1 rounded text-[10.5px] font-mono border border-slate-700">Scope: {supervisorDepartment || 'Field Engineering'}</span>
                      <span className="bg-slate-800 px-2.5 py-1 rounded text-[10.5px] font-mono border border-slate-700">Allocated Seats: {supervisorMaxCapacity} students</span>
                    </div>
                  </div>
                  <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center w-full md:w-auto">
                    <p className="text-[10px] text-slate-400 uppercase font-black leading-none tracking-wider">Supervised Trainees</p>
                    <p className="text-2xl font-black mt-1 text-emerald-400">{placementsList?.length || 0}</p>
                    <p className="text-[9px] text-slate-300 mt-1 font-bold">Capacity: {placementsList?.length || 0}/{supervisorMaxCapacity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form */}
                  <form onSubmit={handleUpdateSupervisorProfile} className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
                    <div className="border-b pb-3 border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Corporate Mentor Credentials</h3>
                        <p className="text-[11px] text-gray-500">Edit industrial supervisor, capacity limits, and corporate communications attributes below.</p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Workplace Certified</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Host Company Enterprise</label>
                        <input
                          type="text"
                          value={supervisorCompanyName}
                          onChange={(e) => setSupervisorCompanyName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Safaricom PLC"
                        />
                      </div>

                      {/* Job Title */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Official Corporate Designation</label>
                        <input
                          type="text"
                          value={supervisorJobTitle}
                          onChange={(e) => setSupervisorJobTitle(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Senior Network Architect"
                        />
                      </div>

                      {/* Department */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Industrial Department / Division</label>
                        <input
                          type="text"
                          value={supervisorDepartment}
                          onChange={(e) => setSupervisorDepartment(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Infrastructure Maintenance"
                        />
                      </div>

                      {/* Work Email */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Secure Workspace Email</label>
                        <input
                          type="email"
                          value={supervisorWorkEmail}
                          onChange={(e) => setSupervisorWorkEmail(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden font-mono text-gray-800"
                          placeholder="supervisor@corporation.com"
                        />
                      </div>

                      {/* Work Phone */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Corporate Hotline / Phone Number</label>
                        <input
                          type="text"
                          value={supervisorWorkPhone}
                          onChange={(e) => setSupervisorWorkPhone(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden font-mono text-gray-800"
                          placeholder="+254 700 000 000"
                        />
                      </div>

                      {/* Office Location */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Enterprise Physical Desk / Facility Office</label>
                        <input
                          type="text"
                          value={supervisorOfficeLocation}
                          onChange={(e) => setSupervisorOfficeLocation(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Headquarters Block C, 4th Floor"
                        />
                      </div>

                      {/* Student capacity */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Authorized Student Capacity Quota {supervisorMaxCapacity}</label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={supervisorMaxCapacity}
                          onChange={(e) => setSupervisorMaxCapacity(Number(e.target.value))}
                          className="w-full text-xs font-mono h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7B1C2E]"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>Min: 1 Student</span>
                          <span>Max Capacity Allocation: 20 Students</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 border-gray-100 flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 font-mono">Changes dynamically update linked student structures.</p>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition hover:shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingProfile ? 'Updating Workspace Credentials...' : 'Save Supervisor Work Profile'}
                      </button>
                    </div>
                  </form>

                  {/* Tasks snapshot */}
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest text-slate-800">Operational Mentor Guideline</h4>
                      <div className="space-y-3 leading-relaxed text-xs text-gray-600">
                        <p>Industry supervisors approve student workdays, certify attendance rosters, and collaborate directly with visiting campus assessors.</p>
                        <div className="border-l-2 border-slate-700 pl-2.5 py-1 font-mono text-[10px] bg-slate-50 text-slate-700 rounded-r">
                          <span><b>Capacity rule:</b> Exceeding the maximum assigned trainees capacity requires ILO Registrar authorization.</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Account Telemetry</h4>
                      <div className="space-y-2 text-[11px] font-mono text-gray-500">
                        <div className="flex justify-between py-1 border-b">
                          <span>Database User:</span>
                          <span className="font-bold text-gray-700">{currentUser.fullName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span>Associated Email:</span>
                          <span className="font-bold text-gray-700">{currentUser.email}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Database Service:</span>
                          <span className="text-emerald-600 font-bold">SQL / MOUNT DATASTORE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 10. ADMIN OVERVIEW TAB ==================== */}
            {currentUser.role === 'ADMIN' && activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* ILO Admin KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Card 1: Dynamic Black Tech Card */}
                  <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-5 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-[1.02] hover:border-neutral-700 group">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                      <Users className="w-24 h-24 text-white" />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-800/10 rounded-full blur-2xl group-hover:bg-neutral-700/20 transition-colors pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse"></span>
                            Total Enrolled Trainees
                          </span>
                          <h2 className="text-2xl font-black mt-2 text-white leading-none tracking-tight font-sans">
                            128 <span className="text-xs font-medium text-neutral-400">Students</span>
                          </h2>
                        </div>
                        <div className="p-2 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-neutral-300 group-hover:bg-white group-hover:text-black transition-all duration-300">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-semibold pt-2 border-t border-neutral-800/80">
                        <span className="text-emerald-400">+12% from last term</span>
                        <span className="text-neutral-600">•</span>
                        <span>Live active registry</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Dynamic Maroon Polytechnic Branding Card */}
                  <div className="bg-gradient-to-br from-[#7B1C2E] via-[#5C1320] to-[#400B14] p-5 rounded-2xl border border-[#942E3F]/40 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(123,28,46,0.35)] hover:scale-[1.02] hover:border-[#B13E53]/60 group">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none group-hover:scale-110 group-hover:opacity-15 transition-all duration-500">
                      <Award className="w-24 h-24 text-rose-200" />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-400/10 rounded-full blur-2xl group-hover:bg-rose-400/20 transition-colors pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-rose-200/80 tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse"></span>
                            Placed Percentage Rate
                          </span>
                          <h2 className="text-2xl font-black mt-2 text-white leading-none tracking-tight font-sans">
                            82% <span className="text-xs font-semibold text-rose-200/70">Placement</span>
                          </h2>
                        </div>
                        <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-rose-100 group-hover:bg-white group-hover:text-[#7B1C2E] transition-all duration-300">
                          <Award className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <div className="flex justify-between text-[9px] font-bold text-rose-200/70 uppercase">
                          <span>Current Goal Status</span>
                          <span>Target: 80%</span>
                        </div>
                        <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-400 h-full rounded-full shadow-[0_0_8px_#F43F5E] transition-all duration-500" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Dynamic Emerald Compliance/Green Design Card */}
                  <div className="bg-gradient-to-br from-emerald-950 via-[#0A261D] to-black p-5 rounded-2xl border border-emerald-900/50 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(16,185,129,0.2)] hover:scale-[1.02] hover:border-emerald-500/40 group">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none group-hover:scale-110 group-hover:opacity-15 transition-all duration-500">
                      <FileText className="w-24 h-24 text-emerald-300" />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-colors pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-400/80 tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Total Documents Managed
                          </span>
                          <h2 className="text-2xl font-black mt-2 text-white leading-none tracking-tight font-sans">
                            {documents.length} <span className="text-xs font-semibold text-emerald-400/60 font-medium">Policies</span>
                          </h2>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-900/40 border border-emerald-800/40 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black transition-all duration-300">
                          <FileText className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90 font-bold pt-2 border-t border-emerald-900/60">
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px]">✓</span>
                        <span>100% compliant and active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional Geographic dispatch distribution map / chart layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: OpenStreetMap of regional grouping */}
                  <div className="bg-white border p-5 rounded-xl shadow-sm md:col-span-3 space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">Assessor GIS Regional Dispatching Hub</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Live geographic registry mapping active TVET student placements across Kenya transport hubs on OpenStreetMap.</p>
                    </div>
                    
                    <div className="relative">
                      <PlacementMap 
                        placements={placementsList} 
                      />
                    </div>
                  </div>

                  {/* Right: African Talking / SMS log dispatchers preview */}
                  <div className="bg-white border p-5 rounded-xl shadow-sm space-y-4 text-xs">
                    <h3 className="font-bold text-gray-800 text-sm border-b pb-2">SMS Notification Dispatch Logs</h3>
                    <div className="space-y-2 p-1.5 max-h-80 overflow-y-auto">
                      <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                        <span className="text-[10px] text-indigo-700 font-bold block">TO: +254 712 345 678</span>
                        <p className="text-gray-600 leading-tight">"Your KNPSS Link password reset code is 432821. Expires in 10 minutes. Do not share."</p>
                        <span className="text-[9px] text-gray-400 block pt-1 bg-white p-0.5 px-1.5 rounded w-max">2 mins ago via AT Gateway</span>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                        <span className="text-[10px] text-indigo-700 font-bold block">TO: +254 722 111 222</span>
                        <p className="text-gray-600 leading-tight">"KNPSS Link: Your field visit review has been authorized by Assessor Mary Wanjiku. Attachment marked Assessed."</p>
                        <span className="text-[9px] text-gray-400 block pt-1 bg-white p-0.5 px-1.5 rounded w-max">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 11. ADMIN STUDENT MANAGEMENT ==================== */}
            {currentUser.role === 'ADMIN' && activeTab === 'trainees' && (
              <div className="space-y-6">
                
                {/* CSV Mass Import card */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm">Industrial Liaison CSV Bulk Ingestion</h3>
                  <p className="text-xs text-gray-500">Load mass trainee spreadsheets to automatically bootstrap admission IDs and clear credentials.</p>
                  
                  <div className="flex gap-2 text-xs">
                    <textarea 
                      rows={2}
                      className="w-full p-2 border rounded-lg bg-gray-50 font-mono text-[10px]"
                      placeholder="FullName,Email,Phone,AdmissionNo&#10;Alice Atieno,alice@knpss.ac.ke,254701234567,KNPSS/DICT/2022/9901"
                      id="bulk-csv-input"
                    />
                    <button 
                      onClick={() => {
                        const val = (document.getElementById('bulk-csv-input') as HTMLTextAreaElement)?.value;
                        if (!val) return alert(" spreadsheet is empty");
                        fetch('/api/v1/users/import-csv', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ csvData: val })
                        }).then(() => {
                          alert("CSV Bulk records imported. Users populated successfully.");
                          loadUserData();
                        });
                      }}
                      className="bg-[#7B1C2E] text-white px-4 font-bold rounded-lg hover:bg-[#6A1727]"
                    >
                      Import Spreadsheet
                    </button>
                  </div>
                </div>

                <div className="bg-white shadow-sm border rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-gray-800 text-sm">Enrolled Trainees Directory</h3>
                  <div className="overflow-x-auto text-xs text-gray-700">
                    <table className="w-full text-left min-w-[650px]">
                      <thead>
                        <tr className="bg-gray-50 border-b font-bold text-gray-600">
                          <th className="py-2 px-3">Trainee Name</th>
                          <th className="py-2 px-3">Email Address</th>
                          <th className="py-2 px-3">Registration ID</th>
                          <th className="py-2 px-3">Enrolled Status</th>
                          <th className="py-2 px-3">Clearing Override Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const trainees = usersList.filter(u => u.role === 'TRAINEE');
                          const uniqueTrainees = trainees.filter((item, idx, self) =>
                            self.findIndex(t => t.email.toLowerCase() === item.email.toLowerCase()) === idx
                          );
                          
                          if (uniqueTrainees.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="py-6 px-3 text-center text-gray-400 italic">
                                  No enrolled trainees found in directory.
                                </td>
                              </tr>
                            );
                          }

                          return uniqueTrainees.map(u => (
                            <tr key={u.id} className="border-b hover:bg-gray-50 tracking-wide">
                              <td className="py-3.5 px-3 font-semibold text-slate-850 flex items-center gap-1.5">{u.fullName}</td>
                              <td className="py-3.5 px-3 font-medium text-gray-500">{u.email}</td>
                              <td className="py-3.5 px-3 font-mono font-semibold text-gray-700">{(u as any).admissionNo || 'Pending Allocated'}</td>
                              <td className="py-3.5 px-3">
                                {u.isApprovedForLogin ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    ACTIVE / APPROVED
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-705 border border-amber-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                    PENDING APPROVAL
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-3 flex items-center gap-2">
                                {u.isApprovedForLogin ? (
                                  <button 
                                    onClick={async () => {
                                      if (confirm(`Lock permanent login credentials for ${u.fullName}?`)) {
                                        const res = await fetch(`/api/v1/users/${u.id}/approve-login`, {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ isApprovedForLogin: false })
                                        });
                                        if (res.ok) {
                                          alert(`Locked access for ${u.fullName}.`);
                                          // Reload users
                                          const usersRes = await fetch('/api/v1/users');
                                          if (usersRes.ok) setUsersList(await usersRes.json());
                                        } else {
                                          alert("Failed to alter approval credentials.");
                                        }
                                      }
                                    }}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors"
                                  >
                                    Lock Login
                                  </button>
                                ) : (
                                  <button 
                                    onClick={async () => {
                                      const res = await fetch(`/api/v1/users/${u.id}/approve-login`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ isApprovedForLogin: true })
                                      });
                                      if (res.ok) {
                                        alert(`Active status for ${u.fullName} is verified & locked in database!`);
                                        // Reload users
                                        const usersRes = await fetch('/api/v1/users');
                                        if (usersRes.ok) setUsersList(await usersRes.json());
                                      } else {
                                        alert("Approval submission failed.");
                                      }
                                    }}
                                    className="bg-[#7B1C2E] hover:bg-[#681424] text-white px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-sm transition-colors"
                                  >
                                    Approve Login
                                  </button>
                                )}

                                <button 
                                  onClick={async () => {
                                    if (confirm(`Reset download quotas for ${u.fullName}?`)) {
                                      await fetch(`/api/v1/documents/doc-1/reset-entitlement/${u.id}`, { method: 'POST' });
                                      alert("Student documentation counters reverted successfully.");
                                    }
                                  }}
                                  className="bg-slate-100 text-slate-800 hover:bg-slate-200 border px-2 py-1 text-[11px] font-semibold rounded-lg transition-all"
                                >
                                  Reset limits
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 12. ADMIN DOCUMENT RELEASE ==================== */}
            {currentUser.role === 'ADMIN' && activeTab === 'admin-docs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Release new policy document form */}
                <div className="bg-white p-5 border rounded-xl shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-800 text-sm border-b pb-2 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-[#7B1C2E]" /> Upload Institutional forms
                  </h3>

                  <form onSubmit={handleAdminDocumentUpload} className="space-y-4 text-xs font-semibold text-gray-700">
                    {/* Preset helper buttons for common requested document types */}
                    <div className="bg-slate-50 p-3 rounded-lg border space-y-1.5 mb-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Quick Preset Insertion</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle("KNPSS Attachment Insurance Form (All Trainees)");
                            setNewDocCategory("INSURANCE");
                            setNewDocVersion("v4.2");
                            setNewDocValidationCode("SAFE-KNP-2026");
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-semibold border px-2 py-1 rounded"
                        >
                          + Insurance Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle("Industrial Attachment Handbook and Code of Conduct");
                            setNewDocCategory("POLICY");
                            setNewDocVersion("v5.0");
                            setNewDocValidationCode("");
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-semibold border px-2 py-1 rounded"
                        >
                          + Attachment Handbook
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle("NITA Attachment Reimbursement Claim Form");
                            setNewDocCategory("NITA");
                            setNewDocVersion("v2.1");
                            setNewDocValidationCode("");
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-semibold border px-2 py-1 rounded"
                        >
                          + NITA Form
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle("Liaison Office Introduction Letter (Restricted)");
                            setNewDocCategory("LETTER");
                            setNewDocVersion("v1.0");
                            setNewDocValidationCode("");
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-semibold border px-2 py-1 rounded"
                        >
                          + Liaison Letter
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewDocTitle("");
                            setNewDocCategory("OTHER");
                            setNewDocVersion("v1.0");
                            setNewDocValidationCode("");
                            setSelectedFile(null);
                          }}
                          className="bg-[#7B1C2E] hover:bg-[#681424] text-white text-[10px] font-bold border border-[#7B1C2E] px-2.5 py-1 rounded transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Visual Interactive Drag and Drop Upload Zone */}
                    <div className="space-y-1.5 font-sans">
                      <label className="block font-bold uppercase text-[10px] text-slate-700 tracking-wider">
                        📁 Selected File Upload (PDF / Word / Document)
                      </label>
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            const file = e.dataTransfer.files[0];
                            setSelectedFile(file);
                            if (!newDocTitle) {
                              setNewDocTitle(file.name.replace(/\.[^/.]+$/, ""));
                            }
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                          selectedFile 
                            ? 'border-emerald-400 bg-emerald-50/40 text-emerald-900 shadow-sm' 
                            : 'border-slate-300 hover:border-[#7B1C2E] bg-slate-50/50 hover:bg-slate-50 text-slate-500 hover:shadow-xs'
                        }`}
                        onClick={() => document.getElementById('admin-file-picker')?.click()}
                      >
                        <input 
                          id="admin-file-picker"
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setSelectedFile(file);
                              if (!newDocTitle) {
                                setNewDocTitle(file.name.replace(/\.[^/.]+$/, ""));
                              }
                            }
                          }}
                        />
                        {selectedFile ? (
                          <div className="space-y-1.5 text-xs">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                              <Check className="w-5 h-5 font-bold" />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-800 text-[11px] truncate max-w-xs mx-auto">{selectedFile.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB | Ready to publish securely</p>
                            </div>
                            <span 
                              className="text-[10px] underline text-red-600 hover:text-red-800 font-bold uppercase tracking-wider block cursor-pointer" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedFile(null); 
                              }}
                            >
                              ✕ Remove and Redrag
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                              <UploadCloud className="w-5 h-5 text-[#7B1C2E]" />
                            </div>
                            <div className="space-y-0.5 text-xs">
                              <p className="text-[11px] font-bold text-slate-700">Drag & drop your attachment form copy here, or click to browse</p>
                              <p className="text-[10px] text-slate-400 font-medium">Supports PDF, DOCX, and scanned images up to 15MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Simulating Secure Upload Status indicator */}
                    {isUploading && (
                      <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg border border-slate-700 space-y-2 font-mono">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-amber-400 uppercase tracking-widest flex items-center gap-1">
                            ⚡ Crypto hashing & Uploading: {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 transition-all duration-150" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block font-bold uppercase mb-1">Document Title</label>
                      <input 
                        type="text" 
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="e.g. Liability Insurance Covers Form v3"
                        className="w-full px-3 py-1.5 border rounded-lg focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold uppercase mb-1">Doc Category</label>
                        <select 
                          value={newDocCategory}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewDocCategory(val);
                            if (val === 'INSURANCE') {
                              setNewDocValidationCode('SAFE-KNP-2026');
                            } else {
                              setNewDocValidationCode('');
                            }
                          }}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="INSURANCE">INSURANCE COVER</option>
                          <option value="POLICY">HANDBOOK / CODE OF CONDUCT</option>
                          <option value="NITA">NITA REIMBURSEMENT FORM</option>
                          <option value="LETTER">LIAISON OFFICE INTRO LETTER</option>
                          <option value="FORM">FORM</option>
                          <option value="OTHER">OTHER DOCUMENT</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1">Version tag</label>
                        <input 
                          type="text" 
                          value={newDocVersion} 
                          onChange={(e) => setNewDocVersion(e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Pre-upload secure validation code for Insurance/other documents */}
                    {newDocCategory === 'INSURANCE' && (
                      <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200 space-y-1.5">
                        <label className="block font-bold uppercase text-amber-900 text-[10px] tracking-wide">
                          🔐 Secure Insurance Validation Code
                        </label>
                        <p className="text-[10px] text-amber-800 leading-tight">
                          Trainees must successfully match this code in their viewport before they can view, download, or register their placements.
                        </p>
                        <input 
                          type="text"
                          value={newDocValidationCode}
                          onChange={(e) => setNewDocValidationCode(e.target.value)}
                          placeholder="e.g. SAFE-KNP-2026"
                          className="w-full px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none bg-white font-mono"
                          required={newDocCategory === 'INSURANCE'}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pb-2">
                      <div>
                        <label className="block font-bold uppercase mb-1">Download restriction policy</label>
                        <select 
                          value={newDocPolicy}
                          onChange={(e) => setNewDocPolicy(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="UNLIMITED">UNLIMITED DOWNLOADS</option>
                          <option value="VIEW_ONLY">VIEW ONLINE ONLY</option>
                          <option value="SINGLE">SINGLE DOWNLOAD LIMIT</option>
                          <option value="N_DOWNLOADS">N DOWNLOADS ALLOCATION</option>
                        </select>
                      </div>
                      {newDocPolicy === 'N_DOWNLOADS' && (
                        <div>
                          <label className="block font-bold uppercase mb-1">Download Count limits (N)</label>
                          <input 
                            type="number" 
                            value={newDocLimit}
                            onChange={(e) => setNewDocLimit(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    <button type="submit" className="w-full bg-[#7B1C2E] hover:bg-[#6A1727] text-white py-2 font-bold rounded-lg cursor-pointer">
                      File Release Policy Document
                    </button>
                  </form>
                </div>

                {/* Published document list view */}
                <div className="bg-white border p-5 rounded-xl shadow-sm space-y-4 text-xs text-gray-700">
                  <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Current System Registry</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {documents.map(d => (
                      <div key={d.id} className="p-3 bg-gray-50 border rounded-lg space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <h4 className="font-bold text-xs text-gray-800">{d.title}</h4>
                          <span className="bg-[#7B1C2E] text-white font-bold text-[9px] px-1.5 py-0.5 rounded shrink-0 uppercase">{d.category}</span>
                        </div>
                        <p className="text-gray-600 bg-white p-1 rounded border border-gray-150">Policy: <b>{d.downloadPolicy}</b> {d.downloadLimit ? `(Limit: ${d.downloadLimit})` : ''}</p>
                        {d.validationCode && (
                          <p className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded w-max text-[10px] flex items-center gap-1">
                            🔐 Code Required: <span className="font-mono underline">{d.validationCode}</span>
                          </p>
                        )}
                        <span className="text-[10px] text-gray-400 block pt-1">SHA-256: {d.fileHash}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 13. ADMIN IMMUTABLE AUDIT TRAIL ==================== */}
            {currentUser.role === 'ADMIN' && activeTab === 'audit-history' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border">
                  <h3 className="font-bold text-gray-800 text-sm">Immutable Regulatory Audit Ledger</h3>
                  <p className="text-xs text-gray-500">Every authorization and document download strictly recorded with IP address tracking.</p>
                </div>

                <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-xs text-gray-700">
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-left min-w-[650px]">
                      <thead>
                        <tr className="bg-gray-50 border-b font-bold text-gray-600">
                          <th className="py-2.5 px-3">Date Record</th>
                          <th className="py-2.5 px-3">Security Action</th>
                          <th className="py-2.5 px-3">Resource Type</th>
                          <th className="py-2.5 px-3 font-mono">Reference ID</th>
                          <th className="py-2.5 px-3">IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map(log => (
                          <tr key={log.id} className="border-b hover:bg-gray-50 font-medium">
                            <td className="py-2.5 px-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                            <td className="py-2.5 px-3 font-bold text-indigo-800">{log.action}</td>
                            <td className="py-2.5 px-3">{log.entityType || 'SYSTEM'}</td>
                            <td className="py-2.5 px-3 font-mono">{log.entityId || 'N/A'}</td>
                            <td className="py-2.5 px-3 font-mono">{log.ipAddress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 14. ADMIN PROFILE TAB (ILO Admin) ==================== */}
            {currentUser.role === 'ADMIN' && activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* Header card with quick statistics */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      src={currentUser.profilePhotoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"}
                      className="w-20 h-20 rounded-full border-4 border-slate-800 object-cover"
                      alt="ILO Admin Avatar"
                    />
                    <div className="absolute bottom-0 right-0 bg-[#7B1C2E] text-white p-1 rounded-full text-[9px] font-bold border-2 border-slate-900">
                      ILO Admin
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-xl font-extrabold">{currentUser.fullName}</h2>
                    <p className="text-xs text-indigo-200 font-semibold tracking-wide uppercase mt-0.5">Industrial Liaison Registrar • {adminStaffCodeDraft || 'KNPSS-ADMIN'}</p>
                    <div className="flex flex-wrap gap-2.5 mt-3 justify-center md:justify-start">
                      <span className="bg-slate-800 px-2.5 py-1 rounded text-[10.5px] font-mono border border-slate-700">Portfolio: {adminPortfolioDraft || 'Core Coordination'}</span>
                      <span className="bg-[#7B1C2E] px-2.5 py-1 rounded text-[10.5px] font-mono border border-red-700 font-bold">Role: {adminPermissionsRoleDraft}</span>
                    </div>
                  </div>
                  <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center w-full md:w-auto">
                    <p className="text-[10px] text-slate-400 uppercase font-black leading-none tracking-wider">Total Active Users</p>
                    <p className="text-2xl font-black mt-1 text-indigo-400">{usersList?.length || 0}</p>
                    <p className="text-[9px] text-[#7B1C2E] mt-1 font-bold">100% Policy Compliant</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form */}
                  <form onSubmit={handleUpdateAdminProfile} className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
                    <div className="border-b pb-3 border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Administrative Registry Parameters</h3>
                        <p className="text-[11px] text-gray-500">Edit institutional credentials, extensions, and assigned office configurations below.</p>
                      </div>
                      <span className="text-[10px] bg-red-50 text-[#7B1C2E] px-2 py-0.5 rounded font-bold uppercase">System Authorizer</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Admin Staff Code */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Official ILO Staff Code</label>
                        <input
                          type="text"
                          value={adminStaffCodeDraft}
                          onChange={(e) => setAdminStaffCodeDraft(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800 font-mono"
                          placeholder="e.g. KNP-ILO-REGISTRAR-01"
                        />
                      </div>

                      {/* Portfolio */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Industrial Liaison Portfolio</label>
                        <input
                          type="text"
                          value={adminPortfolioDraft}
                          onChange={(e) => setAdminPortfolioDraft(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Academic Placements & Partnerships"
                        />
                      </div>

                      {/* Permissions Role */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Security Permissions Clearance</label>
                        <select
                          value={adminPermissionsRoleDraft}
                          onChange={(e: any) => setAdminPermissionsRoleDraft(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800 font-bold"
                        >
                          <option value="PRIMARY_OFFICER">Primary Placement Officer</option>
                          <option value="AUDITOR">Security Compliancy Auditor</option>
                          <option value="SYSTEM_ADMIN">Super System Liaison Administrator</option>
                        </select>
                      </div>

                      {/* Office Extension */}
                      <div className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Telecom Office Extension Code</label>
                        <input
                          type="text"
                          value={adminOfficeExtensionDraft}
                          onChange={(e) => setAdminOfficeExtensionDraft(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800 font-mono"
                          placeholder="e.g. EXT 4001"
                        />
                      </div>

                      {/* Desk Location */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10.5px] font-bold text-gray-700 block uppercase">Liaison Office Desk Location</label>
                        <input
                          type="text"
                          value={adminDeskLocationDraft}
                          onChange={(e) => setAdminDeskLocationDraft(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-hidden text-gray-800"
                          placeholder="e.g. Central Administration Building, Ground Floor Suite A"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 border-gray-100 flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 font-mono">Operations tracked on immutable logs ledger.</p>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition hover:shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingProfile ? 'Synchronizing Institutional Node...' : 'Save ILO Registry Credentials'}
                      </button>
                    </div>
                  </form>

                  {/* Tasks snapshot */}
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                      <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest font-sans">ILO Regulatory Mandate</h4>
                      <div className="space-y-3 leading-relaxed text-xs text-gray-600">
                        <p>The Industrial Liaison Office coordinates national attachment allocations, approves organizational clearance states, and enforces immutable compliance trails.</p>
                        <div className="border-l-2 border-indigo-700 pl-2.5 py-1 font-mono text-[10px] bg-indigo-50 text-indigo-700 rounded-r">
                          <span><b>Compliance rule:</b> Changes to permissions clearance require twin security approvals.</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Liaison Telemetry</h4>
                      <div className="space-y-2 text-[11px] font-mono text-gray-500">
                        <div className="flex justify-between py-1 border-b">
                          <span>ILO User ID:</span>
                          <span className="font-bold text-gray-700">{currentUser.id}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span>Liaison Email:</span>
                          <span className="font-bold text-gray-700">{currentUser.email}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Database Store:</span>
                          <span className="text-indigo-600 font-bold">SQL / ENFORCED ACID</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==================== 14.1 SECURITY & LOCKOUT OPERATIONS BOARD ==================== */}
                <div id="security-lockout-operations-board" className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-dashed border-slate-300 space-y-6 mt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-1.5 bg-[#7B1C2E] text-white text-[10px] font-bold rounded">CORE SHIELD</span>
                        <h3 className="text-base font-extrabold text-slate-800 tracking-tight">System Account Directory & Lockout Security Board</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Manage operational live status, bypass safety permissions, and deactivate compromise vectors globally.</p>
                    </div>
                    {/* Lockout Summary Stat cards */}
                    <div className="flex flex-wrap gap-3 font-mono">
                      <div id="card-total-core-users" className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center shadow-2xs">
                        <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">Total Core Users</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{usersList?.length || 0}</p>
                      </div>
                      <div id="card-locked-out-inactive" className="bg-rose-50 px-3 py-1.5 rounded-lg border border-red-200 text-center shadow-2xs">
                        <p className="text-[9px] text-rose-600 font-bold uppercase leading-none font-sans">Locked Out / Inactive</p>
                        <p className="text-sm font-black text-rose-700 mt-1">
                          {usersList?.filter(u => !u.isActive).length || 0}
                        </p>
                      </div>
                      <div id="card-trainee-restricted" className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-center shadow-2xs">
                        <p className="text-[9px] text-amber-800 font-bold uppercase leading-none font-sans">Trainee Restrict</p>
                        <p className="text-sm font-black text-amber-700 mt-1">
                          {usersList?.filter(u => u.role === 'TRAINEE' && !u.isApprovedForLogin).length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div id="table-sec-directory-container" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-between pb-4">
                      <div className="w-full sm:max-w-xs relative">
                        <input
                          id="input-lockout-search"
                          type="text"
                          placeholder="Search directory by name, role or email..."
                          value={adminLockoutSearch}
                          onChange={(e) => setAdminLockoutSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#7B1C2E] outline-none text-slate-800 placeholder-slate-400"
                        />
                        <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        <button
                          id="btn-lockout-all"
                          onClick={() => setAdminLockoutFilter('ALL')}
                          className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            adminLockoutFilter === 'ALL'
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          All ({usersList?.length || 0})
                        </button>
                        <button
                          id="btn-lockout-locked"
                          onClick={() => setAdminLockoutFilter('LOCKED_OUT')}
                          className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            adminLockoutFilter === 'LOCKED_OUT'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          Locked Out / Inactive ({usersList?.filter(u => !u.isActive).length || 0})
                        </button>
                        <button
                          id="btn-lockout-active"
                          onClick={() => setAdminLockoutFilter('ACTIVE')}
                          className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            adminLockoutFilter === 'ACTIVE'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          Active ({usersList?.filter(u => u.isActive).length || 0})
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table id="table-user-accounts-security" className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3">Identity Node</th>
                            <th className="py-2.5 px-3">System Role</th>
                            <th className="py-2.5 px-3">Secure Credentials</th>
                            <th className="py-2.5 px-3 font-sans">Last Login Check</th>
                            <th className="py-2.5 px-3">Security Status</th>
                            <th className="py-2.5 px-3 text-right">Actions Override</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const filtered = (usersList || []).filter(u => {
                              // Search matching name, email, role
                              const query = adminLockoutSearch.toLowerCase();
                              const matchesSearch =
                                u.fullName.toLowerCase().includes(query) ||
                                u.email.toLowerCase().includes(query) ||
                                u.role.toLowerCase().includes(query);
                              
                              if (!matchesSearch) return false;
                              
                              if (adminLockoutFilter === 'LOCKED_OUT') return !u.isActive;
                              if (adminLockoutFilter === 'ACTIVE') return u.isActive;
                              return true;
                            });

                            if (filtered.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold font-sans">
                                    No node entries matching current security filters.
                                  </td>
                                </tr>
                              );
                            }

                            return filtered.map(u => {
                              const isSelf = u.id === currentUser.id;
                              return (
                                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors font-medium">
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-2.5">
                                      <img
                                        src={u.profilePhotoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                        alt={u.fullName}
                                        className="w-7 h-7 rounded-sm border object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div>
                                        <p className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                                          {u.fullName}
                                          {isSelf && (
                                            <span className="bg-[#7B1C2E] text-white text-[8px] px-1 rounded font-black tracking-normal">YOU</span>
                                          )}
                                        </p>
                                        <span className="text-[9.5px] text-slate-400 font-mono block">Node ID: {u.id}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    {(() => {
                                      switch (u.role) {
                                        case 'TRAINEE':
                                          return <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[9.5px] font-bold px-1.5 py-0.5 rounded">STUDENT / TRAINEE</span>;
                                        case 'OFFICER':
                                          return <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-[9.5px] font-bold px-1.5 py-0.5 rounded">ASSESSOR OFFICER</span>;
                                        case 'SUPERVISOR':
                                          return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-bold px-1.5 py-0.5 rounded">HOST SUPERVISOR</span>;
                                        case 'ADMIN':
                                          return <span className="bg-pink-50 text-pink-800 border border-pink-200 text-[9.5px] font-bold px-1.5 py-0.5 rounded">ILO ADMIN</span>;
                                        default:
                                          return <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[9.5px] font-mono px-1.5 py-0.5 rounded">{u.role}</span>;
                                      }
                                    })()}
                                  </td>
                                  <td className="py-3 px-3">
                                    <p className="text-slate-800 font-semibold">{u.email}</p>
                                    {u.phone && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{u.phone}</p>}
                                  </td>
                                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never Connected'}
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                                        <span className={`font-bold text-[10px] ${u.isActive ? 'text-emerald-700' : 'text-red-700 bg-red-50 px-1 py-0.2 rounded'}`}>
                                          {u.isActive ? 'OPERATIONAL' : 'LOCKED OUT'}
                                        </span>
                                      </div>
                                      {u.role === 'TRAINEE' && (
                                        <div className="flex items-center gap-1 text-[10px]">
                                          <span className="text-slate-400">Logbook Approval:</span>
                                          <span className={`font-bold ${u.isApprovedForLogin ? 'text-teal-600' : 'text-amber-600 bg-amber-50 px-1 rounded'}`}>
                                            {u.isApprovedForLogin ? 'GRANTED' : 'RESTRICTED'}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-right font-sans">
                                    <div className="flex justify-end gap-1.5">
                                      {/* Deactivate/Active Lockout button */}
                                      <button
                                        onClick={() => {
                                          if (isSelf && u.isActive) {
                                            if (confirm("WARNING: You are about to lock OUT your own ILO Administrator account. This will terminate your ability to manage system registers on next login. Proceed anyway?")) {
                                              handleToggleUserLockout(u);
                                            }
                                          } else {
                                            handleToggleUserLockout(u);
                                          }
                                        }}
                                        className={`px-2 py-0.5 text-[9.5px] font-bold rounded border transition duration-150 active:scale-95 cursor-pointer flex items-center gap-1 ${
                                          u.isActive
                                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:text-rose-800'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800'
                                        }`}
                                      >
                                        {u.isActive ? '🔒 Lock Account' : '🔓 Unlock'}
                                      </button>

                                      {/* Trainee directory approval toggle */}
                                      {u.role === 'TRAINEE' && (
                                        <button
                                          onClick={() => handleToggleUserApproval(u)}
                                          className={`px-1.5 py-0.5 text-[9.5px] font-bold rounded border transition duration-150 active:scale-95 cursor-pointer ${
                                            u.isApprovedForLogin
                                              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                              : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                                          }`}
                                        >
                                          {u.isApprovedForLogin ? '🚫 Restrict' : '✓ Approvals'}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dynamic activity stream & dynamic schema */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity feed column */}
                    <div id="live-activity-feed-container" className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2.5 border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-sans">Liaison & Authentication Activity Stream</h4>
                          <p className="text-[10px] text-slate-400 font-medium font-sans">All authenticated login sequences, password overrides, and signup sessions mapped to immutable ledger.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            id="btn-export-audit-csv"
                            onClick={handleExportAuditLogsToCSV}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg border border-emerald-700 transition duration-150 flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                            title="Export all database audit records to a CSV spreadsheet"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Export CSV</span>
                          </button>
                          <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-1 rounded font-extrabold uppercase">LIVE FEED</span>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {(() => {
                          // Filter audit logs for login and lockout related events
                          const authRelatedLogs = (auditLogs || []).filter(log => {
                            const action = log.action || '';
                            return (
                              action.includes("LOGIN") ||
                              action.includes("SIGNUP") ||
                              action.includes("DEACTIVATION") ||
                              action.includes("LOCKOUT") ||
                              action.includes("APPROVAL_OVERRIDE") ||
                              action.includes("OTP") ||
                              action.includes("MODIFICATION")
                            );
                          });

                          if (authRelatedLogs.length === 0) {
                            return (
                              <p className="text-center py-8 text-slate-400 font-semibold font-sans">
                                No security ledger entries recorded. Try logging out/in or changing profile parameters.
                              </p>
                            );
                          }

                          return authRelatedLogs.slice(0, 15).map(log => {
                            const isSuccessfulLogin = log.action === 'USER_LOGIN';
                            const isSignup = log.action === 'USER_SIGNUP' || log.action === 'AUTO_SIGNUP_ON_LOGIN';
                            const isDeact = log.action === 'USER_DEACTIVATION_ADMIN';
                            const isOverride = log.action === 'USER_APPROVAL_OVERRIDE';
                            const isPassword = log.action.includes("PASSWORD");

                            let icon = "⚙️";
                            let alertStyle = "border-slate-100 bg-slate-50";
                            let titleText = log.action;

                            if (isSuccessfulLogin) {
                              icon = "🔑";
                              alertStyle = "border-emerald-100 bg-emerald-50/50";
                              titleText = "Successful Credentials Authentication";
                            } else if (isSignup) {
                              icon = "🆕";
                              alertStyle = "border-sky-100 bg-sky-50/40";
                              titleText = "New Institutional Security Lease (Signup)";
                            } else if (isDeact) {
                              icon = "🚨";
                              alertStyle = "border-rose-100 bg-rose-50/40";
                              titleText = "Account Deactivation Enforcement";
                            } else if (isOverride) {
                              icon = "⚡";
                              alertStyle = "border-amber-100 bg-amber-50/40";
                              titleText = "Administrative Logging Bypassed Status";
                            } else if (isPassword) {
                              icon = "🔒";
                              alertStyle = "border-indigo-100 bg-indigo-50/40";
                              titleText = "Password Reset Operations";
                            }

                            return (
                              <div key={log.id} className={`p-3 rounded-xl border ${alertStyle} flex items-start gap-3 transition-all duration-200 hover:shadow-xs text-xs`}>
                                <div className="text-base py-0.5">{icon}</div>
                                <div className="space-y-1 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-slate-100 pb-1.5 mb-1.5">
                                    <p className="font-extrabold text-slate-800">{titleText}</p>
                                    <span className="text-[9.5px] text-slate-500 font-mono bg-slate-100/80 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      {new Date(log.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 font-medium leading-relaxed font-sans">
                                    User Reference <span className="font-mono text-[10.5px] text-slate-700 bg-slate-100 px-1 py-0.2 rounded font-bold">{log.id || log.entityId || 'SYSTEM'}</span> updated state on module <span className="font-bold">{log.entityType || 'CORE'}</span>.
                                  </p>
                                  {log.newValues && (
                                    <div className="bg-white/80 p-1.5 rounded text-[10px] font-mono text-slate-500 overflow-x-auto border">
                                      <span className="font-bold block text-slate-600 mb-0.5 font-sans">State modification logs:</span>
                                      {typeof log.newValues === 'string' ? log.newValues : JSON.stringify(log.newValues)}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                                    <span>🌐 Endpoint IP: {log.ipAddress || '127.0.0.1'}</span>
                                    <span>• ID Ref: #{log.id.slice(0, 8)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Dashboard Visualizer dynamic map / Visual component */}
                    <div id="visual-telemetry-container" className="bg-[#1E293B] text-slate-100 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-700 pb-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">System Telemetry Network Diagram</h4>
                        </div>
                        
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          Dynamic network topology representing registered database instances, encryption nodes, and locked-out user vectors.
                        </p>

                        {/* Interactive dynamic SVG of connections */}
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-center justify-center relative overflow-hidden h-40">
                          {/* Grid background effect */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10"></div>
                          
                          <svg className="w-full h-full max-w-[240px]" viewBox="0 0 240 160">
                            {/* Lines connecting nodes */}
                            <line x1="120" y1="80" x2="40" y2="40" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="3 3" />
                            <line x1="120" y1="80" x2="200" y2="40" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3 3" />
                            <line x1="120" y1="80" x2="40" y2="120" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="2 2" />
                            <line x1="120" y1="80" x2="200" y2="120" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="2 2" />

                            {/* Core ILO Admin Node */}
                            <circle cx="120" cy="80" r="14" fill="#7B1C2E" className="animate-pulse" />
                            <text x="120" y="83" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="monospace">ILO GATE</text>

                            {/* Student Nodes */}
                            <circle cx="40" cy="40" r="10" fill="#1E293B" stroke="#4F46E5" strokeWidth="2" />
                            <text x="40" y="42" textAnchor="middle" fill="#818CF8" fontSize="6" fontWeight="extrabold" fontFamily="monospace">STUDENT</text>

                            {/* Host Supervisor Nodes */}
                            <circle cx="200" cy="40" r="10" fill="#1E293B" stroke="#22C55E" strokeWidth="2" />
                            <text x="200" y="42" textAnchor="middle" fill="#4ADE80" fontSize="6" fontWeight="extrabold" fontFamily="monospace">HOST</text>

                            {/* Locked out user indicators red */}
                            <circle cx="40" cy="120" r="10" fill="#1E293B" stroke="#F43F5E" strokeWidth="2" />
                            <text x="40" y="122" textAnchor="middle" fill="#FB7185" fontSize="6" fontWeight="extrabold" fontFamily="monospace">BLOCKED</text>

                            {/* Assessor Nodes */}
                            <circle cx="200" cy="120" r="10" fill="#1E293B" stroke="#EAB308" strokeWidth="2" />
                            <text x="200" y="122" textAnchor="middle" fill="#FACC15" fontSize="6" fontWeight="extrabold" fontFamily="monospace">OFFICER</text>
                          </svg>

                          {/* Float details indicator */}
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] font-mono text-slate-500">
                            <span>REG_NODE: OK_LEASE</span>
                            <span>DATABASE: MOUNTED ✓</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-850 p-3 rounded-xl border border-slate-750 text-slate-400 text-[10px] space-y-1.5 mt-4 leading-relaxed font-mono">
                        <div className="flex justify-between">
                          <span>Connection Type:</span>
                          <span className="text-indigo-400 font-bold">SQL INGRESS SSL</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Live Session Logs:</span>
                          <span className="text-emerald-400 font-bold">ACTIVE STREAMING</span>
                        </div>
                        <div className="flex justify-between text-[9px] border-t border-slate-755 pt-1">
                          <span>Compliance Plan:</span>
                          <span className="text-[#4ADE80] font-sans font-bold">STRICT COMPLIANT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>

          {/* Floating Profile Action Toast Notifications */}
          {profileToast && (
            <div className="fixed bottom-5 right-5 z-[250] bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-xs font-semibold">{profileToast}</p>
            </div>
          )}

          {/* Circular Profile Photo Crop Simulator Modal */}
          {isCroppingOpen && photoSelectedUrl && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[200] p-4 text-xs font-sans">
              <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-gray-100 animate-scale-in">
                <div className="bg-[#7B1C2E] p-4 text-white text-center">
                  <h3 className="font-bold text-sm">Circular Profile Avatar Cropper</h3>
                  <p className="text-white/80 text-[10px] mt-0.5">Scale and position your institutional user file portrait</p>
                </div>

                <div className="p-6 flex flex-col items-center gap-5">
                  {/* Circular view preview wrapper */}
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#7B1C2E] bg-gray-50 relative shadow-inner">
                    <img 
                      src={photoSelectedUrl} 
                      className="absolute pointer-events-none transition-transform duration-100" 
                      style={{
                        transform: `scale(${cropScale})`,
                        top: '0%', left: '0%',
                        width: '100%', height: '100%',
                        objectFit: 'cover'
                      }}
                      alt="Crop Preview" 
                    />
                  </div>

                  {/* Adjustments control slider */}
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase">
                      <span>Zoom Adjustment</span>
                      <span>{Math.round(cropScale * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.1" 
                      value={cropScale}
                      onChange={(e) => setCropScale(parseFloat(e.target.value))}
                      className="w-full accent-[#7B1C2E]"
                    />
                  </div>

                  <div className="flex gap-3 w-full mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCroppingOpen(false);
                        setPhotoSelectedUrl(null);
                        setPhotoPreviewFile(null);
                      }}
                      className="flex-1 py-2 font-bold uppercase rounded-lg border text-gray-600 hover:bg-gray-50 transition tracking-wide text-[10px]"
                    >
                      Cancel File
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCropAndUpload}
                      className="flex-1 py-2 font-bold uppercase bg-[#7B1C2E] hover:bg-[#6A1727] text-white rounded-lg transition tracking-wide text-[10px]"
                    >
                      Confirm & Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive High-Fidelity Institutional PDF/Document Viewer Modal */}
          {viewingDoc && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[210] p-4 font-sans text-xs">
              <div className="bg-[#1E1E2F] rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-700 animate-scale-in text-slate-100">
                {/* Header bar */}
                <div className="bg-[#11111E] px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-[#7B1C2E] p-1.5 rounded text-white shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white line-clamp-1">{viewingDoc.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Category: <span className="text-red-400 font-bold uppercase">{viewingDoc.category}</span> | Version: <span className="font-semibold text-white">{viewingDoc.version}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setViewingDoc(null);
                      setTypedValidationCode('');
                      setValidationError('');
                    }}
                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-sm transition shrink-0 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Body */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0 bg-[#161624]">
                  {/* Left Side: Document simulated page or real PDF file iframe */}
                  <div className="flex-1 p-4 overflow-y-auto flex items-stretch justify-center bg-slate-950/40 border-r border-slate-800">
                    {viewingDoc.category === 'INSURANCE' && !isInsuranceCodeValidated ? (
                      /* Display lock message on a white paper background card */
                      <div className="m-auto bg-white text-slate-900 shadow-2xl p-6 sm:p-10 w-full max-w-2xl rounded-lg font-serif relative overflow-hidden flex flex-col min-h-[450px] border border-gray-100 items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 border border-amber-200">
                          <Lock className="w-8 h-8 text-[#7B1C2E]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wider">🔒 Policy Access Control Active</h4>
                          <p className="font-sans text-[10px] text-gray-500 max-w-sm leading-relaxed">
                            Trainees must successfully validate the security code printed on their institutional insurance release copy before content becomes legible.
                          </p>
                        </div>
                        
                        <div className="bg-slate-50 p-3 rounded-lg border text-left font-sans text-[10px] space-y-1 max-w-xs text-slate-600">
                          <p className="font-semibold text-[#7B1C2E]">Enter Code to Unlock:</p>
                          <p>Check code printed inside form or use KNP registrar default: <code className="bg-white px-1 border rounded text-red-600 font-mono font-bold">SAFE-KNP-2026</code></p>
                        </div>
                      </div>
                    ) : ( 
                      /* Once unlocked (or if not insurance document) */
                      (viewingDoc.fileUrl && !viewingDoc.fileUrl.endsWith('dummy.pdf')) ? (
                        <div className="w-full h-full flex flex-col bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-slate-800 min-h-[480px] space-y-4">
                          {/* Rich High-Fidelity External Viewer Anchor Banner */}
                          <div className="bg-[#11111E] p-3 rounded-xl border border-[#7B1C2E]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shrink-0">
                            <div className="space-y-1 text-center sm:text-left">
                              <span className="inline-block text-[9px] uppercase font-mono tracking-widest text-amber-500 font-extrabold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/30">
                                Browser Sandbox Protection Active
                              </span>
                              <h4 className="text-[11px] font-bold text-white mt-1">Official Document Page Layout Analyzer</h4>
                              <p className="text-[10px] text-slate-300 max-w-md select-text">
                                Inside sandboxed environments, browsers block plugin engines. Click the button to read your original uploaded PDF with absolute fidelity and correct page layouts.
                              </p>
                            </div>
                            <a 
                              href={viewingDoc.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-[#7B1C2E] hover:bg-[#6A1727] text-white px-4 py-2 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1.5 whitespace-nowrap shadow-md cursor-pointer select-none"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> View Original PDF Layout
                            </a>
                          </div>

                          <div className="flex-1 flex flex-col bg-slate-950/60 rounded-xl p-2 border border-slate-800 relative min-h-[300px]">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 rounded-lg text-[10px] font-mono text-slate-400 mb-2">
                              <span>EMBEDDED NATIVE VIEWER</span>
                              <span className="text-emerald-500 uppercase font-bold flex items-center gap-1">🟢 ONLINE</span>
                            </div>
                            
                            {/* The PDF iframe */}
                            <iframe 
                              src={`${viewingDoc.fileUrl}`} 
                              className="w-full flex-1 rounded-lg bg-white border border-slate-700 shadow-inner min-h-[340px]" 
                              title={viewingDoc.title}
                            />
                            
                            <div className="mt-2 bg-[#1A1A2B] text-slate-300 p-2 rounded-lg border border-slate-800 text-[10px] text-center">
                              💡 <b>Note:</b> If the space above is blank, gray, or shows a sad face, simply click the <b>"View Original PDF Layout"</b> button above to bypass sandbox restrictions.
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Simulated white paper canvas fallback */
                        <div className="m-auto bg-white text-slate-900 shadow-2xl p-6 sm:p-10 w-full max-w-2xl rounded-lg font-serif relative overflow-hidden flex flex-col min-h-[550px] border border-gray-100 select-none">
                          
                          {/* Institutional Header */}
                          <div className="text-center space-y-1 font-sans shrink-0 border-b-2 border-gray-900 pb-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-xs font-bold tracking-widest text-[#7B1C2E]">KNPSS / REGISTRAR</span>
                            </div>
                            <h2 className="text-sm font-extrabold text-gray-900 tracking-wider">THE KISUMU NATIONAL POLYTECHNIC</h2>
                            <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Office of the Industrial Liaison & Academic Attachments Directorate</p>
                            <p className="text-[8px] text-slate-400 italic">PO Box 1490 - 40100, Kisumu, Kenya | Email: liaison@kisumupoly.ac.ke</p>
                          </div>

                          {/* Paper Content Wrapper */}
                          <div className="flex-1 py-6 space-y-4 font-serif text-[11px] leading-relaxed relative">
                            {/* Actual simulated textual content of the document */}
                            <div className="space-y-4">
                              <div className="text-center font-sans tracking-wide">
                                <h3 className="font-bold text-xs uppercase text-[#7B1C2E] tracking-tight">{viewingDoc.title}</h3>
                                <p className="text-[9px] text-gray-500 mt-0.5 font-mono">REMO-ID: {viewingDoc.id} / SEC-CODE: {viewingDoc.fileHash.slice(0, 16)}...</p>
                              </div>

                              {viewingDoc.category === 'INSURANCE' && (
                                <div className="space-y-3 font-serif">
                                  <p className="indent-6 font-medium">
                                    This document serves to certify that the enrolled student listed herein is fully registered under the TVET Group Personal Accident & Public Liability Insurance scheme managed by Kisumu National Polytechnic student support funds.
                                  </p>
                                  <div className="bg-gray-50 p-3 rounded border border-gray-150 font-sans text-[10px] grid grid-cols-2 gap-2 text-gray-700">
                                    <div><b>Underwriter:</b> CIC General Insurance Pension Co.</div>
                                    <div><b>Policy Coverage Year:</b> 2026/2027 Academic Phase</div>
                                    <div><b>Insured Trainee:</b> {currentUser.fullName}</div>
                                    <div><b>Registered Email:</b> {currentUser.email}</div>
                                  </div>
                                  <p className="text-[10.5px]">
                                    <b>Key Cover Parameters:</b><br />
                                    1. Personal Accident medical reimbursement up to KES 250,000 per TVET sector accident.<br />
                                    2. Group life benefit to statutory nominees of up to KES 500,000.<br />
                                    3. Host company public liability property cover up to KES 1,000,000.
                                  </p>
                                  <p className="text-[10px] text-gray-500 italic">
                                    *Note: Coverage is immediately void if the trainee relocates from their registered county without initiating liaison notification logs.
                                  </p>
                                </div>
                              )}

                              {viewingDoc.category === 'POLICY' && (
                                <div className="space-y-3 font-serif">
                                  <p className="indent-6">
                                    Standard TVET Industrial Attachment operational rules mandate that all students adhere strictly to company code of conduct handbooks:
                                  </p>
                                  <ul className="list-decimal pl-5 text-[10px] space-y-1 text-gray-700 font-sans">
                                    <li>Submission of logbook updates on a daily basis is mandatory for assessment eligibility.</li>
                                    <li>Attendance details must be countersigned and stamped by company supervisor on site.</li>
                                    <li>Late logbooks are flagged automatically in the liaison queue and might trigger a field audit check.</li>
                                    <li>Do not engage in unauthenticated communications without supervisor approval.</li>
                                  </ul>
                                  <p>
                                    Failure to meet these guidelines triggers academic warnings and coordinates with the assessment officer to restrict formal graduation clearance.
                                  </p>
                                </div>
                              )}

                              {viewingDoc.category === 'NITA' && (
                                <div className="space-y-3 font-serif">
                                  <p className="indent-6">
                                    Reimbursement claims under the National Industrial Training Authority (NITA) are processed quarterly under compliance forms:
                                  </p>
                                  <div className="border border-dashed p-3 font-mono text-[9px] text-gray-600 bg-gray-50 space-y-1">
                                    <div>• NITA LEVY CODE: NITA-KNP-71822</div>
                                    <div>• SUBSIDY RECOVERY RATE: KES 30,000 / Trainee Semestrial</div>
                                    <div>• APPROVED DISBURSEMENT BANK: Kenya Commercial Bank (KCB)</div>
                                  </div>
                                  <p className="text-[10px]">
                                    Trainees must attach a certified copy of their stamped completion certificate, logbook summary reports generated from the portal, and active feedback survey forms.
                                  </p>
                                </div>
                              )}

                              {viewingDoc.category === 'LETTER' && (
                                <div className="space-y-3 font-serif">
                                  <p><b>TO WHOM IT MAY CONCERN / MANAGING DIRECTOR</b></p>
                                  <p className="indent-6">
                                    We respectfully introduce <b>{currentUser.fullName}</b> who is pursuing standard curriculum training in Kisumu National Polytechnic.
                                  </p>
                                  <p>
                                    Student has been cleared to proceed for their practical Industrial Attachment placement sector. We would be highly grateful for your corporate slot offer to this student.
                                  </p>
                                </div>
                              )}

                              {viewingDoc.category !== 'INSURANCE' && viewingDoc.category !== 'POLICY' && viewingDoc.category !== 'NITA' && viewingDoc.category !== 'LETTER' && (
                                <div className="space-y-3 font-serif">
                                  <p className="indent-6">
                                    This supplementary institutional document is released to all students to accompany mandatory liaison department files. Please review the version tags and match guidelines.
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    Released on {new Date().toLocaleDateString()} under administrative sign-off protocols.
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Stamp Overlay decoration */}
                            <div className="absolute bottom-4 right-4 pointer-events-none opacity-40 shrink-0">
                              <div className="border-4 border-emerald-600 rounded-full w-24 h-24 flex items-center justify-center text-emerald-600 font-sans font-bold text-[9px] uppercase tracking-wide rotate-12 bg-white flex-col">
                                <span>KNP LIAISON</span>
                                <span className="text-[8px] underline">VERIFIED</span>
                                <span className="text-[6px] tracking-normal">ISO CERTIFIED</span>
                              </div>
                            </div>
                          </div>

                          {/* Official Signatures */}
                          <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-[9px] font-sans text-gray-500 tracking-wide shrink-0">
                            <div>
                              <p className="font-bold text-gray-700">Dr. Walter O. K.</p>
                              <p>Director of Industrial Liaisons, KNP</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-700">Registrar Academics</p>
                              <p>The Kisumu National Polytechnic</p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Right Side: Validation & Action console panel */}
                  <div className="w-full md:w-80 p-6 flex flex-col justify-between shrink-0 bg-[#1A1A2A] overflow-y-auto">
                    <div className="space-y-5">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-[#7B1C2E] mb-1">Compliance Engine</h4>
                        <p className="text-[10.5px] text-slate-400">Validate security protocols and access offline resources.</p>
                      </div>

                      {/* Security Key Entry for Insurance */}
                      {viewingDoc.category === 'INSURANCE' && (
                        <div className="bg-[#11111E] p-4 rounded-xl border border-slate-700 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                            <Lock className="w-4 h-4" />
                            <span>Verification Controller</span>
                          </div>

                          <p className="text-[10px] text-slate-300 leading-normal">
                            All trainees must successfully validate the security code on the insurance cover in order to unlock company placement registrations.
                          </p>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enter Security Code</label>
                            <input 
                              type="text"
                              value={typedValidationCode}
                              onChange={(e) => {
                                setTypedValidationCode(e.target.value);
                                setValidationError('');
                              }}
                              placeholder="e.g. SAFE-KNP-2026"
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:border-amber-500 focus:outline-none uppercase"
                            />
                            {validationError && (
                              <p className="text-red-500 font-semibold text-[10px] mt-1 bg-red-950/40 p-1.5 rounded">{validationError}</p>
                            )}
                          </div>

                          {isInsuranceCodeValidated ? (
                            <p className="text-emerald-400 font-bold text-[10.5px] flex items-center gap-1.5 bg-emerald-950/40 p-2 rounded">
                              ✓ Code Verified & Active
                            </p>
                          ) : (
                            <button
                              onClick={() => {
                                if (!typedValidationCode) {
                                  setValidationError("Please enter a validation key.");
                                  return;
                                }
                                const expected = viewingDoc.validationCode || "SAFE-KNP-2026";
                                if (typedValidationCode.trim().toUpperCase() === expected.trim().toUpperCase()) {
                                  setIsInsuranceCodeValidated(true);
                                  localStorage.setItem(`knp_insurance_validated_${currentUser.id}`, 'true');
                                  setValidationError('');
                                  setTypedValidationCode('');
                                  alert("✓ Verification Successful! Insurance coverage validated. Your company attachment placement portal is now unlocked.");
                                } else {
                                  setValidationError("❌ Incorrect code. Check printed form or ask Registrar Liaison Office.");
                                }
                              }}
                              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-lg text-xs font-bold cursor-pointer transition shadow-xs"
                            >
                              🔑 Verify Document Code
                            </button>
                          )}
                        </div>
                      )}

                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-300 block uppercase tracking-wider">Access Parameters</span>
                        <div><b>Download Policy:</b> {viewingDoc.downloadPolicy}</div>
                        {viewingDoc.downloadLimit && (
                          <div><b>Client Downloads Allocation:</b> {viewingDoc.downloadLimit} usage limit</div>
                        )}
                        <div><b>Crypto Integrity Hash:</b> </div>
                        <div className="font-mono text-[9px] bg-slate-950 p-1 rounded border border-slate-800 break-all select-all">{viewingDoc.fileHash}</div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-slate-800">
                      {viewingDoc.downloadPolicy === 'VIEW_ONLY' ? (
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                          <span><b>Read-Only Notice:</b> The administrator has disabled local file downloads for this document registry index. Readable on-screen only.</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            // Check if insurance is locked
                            if (viewingDoc.category === 'INSURANCE' && !isInsuranceCodeValidated) {
                              alert("ACCESS DENIED: You must validate the insurance security code above before you can download this policy document.");
                              return;
                            }
                            handleDownloadDocument(viewingDoc);
                          }}
                          className={`w-full text-white py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider transition shadow-sm ${
                            viewingDoc.category === 'INSURANCE' && !isInsuranceCodeValidated 
                              ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
                              : 'bg-[#7B1C2E] hover:bg-[#6A1727]'
                          }`}
                        >
                          <FileDown className="w-4 h-4" /> Download/Acquire Document
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setViewingDoc(null);
                          setTypedValidationCode('');
                          setValidationError('');
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-bold cursor-pointer transition border border-slate-700"
                      >
                        Close Document
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

