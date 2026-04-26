import { useState } from "react";
import api from "../api/api";

const CreateRequest = ({ equipmentId, onSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/requests", {
        equipmentId,
        startDate,
        endDate,
        comment,
      });

      alert("Request sent successfully!");

      // reset form
      setStartDate("");
      setEndDate("");
      setComment("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.log("Error creating request:", err);
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Create Request</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
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

        <textarea
          placeholder="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default CreateRequest;
