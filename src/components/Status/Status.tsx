import * as React from 'react';
import Loader from 'src/components/Loader/Loader';
import './Status.css';

interface IState {
    apiStatus: boolean;
    isLoading: boolean;
}

class Status extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      apiStatus: true,
      isLoading: false
    }
  }
  public componentDidMount(){
    // simplest solution : used getaddress API with old address
    fetch("https://explorer.peercoin.net/ext/getaddress/PEi5LPN6K9oZDKe9CVgBDoPyX2uvkYyiZ2")
       .then()
       .then(
         (result) => {
           this.setState({
             apiStatus: true
           });
         },
         (error) => {
           this.setState({
             apiStatus: false
           });
         }
       )
  }

  public render() {
    return (
      <div className="StatusComp">
        {this.state.isLoading && <Loader />}
        {this.state.apiStatus && <div className="status-btn"><img src="img/status_on.png"/></div>}
        {!this.state.apiStatus && <div className="status-btn"><img src="img/status_off.png"/></div>}
      </div>
    );
  }
}

export default Status;
