import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const name = process.env.COOKIE_NAME;
  const token = req.cookies?.[name];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.sendStatus(401);
  }
};
