const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.error("Email config error:", err);
  else console.log("Email ready to send!");
});

// 🎨 BEAUTIFUL EMAIL TEMPLATE
const requestStatusEmail = (userEmail, request, status, equipment) => {
  const isApproved = status === "approved";

  return {
    from: `"Equipment System" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Request ${isApproved ? "Approved" : "Rejected"} - ${equipment.name}`,
    html: `
      <div style="font-family:Arial;padding:20px;background:#f4f4f4">
        <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px">

          <h2 style="color:${isApproved ? "green" : "red"}">
            ${isApproved ? "✅ Approved" : "❌ Rejected"} Request
          </h2>

          <p><b>Equipment:</b> ${equipment.name}</p>
          <p><b>Quantity:</b> ${request.quantity}</p>
          <p><b>Period:</b> ${new Date(request.startDate).toLocaleDateString()} → ${new Date(
            request.endDate,
          ).toLocaleDateString()}</p>

          <p><b>Status:</b> ${status}</p>

          <hr/>

          <p style="color:#555">
            ${
              isApproved
                ? "Your request has been approved. You can collect the equipment."
                : "Your request has been rejected. Please contact admin for more info."
            }
          </p>

        </div>
      </div>
    `,
  };
};

module.exports = { transporter, requestStatusEmail };
