import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

const client = new PrismaClient();
await client
  .$connect()
  .then(() => {
    console.log("db connect");
  })
  .catch((err) => {
    console.log("db error", err);
  });

const app = express();

app.use(express.json()); // Важная штука, чтобы все запросы приходили и уходили в формате json

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

// app.get("/posts", PostController.getAll);
// app.get("/posts/:id", PostController.getOne);
app.get("/posts", checkAuth, postCreateValidation, PostController.create);
// app.get("/delete", PostController.remove);
// app.get("/patch", PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server OK");
});
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   }); // после того как наш сервер отработал мы отключаем базу данных;
