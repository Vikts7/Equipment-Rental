const { Request, User, Equipment } = require("../models");
const { transporter, requestStatusEmail } = require("../utils/email");

exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can create requests" });
    }

    const { startDate, endDate, comment, equipmentId, quantity } = req.body;

    const equipment = await Equipment.findByPk(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (quantity > equipment.quantity) {
      return res.status(400).json({
        message: `Max available quantity is ${equipment.quantity}`,
      });
    }

    const request = await Request.create({
      startDate,
      endDate,
      quantity, // ✅ now it exists
      comment,
      user_id: req.user.id,
      equipment_id: equipmentId,
      status: "pending",
    });

    const fullRequest = await Request.findByPk(request.id, {
      include: [
        { model: Equipment, as: "equipment" },
        { model: User, as: "user", attributes: ["id", "email", "role"] },
      ],
    });

    res.json(fullRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Equipment, as: "equipment" }],
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can view all requests" });
    }

    const requests = await Request.findAll({
      include: [
        { model: Equipment, as: "equipment" },
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
exports.updateStatus = async (req, res) => {
  try {
    // 🔐 only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update status" });
    }

    const { id } = req.params;
    const { status } = req.body;

    // 1️⃣ find request
    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 2️⃣ update status
    request.status = status;
    await request.save();

    // 3️⃣ re-fetch FULL data (important for email + frontend)
    const updated = await Request.findByPk(id, {
      include: [
        { model: Equipment, as: "equipment" },
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
    });

    // 4️⃣ send email
    try {
      const emailData = requestStatusEmail(
        updated.user.email,
        updated,
        status,
        updated.equipment,
      );

      await transporter.sendMail(emailData);
      console.log("Email sent successfully");
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    // 5️⃣ return updated request
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.user.role === "user" && request.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only users can delete requests" });
    }

    if (request.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can delete only your requests" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be deleted" });
    }

    await request.destroy();

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
