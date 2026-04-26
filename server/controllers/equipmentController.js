const { Equipment } = require("../models");
const fs = require("fs");
const path = require("path");

exports.createEquipment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create equipment" });
    }

    const { name, description, quantity, condition } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const equipment = await Equipment.create({
      name,
      description,
      quantity,
      condition,
      imageUrl,
    });

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findAll();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipment = await Equipment.findByPk(id);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update equipment" });
    }

    const { id } = req.params;

    const equipment = await Equipment.findByPk(id);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const { name, description, quantity, condition } = req.body;

    if (name !== undefined) equipment.name = name;
    if (description !== undefined) equipment.description = description;
    if (quantity !== undefined) equipment.quantity = quantity;
    if (condition !== undefined) equipment.condition = condition;

    if (req.file) {
      if (equipment.imageUrl) {
        const oldPath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(equipment.imageUrl),
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      equipment.imageUrl = `/uploads/${req.file.filename}`;
    }

    await equipment.save();

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete equipment" });
    }

    const { id } = req.params;

    const equipment = await Equipment.findByPk(id);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (equipment.imageUrl) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(equipment.imageUrl),
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await equipment.destroy();

    res.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
