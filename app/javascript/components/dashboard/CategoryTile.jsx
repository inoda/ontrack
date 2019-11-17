import React from 'react'
import PropTypes from 'prop-types'
import { Numerics } from '../../helpers/main'
import Progress from '../shared/Progress'
import CategoryFormModal from '../categories/FormModal'
import ExpenseFormModal from '../expenses/FormModal'
import moment from 'moment'

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

  goalComparisonDisplay() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 'No goal set'; }
    const diff = this.props.categoryWithExpensesAndSpend.monthly_goal - this.props.categoryWithExpensesAndSpend.spend;
    return (diff >= 0) ? `${Numerics.centsToDollars(diff)} remaining` : `${Numerics.centsToDollars(Math.abs(diff))} over`;
  }

  normalizedPercentage() {
    if (!this.props.categoryWithExpensesAndSpend.monthly_goal) { return 0; }
    return Math.min(100, this.props.categoryWithExpensesAndSpend.spend / this.props.categoryWithExpensesAndSpend.monthly_goal * 100);
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
      <div className="category-tile" style={{ borderColor: this.props.categoryWithExpensesAndSpend.color }} onClick={this.jumpToHistory}>
        {this.renderCategoryEditModal()}
        {this.renderExpenseCreateModal()}
        <div className="flex flex-space-between title">
          <div>
            <div className="flex">
              <a href={`/expenses?category_id=${this.props.categoryWithExpensesAndSpend.id}&paid_after=${moment().startOf('month').unix()}`} className="dim-on-hover"><b>{this.props.categoryWithExpensesAndSpend.name}</b></a>
              <img className="icon-default hover-pointer dim-til-hover" src={window.iconEdit} onClick={this.openCategoryEdit} />
            </div>
            <div className="text-muted">{this.goalComparisonDisplay()}</div>
          </div>

          <h2>{Numerics.centsToDollars(this.props.categoryWithExpensesAndSpend.spend)}</h2>
        </div>

        <Progress data={[{ percentage: this.normalizedPercentage() }]} small={true} />

        <div className='add-expense'>
          <img className="mt-50" src={window.iconPlus} onClick={this.openExpenseCreate} />
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
