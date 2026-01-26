import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <span className="badge">
        ✨ Smart Queue Management for Modern Organizations
      </span>

      <h1>
        Stop Waiting in Lines,<br />
        <span>Start Living</span>
      </h1>

      <p>
        Transform your waiting experience with our intelligent virtual
        queue system.
      </p>

      <div className="buttons">
        <button
          className="primary-btn"
          onClick={() => navigate("/register")}
        >
          Get Started →
        </button>

        <button
          className="outline-btn"
          onClick={() => navigate("/login")}
        >
          🎟 Take Token
        </button>
      </div>
    </section>
  );
};

export default Hero;
