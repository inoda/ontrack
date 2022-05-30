import React from 'react';
import moment from 'moment';
import Overview from './Overview';
import CategoriesList from './CategoriesList';
import ExpenseFormModal from '../expenses/FormModal';
import Chart from './Chart';
import { Categories, Expenses, Goals } from '../../api/main';
import { Alerts } from '../../helpers/main';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      expenses: [],
      loaded: false,
      monthlyGoal: 0,
      showExpenseCreateModal: false,
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
      (cResp) => {
        this.setState({ categories: cResp });
        Expenses.list({ paid_after: moment().startOf('month').unix() }).then(
          (eResp) => {
            this.setState({ expenses: eResp });
            Goals.list().then(
              (gResp) => { this.setState({ loaded: true, monthlyGoal: gResp.monthly }); },
              () => { Alerts.genericError(); },
            );
          },
          () => { Alerts.genericError(); },
        );
      },
      () => { Alerts.genericError(); },
    );
  }

  categoriesWithExpensesAndSpend() {
    const categories = [];
    this.state.categories.forEach((category) => {
      category.expenses = this.state.expenses.filter((expense) => expense.category_id == category.id);
      category.spend = category.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      categories.push(category);
    });
    return categories;
  }

  renderExpenseCreateModal() {
    if (!this.state.showExpenseCreateModal) { return ''; }
    return <ExpenseFormModal categories={this.state.categories} onClose={this.closeExpenseCreate} onSave={this.onExpenseSave} />;
  }

  render() {
    if (!this.state.loaded) { return ''; }

    return (
      <div>
        {this.renderExpenseCreateModal()}

        <div className="container">
          <Overview categoriesWithExpensesAndSpend={this.categoriesWithExpensesAndSpend()} monthlyGoal={this.state.monthlyGoal} onChange={this.loadData} />
        </div>

        <div className="container mt-100">
          <Chart month={moment().format('MMMM YYYY')} />
        </div>

        <div className="bg-art mt-150">
          <div className="container">
            <button className="btn btn-round btn-dark pos-abs mt-neg-20 z-5" onClick={this.openExpenseCreate}>+ add an expense</button>
          </div>
          <div className="container pv-100 mh-350">
            <CategoriesList categoriesWithExpensesAndSpend={this.categoriesWithExpensesAndSpend()} onChange={this.loadData} />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
