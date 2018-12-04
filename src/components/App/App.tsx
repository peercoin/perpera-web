import * as React from 'react';
import ObservableHelper from 'src/helpers/Observable';
import Header from '../Header/Header';
import Result from '../Result/Result';
import Search from '../Search/Search';
import './App.css';

class App extends React.Component {

  public componentWillMount() {
    ObservableHelper.on('onSearch', (payload: any) => {
      // tslint:disable-next-line:no-console
      console.log('Fired!');
      // tslint:disable-next-line:no-console
      console.log(payload);
    });
  }

  public render() {
    return (
      <div className="AppComp">
        <Header />
        <Search />
        <Result />
      </div>
    );
  }
}

export default App;
