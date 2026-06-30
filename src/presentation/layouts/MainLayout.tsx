import { NavLink, Outlet } from "react-router-dom";
import "./MainLayout.css";

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="enterprise-header">
        <div className="header-brand">
          <div className="brand-logo">AI</div>

          <div>
            <h2>IT Consulting AI</h2>
            <span>Enterprise Architecture Assistant</span>
          </div>
        </div>

        <nav className="header-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/chat">AI Chat</NavLink>
        </nav>

        <div className="header-actions">
          <span className="environment-pill">Demo</span>
          <button className="contact-button">Contact Us</button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
