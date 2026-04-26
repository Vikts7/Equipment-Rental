import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        height: "60px",
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          Equipment
        </Link>

        {/* ADMIN */}
        {role === "admin" && <Link to="/admin">Admin panel</Link>}

        {/* USER */}
        {token && role === "user" && <Link to="/my-requests">My Requests</Link>}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: "20px" }}>
        {token ? (
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
