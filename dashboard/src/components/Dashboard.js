import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";

import Orders from "./Orders";
import Positions from "./Positions";
import PortfolioAnalysis from "./PortfolioAnalysis";
import PersonalizedAdvisor from "./PersonalizedAdvisor";
import PersonalizedReport from "./PersonalizedReport";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  const location = useLocation();
  const isFullWidthRoute = [
    "/ai-portfolio",
    "/personalized-advisor",
    "/personalized-report",
  ].includes(location.pathname);

  return (
    <div className="dashboard-container">
      {!isFullWidthRoute ? (
        <GeneralContextProvider>
          <WatchList />
        </GeneralContextProvider>
      ) : null}
      <div
        className={`content ${isFullWidthRoute ? "full-width-content" : ""}`}
      >
        <Routes>
          <Route exact path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/ai-portfolio" element={<PortfolioAnalysis />} />
          <Route
            path="/personalized-advisor"
            element={<PersonalizedAdvisor />}
          />
          <Route path="/personalized-report" element={<PersonalizedReport />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
