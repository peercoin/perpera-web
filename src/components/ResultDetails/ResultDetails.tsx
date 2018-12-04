import * as React from 'react';
import './ResultDetails.css';

interface IProps {
  doc: any;
}

class ResultDetails extends React.Component<IProps> {
  public render() {
    return (
      <div className="ResultDetailsComp">
        <div className="data">
          <div className="label">Showing Revisions for Tag:</div>
          <div className="value green">{this.props.doc.tag}</div>
        </div>
      </div>
    );
  }
}

export default ResultDetails;
