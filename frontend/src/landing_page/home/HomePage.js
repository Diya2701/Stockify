import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import Hero from "./Hero";
import Awards from "./Awards";
import Stats from "./Stats";
import Pricing from "./Pricing";
import Education from "./Education";
import OpenAccount from "../OpenAccount";

function HomePage() {
  const { loading, message, clearMessage } = useContext(AuthContext);

  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = setTimeout(() => {
      clearMessage();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, clearMessage]);

  if (loading) {
    return <div className="container p-5">Loading...</div>;
  }

  return (
    <>
      <Hero />
      <Awards />
      <Stats />
      <Pricing />
      <Education />
      <OpenAccount />
    </>
  );
}

export default HomePage;
