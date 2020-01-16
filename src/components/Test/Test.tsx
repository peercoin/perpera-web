import * as React from 'react';
import PerperaService from "src/services/Perpera";
import "./Test.css";

class Test extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }
  public componentDidMount(){
    this.handleTest = this.handleTest.bind(this);
  }

  public async handleTest() {
    /* Hardware wallet */
    const perperaService = new PerperaService();
    try {
      const result = await perperaService.getWalletPublicKey(); 
      console.log("getLedgerAddress");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  public render() {
    return (
      <div className="test-comp">
          <button onClick={this.handleTest}>Test</button>
      </div>
    );
  }
}

export default Test;
