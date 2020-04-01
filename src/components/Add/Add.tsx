import * as React from "react";
import Loader from "src/components/Loader/Loader";
import ObservableHelper from "src/helpers/Observable";
import "./Add.css";

interface IState {
  errorMsg: string;
  fileType: boolean;
  isLoading: boolean;
  uri: string;
}

class Add extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.handleFile = this.handleFile.bind(this);
    this.handleFileUri = this.handleFileUri.bind(this);
    this.changeFileType = this.changeFileType.bind(this);
    this.handleURI = this.handleURI.bind(this);

    this.state = {
      errorMsg: "",
      fileType: true,
      isLoading: false,
      uri: ""
    };
  }

  public async handleFile(e: any) {
    e.preventDefault();
    this.setState({ isLoading: true });

    const file: File = e.target.files[0];

    console.log(file);

    const fileBuffer = await this.getFileBuffer(file);
    console.log(fileBuffer);
    ObservableHelper.fire("onNewFileHash", { fileBuffer, fileName: file.name });

    this.setState({ isLoading: false });
  }

  public getFileBuffer(file: File): Promise<any> {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.readyState === reader.DONE) {
          resolve(reader.result);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  public changeFileType(e: any) {
    this.setState({ fileType: !this.state.fileType, errorMsg: "" });
  }

  public getFileSize(url: string) {
    const http = new XMLHttpRequest();
    http.open("HEAD", url, false); // false = Synchronous

    http.send(null); // it will stop here until this http request is complete

    // when we are here, we already have a response, b/c we used Synchronous XHR

    if (http.status === 200) {
      const fileSize = http.getResponseHeader("content-length");
      if (fileSize != null) {
        return parseInt(fileSize, 10);
      }
    }
    return -1;
  }

  public async getUriContent(uri: string): Promise<any> {
    const controller = new AbortController();
    const signal = controller.signal;

    const timerID = setTimeout(
      (() => {
        controller.abort();
      }).bind(this),
      10 * 60 * 1000
    );

    if (this.getFileSize(uri) === -1) {
      return 0;
    }
    if (this.getFileSize(uri) > 256 * 1024 * 1024) {
      return 1;
    }

    const response = await fetch(uri, { method: "get", signal });
    console.log(response);
    clearTimeout(timerID);
    if (!response.ok) {
      return 0;
    }
    return response.blob().toString();
  }

  public async handleFileUri(e: any) {
    e.preventDefault();
    this.setState({ isLoading: true });

    try {
      const fileBuffer = await this.getUriContent(this.state.uri);
      if (fileBuffer === 0) {
        this.setState({ errorMsg: "document URI invalid" });
      } else if (fileBuffer === 1) {
        this.setState({ errorMsg: "document URI invalid" });
      } else {
        ObservableHelper.fire("onNewFileHash", {
          fileBuffer,
          fileName: this.state.uri
        });
        this.setState({ fileType: !this.state.fileType });
      }
    } catch (e) {
      this.setState({ errorMsg: "error on adding URI" });
    }

    this.setState({ isLoading: false });
  }

  public handleURI(e: any) {
    this.setState({ errorMsg: "", uri: e.target.value });
  }

  public render() {
    return (
      <div className="AddComp">
        {this.state.isLoading && <Loader />}
        <div className="add-btn add-file" title="input file">
          <img
            className="add-icon"
            src="/img/attach-file.svg"
            alt="attach-file"
          />
          <input className="file" type="file" onChange={this.handleFile} />
        </div>
        <div className="add-btn add-uri" title="input uri">
          <img
            className="add-icon"
            src="/img/attach-uri.svg"
            alt="attach uri"
          />
          <input className="file" type="button" onClick={this.changeFileType} />
        </div>
        {!this.state.fileType && (
          <div className="input-uri">
            <div className="input-dlg">
              <button className="close" onClick={this.changeFileType}>
                <img src="img/icon-close.svg" alt="Close Popup" />
              </button>
              <form className="form" onSubmit={this.handleFileUri}>
                <div>
                  <label>Insert document URI:</label>
                </div>
                <div>
                  <input
                    className="form-field"
                    placeholder="Type URI here..."
                    type="url"
                    pattern="https?://.+"
                    onChange={this.handleURI}
                  />
                </div>
                {this.state.errorMsg && (
                  <div className="error-msg">{this.state.errorMsg}</div>
                )}
                <button className="form-submit">Add Uri</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Add;
