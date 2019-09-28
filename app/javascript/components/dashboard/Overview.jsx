import React from 'react'
import PropTypes from 'prop-types'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'

class Overview extends React.Component {
  percentages() {
    return this.props.categories.map((category) => {
      return { percentage: 10, color: category.color }
    })
  }

  render() {
    return (
      <div>
        <ul className="flex">
          <li><a href="#">By Week</a></li>
          <li className="ml-40"><a href="#">By Month</a></li>
          <li className="ml-40"><a href="#">By Year</a></li>
        </ul>

        <div className="border p-25 br-5">
          September

          <div className="flex flex-space-between flex-baseline">
            <div><h1>{Numerics.centsToDollars(123412)}</h1></div>
            <b>{Numerics.centsToDollars(3123)} remaining</b>
          </div>

          <Progress data={this.percentages()} />
        </div>
      </div>
    );
  }
}

Overview.defaultProps = {
  categories: []
}

Overview.propTypes = {
  categories: PropTypes.array
}

export default Overview;
