import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const UserRequests = () => {
  const { id } = useParams(); // user id
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/api/requests");

        // filter requests for this user
        const userRequests = res.data.filter((r) => r.user_id === Number(id));

        setRequests(userRequests);

        // optional: get user info from first request
        if (userRequests.length > 0) {
          setUser(userRequests[0].user);
        } else {
          // fallback: fetch user separately if needed
          const userRes = await api.get("/api/users");
          const found = userRes.data.find((u) => u.id === Number(id));
          setUser(found);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleStatusChange = async (requestId, status) => {
    try {
      const res = await api.put(`/api/requests/${requestId}/status`, {
        status,
      });

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? res.data : r)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h1>Requests for {user?.username || user?.email || "User"}</h1>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requests.map((r) => (
          <div key={r.id} style={styles.card}>
            <h3>{r.equipment?.name}</h3>

            <p>
              <strong>Dates:</strong> {formatDate(r.startDate)} →{" "}
              {formatDate(r.endDate)}
            </p>

            <p>
              <strong>Comment:</strong> {r.comment}
            </p>

            <p>
              <strong>Status:</strong> {r.status}
            </p>

            {/* ADMIN ACTIONS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleStatusChange(r.id, "approved")}>
                Approve
              </button>

              <button onClick={() => handleStatusChange(r.id, "rejected")}>
                Reject
              </button>
            </div>
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
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
  },
};

export default UserRequests;
