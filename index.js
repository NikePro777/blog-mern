import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Лизка");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);

  const token = jwt.sign(
    { email: req.body.email, fullName: "Вася Пупкин" },
    "secret123"
  );

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
