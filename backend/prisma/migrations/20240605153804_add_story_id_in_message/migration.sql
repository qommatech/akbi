-- AlterTable
ALTER TABLE `Message` ADD COLUMN `storyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `content` LONGTEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_storyId_fkey` FOREIGN KEY (`storyId`) REFERENCES `Story`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
