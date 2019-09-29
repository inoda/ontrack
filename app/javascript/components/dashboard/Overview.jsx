import React from 'react'
import PropTypes from 'prop-types'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'

class Overview extends React.Component {
  percentages() {
    return this.props.categoriesWithExpensesAndSpend.map((category) => {
      return { percentage: 10, color: category.color }
    })
  }

  render() {
    return (
      <div>
        <div>
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
  categoriesWithExpensesAndSpend: []
}

Overview.propTypes = {
  categoriesWithExpensesAndSpend: PropTypes.array
}

export default Overview;
