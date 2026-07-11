import React, { useContext, useState } from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, initialMode = "BUY" }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [mode, setMode] = useState(initialMode);
  const [flashMessage, setFlashMessage] = useState("");
  const generalContext = useContext(GeneralContext);

  const handleActionClick = async () => {
    try {
      await axios.post("http://localhost:3001/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode,
      });
      setFlashMessage(`${mode} order placed successfully`);
      setTimeout(() => {
        generalContext.closeBuyWindow();
        window.location.href = "/holdings";
      }, 800);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to place order");
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div
      className={`container ${mode === "SELL" ? "sell-theme" : "buy-theme"}`}
      id="buy-window"
      draggable="true"
    >
      <div className="header">
        <h3>{mode === "SELL" ? "Sell Order" : "Buy Order"}</h3>
        <button className="close-btn" onClick={handleCancelClick} type="button">
          ×
        </button>
      </div>

      {flashMessage && <div className="flash-message">{flashMessage}</div>}

      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>

        <div className="mode-toggle" style={{ marginTop: "12px" }}>
          <button
            className={mode === "BUY" ? "btn btn-blue" : "btn btn-grey"}
            onClick={() => setMode("BUY")}
            type="button"
          >
            Buy
          </button>
          <button
            className={mode === "SELL" ? "btn btn-blue" : "btn btn-grey"}
            onClick={() => setMode("SELL")}
            type="button"
          >
            Sell
          </button>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div className="action-group">
          <button
            className="btn btn-grey"
            onClick={handleCancelClick}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn btn-blue"
            onClick={handleActionClick}
            type="button"
          >
            {mode}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
