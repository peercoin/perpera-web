import * as React from 'react';
import Revision from '../Revision/Revision';
import './ResultDetails.css';

interface IProps {
  doc: any;
}

class ResultDetails extends React.Component<IProps> {
  public render() {
    const lastUpdate = this.props.doc.transitions[this.props.doc.transitions.length - 1].formattedTime
    // tslint:disable-next-line:no-console
    console.log(this.props.doc);
    return (
      <div className="ResultDetailsComp">
        <div className="data">
          <div className="label">Showing Revisions for Tag:</div>
          <div className="value green">{this.props.doc.tag}</div>
        </div>
        <div className="panel grey">
          <div className="data">
            <div className="label">Network:</div>
            <div className="value green">{this.props.doc.driver.network.coin}</div>
          </div>
          <div className="data">
            <div className="label">Last Update:</div>
            <div className="value green">{lastUpdate}</div>
          </div>
        </div>
        <h3>File Revisions ({this.props.doc.transitions.length}):</h3>
        {this.props.doc.transitions.map((revision: any, i: number) => (
          <Revision isCurrent={i === 0} key={Math.random()} revision={revision} />
        ))}
      </div>
    );  
  }
}

export default ResultDetails;
