import * as React from 'react';
import './Header.css';

interface IState {
  testnet: boolean;
}

class Header extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      testnet: window.location.hash === '#testnet'
    }
  }

  public componentWillMount() {
    window.onhashchange = () => {
      this.setState({
        testnet: window.location.hash === '#testnet'
      });
    }
  }

  public render() {
    return (
      <header className="HeaderComp">
        <div className="container">
          <h1 className="title">PERPERA</h1>
          <h2 className="slogan">A Data Audit Protocol based on <a href="#">PeerAssets</a>.</h2>
          <div className="by">
            <span>by</span>
            <img src="/img/peercoin-logo.svg" alt="Peercoin" width="95" />
          </div>
          <div className="switch">
            {!this.state.testnet && <a href="#testnet">Enable Testnet</a>}
            {this.state.testnet && <a href="#">Disable Testnet</a>}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
