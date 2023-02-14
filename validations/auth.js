import { body } from "express-validator";

export const registerValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "пароль минимум 5 символов").isLength({ min: 5 }),
  body("fullName", "имя напиши полное").isLength({ min: 3 }),
  body("avatarUrl", "ссылка не читается").optional().isURL(),
];
