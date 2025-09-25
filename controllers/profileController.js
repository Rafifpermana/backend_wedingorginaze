const db = require("../config/database");

const getProfile = (req, res) => {
  const query = "SELECT * FROM Tb_profilWO LIMIT 1";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(results[0]);
  });
};

const updateProfile = (req, res) => {
  const { id } = req.params;
  const { Deskripsi_wo, Contact_wo, Alamat_wo, About_wo } = req.body;

  if (!Deskripsi_wo || !Contact_wo || !Alamat_wo || !About_wo) {
    return res
      .status(400)
      .json({ message: "Please provide all profile fields" });
  }

  const query =
    "UPDATE Tb_profilWO SET Deskripsi_wo = ?, Contact_wo = ?, Alamat_wo = ?, About_wo = ? WHERE Id = ?";
  db.query(
    query,
    [Deskripsi_wo, Contact_wo, Alamat_wo, About_wo, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error", error: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json({ message: "Profile updated successfully" });
    }
  );
};

const createProfile = (req, res) => {
  const { Deskripsi_wo, Contact_wo, Alamat_wo, About_wo } = req.body;

  if (!Deskripsi_wo || !Contact_wo || !Alamat_wo || !About_wo) {
    return res
      .status(400)
      .json({ message: "Please provide all profile fields" });
  }
  const checkQuery = "SELECT Id FROM Tb_profilWO LIMIT 1";
  db.query(checkQuery, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Server error on check", error: err });
    }
    if (results.length > 0) {
      return res
        .status(409)
        .json({ message: "Profile already exists. Use PUT method to update." });
    }

    const insertQuery =
      "INSERT INTO Tb_profilWO (Deskripsi_wo, Contact_wo, Alamat_wo, About_wo) VALUES (?, ?, ?, ?)";
    db.query(
      insertQuery,
      [Deskripsi_wo, Contact_wo, Alamat_wo, About_wo],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Server error on create", error: err });
        }
        res.status(201).json({
          message: "Profile created successfully",
          profileId: results.insertId,
        });
      }
    );
  });
};

const deleteProfile = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Tb_profilWO WHERE Id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile deleted successfully" });
  });
};

module.exports = { getProfile, createProfile, updateProfile, deleteProfile };
