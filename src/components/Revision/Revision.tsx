import * as React from 'react';
import './Revision.css';

interface IProps {
  revision: any;
  isCurrent?: boolean;
}

class Revision extends React.Component<IProps> {
  public render() {
    const hashes = Object.keys(this.props.revision.state.hash);

    return (
      <div className={this.props.isCurrent ? 'RevisionComp is-current' : 'RevisionComp'}>
        {this.props.isCurrent && (<span className="current-label">Current Revision</span>)}
        
        {hashes.map(hash => (
          <div className="revision-info" key={Math.random()}>
            <div className="revision-title">Document Hash ({hash}):</div>
            <div className="revision-value">{this.props.revision.state.hash[hash]}</div>
          </div>
        ))}
        <div className="revision-info" key={Math.random()}>
          <div className="revision-title">Date Issued:</div>
          <div className="revision-value">{this.props.revision.formattedTime}</div>
        </div>
      </div>
    );
  }
}

export default Revision;
