import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Paginator from '../shared/Paginator'
import DatePicker from '../shared/DatePicker'
import { Expenses } from '../../api/main'
import { Numerics } from '../../helpers/main'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: [],
      minPaidAt: moment().subtract(365, 'd').unix(),
      maxPaidAt: moment().unix(),
      total: 1,
    };
  }

  handlePaidAtMinChange = (val) => {
    this.setState({ minPaidAt: moment(val).unix() });
  }
  handlePaidAtMaxChange = (val) => {
    this.setState({ maxPaidAt: moment(val).unix() });
  }
  onLoad = (payload) => {
    this.setState({ expenses: payload.items, total: payload.total });
  }

  renderEmptyState() {
    if (this.props.hasData) { return '' }
    return (
      <div className="flex row-flex flex-space-between text-center-sm">
        <div className="empty-text">
          <h2>Oops, our historian has nothing to show!</h2>
          <div className="mt-20">As you start tracking your expenses they will show here.</div>
        </div>
        <img className="mt-50 historian" src={window.historian} />
      </div>
    )
  }

  renderTable() {
    if (!this.props.hasData) { return '' }
    return (
      <div>
        <div className="flex row-flex flex-space-between">
          <h2 className="mb-10">Expense History</h2>
          <div className="input-group inline mb-10 small-datepicker">
            <DatePicker onChange={this.handlePaidAtMinChange} value={moment.unix(this.state.minPaidAt).toDate()} />
            <span className="mh-5 mt-5">-</span>
            <DatePicker onChange={this.handlePaidAtMaxChange} value={moment.unix(this.state.maxPaidAt).toDate()} />
          </div>
        </div>
        <div className="overflow-x mt-50">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {this.state.expenses.map((exp) => { return this.renderExpense(exp) })}
            </tbody>
          </table>
        </div>

        <div className="mt-20">
          <Paginator url={`/expenses?include_category=true&paid_before=${this.state.maxPaidAt}&paid_after=${this.state.minPaidAt}`} onLoad={this.onLoad} />
        </div>
      </div>
    )
  }

  renderExpense(expense) {
    return (
      <tr key={expense.id}>
        <td>{Numerics.timestamp(expense.paid_at)}</td>
        <td>{expense.category.name}</td>
        <td>{Numerics.centsToDollars(expense.amount)}</td>
        <td>{expense.description}</td>
      </tr>
    )
  }

  render() {
    return (
      <div className="container">
        {this.renderEmptyState()}
        {this.renderTable()}
      </div>
    );
  }
}

export default Main;
