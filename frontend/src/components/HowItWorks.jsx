const HowItWorks = () => {
  return (
    <section className="how">
      <h2>How It Works</h2>
      <p className="subtext">Get started in just a few simple steps</p>

      <div className="steps">
        <div className="step">
          <div className="circle">1</div>
          <h4>Create Account</h4>
          <p>
            Sign up with your email and basic details in seconds.
          </p>
        </div>

        <div className="step">
          <div className="circle">2</div>
          <h4>Select Employee</h4>
          <p>
            Choose an available employee from the dropdown list.
          </p>
        </div>

        <div className="step">
          <div className="circle">3</div>
          <h4>Get Your Token</h4>
          <p>
            Receive your token number with estimated wait time.
          </p>
        </div>

        <div className="step">
          <div className="circle">4</div>
          <h4>Get Served</h4>
          <p>
            Wait comfortably and get notified when it’s your turn.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
