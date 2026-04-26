import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/api/equipment")
      .then((res) => setEquipment(res.data))
      .catch((err) => console.log("Error loading equipment:", err));
  }, []);

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/equipment/${id}`);
      setEquipment((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (item) => {
    const name = prompt("New name:", item.name);
    const description = prompt("New description:", item.description);
    const quantity = prompt("New quantity:", item.quantity);
    const condition = prompt("New condition:", item.condition);

    if (!name || !description) return;

    try {
      const res = await api.put(`/api/equipment/${item.id}`, {
        name,
        description,
        quantity,
        condition,
      });

      setEquipment((prev) =>
        prev.map((e) => (e.id === item.id ? res.data : e)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Equipment</h1>

      <input
        type="text"
        placeholder="Search equipment..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.list}>
        {filteredEquipment.map((item) => (
          <div key={item.id} style={styles.card}>
            {item.imageUrl && (
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt={item.name}
                style={styles.image}
              />
            )}

            <div style={styles.info}>
              <h3
                onClick={() => navigate(`/equipment/${item.id}`)}
                style={styles.name}
              >
                {item.name}
              </h3>

              <p style={styles.meta}>
                {item.quantity} pcs • {item.condition}
              </p>
            </div>

            {isLoggedIn && isAdmin && (
              <div style={styles.actions}>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "Arial",
    padding: "0 20px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "15px",
  },

  search: {
    padding: "10px",
    width: "100%",
    maxWidth: "350px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    border: "1px solid #eee",
    borderRadius: "10px",
    background: "#fafafa",
    transition: "0.2s",
  },

  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    marginRight: "12px",
  },

  info: {
    flex: 1,
    cursor: "pointer",
  },

  name: {
    margin: 0,
    cursor: "pointer",
  },

  meta: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    gap: "8px",
  },
};

export default Equipment;
