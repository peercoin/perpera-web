import * as React from 'react';
import './SuccessPopup.css';

interface IProps {
  text?: string;
  title?: string;
  txid?: string;
}

interface IState {
  isOpen: boolean;
}

class SuccessPopup extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isOpen: true
    }

    this.close = this.close.bind(this);
  }

  public close() {
    this.setState({
      isOpen: false
    });
  }

  public render() {
    return (
      <div className={this.state.isOpen ? 'SuccessPopupComp open' : 'SuccessPopupComp'}>
        <div className="success-popup">
          <img src="img/icon-success.svg" alt="" className="success-icon"/>
          <div className="success-title">{this.props.title || 'Success!'}</div>
          <div className="success-text">{this.props.text || 'File registered to blockchain.'}</div>
          <button className="form-submit" onClick={this.close}>OK</button>
        </div>
      </div>
    );
  }
}

export default SuccessPopup;
