import React from "react";
import { useLocation } from "react-router-dom";

import Menu from "./Menu";

const TopBar = () => {
  const location = useLocation();
  const hideIndices = [
    "/ai-portfolio",
    "/personalized-advisor",
    "/personalized-report",
  ].includes(location.pathname);

  return (
    <div className="topbar-container">
      {!hideIndices ? (
        <div className="indices-container">
          <div className="nifty">
            <p className="index">NIFTY 50</p>
            <p className="index-points">{100.2} </p>
            <p className="percent"> </p>
          </div>
          <div className="sensex">
            <p className="index">SENSEX</p>
            <p className="index-points">{100.2}</p>
            <p className="percent"></p>
          </div>
        </div>
      ) : null}

      <Menu />
    </div>
  );
};

export default TopBar;
