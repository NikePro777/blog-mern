import { PrismaClient } from "@prisma/client";
import express from "express";
import fs from "fs";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";
import { handleValidationsErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";
import multer from "multer";

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

// грузим картинки
const storage = multer.diskStorage({
  // функция которая ждет параметры, куда сохранять , что сохранять и колбек. На все забиваем пишем только колбек
  destination: (_, __, cb) => {
    // если папка аплоадс не создана- создаем ее
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    // функция не должна получить ошибки и все что есть должна сохранить в папку uploads
    cb(null, "uploads");
  }, // как будет называться файл? обьясняем что хотим вытащить оригинальное название
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // есть функция аплоад и у него есть вот такое вот хранилище

app.use(express.json()); // Важная штука, чтобы все запросы приходили и уходили в формате json
app.use(cors()); // отключаем политику CORS для нашего бэка
app.use("/uploads", express.static("uploads")); // когда запрос придет на роут /uploads экспресс проверяет в папке , есть ли такой файл и выдает
// крч папка uploads это статическое хранилище данных

app.post(
  "/auth/login",
  loginValidation,
  handleValidationsErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationsErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

// роут по которому мы ждем картинку, и если там есть image, то сохраняем по пути url
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.get("/tags", PostController.getLastTags);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  PostController.update
);

app.listen(process.env.PORT || 4444, (err) => {
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
