import React from "react";

const charges = [
  "Call & Trade and RMS auto-squareoff: additional charges of ₹50 + GST per order.",
  "Digital contract notes will be sent via email.",
  "Physical copies of contract notes, if required, will be charged ₹20 per contract note. Courier charges apply.",
  "For NRI account (non-PIS), 0.5% or ₹100 per executed order for equity (whichever is lower).",
  "For NRI account (PIS), 0.5% or ₹200 per executed order for equity (whichever is lower).",
  "If the account is in debit balance, any order placed will be charged ₹40 per executed order instead of ₹20.",
];

function Brokerage() {
  return (
    <div className="container py-5">
      <div className="row g-4 border-top pt-5">
        <div className="col-12 col-lg-7">
          <div className="p-4 rounded-4 border shadow-sm bg-white h-100">
            <h3 className="fw-semibold mb-4 text-primary">
              Brokerage calculator
            </h3>
            <ul className="ps-3 text-muted mb-0" style={{ lineHeight: "1.8" }}>
              {charges.map((item) => (
                <li key={item} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="p-4 rounded-4 border shadow-sm bg-white h-100">
            <h3 className="fw-semibold mb-4 text-primary">List of charges</h3>
            <div className="text-muted" style={{ lineHeight: "1.8" }}>
              <p className="mb-2">
                <strong className="text-dark">₹20</strong> per order for
                intraday and F&O trades
              </p>
              <p className="mb-2">
                <strong className="text-dark">₹0</strong> for equity delivery
                and direct mutual funds
              </p>
              <p className="mb-2">
                <strong className="text-dark">₹50 + GST</strong> for call &
                trade
              </p>
              <p className="mb-0">
                <strong className="text-dark">₹20</strong> per contract note for
                physical copies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Brokerage;
