-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `sync_status` VARCHAR(191) NULL DEFAULT 'synced';

-- AlterTable
ALTER TABLE `persons` ADD COLUMN `sync_status` VARCHAR(191) NULL DEFAULT 'synced';
