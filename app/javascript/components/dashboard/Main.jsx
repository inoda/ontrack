import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Overview from './Overview'
import CategoriesList from './CategoriesList'
import { Categories, Expenses } from '../../api/main'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      categories: [],
      expenses: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ loaded: false });
    Categories.list().then(
      (resp) => {
        this.setState({ categories: resp });
        Expenses.list({ paid_after: moment().startOf('month').unix() }).then(
          (resp) => { this.setState({ expenses: resp, loaded: true }); },
          (error) => { console.log(error); },
        )
      },
      (error) => { console.log(error); },
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

  render() {
    if (!this.state.loaded) { return <div></div>; }

    return (
      <div>
        <div className="container">
          <Overview categoriesWithExpensesAndSpend={this.categoriesWithExpensesAndSpend()} />
        </div>

        <div className="bg-art mt-100">
          <div className="container">
            <button className="btn btn-round btn-dark pos-abs mt-neg-20">+ add an expense</button>
          </div>
          <div className="container pv-100">
            <CategoriesList categoriesWithExpensesAndSpend={this.categoriesWithExpensesAndSpend()} />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
