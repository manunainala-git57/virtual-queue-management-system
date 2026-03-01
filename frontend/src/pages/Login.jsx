import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("LOGIN API RESPONSE:", data);

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // Store basic user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("mobile", data.user.mobile);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("id", data.user.id);

      const doctorMap = {
        2: "General Physician",
        3: "Cardiologist",
        4: "Dermatologist",
        5: "Orthopedic",
        6: "Pediatrician",
      };

      if (data.user.role === "EMPLOYEE") {
        const specialization = doctorMap[data.user.id] || "Employee";
        localStorage.setItem("specialization", specialization);
      } else {
        localStorage.removeItem("specialization");
      }

      // Redirect based on role
      const role = data.user.role.toLowerCase();
      if (role === "admin") navigate("/admin");
      else if (role === "employee") navigate("/employee");
      else navigate("/user");

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-input-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="login-input"
                value={form.password}
                onChange={handleChange}
                required
              />

              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p className="error-text">{error}</p>}
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;