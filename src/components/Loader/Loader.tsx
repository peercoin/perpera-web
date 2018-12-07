import * as React from 'react';
import './Loader.css';

class Loader extends React.Component {
  public render() {
    return (
      <div className="LoaderComp">
        <div className="loader-spinner">
          <div className="spinner"/>
        </div>
      </div>
    );
  }
}

export default Loader;
