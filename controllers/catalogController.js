const db = require("../config/database");

const getAllCatalogs = (req, res) => {
  const query = "SELECT * FROM Tb_catalog";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    res.json(results);
  });
};

const getCatalogById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Tb_catalog WHERE Id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Catalog not found" });
    }
    res.json(results[0]);
  });
};

const createCatalog = (req, res) => {
  const { Nama, Harga, Deskripsi } = req.body;
  if (!Nama || !Harga || !Deskripsi) {
    return res
      .status(400)
      .json({ message: "Please provide all catalog fields" });
  }
  const query =
    "INSERT INTO Tb_catalog (Nama, Harga, Deskripsi) VALUES (?, ?, ?)";
  db.query(query, [Nama, Harga, Deskripsi], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    res.status(201).json({
      message: "Catalog created successfully",
      catalogId: results.insertId,
    });
  });
};

const updateCatalog = (req, res) => {
  const { id } = req.params;
  const { Nama, Harga, Deskripsi } = req.body;
  if (!Nama || !Harga || !Deskripsi) {
    return res
      .status(400)
      .json({ message: "Please provide all catalog fields" });
  }
  const query =
    "UPDATE Tb_catalog SET Nama = ?, Harga = ?, Deskripsi = ? WHERE Id = ?";
  db.query(query, [Nama, Harga, Deskripsi, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Catalog not found" });
    }
    res.json({ message: "Catalog updated successfully" });
  });
};

const deleteCatalog = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Tb_catalog WHERE Id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Catalog not found" });
    }
    res.json({ message: "Catalog deleted successfully" });
  });
};

module.exports = {
  getAllCatalogs,
  getCatalogById,
  createCatalog,
  updateCatalog,
  deleteCatalog,
};
