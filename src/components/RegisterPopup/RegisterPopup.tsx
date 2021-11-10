import {sha256} from "js-sha256";
import {sha3_256} from 'js-sha3';
import {sha3_512} from 'js-sha3';
import {sha512} from "js-sha512";

import * as React from "react";
import Loader from "../Loader/Loader";
import SuccessPopup from "../SuccessPopup/SuccessPopup";
import ObservableHelper from "../../helpers/Observable";
import PerperaService from "../../services/Perpera";
import "./RegisterPopup.css";

interface IState {
  errorMsg: string;
  fileBuffer: ArrayBuffer;
  fileName: string;
  hash: string;
  hashAlgo: string;
  isLoading: boolean;
  isOpen: boolean;
  originalHash?: string;
  isSuccess: boolean;
  fee?: any;
  rawTx: string;
  showPassword: boolean;
  txid: string;
  wif: string;
}

class RegisterPopup extends React.Component<{}, IState> {
  private reference: any;

  constructor(props: any) {
    super(props);

    this.state = {
      errorMsg: "",
      fileBuffer: new ArrayBuffer(1),
      fileName: "",
      hash: "",
      hashAlgo: "sha2-256",
      isLoading: false,
      isOpen: false,
      isSuccess: false,
      rawTx: "",
      showPassword: false,
      txid: "",
      wif: "",
    };

    this.handleForm = this.handleForm.bind(this);
    this.handleFee = this.handleFee.bind(this);
    this.close = this.close.bind(this);
    this.handleWIF = this.handleWIF.bind(this);
    this.changeHash = this.changeHash.bind(this);
    this.handleRaw = this.handleRaw.bind(this);
  }

  public getHash(hashAlgo: string, buffer: ArrayBuffer){
    if(hashAlgo === "sha2-256"){
      const hash = sha256(buffer);
      return hash;
    }
    if(hashAlgo === "sha2-512"){
      const hash = sha512(buffer);
      return hash;
    }
    if(hashAlgo === "sha3-256"){
      const hash = sha3_256(buffer);
      return hash;
    }
    if(hashAlgo === "sha3-512"){
      const hash = sha3_512(buffer);
      return hash;
    }

    return "";
  }

  public componentDidMount() {
    ObservableHelper.on("onNewFileHash", (payload: any) => {
      console.log(payload.fileBuffer);
      this.setState({
        fileBuffer: payload.fileBuffer,
        fileName: payload.fileName,
        hash: this.getHash("sha2-256", payload.fileBuffer),
        hashAlgo: "sha2-256",
        isOpen: true,
        originalHash: ""
      });
    });
    ObservableHelper.on("onUpdateFileHash", (payload: any) => {
      this.setState({
        fileBuffer: payload.fileBuffer,
        fileName: payload.fileName,
        hash: this.getHash("sha2-256", payload.fileBuffer),
        hashAlgo: "sha2-256",
        isOpen: true,
        originalHash: payload.originalHash
      });
    });
  }

  public copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public async handleRaw(e: any){
    e.preventDefault();
    this.setState({ isLoading: true });
    const perperaService = new PerperaService();
    try {
      const result = await perperaService.getRawTransaction(
        this.state.hash,
        this.state.hashAlgo,
        this.state.wif
      );
      this.setState({ isLoading: false , rawTx: result});
      this.copyMessage(result);
    } catch (e) {
      this.setState({ errorMsg: "WIF invalid.", isLoading: false });
    }
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
          this.state.hashAlgo,
          this.state.wif
        );
        this.setState({txid: result});
        console.log(result);
      } else {
        const result = await this.reference.commit();
        this.setState({txid: result});
        console.log(result);
      }
      this.setState({ isSuccess: true, isLoading: false });
    } catch (e) {
      if ((e as Error).toString().includes("Insufficient funds")) {
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
        this.state.hashAlgo,
        this.state.wif
      );

      this.reference = result.reference;

      this.setState({
        fee: result.fee,
        isLoading: false
      });
    } catch (e) {
      if ((e as Error).toString().includes("Insufficient funds")) {
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
    this.setState({ errorMsg: "", wif: e.target.value, rawTx: "" });
  }

  public close() {
    this.setState({ isOpen: false, isLoading: false });
  }

  public nextHashAlgo(hashAlgo: string) {
    if(hashAlgo === "sha2-256"){
      return "sha2-512";
    }
    if(hashAlgo === "sha2-512"){
      return "sha3-256";
    }
    if(hashAlgo === "sha3-256"){
      return "sha3-512";
    }
    if(hashAlgo === "sha3-512"){
      return "sha2-256";
    }
    return "";
  }

  public changeHash() {
    const hashAlgo = this.nextHashAlgo(this.state.hashAlgo);
    this.setState({
      fee: undefined,
      hash: this.getHash(hashAlgo, this.state.fileBuffer),
      hashAlgo
    });
  }

  public renderEye = () => {
    return this.state.showPassword ? (
      <i className="eye-slash" onClick={this.toggleShowPassword} />
    ) : (
      <i className="eye-regular" onClick={this.toggleShowPassword} />
    );
  };

  public toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

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
              <div className="label" onClick={this.changeHash} title={"change to " + this.nextHashAlgo(this.state.hashAlgo)}>{this.state.hashAlgo}</div>
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
                <label>Insert your WIF:{this.renderEye()}</label>
                <input
                  className="form-field"
                  autoCorrect="false"
                  placeholder="Type WIF here..."
                  value={wif.trim()}
                  onChange={this.handleWIF}
                  type={showPassword ? "text" : "password"}
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
                <label>Insert your WIF:{this.renderEye()}</label>
                <input
                  className="form-field"
                  autoCorrect="false"
                  placeholder="Type WIF here..."
                  value={wif.trim()}
                  onChange={this.handleWIF}
                  type={showPassword ? "text" : "password"}
                />
                {this.state.errorMsg && (
                  <div className="error-msg">{this.state.errorMsg}</div>
                )}
                {this.state.rawTx === "" && (<button
                  className="btn-getraw"
                  disabled={this.state.isLoading}
                  onClick={this.handleRaw}
                >
                  Show Raw Transaction
                </button>)}
                {this.state.rawTx !== "" && (
                  <div className="show-raw">
                    <label>Raw Transaction</label>
                    <div>{this.state.rawTx}</div>
                  </div>
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
              After registering, you will have to wait for at least one new
              block to be sure your entry is registered with the blockchain.
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default RegisterPopup;
