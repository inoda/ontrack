import React from 'react'
import PropTypes from 'prop-types'

class Overview extends React.Component {
  render() {
    return (
      <div>
        <ul className="flex">
          <li><a href="#">By Week</a></li>
          <li className="ml-40"><a href="#">By Month</a></li>
          <li className="ml-40"><a href="#">By Year</a></li>
        </ul>

        <div className="border p-15">
          September
        </div>
      </div>
    );
  }
}

Overview.defaultProps = {
  name: 'David'
}

Overview.propTypes = {
  name: PropTypes.string
}

export default Overview;
