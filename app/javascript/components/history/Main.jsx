import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Paginator from '../shared/Paginator'
import DatePicker from '../shared/DatePicker'
import { Alerts } from '../../helpers/main'
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
      reloadTrigger: 0,
    };
  }

  onLoad = (payload) => {
    this.setState({ expenses: payload.items, total: payload.total });
  }
  handlePaidAtMinChange = (val) => {
    this.setState({ minPaidAt: moment(val).unix() });
  }
  handlePaidAtMaxChange = (val) => {
    this.setState({ maxPaidAt: moment(val).unix() });
  }
  handleExpenseDelete = (id) => {
    Alerts.genericDelete('expense').then((result) => {
      if (!result.value) { return; }
      Expenses.delete(id).then(
        () => { this.setState({ reloadTrigger: this.state.reloadTrigger + 1 }); },
        (error) => { Alerts.genericError(); },
      )
    })
  }

  renderEmptyState() {
    if (this.props.hasData) { return '' }
    return (
      <div className="flex row-flex flex-space-between text-center-sm">
        <div className="status-text">
          <h2>Oops, our historian has nothing to do!</h2>
          <div className="mt-20">As you start tracking your expenses they will show here.</div>
        </div>
        <img className="mt-50 status-image" src={window.historian} />
      </div>
    )
  }

  renderTable() {
    if (!this.props.hasData) { return '' }
    return (
      <div>
        <div className="flex row-flex flex-space-between">
          <b>Expense History</b>
          <div className="input-group inline small-datepicker">
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.expenses.map((exp) => { return this.renderExpense(exp) })}
            </tbody>
          </table>
        </div>

        <div className="mt-20">
          <Paginator url={`/expenses?include_category=true&paid_before=${this.state.maxPaidAt}&paid_after=${this.state.minPaidAt}`} onLoad={this.onLoad} reloadTrigger={this.state.reloadTrigger} />
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
        <td><a onClick={() => this.handleExpenseDelete(expense.id)}><i className="fa fa-times"></i></a></td>
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

Main.defaultProps = {
  hasData: false,
}

Main.propTypes = {
  hasData: PropTypes.bool,
}

export default Main;
