import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
const app = express();

app.use(express.json()); // Важная штука, чтобы все запросы приходили и уходили в формате json

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);

  const token = jwt.sign(
    { email: req.body.email, fullName: "Вася Пупкин" },
    "secret123"
  );
  // т.е. мы зашифровали в токен информацию, которая будет передаваться (почта и полное имя) по слову секрет123 (тут любое слово и что угодно м.б.)

  res.json({
    success: true,
    token,
  });
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
