import * as React from 'react';
import Loader from 'src/components/Loader/Loader';
import ObservableHelper from 'src/helpers/Observable';
import './Update.css';

interface IState {
  isLoading: boolean;
}

interface IProps {
  originalHash: string;
}

class Update extends React.Component<IProps, IState> {
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

    console.log(file);

    const fileBuffer = await this.getFileBuffer(file);

    ObservableHelper.fire('onUpdateFileHash', {originalHash: this.props.originalHash, fileBuffer, fileName: file.name});

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
      <div className="UpdateComp">
        {this.state.isLoading && <Loader />}
        <div className="update-btn">+<input className="file" type="file" onChange={this.handleFile}/></div>
      </div>
    );
  }
}

export default Update;
