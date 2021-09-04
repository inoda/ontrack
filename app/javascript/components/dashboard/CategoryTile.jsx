import React from 'react';
import PropTypes from 'prop-types';
import { Numerics } from '../../helpers/main';
import CategoryFormModal from '../categories/FormModal';

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
  onExpenseSave = () => {
    this.closeExpenseCreate();
    this.props.onChange();
  }

  goalDiff() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 0; }
    return this.props.categoryWithExpensesAndSpend.monthly_goal - this.props.categoryWithExpensesAndSpend.spend;
  }

  goalComparisonDisplay() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 'No goal set'; }

    const diff = this.goalDiff();
    return (diff >= 0) ? `${Numerics.centsToDollars(diff)} remaining` : `${Numerics.centsToDollars(Math.abs(diff))} over`;
  }

  normalizedPercentage() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 0; }
    return Math.min(100, this.props.categoryWithExpensesAndSpend.spend / this.props.categoryWithExpensesAndSpend.monthly_goal * 100);
  }

  renderCategoryEditModal() {
    if (!this.state.showCategoryEditModal) { return ''; }
    return (
      <CategoryFormModal
        onClose={this.closeCategoryEdit}
        onSave={this.onCategorySave}
        category={this.props.categoryWithExpensesAndSpend}
        colorsToSkip={this.props.colorsToSkip}
      />
    );
  }

  render() {
    const category = this.props.categoryWithExpensesAndSpend;
    return (
      <>
        <div
          className="category-tile flex flex-space-between tint-on-hover hover-pointer"
          style={{ borderColor: category.color }}
          onClick={this.openCategoryEdit}
        >
          <h3>{category.name}</h3>

          <div className="text-right">
            <h2 className={category.spend > 0 ? '' : 'text-muted'}>{Numerics.centsToDollars(category.spend)}</h2>
            <div className={this.goalDiff() < 0 ? 'text-warning' : 'text-muted'}>
              {this.goalDiff() < 0 && (
                <i className="fas fa-exclamation-circle mr-4" />
              )}
              {this.goalComparisonDisplay()}
            </div>
          </div>
        </div>
        {this.renderCategoryEditModal()}
      </>
    );
  }
}

CategoryTile.defaultProps = {
  categoryWithExpensesAndSpend: {},
  colorsToSkip: [],
};

CategoryTile.propTypes = {
  categoryWithExpensesAndSpend: PropTypes.object,
  colorsToSkip: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default CategoryTile;
