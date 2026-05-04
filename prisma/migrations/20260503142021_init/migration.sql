-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "industry" TEXT,
    "productName" TEXT,
    "projectManager" TEXT,
    "salesId" TEXT,
    "pmoId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'stage_1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage2ClientEngagement" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "rfpReviewed" BOOLEAN NOT NULL DEFAULT false,
    "rfpDate" TIMESTAMP(3),
    "technicalAssessment" BOOLEAN NOT NULL DEFAULT false,
    "technicalSignoff" TEXT,
    "proposalPrepared" BOOLEAN NOT NULL DEFAULT false,
    "pricingReview" TEXT,
    "proposalApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvalBy" TEXT,
    "proposalSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "submissionDate" TIMESTAMP(3),
    "demosCompleted" BOOLEAN NOT NULL DEFAULT false,
    "demoNotes" TEXT,
    "awardReceived" BOOLEAN NOT NULL DEFAULT false,
    "awardFile" TEXT,
    "termsAgreed" BOOLEAN NOT NULL DEFAULT false,
    "termsNotes" TEXT,
    "businessDevLead" TEXT,
    "financeSign" TEXT,
    "ceoSign" TEXT,
    "proposalTemplate" TEXT,
    "awardLetter" TEXT,
    "termsSheet" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage2ClientEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage3Initiation" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "awardLetterOnFile" BOOLEAN NOT NULL DEFAULT false,
    "awardLetterFile" TEXT,
    "invoiceIssued" BOOLEAN NOT NULL DEFAULT false,
    "invoiceRef" TEXT,
    "signedScopeDoc" BOOLEAN NOT NULL DEFAULT false,
    "scopeDocFile" TEXT,
    "advancePaymentReceived" BOOLEAN NOT NULL DEFAULT false,
    "paymentFile" TEXT,
    "waiverObtained" BOOLEAN NOT NULL DEFAULT false,
    "waiverFile" TEXT,
    "initiationFormSigned" BOOLEAN NOT NULL DEFAULT false,
    "initiationFormFile" TEXT,
    "projectCodeAssigned" BOOLEAN NOT NULL DEFAULT false,
    "projectCode" TEXT,
    "resourcesDeployed" BOOLEAN NOT NULL DEFAULT false,
    "resourceNotes" TEXT,
    "projectHead" TEXT,
    "legalCompliance" TEXT,
    "financeSign" TEXT,
    "marketing" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage3Initiation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage4Planning" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "charterSigned" BOOLEAN NOT NULL DEFAULT false,
    "charterFile" TEXT,
    "projectPlanShared" BOOLEAN NOT NULL DEFAULT false,
    "projectPlanFile" TEXT,
    "resourcePlanApproved" BOOLEAN NOT NULL DEFAULT false,
    "resourceNotes" TEXT,
    "riskRegisterInitiated" BOOLEAN NOT NULL DEFAULT false,
    "riskNotes" TEXT,
    "communicationPlan" BOOLEAN NOT NULL DEFAULT false,
    "communicationNotes" TEXT,
    "changeProcessDefined" BOOLEAN NOT NULL DEFAULT false,
    "changeNotes" TEXT,
    "environmentReady" BOOLEAN NOT NULL DEFAULT false,
    "environmentNotes" TEXT,
    "migrationPlanReviewed" BOOLEAN NOT NULL DEFAULT false,
    "migrationNotes" TEXT,
    "kickoffHeld" BOOLEAN NOT NULL DEFAULT false,
    "kickoffDate" TIMESTAMP(3),
    "projectManager" TEXT,
    "clientLead" TEXT,
    "technicalLead" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage4Planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage5Execution" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "weeklyReports" BOOLEAN NOT NULL DEFAULT false,
    "weeklyReportFile" TEXT,
    "weeklyNotes" TEXT,
    "milestone1" BOOLEAN NOT NULL DEFAULT false,
    "milestone1File" TEXT,
    "milestone2" BOOLEAN NOT NULL DEFAULT false,
    "milestone2File" TEXT,
    "changeRequests" BOOLEAN NOT NULL DEFAULT false,
    "changeRequestNotes" TEXT,
    "issueLog" BOOLEAN NOT NULL DEFAULT false,
    "issueLogFile" TEXT,
    "trainingExecuted" BOOLEAN NOT NULL DEFAULT false,
    "trainingFile" TEXT,
    "sitCompleted" BOOLEAN NOT NULL DEFAULT false,
    "sitFile" TEXT,
    "preUatReady" BOOLEAN NOT NULL DEFAULT false,
    "projectManagerSign" TEXT,
    "clientLeadSign" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage5Execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage6UAT" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "uatStarted" BOOLEAN NOT NULL DEFAULT false,
    "testCasesExecuted" BOOLEAN NOT NULL DEFAULT false,
    "defectsResolved" BOOLEAN NOT NULL DEFAULT false,
    "userTrainingDone" BOOLEAN NOT NULL DEFAULT false,
    "clientSignoffReceived" BOOLEAN NOT NULL DEFAULT false,
    "signoffFile" TEXT,
    "projectManagerSign" TEXT,
    "clientLeadSign" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage6UAT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage7GoLive" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "readinessComplete" BOOLEAN NOT NULL DEFAULT false,
    "cutoverApproved" BOOLEAN NOT NULL DEFAULT false,
    "productionValidated" BOOLEAN NOT NULL DEFAULT false,
    "clientAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "cutoverExecuted" BOOLEAN NOT NULL DEFAULT false,
    "smokeTestsPassed" BOOLEAN NOT NULL DEFAULT false,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "hypercareDefined" BOOLEAN NOT NULL DEFAULT false,
    "projectManagerApproval" TEXT,
    "clientCioApproval" TEXT,
    "technicalLeadApproval" TEXT,
    "financeApproval" TEXT,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage7GoLive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stage2ClientEngagement_projectId_key" ON "Stage2ClientEngagement"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Stage3Initiation_projectId_key" ON "Stage3Initiation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Stage4Planning_projectId_key" ON "Stage4Planning"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Stage5Execution_projectId_key" ON "Stage5Execution"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Stage6UAT_projectId_key" ON "Stage6UAT"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Stage7GoLive_projectId_key" ON "Stage7GoLive"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "Stage2ClientEngagement" ADD CONSTRAINT "Stage2ClientEngagement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage3Initiation" ADD CONSTRAINT "Stage3Initiation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage4Planning" ADD CONSTRAINT "Stage4Planning_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage5Execution" ADD CONSTRAINT "Stage5Execution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage6UAT" ADD CONSTRAINT "Stage6UAT_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage7GoLive" ADD CONSTRAINT "Stage7GoLive_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
