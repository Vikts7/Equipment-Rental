import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get("/api/requests/my")
      .then((res) => setRequests(res.data))
      .catch((err) => console.log("Error loading requests:", err));
  }, []);

  const getStatusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "rejected") return "red";
    return "orange";
  };

  return (
    <div style={styles.container}>
      <h1>My Requests</h1>

      {requests.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} style={styles.card}>
            <h3 onClick={() => navigate(`/equipment/${req.equipment_id}`)}>
              {req.equipment?.name}
            </h3>

            <p>
              <strong>From:</strong> {req.startDate}
            </p>
            <p>
              <strong>To:</strong> {req.endDate}
            </p>

            <p>
              <strong>Quantity:</strong> {req.quantity}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: getStatusColor(req.status) }}>
                {req.status}
              </span>
            </p>
          </div>
        ))
      )}
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
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
};

export default MyRequests;
