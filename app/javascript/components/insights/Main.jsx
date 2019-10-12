import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Categories, Expenses, Goals } from '../../api/main'
import { Alerts } from '../../helpers/main'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({ loaded: true });
  }

  render() {
    if (!this.state.loaded) { return ''; }

    return (
      <div className="pt-100 container">
        hello
      </div>
    );
  }
}

export default Main;
