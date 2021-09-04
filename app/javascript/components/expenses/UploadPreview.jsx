import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from '../shared/DatePicker';
import CurrencyInput from '../shared/CurrencyInput';
import { Expenses } from '../../api/main';
import { Alerts } from '../../helpers/main';

class UploadPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: props.expenses,
      submitting: false,
    };
  }

  handleExpenseDelete = (idx) => {
    const modifiedExpenses = [...this.state.expenses]; // Make a copy
    modifiedExpenses.splice(idx, 1);
    this.setState({ expenses: modifiedExpenses });
  }

  updateExpense = (idx, updates) => {
    const modifiedExpenses = [...this.state.expenses]; // Make a copy
    const modifiedExpense = Object.assign({ ...modifiedExpenses[idx] }, updates);
    modifiedExpenses[idx] = modifiedExpense;
    this.setState({ expenses: modifiedExpenses });
  }

  renderEmptyState() {
    if (this.props.expenses.length) { return ''; }
    return (
      <div className="empty-or-error-status mt-30">
        <div className="status-text">
          <h2>Nothing to import!</h2>
          <div>There are no expenses to import from your CSV.</div>
          <div className="mt-10">
            <a href="/expense_uploads/new" className="btn btn-dark">Go back</a>
          </div>
        </div>
        <img className="status-image" src={window.historian} />
      </div>
    );
  }

  cancel() {
    window.location = '/expense_uploads/new';
  }

  submit = () => {
    this.setState({ submitting: true });

    Expenses.bulkCreate({ expenses: this.state.expenses }).then(
      () => {
        this.setState({ submitting: false });
        Alerts.success('Your import was successful.', () => { window.location = '/expenses'; });
      },
      () => {
        this.setState({ submitting: false });
        Alerts.error('Something went wrong! Double check that your inputs are all valid.');
      },
    );
  }

  renderExpense(expense, idx) {
    return (
      <tr key={`${expense.paid_at}-${expense.amount}-${expense.description}-${idx}`}>
        <td className="input-group mw-150">
          <DatePicker onChange={(val) => this.updateExpense(idx, { paid_at: val })} value={new Date(expense.paid_at)} className="bg-gray-slight-contrast" />
        </td>

        <td className="input-group mw-200">
          <select defaultValue={expense.category_id} onChange={(e) => this.updateExpense(idx, { category_id: e.target.value })} className="bg-gray-slight-contrast">
            {this.props.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </td>

        <td className="input-group mw-100">
          <CurrencyInput
            initialValue={expense.amount}
            onBlur={(val) => this.updateExpense(idx, { amount: val })}
            allowNegative
            className="bg-gray-slight-contrast"
          />
        </td>

        <td className="input-group mw-300">
          <input defaultValue={expense.description} onBlur={(e) => { if (e.target.value.trim() != expense.description) { this.updateExpense(idx, { description: e.target.value.trim() }); } } } className="bg-gray-slight-contrast" />
        </td>

        <td>
          <a onClick={() => this.handleExpenseDelete(idx)} className="dim-til-hover"><i className="fa fa-times" /></a>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <div className="container pb-100">
        {this.renderEmptyState()}

        {this.props.expenses.length > 0 && (
          <>
            <h1>Review import ({this.state.expenses.length} items)</h1>
            <div>
              <div className="mt-30 mb-10">
                <em className="text-muted">Make any changes you want before submitting at the bottom of the page.</em>
              </div>
              <div className="overflow-x bg-gray p-10">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.expenses.map((exp, idx) => this.renderExpense(exp, idx))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-dark"
                onClick={this.submit}
                disabled={this.state.submitting}
              >
                {this.state.submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="btn" onClick={this.cancel}>Cancel</button>
            </div>
          </>
        )}
      </div>
    );
  }
}

UploadPreview.defaultProps = {
  categories: [],
  expenses: [],
};

UploadPreview.propTypes = {
  categories: PropTypes.array,
  expenses: PropTypes.array,
};

export default UploadPreview;
