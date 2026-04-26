import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      username: u.username || "",
      email: u.email || "",
      firstName: u.firstName || "",
      lastName: u.lastName || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/api/users/${id}`, form);

      setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));

      setEditingId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Users</h1>

      {users.map((u) => (
        <div key={u.id} style={styles.card}>
          {editingId === u.id ? (
            // ================= EDIT MODE =================
            <div style={styles.form}>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => saveEdit(u.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            // ================= VIEW MODE =================
            <div>
              <div>
                <strong
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => navigate(`/admin/users/${u.id}/requests`)}
                >
                  {u.username}
                </strong>{" "}
                ({u.role})
              </div>
              <div>{u.email}</div>
              <div>
                {u.firstName} {u.lastName}
              </div>

              {currentUser?.role === "admin" && (
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => startEdit(u)}>Edit</button>
                  <button onClick={() => handleDelete(u.id)}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "Arial",
  },
  card: {
    border: "1px solid #ddd",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};

export default AdminUsers;
