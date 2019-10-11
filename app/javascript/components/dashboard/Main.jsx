import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Overview from './Overview'
import CategoriesList from './CategoriesList'
import ExpenseFormModal from '../expenses/FormModal'
import { Categories, Expenses, Goals } from '../../api/main'
import { Alerts } from '../../helpers/main'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExpenseCreateModal: false,
      loaded: false,
      categories: [],
      expenses: [],
      monthlyGoal: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  openExpenseCreate = () => { this.setState({ showExpenseCreateModal: true }); }
  closeExpenseCreate = () => { this.setState({ showExpenseCreateModal: false }); }
  onExpenseSave = () => {
    this.closeExpenseCreate();
    this.loadData();
  }

  loadData = () => {
    Categories.list().then(
      (resp) => {
        this.setState({ categories: resp });
        Expenses.list({ paid_after: moment().startOf('month').unix() }).then(
          (resp) => {
            this.setState({ expenses: resp });
            Goals.list().then(
              (resp) => { this.setState({ monthlyGoal: resp.monthly, loaded: true }); },
              (error) => { Alerts.genericError(); },
            )
          },
          (error) => { Alerts.genericError(); },
        )
      },
      (error) => { Alerts.genericError(); },
    )
  }

  categoriesWithExpensesAndSpend() {
    let categories = [];
    this.state.categories.forEach((category) => {
      category.expenses = this.state.expenses.filter((expense) => expense.category_id == category.id);
      category.spend = category.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      categories.push(category);
    });
    return categories;
  }

  renderExpenseCreateModal() {
    if (!this.state.showExpenseCreateModal) { return '' }
    return <ExpenseFormModal onClose={this.closeExpenseCreate} onSave={this.onExpenseSave} categories={this.state.categories} />;
  }

  render() {
    if (!this.state.loaded) { return ''; }

    return (
      <div className="pt-100">
        {this.renderExpenseCreateModal()}

        <div className="container">
          <Overview categoriesWithExpensesAndSpend={this.categoriesWithExpensesAndSpend()} monthlyGoal={this.state.monthlyGoal} onChange={this.loadData} />
        </div>

        <div className="bg-art mt-100">
          <div className="container">
            <button className="btn btn-round btn-dark pos-abs mt-neg-20 z-5" onClick={this.openExpenseCreate}>+ add an expense</button>
          </div>
          <div className="container pv-100">
            <CategoriesList categoriesWithExpensesAndSpend={this.categoriesWithExpensesAndSpend()} onChange={this.loadData} />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
