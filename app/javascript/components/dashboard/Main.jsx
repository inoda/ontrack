import React from 'react'
import PropTypes from 'prop-types'
import Overview from './Overview'
import Breakdown from './Breakdown'
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
    Categories.list().then(
      (resp) => { this.setState({ categories: resp }) },
      (error) => { console.log(error); },
    )

    Expenses.list().then(
      (resp) => { this.setState({ expenses: resp }); console.log(this.state.expenses) },
      (error) => { console.log(error); },
    )
  }

  render() {
    return (
      <div>
        <div className="container">
          <Overview categories={this.state.categories} />
        </div>

        <div className="bg-art mt-100">
          <div className="container pv-100">
            <Breakdown categories={this.state.categories} />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
