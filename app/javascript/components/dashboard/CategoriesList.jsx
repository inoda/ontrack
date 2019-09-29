import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../shared/Modal'
import CategoryTile from './CategoryTile'
import CategoryFormModal from '../categories/FormModal'

class CategoriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCategoryCreateModal: false };
  }

  openCategoryCreate = () => { this.setState({ showCategoryCreateModal: true }); }
  closeCategoryCreate = () => { this.setState({ showCategoryCreateModal: false }); }
  openCategorySave = () => {
    this.closeCategoryCreate();
    this.props.onChange();
  }

  renderCategoryCreateModal() {
    if (!this.state.showCategoryCreateModal) { return '' }
    return <CategoryFormModal onClose={this.closeCategoryCreate} onSave={this.openCategorySave} />;
  }

  renderCategory(category, idx) {
    return <CategoryTile key={idx} categoryWithExpensesAndSpend={category} />;
  }

  render() {
    return (
      <div>
        {this.renderCategoryCreateModal()}
        {this.props.categoriesWithExpensesAndSpend.map((value, idx) => { return this.renderCategory(value, idx) })}
        <div className="category-tile hover-dim hover-pointer" onClick={this.openCategoryCreate}>
          <div className="add">+ Add a category</div>
        </div>
      </div>
    );
  }
}

CategoriesList.defaultProps = {
  categoriesWithExpensesAndSpend: []
}

CategoriesList.propTypes = {
  categoriesWithExpensesAndSpend: PropTypes.array,
  onChange: PropTypes.func
}

export default CategoriesList;
