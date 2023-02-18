import { PrismaClient } from "@prisma/client";
import { PostFields } from "../utils/post.utils.js";

const client = new PrismaClient();

export const getAll = async (req, res) => {
  try {
    const posts = await client.post.findMany();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await client.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить статю" });
  }
};

export const create = async (req, res) => {
  try {
    const post = await client.post.create({
      data: {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
        tags: req.body.tags ? req.body.tags.toString() : "",
        user: { connect: { id: req.userId } },
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};
