const db = require("../config/database");
const { sendOrderConfirmationEmail } = require("../utils/emailService");

const createOrder = (req, res) => {
  const { Id_catalog, Email, Nama, catatan_pelanggan, Phone_number, Alamat } =
    req.body;

  if (!Id_catalog || !Email || !Nama || !Phone_number || !Alamat) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const query =
    "INSERT INTO Tb_order (Id_catalog, Email, Nama, catatan_pelanggan, Phone_number, Alamat, Status) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      Id_catalog,
      Email,
      Nama,
      catatan_pelanggan,
      Phone_number,
      Alamat,
      "pending",
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error", error: err });
      }
      res.status(201).json({
        message: "Order created successfully",
        orderId: results.insertId,
      });
    }
  );
};

const getAllOrders = (req, res) => {
  const query = `
        SELECT o.*, c.Nama AS Nama_Paket 
        FROM Tb_order o
        JOIN Tb_catalog c ON o.Id_catalog = c.Id
        ORDER BY o.created_at DESC
    `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
    res.json(results);
  });
};

const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "approve"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const findOrderQuery = `
    SELECT o.Email, o.Nama, c.Nama AS Nama_Paket
    FROM Tb_order o
    JOIN Tb_catalog c ON o.Id_catalog = c.Id
    WHERE o.Id = ?
  `;

  db.query(findOrderQuery, [id], (err, orders) => {
    if (err || orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderDetails = orders[0];

    const updateQuery = "UPDATE Tb_order SET Status = ? WHERE Id = ?";
    db.query(updateQuery, [status, id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error on update" });
      }

      if (status === "approve") {
        sendOrderConfirmationEmail(orderDetails).catch(console.error);
      }

      res.json({ message: `Order status updated to ${status}` });
    });
  });
};

module.exports = { createOrder, getAllOrders, updateOrderStatus };
