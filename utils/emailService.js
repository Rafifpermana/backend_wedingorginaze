const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("../config/database");

dotenv.config();

console.log("Mencoba login dengan Email:", process.env.EMAIL_USER);
console.log("Apakah Sandi Aplikasi ada?:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (orderDetails) => {
  const { Email, Nama, Nama_Paket } = orderDetails;

  const [rows] = await db
    .promise()
    .query("SELECT Contact_wo FROM Tb_profilWO LIMIT 1");
  if (rows.length === 0) {
    throw new Error("Admin contact not found in database");
  }
  const adminPhone = rows[0].Contact_wo;

  const mailOptions = {
    from: `"Eterna Wedding" <${process.env.EMAIL_USER}>`,
    to: Email,
    subject: "Pesanan Anda di Eterna Wedding Telah Dikonfirmasi!",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
      <h2 style="color: #4A5568; text-align: center;">Halo, ${Nama}!</h2>
      <p style="text-align: center; line-height: 1.6; font-size: 15px;">
        Kabar baik! Pesanan Anda untuk paket pernikahan <strong>${Nama_Paket}</strong> telah kami terima dan <span style="color: green; font-weight: bold;">disetujui</span>.
      </p>
      <p style="text-align: center; line-height: 1.6; font-size: 15px;">
        Terima kasih telah memercayakan hari spesial Anda kepada kami. Tim kami akan segera menghubungi Anda untuk membahas langkah-langkah selanjutnya.
      </p>

      <div style="margin: 25px 0; text-align: center;">
        <a href="https://wa.me/${adminPhone.replace(/\D/g, "")}" 
           style="display: inline-block; background-color: #25D366; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">
          Konfirmasi via WhatsApp Admin
        </a>
        <p style="margin-top: 10px; font-size: 14px; color: #555;">
          atau hubungi langsung: <strong>${adminPhone}</strong>
        </p>
      </div>

      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

      <div style="text-align: center; margin-top: 10px;">
        <p style="margin: 0;">Hormat kami,</p>
        <p style="margin: 0; font-weight: bold;">Tim Eterna Wedding</p>
      </div>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email konfirmasi berhasil dikirim ke ${Email}`);
  } catch (error) {
    console.error(`Gagal mengirim email ke ${Email}:`, error);
  }
};

module.exports = { sendOrderConfirmationEmail };
