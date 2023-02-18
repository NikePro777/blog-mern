import { PrismaClient } from "@prisma/client";
import { PostFields } from "../utils/post.utils.js";

const client = new PrismaClient();
export const create = async (req, res) => {
  try {
    const post = await client.post.create({
      data: {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
        tags: req.body.tags.toString(),
        user: { connect: { id: req.userId } },
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};
