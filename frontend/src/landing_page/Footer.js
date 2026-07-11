import React from "react";

function Footer() {
  return (
    <footer
      style={{ backgroundColor: "rgb(250, 250, 250)", padding: "40px 0" }}
    >
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col">
            <img
              src="Media/images/logo.png"
              alt="Stockify logo"
              style={{ width: "50%" }}
            />
            <p>&copy; 2010 - 2024 Stockify Broking Ltd. All rights reserved.</p>
            <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#475569", fontSize: "1.2rem" }}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#475569", fontSize: "1.2rem" }}
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#475569", fontSize: "1.2rem" }}
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="col">
            <p>Company</p>
            <a href="/about" style={{ textDecoration: "none" }}>
              About
            </a>
            <br />
            <a href="/products" style={{ textDecoration: "none" }}>
              Products
            </a>
            <br />
            <a href="/pricing" style={{ textDecoration: "none" }}>
              Pricing
            </a>
            <br />
            <a href="/careers" style={{ textDecoration: "none" }}>
              Careers
            </a>
            <br />
            <a href="/press" style={{ textDecoration: "none" }}>
              Press & media
            </a>
            <br />
          </div>
          <div className="col">
            <p>Resources</p>
            <a href="/support" style={{ textDecoration: "none" }}>
              Support portal
            </a>
            <br />
            <a href="/blog" style={{ textDecoration: "none" }}>
              Stockify blog
            </a>
            <br />
            <a href="/terms" style={{ textDecoration: "none" }}>
              Terms of service
            </a>
            <br />
            <a href="/privacy" style={{ textDecoration: "none" }}>
              Privacy policy
            </a>
            <br />
          </div>
          <div className="col">
            <p>Connect</p>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              Facebook
            </a>
            <br />
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              Twitter
            </a>
            <br />
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              LinkedIn
            </a>
            <br />
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p>
            Stockify Broking Ltd.: Member of NSE​ &​ BSE – SEBI Registration
            no.: INZ000031633 CDSL: Depository services through Stockify
            Securities Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015
            Commodity Trading through Stockify Commodities Pvt. Ltd. MCX: 46025
            – SEBI Registration no.: INZ000038238 Registered Address: Stockify
            Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence
            Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka,
            India. For any complaints pertaining to securities broking please
            write to complaints@stockify.com, for DP related to dp@stockify.com.
            Please ensure you carefully read the Risk Disclosure Document as
            prescribed by SEBI | ICF
          </p>

          <p>
            Procedure to file a complaint on SEBI SCORES: Register on SCORES
            portal. Mandatory details for filing complaints on SCORES: Name,
            PAN, Address, Mobile Number, E-mail ID. Benefits: Effective
            Communication, Speedy redressal of the grievances
          </p>

          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>

          <p>
            "Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers. Receive
            information of your transactions directly from Exchange on your
            mobile/email at the end of the day. Issued in the interest of
            investors. KYC is one time exercise while dealing in securities
            markets - once KYC is done through a SEBI registered intermediary
            (broker, DP, Mutual Fund etc.), you need not undergo the same
            process again when you approach another intermediary." Dear
            Investor, if you are subscribing to an IPO, there is no need to
            issue a cheque. Please write the Bank account number and sign the
            IPO application form to authorize your bank to make payment in case
            of allotment. In case of non allotment the funds will remain in your
            bank account. As a business we don't give stock tips, and have not
            authorized anyone to trade on behalf of others. If you find anyone
            claiming to be part of Stockify and offering such services, please
            create a ticket here.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
