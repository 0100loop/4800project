const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });
    res.json({ message: "User created" });
  } catch {
    res.status(400).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    "secret123",
    { expiresIn: "7d" }
  );

  res.json({ token });
};
