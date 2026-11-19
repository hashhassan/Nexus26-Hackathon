// Phase 1 mock data. Delete once nothing imports it (Phase 2 replaces it with real queries).
import type {
  Complaint,
  ComplaintStatus,
  ComplaintUpdate,
  Department,
  User,
} from "@/generated/prisma/client";
import { DEPARTMENTS } from "@/lib/constants";

export type MockUpdate = ComplaintUpdate & { admin: Pick<User, "id" | "name"> };

export type MockComplaint = Complaint & {
  student: Pick<User, "id" | "name">;
  updates: MockUpdate[];
};

const baseUser = {
  emailVerified: true,
  image: null,
  createdAt: new Date("2026-09-01T08:00:00Z"),
  updatedAt: new Date("2026-09-01T08:00:00Z"),
};

export const mockStudent: User = {
  ...baseUser,
  id: "stu_1",
  name: "Ayesha Khan",
  email: "student1@campus.test",
  role: "student",
  department: null,
};

const otherStudent: User = {
  ...baseUser,
  id: "stu_2",
  name: "Hamza Ali",
  email: "student2@campus.test",
  role: "student",
  department: null,
};

export const mockAdmins: User[] = [
  {
    ...baseUser,
    id: "adm_super",
    name: "Dr. Sara Malik",
    email: "admin@campus.test",
    role: "super_admin",
    department: null,
  },
  {
    ...baseUser,
    id: "adm_cafe",
    name: "Imran Siddiqui",
    email: "cafeteria@campus.test",
    role: "dept_admin",
    department: "CAFETERIA",
  },
  {
    ...baseUser,
    id: "adm_lib",
    name: "Nadia Hussain",
    email: "library@campus.test",
    role: "dept_admin",
    department: "LIBRARY",
  },
  {
    ...baseUser,
    id: "adm_labs",
    name: "Bilal Ahmed",
    email: "labs@campus.test",
    role: "dept_admin",
    department: "LABS_IT",
  },
  {
    ...baseUser,
    id: "adm_teach",
    name: "Prof. Farah Noor",
    email: "teaching@campus.test",
    role: "dept_admin",
    department: "TEACHING",
  },
];

const adminByDept: Record<Department, Pick<User, "id" | "name">> = {
  CAFETERIA: mockAdmins[1],
  LIBRARY: mockAdmins[2],
  LABS_IT: mockAdmins[3],
  TEACHING: mockAdmins[4],
};

type UpdateSeed = [status: ComplaintStatus, remark: string, at: string];

type ComplaintSeed = {
  id: string;
  title: string;
  description: string;
  department: Department;
  issueType: string;
  status: ComplaintStatus;
  student: User;
  createdAt: string;
  rating?: [number, string?];
  updates: UpdateSeed[];
};

function build(seed: ComplaintSeed): MockComplaint {
  const admin = adminByDept[seed.department];
  const updates: MockUpdate[] = seed.updates.map(([status, remark, at], i) => ({
    id: `${seed.id}_u${i + 1}`,
    complaintId: seed.id,
    adminId: admin.id,
    admin,
    status,
    remark,
    createdAt: new Date(at),
  }));
  const last = updates[updates.length - 1];
  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    department: seed.department,
    issueType: seed.issueType,
    status: seed.status,
    imageUrl: null,
    rating: seed.rating?.[0] ?? null,
    ratingComment: seed.rating?.[1] ?? null,
    studentId: seed.student.id,
    student: { id: seed.student.id, name: seed.student.name },
    updates,
    createdAt: new Date(seed.createdAt),
    updatedAt: last ? last.createdAt : new Date(seed.createdAt),
  };
}

