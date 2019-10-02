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
      return <span className="text-small text-muted">Finish setting goals to see progress</span>
    } else {
      const diff = this.totalMonthlyGoal() - this.totalSpend();
      return (diff >= 0) ? <b className="text-muted">{Numerics.centsToDollars(diff)} remaining</b> : <b>{Numerics.centsToDollars(Math.abs(diff))} over}</b>;
    }
  }

  render() {
    return (
      <div>
        <div>
          <div className="mb-10">{moment().format('MMMM')}</div>

          <div className="flex row-flex flex-space-between flex-baseline mb-10">
            <div><h1>{Numerics.centsToDollars(this.totalSpend())}</h1></div>
            <div>{this.goalComparisonDisplay()}</div>
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
