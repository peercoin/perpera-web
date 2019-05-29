import * as React from "react";
import Loader from "src/components/Loader/Loader";
import SuccessPopup from "src/components/SuccessPopup/SuccessPopup";
import ObservableHelper from "src/helpers/Observable";
import PerperaService from "src/services/Perpera";
import "./RegisterPopup.css";

interface IState {
  errorMsg: string;
  fileName: string;
  hash: string;
  isLoading: boolean;
  isOpen: boolean;
  wif: string;
  originalHash?: string;
  isSuccess: boolean;
  fee?: any;
  txid: string;
  showPassword: boolean;
}

class RegisterPopup extends React.Component<{}, IState> {
  private reference: any;

  constructor(props: any) {
    super(props);

    this.state = {
      errorMsg: "",
      fileName: "",
      hash: "",
      isLoading: false,
      isOpen: false,
      isSuccess: false,
      showPassword: false,
      txid: "",
      wif: ""
    };

    this.handleForm = this.handleForm.bind(this);
    this.handleFee = this.handleFee.bind(this);
    this.close = this.close.bind(this);
    this.handleWIF = this.handleWIF.bind(this);
  }

  public componentWillMount() {
    ObservableHelper.on("onNewFileHash", (payload: any) => {
      this.setState({
        fileName: payload.fileName,
        hash: payload.hash,
        isOpen: true,
        originalHash: ""
      });
    });
    ObservableHelper.on("onUpdateFileHash", (payload: any) => {
      this.setState({
        fileName: payload.fileName,
        hash: payload.hash,
        isOpen: true,
        originalHash: payload.originalHash
      });
    });
  }

  public async handleForm(e: any) {
    e.preventDefault();
    this.setState({ isLoading: true });

    const perperaService = new PerperaService();

    try {
      if (this.state.originalHash) {
        const result = await perperaService.updateDocument(
          this.state.originalHash,
          this.state.hash,
          this.state.wif
        );
        console.log(result);
      } else {
        const result = await this.reference.commit();
        console.log(result);
      }
      this.setState({ isSuccess: true, isLoading: false });
    } catch (e) {
      if (e.toString().includes("Insufficient funds")) {
        this.setState({
          errorMsg: "Your wallet has no funds.",
          isLoading: false
        });
        return;
      }

      console.log(e);

      this.setState({ errorMsg: "WIF invalid.", isLoading: false });
    }
  }

  public async handleFee(e: any) {
    e.preventDefault();
    this.setState({ isLoading: true });

    const perperaService = new PerperaService();

    try {
      const result = await perperaService.getFee(
        this.state.hash,
        this.state.wif
      );

      this.reference = result.reference;

      this.setState({
        fee: result.fee,
        isLoading: false
      });
    } catch (e) {
      if (e.toString().includes("Insufficient funds")) {
        this.setState({
          errorMsg: "Your wallet has no funds.",
          isLoading: false
        });
        return;
      }

      console.log(e);

      this.setState({ errorMsg: "WIF invalid.", isLoading: false });
    }
  }

  public handleWIF(e: any) {
    this.setState({ errorMsg: "", wif: e.target.value });
  }

  public close() {
    this.setState({ isOpen: false, isLoading: false });
  }

  public render() {
    const { wif, showPassword } = this.state;
    return (
      <div
        className={
          this.state.isOpen ? "RegisterPopupComp open" : "RegisterPopupComp"
        }
      >
        {this.state.isLoading && <Loader />}
        {this.state.isSuccess && (
          <SuccessPopup
            txid={this.state.txid}
            text="Your file got registered in the blockchain. Wait at least 10 minutes and use the file hash to check it's registry."
          />
        )}
        {this.state.isOpen && (
          <div className="register-popup">
            <button className="close" onClick={this.close}>
              <img src="img/icon-close.svg" alt="Close Popup" />
            </button>
            <div className="file">
              <img src="img/icon-file.svg" alt="File" className="file-icon" />
              <span>{this.state.fileName}</span>
            </div>

            <div className="hash">
              <div className="label">sha256</div>
              <div className="hash-string">{this.state.hash}</div>
            </div>

            {!this.state.fee && <p>Fee to be calculated.</p>}
            {this.state.fee && (
              <p>
                Saving this hash on blockchain will cost you a transaction fee
                of <b className="bold-green">{this.state.fee} PPC</b>.
              </p>
            )}

            {!this.state.fee && (
              <form className="form" onSubmit={this.handleFee}>
                <label>Insert your WIF:</label>
                <input
                  className="form-field"
                  autoCorrect="false"
                  placeholder="Type WIF here..."
                  type={showPassword ? "text" : "password"}
                  value={wif}
                  onChange={this.handleWIF}
                />
                {this.state.errorMsg && (
                  <div className="error-msg">{this.state.errorMsg}</div>
                )}
                <button
                  className="form-submit"
                  disabled={this.state.isLoading || this.state.isSuccess}
                >
                  Calculate Fee
                </button>
              </form>
            )}

            {this.state.fee && (
              <form className="form" onSubmit={this.handleForm}>
                <label>Insert your WIF:</label>
                <input
                  className="form-field"
                  autoCorrect="false"
                  placeholder="Type WIF here..."
                  type={showPassword ? "text" : "password"}
                  value={wif}
                  onChange={this.handleWIF}
                />
                {this.state.errorMsg && (
                  <div className="error-msg">{this.state.errorMsg}</div>
                )}
                <button
                  className="form-submit"
                  disabled={this.state.isLoading || this.state.isSuccess}
                >
                  {this.state.originalHash ? "Update" : "Register"} Document
                </button>
              </form>
            )}

            <p>
              After registering, you will have to wait up to 1 hour in order for
              it to fully propagate to the blockchain.
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default RegisterPopup;
