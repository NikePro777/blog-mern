import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";

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

app.post(
  "/auth/register",
  registerValidation,
  async (req, res) => {
    // const token = jwt.sign(
    //   { email: req.body.email, fullName: "Вася Пупкин" },
    //   "secret123"
    // );
    // т.е. мы зашифровали в токен информацию, которая будет передаваться (почта и полное имя) по слову секрет123 (тут любое слово и что угодно м.б.)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    } // если список ошибок не пуст, то вернем неверный запрос (400) с перечнем ошибок

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // зашифровали пароль, и пароль и шифр передаем как passwordHash

    const user = await client.user.create({
      data: {
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: passwordHash,
      },
    });
    console.log(user);
    res.json(user);
    await client.$disconnect();

    // const user = await client.user.create({
    //   data: {
    //     fullName: "Bob",
    //     email: "bob@prisma.io",
    //     passwordHash: "Hello World",
    //     avatarUrl: "Bob",
    //   },
    // });
    // console.log(user);
  }
  // }
);

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
