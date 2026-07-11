import React from "react";
import { Link } from "react-router-dom";

const Funds = () => {
  return (
    <>
      <div className="funds-hero">
        <div>
          <h3 className="title">Funds</h3>
          <p className="funds-subtitle">
            Instant, zero-cost fund transfers with UPI
          </p>
        </div>
        <div className="funds-actions">
          <Link className="btn btn-green">Add funds</Link>
          <Link className="btn btn-blue">Withdraw</Link>
        </div>
      </div>

      <div className="funds-grid">
        <div className="funds-card">
          <div className="funds-card-header">
            <h4>Equity</h4>
            <span>Live account summary</span>
          </div>

          <div className="funds-summary">
            <div className="funds-summary-item emphasis">
              <p>Available margin</p>
              <h5>₹4,043.10</h5>
            </div>
            <div className="funds-summary-item">
              <p>Used margin</p>
              <h5>₹3,757.30</h5>
            </div>
            <div className="funds-summary-item">
              <p>Available cash</p>
              <h5>₹4,043.10</h5>
            </div>
          </div>

          <div className="table">
            <div className="data">
              <p>Opening Balance</p>
              <p>₹4,043.10</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>₹4,064.00</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>₹0.00</p>
            </div>
          </div>
        </div>

        <div className="funds-card commodity-card">
          <div className="funds-card-header">
            <h4>Commodity</h4>
            <span>Account access</span>
          </div>
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue">Open Account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