export const mockComplaints: MockComplaint[] = (
  [
    {
      id: "cmp_1",
      title: "Stale food served at lunch counter",
      description:
        "The biryani served on Monday was cold and smelled off. Several students felt unwell afterwards. Please inspect the kitchen hygiene.",
      department: "CAFETERIA",
      issueType: "Food quality / hygiene",
      status: "RESOLVED",
      student: mockStudent,
      createdAt: "2026-10-20T09:15:00Z",
      rating: [5, "Quick action, food has been fresh since."],
      updates: [
        ["IN_PROGRESS", "We have started an inspection of the kitchen.", "2026-10-20T13:00:00Z"],
        ["RESOLVED", "Kitchen staff retrained and supplier changed. Daily checks are now logged.", "2026-10-22T10:30:00Z"],
      ],
    },
    {
      id: "cmp_2",
      title: "Meal prices raised without notice",
      description:
        "The price of a basic lunch combo went from 250 to 350 this month with no announcement.",
      department: "CAFETERIA",
      issueType: "High prices",
      status: "REJECTED",
      student: otherStudent,
      createdAt: "2026-10-18T11:00:00Z",
      updates: [
        ["REJECTED", "Prices were revised under the semester contract approved by the committee. A revised menu with budget options will be posted.", "2026-10-19T09:00:00Z"],
      ],
    },
    {
      id: "cmp_3",
      title: "Very few vegetarian options",
      description:
        "Only one vegetarian dish is available most days. Please add more variety to the menu.",
      department: "CAFETERIA",
      issueType: "Limited variety",
      status: "PENDING",
      student: mockStudent,
      createdAt: "2026-11-15T08:40:00Z",
      updates: [
        ["PENDING", "Complaint received and queued for review.", "2026-11-15T09:00:00Z"],
      ],
    },
    {
      id: "cmp_4",
      title: "Core textbooks are 10 years old",
      description:
        "The Database Systems and Operating Systems shelves only have editions from 2014. Newer editions are needed for the syllabus.",
      department: "LIBRARY",
      issueType: "Outdated books",
      status: "IN_PROGRESS",
      student: mockStudent,
      createdAt: "2026-11-05T10:20:00Z",
      updates: [
        ["PENDING", "Complaint received.", "2026-11-05T11:00:00Z"],
        ["IN_PROGRESS", "Purchase request for updated editions sent to the finance office.", "2026-11-08T14:00:00Z"],
      ],
    },
    {
      id: "cmp_5",
      title: "Library closes too early before exams",
      description:
        "The library closes at 6 PM even during exam week. Please extend opening hours.",
      department: "LIBRARY",
      issueType: "Opening hours",
      status: "RESOLVED",
      student: otherStudent,
      createdAt: "2026-10-28T16:45:00Z",
      rating: [4, "Helpful, but weekends are still short."],
      updates: [
        ["IN_PROGRESS", "Reviewing staffing for extended hours.", "2026-10-29T10:00:00Z"],
        ["RESOLVED", "Library will stay open until 10 PM during exam weeks.", "2026-11-02T09:00:00Z"],
      ],
    },
    {
      id: "cmp_6",
      title: "No free seats on the second floor",
      description:
        "From 11 AM onwards there is no place to sit. Many students use the floor.",
      department: "LIBRARY",
      issueType: "Seating space",
      status: "PENDING",
      student: mockStudent,
      createdAt: "2026-11-16T12:10:00Z",
      updates: [
        ["PENDING", "Complaint received and queued for review.", "2026-11-16T12:30:00Z"],
      ],
    },
    {
      id: "cmp_7",
      title: "Lab 3 computers will not boot",
      description:
        "Eight of the twenty machines in Lab 3 show a boot error. Our programming practicals are being disrupted.",
      department: "LABS_IT",
      issueType: "Computers not working",
      status: "IN_PROGRESS",
      student: otherStudent,
      createdAt: "2026-11-10T09:30:00Z",
      updates: [
        ["PENDING", "Complaint logged with the IT desk.", "2026-11-10T10:00:00Z"],
        ["IN_PROGRESS", "Technician found failed disks on five machines. Replacements ordered.", "2026-11-12T11:15:00Z"],
        ["IN_PROGRESS", "Three machines repaired, two pending parts.", "2026-11-14T15:00:00Z"],
      ],
    },
    {
      id: "cmp_8",
      title: "Wi-Fi drops constantly in the CS block",
      description:
        "The internet disconnects every few minutes in the CS block, making online submissions difficult.",
      department: "LABS_IT",
      issueType: "Internet",
      status: "RESOLVED",
      student: mockStudent,
      createdAt: "2026-10-12T13:00:00Z",
      updates: [
        ["IN_PROGRESS", "Network team is checking the access points.", "2026-10-13T09:00:00Z"],
        ["RESOLVED", "Two faulty access points replaced and signal tested.", "2026-10-16T12:00:00Z"],
      ],
    },
    {
      id: "cmp_9",
      title: "Projector in Room B-204 is dead",
      description:
        "The projector does not turn on, so lecturers cannot show slides.",
      department: "LABS_IT",
      issueType: "Projector / multimedia",
      status: "PENDING",
      student: otherStudent,
      createdAt: "2026-11-17T08:15:00Z",
      updates: [
        ["PENDING", "Complaint received and queued for review.", "2026-11-17T08:45:00Z"],
      ],
    },
    {
      id: "cmp_10",
      title: "MATLAB is not installed in the labs",
      description:
        "The numerical methods course needs MATLAB but it is missing from all lab machines.",
      department: "LABS_IT",
      issueType: "Missing software",
      status: "REJECTED",
      student: mockStudent,
      createdAt: "2026-10-30T10:00:00Z",
      updates: [
        ["REJECTED", "The campus license does not cover MATLAB. Please use the free Octave install, now added to all lab machines.", "2026-11-01T09:30:00Z"],
      ],
    },
    {
      id: "cmp_11",
      title: "Lecturer regularly 20 minutes late",
      description:
        "Our Software Engineering lecture starts about 20 minutes late almost every week, cutting the content short.",
      department: "TEACHING",
      issueType: "Teacher late",
      status: "IN_PROGRESS",
      student: mockStudent,
      createdAt: "2026-11-08T14:20:00Z",
      updates: [
        ["PENDING", "Complaint received.", "2026-11-08T15:00:00Z"],
        ["IN_PROGRESS", "Discussed with the department head, timetable under review.", "2026-11-11T10:00:00Z"],
      ],
    },
    {
      id: "cmp_12",
      title: "Lecture notes never uploaded",
      description:
        "No notes or slides have been shared for Data Structures this semester.",
      department: "TEACHING",
      issueType: "Notes unavailable",
      status: "RESOLVED",
      student: otherStudent,
      createdAt: "2026-10-05T09:00:00Z",
      rating: [5, "All slides are on the portal now. Thank you!"],
      updates: [
        ["IN_PROGRESS", "Instructor asked to upload materials.", "2026-10-06T11:00:00Z"],
        ["RESOLVED", "All slides for weeks 1 to 8 uploaded to the course portal.", "2026-10-09T16:00:00Z"],
      ],
    },
  ] satisfies ComplaintSeed[]
).map(build);

