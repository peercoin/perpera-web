import { sha256 } from 'js-sha256';
import * as React from 'react';
import './Add.css';

class Add extends React.Component {
  constructor(props: any) {
    super(props);

    this.handleFile = this.handleFile.bind(this);
  }

  public async handleFile(e: any) {
    e.preventDefault();
    const file: File = e.target.files[0];

    const fileBuffer = await this.getFileBuffer(file);
    console.log(sha256(fileBuffer));
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
        <div className="add-btn">+<input className="file" type="file" onChange={this.handleFile}/></div>
      </div>
    );
  }
}

export default Add;
