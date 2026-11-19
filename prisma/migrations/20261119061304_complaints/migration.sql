-- CreateEnum
CREATE TYPE "Department" AS ENUM ('CAFETERIA', 'LIBRARY', 'LABS_IT', 'TEACHING');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "department" TEXT,
ALTER COLUMN "role" SET DEFAULT 'student';

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "issueType" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING',
    "imageUrl" TEXT,
    "rating" INTEGER,
    "ratingComment" TEXT,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintUpdate" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL,
    "remark" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Complaint_studentId_idx" ON "Complaint"("studentId");

-- CreateIndex
CREATE INDEX "Complaint_department_idx" ON "Complaint"("department");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "ComplaintUpdate_complaintId_idx" ON "ComplaintUpdate"("complaintId");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintUpdate" ADD CONSTRAINT "ComplaintUpdate_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintUpdate" ADD CONSTRAINT "ComplaintUpdate_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
