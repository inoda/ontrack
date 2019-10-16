import React from 'react'
import PropTypes from 'prop-types'
import { Base } from '../../api/main'
import { Expenses } from '../../api/main'
import { Alerts } from '../../helpers/main'

class Paginator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 1,
      itemsPerPage: this.props.itemsPerPage,
      totalItems: 0,
      totalPages: 0,
      url: this.props.url,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.setState({ url: this.props.url, selectedPage: 1 }, this.loadData);
    }

    if (prevProps.reloadTrigger !== this.props.reloadTrigger) {
      this.setState({ selectedPage: 1 }, this.loadData);
    }

    if (prevProps.reloadPageTrigger !== this.props.reloadPageTrigger) {
      this.loadData();
    }
  }

  handlePageNext = () => {
    if (this.state.selectedPage + 1 > this.state.totalPages) { return; }
    this.setState({ selectedPage: this.state.selectedPage + 1 }, this.loadData);
  }

  handlePagePrev = () => {
    if (this.state.selectedPage - 1 < 1) { return; }
    this.setState({ selectedPage: this.state.selectedPage - 1 }, this.loadData);
  }

  handleSelect = (p) => {
    this.setState({ selectedPage: p }, this.loadData);
  }

  loadData() {
    if (!this.props.url.length) { return; }
    Base.get(this.props.url, { page: this.state.selectedPage, per_page: this.state.itemsPerPage }).then(
      (resp) => {
        this.setState({ totalItems: resp.total, totalPages: resp.total_pages, selectedPage: resp.page, itemsPerPage: resp.per_page });
        this.props.onLoad(resp);
      },
      (error) => { Alerts.genericError(); },
    )
  }

  firstPage() {
    return this.state.selectedPage === 1;
  }

  lastPage() {
    return this.state.selectedPage === this.state.totalPages;
  }

  itemsLowerLimit() {
    if (this.state.selectedPage === 1) {
      return 1;
    }

    return ((this.state.selectedPage - 1) * this.state.itemsPerPage) + 1;
  }

  itemsUpperLimit() {
    const upperLimit = this.state.selectedPage * this.state.itemsPerPage;
    if (this.state.totalItems < upperLimit) {
      return this.state.totalItems;
    }
    return upperLimit;
  }

  displayedPages() {
    const pages = [];
    let lowerBound = 0;
    let upperBound = 0;

    if (this.state.totalPages <= 10) {
      lowerBound = 1;
      upperBound = this.state.totalPages;
    } else {
      // Make sure if we're on the last page, and there are enough previous pages, we still show 10 pages total up to the last page
      const nextSlidingLowerBound = this.state.selectedPage >= this.state.totalPages - 4 ? this.state.totalPages - 9 : this.state.selectedPage - 5;
      lowerBound = this.state.selectedPage >= 10 ? nextSlidingLowerBound : 1;

      // Make sure the next upper bound isn't outside of the range of pages available
      const nextSlidingUpperBound = this.state.selectedPage + 4 > this.state.totalPages ? this.state.totalPages : this.state.selectedPage + 4;
      upperBound = this.state.selectedPage >= 10 ? nextSlidingUpperBound : 10;
    }

    for (let p = lowerBound; p <= upperBound; p++) { pages.push(p); }
    return pages;
  }

  renderPage(p) {
    return (
      <li className={`hover-pointer ${this.state.selectedPage == p ? 'active' : ''}`} v-for="p in displayedPages" key={`page-${p}`}>
        <a onClick={() => this.handleSelect(p)}>{p}</a>
      </li>
    )
  }

  render() {
    if (this.state.totalItems < 1) { return '' }

    return (
      <div className="paginator">
        <div className="pagination-num-items">
          <span>Showing <strong>{this.itemsLowerLimit()}</strong>-<strong>{this.itemsUpperLimit()}</strong> of <strong>{this.state.totalItems}</strong></span>
        </div>

        <ol>
          <li>
            <a onClick={this.handlePagePrev}><i className="fa fa-angle-left"></i></a>
          </li>
          {this.displayedPages().map((p) => { return this.renderPage(p) })}
          <li>
            <a onClick={this.handlePageNext}><i className="fa fa-angle-right"></i></a>
          </li>
        </ol>
      </div>
    );
  }
}

Paginator.defaultProps = {
  itemsPerPage: 10,
  totalItems: 0,
  url: '',
  reloadTrigger: 0,
  reloadPageTrigger: 0,
}

Paginator.propTypes = {
  itemsPerPage: PropTypes.number,
  totalItems: PropTypes.number,
  url: PropTypes.string,
  reloadTrigger: PropTypes.number,
  reloadPageTrigger: PropTypes.number,
  onLoad: PropTypes.func
}

export default Paginator;
