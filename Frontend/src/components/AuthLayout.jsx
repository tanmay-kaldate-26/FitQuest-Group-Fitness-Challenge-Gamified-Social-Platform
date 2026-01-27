import "./AuthLayout.css";
import gymImage from "../assets/login-image.jpg";

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        {/* LEFT – static image (never re-renders) */}
        <div className="auth-image-card">
          <img src={gymImage} alt="Fitness motivation" />
          <p className="auth-quote">
            "Stronger together, one streak at a time."
          </p>
        </div>

        {/* RIGHT – dynamic content */}
        <div className="auth-form-card">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
