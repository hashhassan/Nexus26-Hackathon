import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { PrismaNeon } from "@prisma/adapter-neon";
import { ComplaintStatus, Department, PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

const PASSWORD = "Demo@1234";

const USERS = [
  { name: "Dr. Sara Malik", email: "super@campus.edu", role: "super_admin", department: null },
  { name: "Imran Siddiqui", email: "cafeteria@campus.edu", role: "dept_admin", department: "CAFETERIA" },
  { name: "Nadia Hussain", email: "library@campus.edu", role: "dept_admin", department: "LIBRARY" },
  { name: "Bilal Ahmed", email: "labs@campus.edu", role: "dept_admin", department: "LABS_IT" },
  { name: "Prof. Farah Noor", email: "teaching@campus.edu", role: "dept_admin", department: "TEACHING" },
  { name: "Ali Raza", email: "ali@student.edu", role: "student", department: null },
  { name: "Ayesha Khan", email: "ayesha@student.edu", role: "student", department: null },
] as const;

const ADMIN_EMAIL: Record<Department, string> = {
  CAFETERIA: "cafeteria@campus.edu",
  LIBRARY: "library@campus.edu",
  LABS_IT: "labs@campus.edu",
  TEACHING: "teaching@campus.edu",
};

type C = {
  dept: Department;
  issue: string;
  title: string;
  desc: string;
  status: ComplaintStatus;
  student: "ali@student.edu" | "ayesha@student.edu";
  daysAgo: number;
  rating?: [number, string?];
  updates: [ComplaintStatus, string][];
};

const COMPLAINTS: C[] = [
  { dept: "CAFETERIA", issue: "Food quality / hygiene", title: "Stale food served at lunch counter", desc: "The biryani served on Monday was cold and smelled off. Several students felt unwell afterwards. Please inspect the kitchen hygiene.", status: "RESOLVED", student: "ayesha@student.edu", daysAgo: 13, rating: [5, "Quick action, food has been fresh since."], updates: [["IN_PROGRESS", "We have started an inspection of the kitchen."], ["RESOLVED", "Kitchen staff retrained and supplier changed. Daily checks are now logged."]] },
  { dept: "CAFETERIA", issue: "High prices", title: "Meal prices raised without notice", desc: "The price of a basic lunch combo went from 250 to 350 this month with no announcement.", status: "REJECTED", student: "ali@student.edu", daysAgo: 12, updates: [["REJECTED", "Prices were revised under the semester contract approved by the committee. A revised menu with budget options will be posted."]] },
  { dept: "CAFETERIA", issue: "Limited variety", title: "Very few vegetarian options", desc: "Only one vegetarian dish is available most days. Please add more variety to the menu.", status: "PENDING", student: "ayesha@student.edu", daysAgo: 2, updates: [["PENDING", "Complaint received and queued for review."]] },
  { dept: "CAFETERIA", issue: "Staff behaviour", title: "Counter staff rude during rush hour", desc: "Staff at the main counter were dismissive and shouted at students waiting in line.", status: "IN_PROGRESS", student: "ali@student.edu", daysAgo: 6, updates: [["PENDING", "Complaint received."], ["IN_PROGRESS", "Counter staff have been spoken to; we are monitoring service during peak hours."]] },
  { dept: "LIBRARY", issue: "Outdated books", title: "Core textbooks are 10 years old", desc: "The Database Systems and Operating Systems shelves only have editions from 2014. Newer editions are needed for the syllabus.", status: "IN_PROGRESS", student: "ayesha@student.edu", daysAgo: 9, updates: [["PENDING", "Complaint received."], ["IN_PROGRESS", "Purchase request for updated editions sent to the finance office."]] },
  { dept: "LIBRARY", issue: "Opening hours", title: "Library closes too early before exams", desc: "The library closes at 6 PM even during exam week. Please extend opening hours.", status: "RESOLVED", student: "ali@student.edu", daysAgo: 11, rating: [4, "Helpful, but weekends are still short."], updates: [["IN_PROGRESS", "Reviewing staffing for extended hours."], ["RESOLVED", "Library will stay open until 10 PM during exam weeks."]] },
  { dept: "LIBRARY", issue: "Seating space", title: "No free seats on the second floor", desc: "From 11 AM onwards there is no place to sit. Many students use the floor.", status: "PENDING", student: "ayesha@student.edu", daysAgo: 3, updates: [["PENDING", "Complaint received and queued for review."]] },
  { dept: "LIBRARY", issue: "Librarian availability", title: "Nobody at the issue desk after 3 PM", desc: "The issue desk is unattended most afternoons so books cannot be borrowed or returned.", status: "REJECTED", student: "ali@student.edu", daysAgo: 8, updates: [["REJECTED", "The desk is staffed until 5 PM; a self-return box is available at the entrance. Please report specific dates if it recurs."]] },
  { dept: "LABS_IT", issue: "Computers not working", title: "Lab 3 computers will not boot", desc: "Eight of the twenty machines in Lab 3 show a boot error. Our programming practicals are being disrupted.", status: "IN_PROGRESS", student: "ali@student.edu", daysAgo: 7, updates: [["PENDING", "Complaint logged with the IT desk."], ["IN_PROGRESS", "Technician found failed disks on five machines. Replacements ordered."], ["IN_PROGRESS", "Three machines repaired, two pending parts."]] },
  { dept: "LABS_IT", issue: "Internet", title: "Wi-Fi drops constantly in the CS block", desc: "The internet disconnects every few minutes in the CS block, making online submissions difficult.", status: "RESOLVED", student: "ayesha@student.edu", daysAgo: 14, rating: [5, "Stable connection since the fix."], updates: [["IN_PROGRESS", "Network team is checking the access points."], ["RESOLVED", "Two faulty access points replaced and signal tested."]] },
  { dept: "LABS_IT", issue: "Projector / multimedia", title: "Projector in Room B-204 is dead", desc: "The projector does not turn on, so lecturers cannot show slides.", status: "PENDING", student: "ali@student.edu", daysAgo: 1, updates: [["PENDING", "Complaint received and queued for review."]] },
  { dept: "LABS_IT", issue: "Missing software", title: "MATLAB is not installed in the labs", desc: "The numerical methods course needs MATLAB but it is missing from all lab machines.", status: "REJECTED", student: "ayesha@student.edu", daysAgo: 10, updates: [["REJECTED", "The campus license does not cover MATLAB. Please use the free Octave install, now added to all lab machines."]] },
  { dept: "TEACHING", issue: "Teacher late", title: "Lecturer regularly 20 minutes late", desc: "Our Software Engineering lecture starts about 20 minutes late almost every week, cutting the content short.", status: "IN_PROGRESS", student: "ayesha@student.edu", daysAgo: 5, updates: [["PENDING", "Complaint received."], ["IN_PROGRESS", "Discussed with the department head, timetable under review."]] },
  { dept: "TEACHING", issue: "Notes unavailable", title: "Lecture notes never uploaded", desc: "No notes or slides have been shared for Data Structures this semester.", status: "RESOLVED", student: "ali@student.edu", daysAgo: 13, rating: [5, "All slides are on the portal now. Thank you!"], updates: [["IN_PROGRESS", "Instructor asked to upload materials."], ["RESOLVED", "All slides for weeks 1 to 8 uploaded to the course portal."]] },
  { dept: "TEACHING", issue: "Classroom discipline", title: "Noisy classroom during lectures", desc: "Students in the back rows talk throughout the lecture and nobody intervenes.", status: "PENDING", student: "ali@student.edu", daysAgo: 0, updates: [["PENDING", "Complaint received and queued for review."]] },
];

const DAY = 86_400_000;

async function main() {
  const hash = await hashPassword(PASSWORD);

  await prisma.complaintUpdate.deleteMany();
  await prisma.complaint.deleteMany();

  const ids: Record<string, string> = {};
  for (const u of USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, department: u.department, emailVerified: true },
      create: { id: randomUUID(), ...u, emailVerified: true },
    });
    ids[u.email] = user.id;
    await prisma.account.deleteMany({ where: { userId: user.id, providerId: "credential" } });
    await prisma.account.create({
      data: { id: randomUUID(), accountId: user.id, providerId: "credential", userId: user.id, password: hash },
    });
  }

  const now = Date.now();
  for (const c of COMPLAINTS) {
    const createdAt = new Date(now - c.daysAgo * DAY - 3_600_000);
    const complaint = await prisma.complaint.create({
      data: {
        title: c.title,
        description: c.desc,
        department: c.dept,
        issueType: c.issue,
        status: c.status,
        studentId: ids[c.student],
        rating: c.rating?.[0] ?? null,
        ratingComment: c.rating?.[1] ?? null,
        createdAt,
      },
    });
    let at = createdAt.getTime();
    for (const [status, remark] of c.updates) {
      at = Math.min(at + 6 * 3_600_000, now);
      await prisma.complaintUpdate.create({
        data: { complaintId: complaint.id, adminId: ids[ADMIN_EMAIL[c.dept]], status, remark, createdAt: new Date(at) },
      });
    }
  }

  console.log(`Seeded ${USERS.length} users and ${COMPLAINTS.length} complaints.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
