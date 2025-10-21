import jwt from "jsonwebtoken";
export default function auth(requiredRole = null) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const [, token] = header.split(" ");
      if (!token) return res.status(401).json({ error:"Missing token" });
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.id, role: payload.role };
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ error:"Forbidden" });
      }
      next();
    } catch (e) { return res.status(401).json({ error:"Invalid token" }); }
  };
}
