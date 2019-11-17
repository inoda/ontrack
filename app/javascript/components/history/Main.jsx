import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Paginator from '../shared/Paginator'
import DatePicker from '../shared/DatePicker'
import CurrencyInput from '../shared/CurrencyInput'
import { Alerts } from '../../helpers/main'
import { Expenses } from '../../api/main'
import { Numerics } from '../../helpers/main'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: [],
      minPaidAt: this.props.paidAfter || moment().subtract(365, 'd').unix(),
      maxPaidAt: moment().unix(),
      categoryId: this.props.categoryId || '',
      sort: 'paid_at',
      sortDesc: true,
      total: 1,
      reloadTrigger: 0,
      reloadPageTrigger: 0,
    };
  }

  onLoad = (payload) => { this.setState({ expenses: payload.items, total: payload.total }); }
  handlePaidAtMinChange = (val) => { this.setState({ minPaidAt: moment(val).unix() }); }
  handlePaidAtMaxChange = (val) => { this.setState({ maxPaidAt: moment(val).unix() }); }
  handleCategoryFilterChange = (e) => { this.setState({ categoryId: e.target.value }); }
  toggleSortDir = (e) => { this.setState({ sortDesc: !this.state.sortDesc }) }
  changeSort = (s) => { this.setState({ sort: s, sortDesc: true }) }
  updateExpense = (id, updates) => {
    Expenses.update(id, updates).then(
      () => { this.setState({ reloadPageTrigger: this.state.reloadPageTrigger + 1 }); },
      (error) => { Alerts.genericError(); },
    )
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

  url() {
    return `/expenses?include_category=true&paid_before=${this.state.maxPaidAt}&paid_after=${this.state.minPaidAt}&category_id=${this.state.categoryId}&sort=${this.state.sort}&sort_desc=${this.state.sortDesc}`;
  }

  renderSort(key) {
    if (this.state.sort == key) {
      return <i onClick={this.toggleSortDir} className={`fas fa-sort-${this.state.sortDesc ? 'down' : 'up'} ml-2 hover-pointer`}></i>;
    } else {
      return <i onClick={() => { this.changeSort(key) }} className="fas fa-sort ml-2 hover-pointer"></i>;
    }
  }

  renderEmptyState() {
    if (this.props.hasData) { return '' }
    return (
      <div className="empty-or-error-status">
        <div className="status-text">
          <h2>Our historian has nothing to do!</h2>
          <div>The expenses you enter will show up here.</div>
        </div>
        <img className="status-image" src={window.historian} />
      </div>
    )
  }

  renderTable() {
    if (!this.props.hasData) { return '' }
    return (
      <div>
        <div className="flex row-flex flex-space-between">
          <b className="mt-10">Expense History</b>
          <div className="input-group inline small-datepicker mt-10-sm">
            <select className="mr-10 w-auto mt-10" onChange={this.handleCategoryFilterChange} defaultValue={this.state.categoryId}>
              <option value="">All categories</option>
              {this.props.categories.map((c) => { return <option key={c.id} value={c.id}>{c.name}</option> })}
            </select>

            <div className="mt-10">
              <DatePicker onChange={this.handlePaidAtMinChange} value={moment.unix(this.state.minPaidAt).toDate()} />
              <span className="mh-5 mt-5">-</span>
              <DatePicker onChange={this.handlePaidAtMaxChange} value={moment.unix(this.state.maxPaidAt).toDate()} />
            </div>
          </div>
        </div>
        <div className="overflow-x mt-30 bg-gray p-10">
          <table className="table">
            <thead>
              <tr>
                <th>Date {this.renderSort('paid_at')}</th>
                <th>Category</th>
                <th>Amount {this.renderSort('amount')}</th>
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
          <Paginator
            url={this.url()}
            onLoad={this.onLoad}
            reloadTrigger={this.state.reloadTrigger}
            reloadPageTrigger={this.state.reloadPageTrigger}
          />
        </div>
      </div>
    )
  }

  renderExpense(expense) {
    return (
      <tr key={expense.id}>
        <td className="input-group mw-150">
          <DatePicker onChange={(val) => this.updateExpense(expense.id, { paid_at: val })} value={new Date(expense.paid_at)} className="bg-gray-slight-contrast" />
        </td>

        <td className="input-group mw-100">
          <select defaultValue={expense.category_id} onChange={(e) => this.updateExpense(expense.id, { category_id: e.target.value })} className="bg-gray-slight-contrast">
            {this.props.categories.map((c) => { return <option key={c.id} value={c.id}>{c.name}</option> })}
          </select>
        </td>

        <td className="input-group mw-200">
          <CurrencyInput initialValue={expense.amount} onBlur={(val) => this.updateExpense(expense.id, { amount: val })} allowNegative={true} className="bg-gray-slight-contrast" />
        </td>

        <td className="input-group mw-300">
          <input defaultValue={expense.description} onBlur={(e) => { if (e.target.value.trim() != expense.description) this.updateExpense(expense.id, { description: e.target.value.trim() }) } } className="bg-gray-slight-contrast"></input>
        </td>

        <td>
          <a onClick={() => this.handleExpenseDelete(expense.id)} className="dim-til-hover"><i className="fa fa-times"></i></a>
        </td>
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
  categories: [],
}

Main.propTypes = {
  hasData: PropTypes.bool,
  categories: PropTypes.array,
  categoryId: PropTypes.any,
  paidAfter: PropTypes.any,
}

export default Main;
