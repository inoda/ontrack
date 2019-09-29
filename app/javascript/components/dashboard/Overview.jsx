import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'

class Overview extends React.Component {
  totalSpend() {
    return this.props.categoriesWithExpensesAndSpend.reduce((sum, cat) => sum + cat.spend, 0);
  }

  hasCategoryWithNoGoal() {
    for (let cat of this.props.categoriesWithExpensesAndSpend) {
      if (!cat.annual_goal) { return true; }
    }
    return false;
  }

  totalMonthlyGoal() {
    if (this.hasCategoryWithNoGoal()) { return this.totalSpend(); }
    return this.props.categoriesWithExpensesAndSpend.reduce((sum, cat) => sum + (cat.annual_goal / 12), 0);
  }

  percentages() {
    return this.props.categoriesWithExpensesAndSpend.map((category) => {
      return { percentage: category.spend / this.totalMonthlyGoal() * 100, color: category.color }
    })
  }

  goalComparisonDisplay() {
    if (this.hasCategoryWithNoGoal()) {
      return <a href="#">Finish setting goals</a>
    } else {
      const diff = this.totalMonthlyGoal() - this.totalSpend();
      return (diff >= 0) ? <b>{Numerics.centsToDollars(diff)} remaining</b> : <b>{Numerics.centsToDollars(Math.abs(diff))} over}</b>;
    }
  }

  render() {
    return (
      <div>
        <div>
          {moment().format('MMMM')}

          <div className="flex flex-space-between flex-baseline">
            <div><h1>{Numerics.centsToDollars(this.totalSpend())}</h1></div>
            {this.goalComparisonDisplay()}
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
