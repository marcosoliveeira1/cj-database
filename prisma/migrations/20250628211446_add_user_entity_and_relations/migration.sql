-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `active_flag` BOOLEAN NOT NULL,
    `icon_url` VARCHAR(191) NULL,
    `last_login` DATETIME(3) NULL,
    `created` DATETIME(3) NULL,
    `modified` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `sync_status` VARCHAR(191) NULL DEFAULT 'synced',

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
