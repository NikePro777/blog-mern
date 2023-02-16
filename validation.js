import { body } from "express-validator";

export const registerValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "пароль минимум 5 символов").isLength({ min: 5 }),
  body("fullName", "имя напиши полное").isLength({ min: 3 }),
  body("avatarUrl", "ссылка не читается").optional().isURL(),
];

export const loginValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "пароль минимум 5 символов").isLength({ min: 5 }),
];

export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 3 }).isString(),
  body("tags", "Неверный формат тэгов (укажите массив)").optional().isString(),
  body("imageUrl", "неверная ссылка на изображение").optional().isString(),
];
