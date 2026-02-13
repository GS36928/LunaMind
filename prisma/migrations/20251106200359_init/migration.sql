-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('SCHOOL', 'UNIVERSITY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Availability" AS ENUM ('FLEXIBLE', 'FIXED');

-- CreateEnum
CREATE TYPE "public"."TeacherEducation" AS ENUM ('BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STUDENT',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "phoneNumber" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "image" TEXT,
    "acceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "acceptedPrivacy" BOOLEAN NOT NULL DEFAULT false,
    "otpCode" TEXT,
    "otpExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "educationLevel" TEXT,
    "desiredSubjects" TEXT[],
    "reason" TEXT,
    "hasOtherCourses" BOOLEAN,
    "usageFrequency" TEXT,
    "preferredLessonType" TEXT,
    "discoverySource" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeacherProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "city" TEXT,
    "profession" TEXT,
    "education" "public"."TeacherEducation",
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "goal" TEXT,
    "experienceYears" TEXT,
    "preferredAgeGroups" TEXT[],
    "hasCertificate" BOOLEAN,
    "certificateDescription" TEXT,
    "certificateFiles" TEXT[],
    "offersFreeIntroLesson" BOOLEAN,
    "hasIntroVideo" BOOLEAN,
    "introVideoUrl" TEXT,
    "howDidYouHearAboutUs" TEXT,

    CONSTRAINT "TeacherProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeacherSubject" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lesson" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teacherProfileId" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookedLesson" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION,
    "comment" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookedLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "public"."User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "public"."StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherProfile_userId_key" ON "public"."TeacherProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_studentId_teacherId_createdAt_key" ON "public"."Review"("studentId", "teacherId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeacherProfile" ADD CONSTRAINT "TeacherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "public"."TeacherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookedLesson" ADD CONSTRAINT "BookedLesson_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookedLesson" ADD CONSTRAINT "BookedLesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
