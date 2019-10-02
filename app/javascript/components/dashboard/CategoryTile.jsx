import React from 'react'
import PropTypes from 'prop-types'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'
import CategoryFormModal from '../categories/FormModal'
import ExpenseFormModal from '../expenses/FormModal'

class CategoryTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCategoryEditModal: false, showExpenseCreateModal: false };
  }

  openCategoryEdit = () => { this.setState({ showCategoryEditModal: true }); }
  closeCategoryEdit = () => { this.setState({ showCategoryEditModal: false }); }
  openExpenseCreate = () => { this.setState({ showExpenseCreateModal: true }); }
  closeExpenseCreate = () => { this.setState({ showExpenseCreateModal: false }); }
  onCategorySave = () => {
    this.closeCategoryEdit();
    this.props.onChange();
  }
  onExpenseSave = () => {
    this.closeExpenseCreate();
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
    return <CategoryFormModal onClose={this.closeCategoryEdit} onSave={this.onCategorySave} category={this.props.categoryWithExpensesAndSpend} colorsToSkip={this.props.colorsToSkip} />;
  }

  renderExpenseCreateModal() {
    if (!this.state.showExpenseCreateModal) { return '' }
    return <ExpenseFormModal onClose={this.closeExpenseCreate} onSave={this.onExpenseSave} categories={this.props.expenseCategoryOptions} categoryId={this.props.categoryWithExpensesAndSpend.id} />;
  }

  render() {
    return (
      <div className="category-tile" style={{ borderColor: this.props.categoryWithExpensesAndSpend.color }}>
        {this.renderCategoryEditModal()}
        {this.renderExpenseCreateModal()}
        <div className="flex flex-space-between">
          <div>
            <b>{this.props.categoryWithExpensesAndSpend.name}</b> <a onClick={this.openCategoryEdit}><i className="fa fa-edit ml-2"></i></a>
            <div className="text-muted">{this.goalComparisonDisplay()}</div>
          </div>

          <h2>{Numerics.centsToDollars(this.props.categoryWithExpensesAndSpend.spend)}</h2>
        </div>

        <Progress data={[{ percentage: this.normalizedPercentage() }]} small={true} />

        <div className='add-expense'>
          <i className="fa fa-receipt" onClick={this.openExpenseCreate}></i>
        </div>
      </div>
    );
  }
}

CategoryTile.defaultProps = {
  categoryWithExpensesAndSpend: {},
  expenseCategoryOptions: [],
  colorsToSkip: []
}

CategoryTile.propTypes = {
  categoryWithExpensesAndSpend: PropTypes.object,
  expenseCategoryOptions: PropTypes.array,
  colorsToSkip: PropTypes.array,
  onChange: PropTypes.func
}

export default CategoryTile;
