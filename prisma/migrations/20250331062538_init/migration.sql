-- CreateTable
CREATE TABLE "Monitor" (
    "id" TEXT NOT NULL,
    "Url" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCheckedAt" TIMESTAMP(3),

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);
