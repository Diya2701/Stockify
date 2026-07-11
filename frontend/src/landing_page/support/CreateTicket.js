import React from "react";

const supportTopics = [
  {
    title: "Account Opening",
    icon: "fa-solid fa-user-plus",
    links: [
      "Online account opening",
      "Offline account opening",
      "Company, partnership and HUF account",
      "NRI account opening",
      "Charges at Stockify",
    ],
  },
  {
    title: "Kite",
    icon: "fa-solid fa-chart-line",
    links: [
      "Kite user manual",
      "Order types and alerts",
      "Margins and leverage",
      "Trading from mobile app",
      "Reset password",
    ],
  },
  {
    title: "Console",
    icon: "fa-solid fa-desktop",
    links: [
      "Console user manual",
      "Portfolio and holdings",
      "Orders and positions",
      "Funds and payouts",
      "Statement downloads",
    ],
  },
  {
    title: "Funds",
    icon: "fa-solid fa-wallet",
    links: [
      "Add money",
      "Withdraw funds",
      "Payment methods",
      "Payout status",
      "Transfer issues",
    ],
  },
  {
    title: "Charges",
    icon: "fa-solid fa-money-bill-wave",
    links: [
      "Brokerage and fees",
      "DP charges",
      "STT and taxes",
      "Account maintenance",
      "Invoice and receipts",
    ],
  },
  {
    title: "Profile",
    icon: "fa-solid fa-user-gear",
    links: [
      "Update personal details",
      "Change phone number",
      "Segment activation",
      "Email and communication",
      "Profile verification",
    ],
  },
];

function CreateTicket() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 mb-3">
          <h2 className="fs-2 fw-bold">
            To create a ticket, select a relevant topic
          </h2>
        </div>

        {supportTopics.map((topic) => (
          <div key={topic.title} className="col-12 col-md-6 col-lg-4">
            <div className="p-4 rounded-4 border shadow-sm bg-white h-100">
              <h4 className="mb-3 fw-semibold text-primary">
                <i className={`${topic.icon} me-2`}></i>
                {topic.title}
              </h4>
              <div className="d-flex flex-column gap-2">
                {topic.links.map((link) => (
                  <button
                    key={link}
                    type="button"
                    className="text-decoration-none text-dark btn btn-link p-0"
                    style={{ lineHeight: 1.6 }}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateTicket;
