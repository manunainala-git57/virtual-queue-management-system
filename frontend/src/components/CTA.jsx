import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta">
      <h2>
        Ready to Transform Your <span>Queue Experience?</span>
      </h2>

      <p>
        Join thousands of organizations already using QueueFlow.
      </p>

      <div className="buttons">
        <button
          className="primary-btn"
          onClick={() => navigate("/register")}
        >
          Start Free Today <FaArrowRight />
        </button>

        <button
          className="outline-btn"
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </button>
      </div>
    </section>
  );
};

export default CTA;
