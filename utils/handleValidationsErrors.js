import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  } // если список ошибок не пуст, то вернем неверный запрос (400) с перечнем ошибок

  next();
};
