import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AdminAdd = () => {
  const [equipment, setEquipment] = useState({
    name: "",
    description: "",
    quantity: 0,
    condition: "new",
  });

  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", equipment.name);
      formData.append("description", equipment.description);
      formData.append("quantity", equipment.quantity);
      formData.append("condition", equipment.condition);

      if (image) formData.append("image", image);

      await api.post("/api/equipment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/equipment");
    } catch (err) {
      console.log("Error adding equipment:", err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add Equipment</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Name"
            value={equipment.name}
            onChange={handleChange}
          />

          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Description"
            value={equipment.description}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={equipment.quantity}
            onChange={handleChange}
          />

          <select
            style={styles.input}
            name="condition"
            value={equipment.condition}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="repair">Repair</option>
          </select>

          <input
            style={styles.file}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit" style={styles.button}>
            Add Equipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAdd;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "100px",
    resize: "vertical",
    outline: "none",
  },

  file: {
    padding: "5px",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
};
