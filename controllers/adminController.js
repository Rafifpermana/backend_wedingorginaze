const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token berlaku selama 1 hari
  });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  const query = "SELECT * FROM Tb_admin WHERE Email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (results.length > 0) {
      const admin = results[0];
      const isMatch = await bcrypt.compare(password, admin.password);

      if (isMatch) {
        res.json({
          Id: admin.Id,
          Username: admin.Username,
          Email: admin.Email,
          token: generateToken(admin.Id),
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
};

const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const query =
    "INSERT INTO Tb_admin (Username, Email, password) VALUES (?, ?, ?)";

  db.query(query, [username, email, hashedPassword], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Could not create admin", error: err });
    }
    res.status(201).json({
      message: "Admin registered successfully",
      adminId: results.insertId,
    });
  });
};

module.exports = { loginAdmin, registerAdmin };
