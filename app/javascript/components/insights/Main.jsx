import React from 'react'
import PropTypes from 'prop-types'
import Year from './Year';
import Month from './Month';

class Main extends React.Component {
  render() {
    if (!this.props.hasData) {
      return (
        <div className="container text-center">
          <h3>No data available!</h3>
          <p>Add expenses to start seeing reports here.</p>
        </div>
      );
    }

    return (
      <div>
        <div className="container">
          <Year availableYears={this.props.availableYears} />
        </div>
        <div className="bg-gray mt-100">
          <div className="container pv-100">
            <Month availableMonths={this.props.availableMonths} />
          </div>
        </div>
      </div>
    );
  }
}

Main.defaultProps = {
  availableYears: [],
  availableMonths: [],
  hasData: false,
}

Main.propTypes = {
  availableYears: PropTypes.array,
  availableMonths: PropTypes.array,
  hasData: PropTypes.bool
}

export default Main;
