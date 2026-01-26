import {
  FiClock,
  FiUsers,
  FiBell,
  FiBarChart2,
  FiShield,
  FiSmartphone,
} from "react-icons/fi";

const Features = () => {
  return (
    <section className="features">
      <h2>
        Everything You Need to <span>Manage Queues</span>
      </h2>
      <p className="subtext">
        Our comprehensive solution streamlines the entire queuing process for your organization.
      </p>

      <div className="feature-grid">
        <div className="card">
          <FiClock className="feature-icon" />
          <h4>Real-Time Queue Tracking</h4>
          <p>
            See your position in the queue and estimated wait time updated in real-time.
          </p>
        </div>

        <div className="card">
          <FiUsers className="feature-icon" />
          <h4>Smart Employee Matching</h4>
          <p>
            Choose from available employees based on their expertise and current queue length.
          </p>
        </div>

        <div className="card">
          <FiBell className="feature-icon" />
          <h4>Instant Notifications</h4>
          <p>
            Get notified via email or SMS when your turn is approaching.
          </p>
        </div>

        <div className="card">
          <FiBarChart2 className="feature-icon" />
          <h4>Powerful Analytics</h4>
          <p>
            Detailed reports and insights for administrators to optimize operations.
          </p>
        </div>

        <div className="card">
          <FiShield className="feature-icon" />
          <h4>Role-Based Access</h4>
          <p>
            Secure authentication with different access levels for users, employees, and admins.
          </p>
        </div>

        <div className="card">
          <FiSmartphone className="feature-icon" />
          <h4>Mobile Friendly</h4>
          <p>
            Access the queue system from any device, anywhere, anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
