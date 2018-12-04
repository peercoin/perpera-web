import * as React from 'react';
import ObservableHelper from '../../helpers/Observable';
import ResultDetails from '../ResultDetails/ResultDetails';
import './Result.css';

interface IState {
  result: any;
  isSearchArrived: boolean;
}


class Result extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isSearchArrived: false,
      result: undefined
    }
  }

  public componentWillMount() {
    ObservableHelper.on('onSearch', (result: any) => {
      if (result.status === 'empty') {
        this.setState({
          isSearchArrived: false,
          result: undefined
        });
        return;
      }

      this.setState({
        isSearchArrived: true,
        result
      });
    })
  }

  public render() {
    let resultComp;

    if (!this.state.isSearchArrived) {
      resultComp = (
        <h2 key="a" className="waiting-message">Waiting for a search above.</h2>
      );
    } else if (this.state.result.doc) {
      resultComp = (
        <ResultDetails doc={this.state.result.doc} />
      );
    } else {
      resultComp = (
        <h2 key="b" className="waiting-message">No results found for this document tag.</h2>
      )
    }

    return (
      <div className="ResultComp">
        <div className="container">
          {resultComp}
        </div>
      </div>
    );
  }
}

export default Result;
