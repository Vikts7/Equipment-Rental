import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Admin = () => {
  const [stats, setStats] = useState({
    users: 0,
    equipment: 0,
    requests: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, equipmentRes, requestsRes] = await Promise.all([
          api.get("/api/users"),
          api.get("/api/equipment"),
          api.get("/api/requests"),
        ]);

        const requests = requestsRes.data;

        setStats({
          users: usersRes.data.length,
          equipment: equipmentRes.data.length,
          requests: requests.length,
          pending: requests.filter((r) => r.status === "pending").length,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h2>{stats.users}</h2>
          <p>Users</p>
        </div>

        <div style={styles.statCard}>
          <h2>{stats.equipment}</h2>
          <p>Equipment</p>
        </div>

        <div style={styles.statCard}>
          <h2>{stats.requests}</h2>
          <p>Total Requests</p>
        </div>

        <div style={styles.statCard}>
          <h2>{stats.pending}</h2>
          <p>Pending Requests</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={styles.grid}>
        <Link to="/admin/add" style={styles.card}>
          <h2>➕ Add Equipment</h2>
          <p>Create new equipment items</p>
        </Link>

        <Link to="/admin/users" style={styles.card}>
          <h2>👥 Manage Users</h2>
          <p>View, edit and delete users</p>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "50px auto",
    fontFamily: "Arial",
    padding: "20px",
  },

  title: {
    marginBottom: "30px",
    fontSize: "28px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "30px",
  },

  statCard: {
    padding: "15px",
    borderRadius: "10px",
    background: "#f0f0f0",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    display: "block",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    textDecoration: "none",
    color: "black",
    background: "#f9f9f9",
    transition: "0.2s",
  },
};

export default Admin;
