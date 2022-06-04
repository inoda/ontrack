import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Numerics } from '../../helpers/main';
import Progress from '../shared/Progress';
import GoalFormModal from '../goals/FormModal';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showGoalModal: false };
  }

  openGoal = () => { this.setState({ showGoalModal: true }); }
  closeGoal = () => { this.setState({ showGoalModal: false }); }
  onGoalSave = () => {
    this.closeGoal();
    this.props.onChange();
  }

  goalDiff() {
    if (!this.props.monthlyGoal) { return 0; }
    return this.props.monthlyGoal - this.totalSpend();
  }

  totalSpend() {
    return this.props.categoriesWithExpensesAndSpend.reduce((sum, cat) => sum + cat.spend, 0);
  }

  percentages() {
    const outOf = Math.max(this.props.monthlyGoal, this.totalSpend());
    return this.props.categoriesWithExpensesAndSpend.map((category) => ({ percentage: (category.spend / outOf) * 100, color: category.color }));
  }

  goalComparisonDisplay() {
    const diff = this.goalDiff();
    return (diff >= 0) ? `${Numerics.centsToDollars(diff)} remaining` : `${Numerics.centsToDollars(Math.abs(diff))} over`;
  }

  renderGoalModal() {
    if (!this.state.showGoalModal) { return ''; }
    return <GoalFormModal onClose={this.closeGoal} onSave={this.onGoalSave} goals={{ monthly: this.props.monthlyGoal }} />;
  }

  render() {
    const today = moment();
    const daysLeftInMonth = moment().endOf('month').diff(today, 'days');

    return (
      <div>
        <div className="mb-10">{today.format('MMMM')} ({daysLeftInMonth} days left)</div>

        <div className="flex row-flex flex-space-between flex-baseline mb-10">
          <div><h1>{Numerics.centsToDollars(this.totalSpend())}</h1></div>
          {!this.props.monthlyGoal && (
            <a href={null} onClick={this.openGoal} className="dim-til-hover">Set a monthly goal</a>
          )}
          {!!this.props.monthlyGoal && (
            <div className="flex flex-baseline">
              <div className={this.goalDiff() < 0 ? 'text-warning mr-4' : 'text-muted mr-4'}>
                {this.goalDiff() < 0 && (
                  <i className="fas fa-exclamation-circle mr-4" />
                )}
                {this.goalComparisonDisplay()}
              </div>
              <i className="far fa-edit dim-til-hover hover-pointer text-muted" onClick={this.openGoal} />
            </div>
          )}
        </div>

        <Progress data={this.percentages()} />
      </div>
    );
  }
}

Overview.defaultProps = {
  categoriesWithExpensesAndSpend: [],
  monthlyGoal: 0,
};

Overview.propTypes = {
  categoriesWithExpensesAndSpend: PropTypes.array,
  monthlyGoal: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default Overview;
