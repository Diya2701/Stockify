import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // redirect logged-in users to the deployed dashboard
      window.location.href = "https://stockify-dashboard.vercel.app/";
    }
  }, [user]);

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img
            src="Media/images/logo.png"
            style={{ width: "25%" }}
            alt="Logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" role="search">
            <ul className="navbar-nav mb-lg-0">
              {!user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <b>Login</b>
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  <b>Signup</b>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  <b>About</b>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/product">
                  <b>Product</b>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/pricing">
                  <b>Pricing</b>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/support">
                  <b>Support</b>
                </Link>
              </li>
              {/* Logout is shown inside the Dashboard page as requested */}
            </ul>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
