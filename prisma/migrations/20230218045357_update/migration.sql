-- AlterTable
CREATE SEQUENCE post_viewscount_seq;
ALTER TABLE "Post" ALTER COLUMN "viewsCount" SET DEFAULT nextval('post_viewscount_seq');
ALTER SEQUENCE post_viewscount_seq OWNED BY "Post"."viewsCount";
