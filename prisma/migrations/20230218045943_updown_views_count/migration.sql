-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "viewsCount" SET DEFAULT 0,
ALTER COLUMN "viewsCount" DROP DEFAULT;
DROP SEQUENCE "post_viewscount_seq";
