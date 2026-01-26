import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <div className="logo-icon">Q</div>
        <span>QueueFlow</span>
      </div>

      <div className="nav-actions">
        <button
          className="link-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="primary-btn"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
