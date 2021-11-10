import * as React from "react";
import Loader from "../Loader/Loader";
import "./Status.css";
import statusOn from "../../img/status_on.svg";
import statusOff from "../../img/status_off.svg";

interface IState {
  apiStatus: boolean;
  isLoading: boolean;
}

class Status extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      apiStatus: false,
      isLoading: false
    };
  }
  public componentDidMount() {
    // simplest solution : used getaddress API with old address
    fetch("https://blockbook.peercoin.net/api")
      .then()
      .then(
        result => {
          this.setState({
            apiStatus: true
          });
        },
        error => {
          this.setState({
            apiStatus: false
          });
        }
      );
  }

  public render() {
    return (
      <div className="StatusComp">
        {this.state.isLoading && <Loader />}
        {this.state.apiStatus && (
          <div className="status-btn">
            <img src={statusOn} alt="connected" />
          </div>
        )}
        {!this.state.apiStatus && (
          <div className="status-btn">
            <img src={statusOff} alt="disconnected" />
          </div>
        )}
      </div>
    );
  }
}

export default Status;
