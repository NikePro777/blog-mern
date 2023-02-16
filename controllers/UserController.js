import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { UserFields } from "../utils/user.utils.js";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
};

export const getMe = async (req, res) => {
  try {
    const user = await client.user.findUnique({
      where: {
        id: req.userId,
      },
      select: UserFields,
    });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json({ ...user });
  } catch (error) {}
};