export const mockStats = {
  total: mockComplaints.length,
  pending: mockComplaints.filter((c) => c.status === "PENDING").length,
  inProgress: mockComplaints.filter((c) => c.status === "IN_PROGRESS").length,
  resolved: mockComplaints.filter((c) => c.status === "RESOLVED").length,
  rejected: mockComplaints.filter((c) => c.status === "REJECTED").length,
};

export const mockDepartmentCounts: { department: Department; label: string; count: number }[] = (
  Object.keys(DEPARTMENTS) as Department[]
).map((department) => ({
  department,
  label: DEPARTMENTS[department].label,
  count: mockComplaints.filter((c) => c.department === department).length,
}));

export const mockRecurringIssues: { issueType: string; department: Department; count: number }[] = [
  { issueType: "Computers not working", department: "LABS_IT", count: 14 },
  { issueType: "Food quality / hygiene", department: "CAFETERIA", count: 11 },
  { issueType: "Seating space", department: "LIBRARY", count: 9 },
  { issueType: "Teacher late", department: "TEACHING", count: 7 },
  { issueType: "Internet", department: "LABS_IT", count: 6 },
];

const rated = mockComplaints.filter((c) => c.rating !== null);
export const mockAvgSatisfaction = {
  average: Number(
    (rated.reduce((sum, c) => sum + (c.rating ?? 0), 0) / rated.length).toFixed(1),
  ),
  count: rated.length,
};

