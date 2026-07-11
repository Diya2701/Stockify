import React, { useState, useContext, useMemo } from "react";

import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnutChart";

const WatchList = ({ watchlistData = watchlist }) => {
  const chartData = useMemo(() => {
    const labels = watchlistData.map((stock) => stock.name);

    return {
      labels,
      datasets: [
        {
          label: "Price",
          data: watchlistData.map((stock) => Number(stock.price) || 0),
          backgroundColor: [
            "rgba(244, 63, 94, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(250, 204, 21, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(249, 115, 22, 0.8)",
          ],
          borderColor: [
            "rgba(244, 63, 94, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(250, 204, 21, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(168, 85, 247, 1)",
            "rgba(249, 115, 22, 1)",
          ],
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };
  }, [watchlistData]);

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlistData.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} />;
        })}
      </ul>
      <DoughnutChart data={chartData} title="Watchlist Overview" />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  const trendClass = stock.isDown ? "down" : "up";

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={`stock-name ${trendClass}`}>{stock.name}</p>
        <div className="itemInfo">
          <span className={`percent ${trendClass}`}>{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className={trendClass} />
          ) : (
            <KeyboardArrowUp className={trendClass} />
          )}
          <span className={`price ${trendClass}`}>{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid, "BUY");
  };

  const handleSellClick = () => {
    generalContext.openBuyWindow(uid, "SELL");
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell" onClick={handleSellClick}>
            Sell
          </button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
