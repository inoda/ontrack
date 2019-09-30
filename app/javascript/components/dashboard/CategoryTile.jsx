import React from 'react'
import PropTypes from 'prop-types'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'
import CategoryFormModal from '../categories/FormModal'

class CategoryTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCategoryEditModal: false };
  }

  openCategoryEdit = () => { this.setState({ showCategoryEditModal: true }); }
  closeCategoryEdit = () => { this.setState({ showCategoryEditModal: false }); }
  onCategorySave = () => {
    this.closeCategoryEdit();
    this.props.onChange();
  }

  monthlyGoal() {
    return this.props.categoryWithExpensesAndSpend.annual_goal / 12;
  }

  goalComparisonDisplay() {
    if (!this.props.categoryWithExpensesAndSpend.annual_goal) { return 'No goal set'; }
    const diff = this.monthlyGoal() - this.props.categoryWithExpensesAndSpend.spend;
    return (diff >= 0) ? `${Numerics.centsToDollars(diff)} remaining` : `${Numerics.centsToDollars(Math.abs(diff))} over`;
  }

  normalizedPercentage() {
    if (!this.props.categoryWithExpensesAndSpend.annual_goal) { return 0; }
    return Math.min(100, this.props.categoryWithExpensesAndSpend.spend / this.monthlyGoal() * 100);
  }

  renderCategoryEditModal() {
    if (!this.state.showCategoryEditModal) { return '' }
    return <CategoryFormModal onClose={this.closeCategoryEdit} onSave={this.onCategorySave} category={this.props.categoryWithExpensesAndSpend} />;
  }

  render() {
    return (
      <div className="category-tile" style={{ borderColor: this.props.categoryWithExpensesAndSpend.color }}>
        {this.renderCategoryEditModal()}
        <div className="flex flex-space-between">
          <div>
            <b>{this.props.categoryWithExpensesAndSpend.name}</b> <a onClick={this.openCategoryEdit}><i className="fa fa-edit ml-2"></i></a>
            <div className="text-muted">{this.goalComparisonDisplay()}</div>
          </div>

          <h2>{Numerics.centsToDollars(this.props.categoryWithExpensesAndSpend.spend)}</h2>
        </div>

        <Progress data={[{ percentage: this.normalizedPercentage() }]} small={true} />
      </div>
    );
  }
}

CategoryTile.defaultProps = {
  categoryWithExpensesAndSpend: {}
}

CategoryTile.propTypes = {
  categoryWithExpensesAndSpend: PropTypes.object,
  onChange: PropTypes.func
}

export default CategoryTile;
