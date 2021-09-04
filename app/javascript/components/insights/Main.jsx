import React from 'react';
import PropTypes from 'prop-types';
import Year from './Year';
import Month from './Month';

const Main = ({ hasData, availableYears, availableMonths }) => {
  if (!hasData) {
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
        <Year availableYears={availableYears} />
      </div>
      <div className="bg-gray mt-100">
        <div className="container pv-100">
          <Month availableMonths={availableMonths} />
        </div>
      </div>
    </div>
  );
};

Main.propTypes = {
  availableYears: PropTypes.array.isRequired,
  availableMonths: PropTypes.array.isRequired,
  hasData: PropTypes.bool.isRequired,
};

export default Main;
