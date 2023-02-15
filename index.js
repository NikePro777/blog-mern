import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";
import { UserFields } from "./utils/user.utils.js";

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

app.post("/auth/login", async (req, res) => {
  try {
    const user = await client.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "почты нет такой" });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      return res.status(404).json({ message: "пароль  не такой" });
    }

    const token = jwt.sign({ id: user.id }, "secret123", { expiresIn: "30d" });
    const userUnic = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: UserFields,
    });

    res.json({ ...userUnic, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось авторизоваться" });
  }
});

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
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
    // .select(UserFields);

    const token = jwt.sign({ id: user.id }, "secret123", { expiresIn: "30d" });
    // т.е. мы зашифровали в токен информацию, которая будет передаваться (почта и полное имя) по слову секрет123 (тут любое слово и что угодно м.б.), который перестанет действовать чз 30 дней

    const userUnic = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: UserFields,
    });

    res.json({ ...userUnic, token });
    await client.$disconnect();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось зарегистрироваться" });
  }
});

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
