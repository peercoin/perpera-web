import * as React from 'react';
import './ResultDetails.css';

interface IProps {
  doc: any;
}

class ResultDetails extends React.Component<IProps> {
  public render() {
    return (
      <div className="ResultDetailsComp">
        <h1>Details!</h1>
      </div>
    );
  }
}

export default ResultDetails;