/** Fixed "now" for mock data so Today / Earlier grouping is stable. */
export const mockNow = new Date("2026-11-19T12:00:00Z");

export type MockNotification = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  departmentLabel: string;
  status: ComplaintStatus;
  remark: string;
  createdAt: Date;
  unread: boolean;
  /** "status" = status change, "remark" = remark only, "new" = new complaint (admin feed). */
  kind: "status" | "remark" | "new";
  /** Student name, for "new" items. */
  actorName?: string;
};

const minutesAgo = (m: number) => new Date(mockNow.getTime() - m * 60_000);

/** Student feed: recent updates on their own complaints. */
export const mockNotifications: MockNotification[] = [
  {
    id: "ntf_1",
    complaintId: "cmp_4",
    complaintTitle: "Core textbooks are 10 years old",
    departmentLabel: "Library",
    status: "IN_PROGRESS",
    remark: "Purchase request for updated editions sent to the finance office.",
    createdAt: minutesAgo(25),
    unread: true,
    kind: "status",
  },
  {
    id: "ntf_2",
    complaintId: "cmp_11",
    complaintTitle: "Lecturer regularly 20 minutes late",
    departmentLabel: "Teaching",
    status: "IN_PROGRESS",
    remark: "Discussed with the department head, timetable under review.",
    createdAt: minutesAgo(120),
    unread: true,
    kind: "remark",
  },
  {
    id: "ntf_3",
    complaintId: "cmp_8",
    complaintTitle: "Wi-Fi drops constantly in the CS block",
    departmentLabel: "Labs / IT",
    status: "RESOLVED",
    remark: "Two faulty access points replaced and signal tested.",
    createdAt: minutesAgo(240),
    unread: true,
    kind: "status",
  },
  {
    id: "ntf_4",
    complaintId: "cmp_6",
    complaintTitle: "No free seats on the second floor",
    departmentLabel: "Library",
    status: "PENDING",
    remark: "Complaint received and queued for review.",
    createdAt: new Date("2026-11-16T12:30:00Z"),
    unread: false,
    kind: "remark",
  },
  {
    id: "ntf_5",
    complaintId: "cmp_3",
    complaintTitle: "Very few vegetarian options",
    departmentLabel: "Cafeteria",
    status: "PENDING",
    remark: "Complaint received and queued for review.",
    createdAt: new Date("2026-11-15T09:00:00Z"),
    unread: false,
    kind: "remark",
  },
  {
    id: "ntf_6",
    complaintId: "cmp_10",
    complaintTitle: "MATLAB is not installed in the labs",
    departmentLabel: "Labs / IT",
    status: "REJECTED",
    remark: "The campus license does not cover MATLAB. Please use the free Octave install, now added to all lab machines.",
    createdAt: new Date("2026-11-12T09:30:00Z"),
    unread: false,
    kind: "status",
  },
  {
    id: "ntf_7",
    complaintId: "cmp_4",
    complaintTitle: "Core textbooks are 10 years old",
    departmentLabel: "Library",
    status: "PENDING",
    remark: "Complaint received.",
    createdAt: new Date("2026-11-05T11:00:00Z"),
    unread: false,
    kind: "remark",
  },
  {
    id: "ntf_8",
    complaintId: "cmp_1",
    complaintTitle: "Stale food served at lunch counter",
    departmentLabel: "Cafeteria",
    status: "RESOLVED",
    remark: "Kitchen staff retrained and supplier changed. Daily checks are now logged.",
    createdAt: new Date("2026-10-22T10:30:00Z"),
    unread: false,
    kind: "status",
  },
];

/** Admin feed: newly submitted complaints (the 3 latest are unread). */
export const mockAdminNotifications: MockNotification[] = mockComplaints
  .slice()
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 8)
  .map((c, i) => ({
    id: `ntf_adm_${c.id}`,
    complaintId: c.id,
    complaintTitle: c.title,
    departmentLabel: DEPARTMENTS[c.department].label,
    status: c.status,
    remark: c.description,
    createdAt: c.createdAt,
    unread: i < 3,
    kind: "new" as const,
    actorName: c.student.name,
  }));
