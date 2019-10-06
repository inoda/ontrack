import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Paginator from '../shared/Paginator'
import { Expenses } from '../../api/main'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: [],
      total: 1,
    };
  }

  onLoad = (payload) => {
    this.setState({ expenses: payload.items, total: payload.total });
  }

  renderEmptyState() {
    if (this.state.total > 0) { return '' }
    return (
      <div className="text-center">
        <h3 className="text-muted">Expenses will show up here!</h3>
        <img className="mt-50" src="/assets/money-balance.jpg" />
      </div>
    )
  }

  renderExpense(expense) {
    return <div key={expense.id}>{expense.amount}</div>;
  }

  render() {
    return (
      <div className="container">
        {this.renderEmptyState()}
        {this.state.expenses.map((exp) => { return this.renderExpense(exp) })}
        <Paginator url="/expenses?include_category=true" onLoad={this.onLoad} />
      </div>
    );
  }
}

export default Main;
