import * as React from "react";
import "./Header.css";

class Header extends React.Component {
  public render() {
    return (
      <header className="HeaderComp">
        <div className="container">
          <h1 className="title">PERPERA</h1>
          <h2 className="slogan">A Data Audit Protocol.</h2>
          <div className="by">
            <span>by</span>
            <img src="img/peercoin-logo.svg" alt="Peercoin" width="95" />
          </div>
          <a
            href="https://github.com/PeerAssets/peerassets-rfcs/blob/master/0009-data-audit.md"
            className="slogan"
            target="_blank"
            rel="noopener"
            style={{ marginTop: "20px" }}
          >
            How it works
          </a>
        </div>
      </header>
    );
  }
}

export default Header;
