import React from "react";

const partners = [
  {
    name: "Smallcase",
    image: `${process.env.PUBLIC_URL}/Media/images/smallcaseLogo.png`,
    description: "Thematic investment platform",
  },
  {
    name: "Sensibull",
    image: `${process.env.PUBLIC_URL}/Media/images/sensibullLogo.svg`,
    description: "Options and futures advisory platform",
  },
  {
    name: "Streak",
    image: `${process.env.PUBLIC_URL}/Media/images/streakLogo.png`,
    description: "Algo trading and strategy automation",
  },
  {
    name: "Ditto",
    image: `${process.env.PUBLIC_URL}/Media/images/dittoLogo.png`,
    description: "Insurance buying made simple",
  },
  {
    name: "Goldenpi",
    image: `${process.env.PUBLIC_URL}/Media/images/goldenpiLogo.png`,
    description: "Digital gold and fixed income products",
  },
  {
    name: "Stockify Fundhouse",
    image: `${process.env.PUBLIC_URL}/Media/images/zerodhaFundhouse.png`,
    description: "Mutual funds and investment products",
  },
];

function Universe() {
  return (
    <div className="container py-5">
      <div className="row text-center justify-content-center">
        <div className="col-12">
          <h2 className="fw-bold mb-3">The Stockify Universe</h2>
          <p className="text-muted mb-5">
            Extend your trading and investment experience even further with our
            partner platforms
          </p>
        </div>

        {partners.map((partner) => (
          <div key={partner.name} className="col-12 col-sm-6 col-lg-4 mb-4">
            <div className="h-100 p-4 border rounded-4 shadow-sm bg-white">
              <img
                src={partner.image}
                alt={partner.name}
                style={{
                  maxWidth: "180px",
                  height: "60px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto 1rem",
                }}
              />
              <p className="text-muted mb-0">{partner.description}</p>
            </div>
          </div>
        ))}

        <div className="col-12 mt-4">
          <button className="btn btn-primary px-4 py-2">Signup Now</button>
        </div>
      </div>
    </div>
  );
}

export default Universe;
