import React from "react";

const quickLinks = [
  "Track account opening",
  "Track segment activation",
  "Intraday margins",
  "Kite user manual",
];

const featuredArticles = [
  "Current takeovers and delisting - January 2024",
  "Latest intraday leverages - MIS & CO",
  "How to activate F&O and margin trading",
];

function Hero() {
  return (
    <section className="container py-5">
      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-lg-7">
          <div className="p-4 p-md-5 rounded-4 border shadow-sm bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p className="text-primary fw-semibold mb-1">Support Portal</p>
                <h1 className="h3 fw-bold mb-0">
                  Search for an answer or browse help topics to create a ticket
                </h1>
              </div>
              <a
                href="#"
                className="btn btn-primary btn-sm px-3 py-2 rounded-pill shadow-sm"
                style={{ minWidth: "110px" }}
              >
                <i className="bi bi-ticket-perforated me-2"></i>
                Track Tickets
              </a>
            </div>

            <div className="input-group mb-4 shadow-sm">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0"
                placeholder="e.g. How do I activate F&O?"
              />
            </div>

            <div className="d-flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="btn btn-light border text-dark"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="p-4 p-md-5 rounded-4 border shadow-sm bg-light h-100">
            <h2 className="h4 fw-bold mb-4">Featured</h2>
            <ul className="ps-3 mb-0" style={{ lineHeight: "1.8" }}>
              {featuredArticles.map((article) => (
                <li key={article}>
                  <a href="#" className="text-decoration-none text-primary">
                    {article}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
