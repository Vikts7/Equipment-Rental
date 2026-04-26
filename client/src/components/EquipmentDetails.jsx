import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const EquipmentDetails = () => {
  const { id } = useParams();

  const [equipment, setEquipment] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRequest, setShowRequest] = useState(false);

  // request form
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

  const getStatusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "rejected") return "red";
    return "orange";
  };

  useEffect(() => {
    api
      .get(`/api/equipment/${id}`)
      .then((res) => setEquipment(res.data))
      .finally(() => setLoading(false));

    if (isAdmin) {
      api.get("/api/requests").then((res) => setRequests(res.data));
    }
  }, [id, isAdmin]);

  const maxQuantity = equipment?.quantity || 1;

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/requests", {
        equipmentId: Number(id),
        startDate,
        endDate,
        quantity,
        comment,
      });

      alert("Request sent!");

      setStartDate("");
      setEndDate("");
      setQuantity(1);
      setComment("");
      setShowRequest(false);

      if (isAdmin) {
        const res = await api.get("/api/requests");
        setRequests(res.data);
      }
    } catch (err) {
      console.log(err);
      alert("Error creating request");
    }
  };

  const handleStatusChange = async (requestId, status) => {
    try {
      await api.put(`/api/requests/${requestId}/status`, { status });

      const res = await api.get("/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!equipment) return <div>Not found</div>;

  return (
    <div style={styles.container}>
      {/* EQUIPMENT */}
      {equipment.imageUrl && (
        <img
          src={`http://localhost:5000${equipment.imageUrl}`}
          style={styles.image}
        />
      )}

      <h1>{equipment.name}</h1>
      <p>{equipment.description}</p>

      <p>Condition: {equipment.condition}</p>

      <p style={{ fontSize: "12px", color: "#666" }}>
        Max available: {maxQuantity}
      </p>

      {/* USER */}
      {!isAdmin && user?.role === "user" && (
        <div style={{ marginTop: 20 }}>
          <button onClick={() => setShowRequest(!showRequest)}>
            {showRequest ? "Hide Request" : "Request Equipment"}
          </button>

          {showRequest && (
            <form onSubmit={handleCreateRequest} style={styles.form}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />

              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > maxQuantity) return;
                  setQuantity(val);
                }}
              />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment"
              />

              <button type="submit">Send Request</button>
            </form>
          )}
        </div>
      )}

      {/* ADMIN */}
      {isAdmin && (
        <div style={{ marginTop: 30 }}>
          <h2>All Requests</h2>

          {requests
            .filter((r) => r.equipment_id === Number(id))
            .map((r) => (
              <div key={r.id} style={styles.card}>
                {/* HEADER */}
                <div style={styles.header}>
                  <strong>
                    👤 {r.user?.username || r.user?.email || "Unknown"}
                  </strong>

                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: getStatusColor(r.status),
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                <p>
                  {formatDate(r.startDate)} → {formatDate(r.endDate)}
                </p>

                <p>Quantity: {r.quantity || 0}</p>
                <p>Comment: {r.comment}</p>
                <div style={styles.actions}>
                  <button onClick={() => handleStatusChange(r.id, "approved")}>
                    Approve
                  </button>
                  <button onClick={() => handleStatusChange(r.id, "rejected")}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: 700, margin: "40px auto" },
  image: { width: "100%", height: 300, objectFit: "cover" },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },
  card: {
    border: "1px solid #ddd",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    position: "relative",
  },
  header: {
    position: "relative",
    marginBottom: 8,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
};

export default EquipmentDetails;
