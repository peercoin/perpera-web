import { sha256 } from 'js-sha256';
import * as React from 'react';
import Loader from 'src/components/Loader/Loader';
import ObservableHelper from 'src/helpers/Observable';
import './Add.css';

interface IState {
  isLoading: boolean;
}

class Add extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.handleFile = this.handleFile.bind(this);

    this.state = {
      isLoading: false
    }
  }

  public async handleFile(e: any) {
    e.preventDefault();
    this.setState({ isLoading: true });

    const file: File = e.target.files[0];

    const fileBuffer = await this.getFileBuffer(file);
    const hash = sha256(fileBuffer);

    ObservableHelper.fire('onNewFileHash', {hash, fileName: name});

    this.setState({ isLoading: false });
  }

  public getFileBuffer(file: File): Promise<any> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (reader.readyState === reader.DONE) {
          resolve(reader.result);
        }
      }

      reader.readAsArrayBuffer(file);
    });
  }

  public render() {
    return (
      <div className="AddComp">
        {this.state.isLoading && <Loader />}
        <div className="add-btn">+<input className="file" type="file" onChange={this.handleFile}/></div>
      </div>
    );
  }
}

export default Add;
