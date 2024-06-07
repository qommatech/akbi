-- CreateTable
CREATE TABLE `PostAsset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` ENUM('Video', 'Image') NOT NULL DEFAULT 'Image',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostAsset` ADD CONSTRAINT `PostAsset_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
