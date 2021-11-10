import { DateTime } from 'luxon';
import * as React from 'react';
import ObservableHelper from '../../helpers/Observable';
import Loader from '../Loader/Loader';
import './Search.css';
import iconSearch from "../../img/icon-search.svg";
interface IState {
  searchText: string;
  networkType: string;
  isLoading: boolean;
}

class Search extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.searchTag = this.searchTag.bind(this);
    this.setSearchText = this.setSearchText.bind(this);

    this.state = {
      isLoading: false,
      networkType: 'peercoin',
      searchText: ''
    }
  }

  public async searchTag(e: React.FormEvent) {
    const { searchText, networkType } = this.state;

    e.preventDefault();


    // If search is empty or only spaces, ignore request
    // and fire event saying field is empty
    if (!searchText.trim()) {
      ObservableHelper.fire('onSearch', {status: 'empty'});
      return;
    }

    this.setState({ isLoading: true });
    const perpera = window['perpera'];
    let doc = new perpera.Document(searchText, perpera.networks[networkType]);

    await doc.sync();
    doc = this.formatDate(doc);

    if (Array.from(doc.blocks).length < 1) {
      doc = undefined;
    }

    ObservableHelper.fire('onSearch', {status: 'search', doc});

    this.setState({ isLoading: false });
  }

  public formatDate(doc: any) {
    doc.transitions = doc.transitions.map((transition: any) => {
      return {
        ...transition,
        formattedTime: DateTime.fromISO(transition.state.time.toISOString()).toLocaleString(DateTime.DATETIME_MED)
      }
    });

    return doc;
  }

  public setSearchText(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    this.setState({ searchText: target.value });
  }


  public render() {
    return (
      <form className="SearchComp" onSubmit={this.searchTag}>
        {this.state.isLoading && <Loader />}
        <input type="text" className="search-field" placeholder="Search document tag" onInput={this.setSearchText} />
        <button className="search-btn">
          <img src={iconSearch} alt="Search" width="24" />
        </button>
      </form>
    );
  }
}

export default Search;
