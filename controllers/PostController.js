import { PrismaClient } from "@prisma/client";
import { PostFields } from "../utils/post.utils.js";

const client = new PrismaClient();
export const create = async (req, res) => {
  try {
    const doc = new PostFields({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await client.post.create(doc);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};
