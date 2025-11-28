import jwt from "jsonwebtoken";

/**
 * auth() with flexible role checking
 *
 *  - auth()                 → any logged-in user
 *  - auth("host")           → only hosts
 *  - auth(["host","lister"]) → multiple allowed roles
 */
export default function auth(requiredRoles = null) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const [, token] = header.split(" ");

      if (!token) {
        return res.status(401).json({ error: "Missing token" });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: payload.id,
        role: payload.role,
      };

      // If no role required → allow all authenticated users
      if (!requiredRoles) {
        return next();
      }

      // Convert single role → array
      const allowed = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];

      // Convert frontend roles to backend roles
      // "guest" → "user"
      // "host"  → "lister"
      const normalizedRole =
        req.user.role === "guest"
          ? "user"
          : req.user.role === "host"
          ? "lister"
          : req.user.role;

      if (!allowed.includes(normalizedRole)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (e) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
