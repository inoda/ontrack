import React from 'react'
import PropTypes from 'prop-types'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'

class CategoryTile extends React.Component {
  monthlyGoal() {
    return this.props.categoryWithExpensesAndSpend.annual_goal / 12;
  }

  goalComparisonDisplay() {
    if (!this.props.categoryWithExpensesAndSpend.annual_goal) { return 'No goal set'; }
    const diff = this.monthlyGoal() - this.props.categoryWithExpensesAndSpend.spend;
    return (diff >= 0) ? `${Numerics.centsToDollars(diff)} remaining` : `${Numerics.centsToDollars(Math.abs(diff))} over`;
  }

  normalizedPercentage() {
    if (!this.props.categoryWithExpensesAndSpend.annual_goal) { return 0; }
    return Math.min(100, this.props.categoryWithExpensesAndSpend.spend / this.monthlyGoal() * 100);
  }

  progressBar() {
    return <Progress data={[{ percentage: this.normalizedPercentage() }]} small={true} />
  }

  render() {
    return (
      <div className="category-tile" style={{ borderColor: this.props.categoryWithExpensesAndSpend.color }}>
        <div className="flex flex-space-between">
          <div>
            <b>{this.props.categoryWithExpensesAndSpend.name}</b>
            <div className="text-muted">{this.goalComparisonDisplay()}</div>
          </div>

          <h2>{Numerics.centsToDollars(this.props.categoryWithExpensesAndSpend.spend)}</h2>
        </div>

        {this.progressBar()}
      </div>
    );
  }
}

CategoryTile.defaultProps = {
  categoryWithExpensesAndSpend: []
}

CategoryTile.propTypes = {
  categoryWithExpensesAndSpend: PropTypes.object
}

export default CategoryTile;
