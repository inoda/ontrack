import React from 'react'
import PropTypes from 'prop-types'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'

class Breakdown extends React.Component {
  renderCategory(category, idx) {
    return (
      <div key={idx} className="category-tile" style={{ borderColor: category.color }}>
        <div className="flex flex-space-between">
          <div>
            <b>{category.name}</b>
            <div className="text-muted">$100 remaining</div>
          </div>

          <h2>{Numerics.centsToDollars(category.annual_goal)}</h2>
        </div>

        <Progress data={[{ percentage: 45 }]} small={true} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.categories.map((value, idx) => { return this.renderCategory(value, idx) })}
      </div>
    );
  }
}

Breakdown.defaultProps = {
  categories: []
}

Breakdown.propTypes = {
  categories: PropTypes.array
}

export default Breakdown;
