import { NavLink, Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="header">
        <h2>IT Consulting Gen AI</h2>

        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/chat">Chat Agent</NavLink>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
