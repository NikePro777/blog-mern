import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const getLastTags = async (req, res) => {
  try {
    const posts = await client.post.findMany({
      take: 5,
    });
    const tags = posts.map((post) => post.tags.split(","));
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить tags" });
  }
};

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
    res.status(500).json({ message: "Не удалось получить статью" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await client.post.delete({
      where: {
        id: Number(postId),
      },
    });

    res.json({ message: "mission complete" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Невозможно удалить то чего нет" });
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

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await client.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
        tags: req.body.tags ? req.body.tags.toString() : "",
        // user: { connect: { id: req.userId } },
      },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось обновить статью" });
  }
};
