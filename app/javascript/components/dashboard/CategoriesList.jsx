import React from 'react';
import PropTypes from 'prop-types';
import { Arr } from '../../helpers/main';
import CategoryTile from './CategoryTile';
import CategoryFormModal from '../categories/FormModal';

class CategoriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCategoryCreateModal: false };
  }

  openCategoryCreate = () => { this.setState({ showCategoryCreateModal: true }); }
  closeCategoryCreate = () => { this.setState({ showCategoryCreateModal: false }); }
  onCategorySave = () => {
    this.closeCategoryCreate();
    this.props.onChange();
  }

  colorsToSkip() {
    return this.props.categoriesWithExpensesAndSpend.map((cat) => cat.color);
  }

  chunkedCategories() {
    const categoriesAndAddButton = this.props.categoriesWithExpensesAndSpend.concat('addButton');
    return Arr.chunk(categoriesAndAddButton, 2);
  }

  renderCategoryCreateModal() {
    if (!this.state.showCategoryCreateModal) { return ''; }
    return <CategoryFormModal colorsToSkip={this.colorsToSkip()} onClose={this.closeCategoryCreate} onSave={this.onCategorySave} />;
  }

  renderCategory(category, idx) {
    let markup = '';
    if (category == 'addButton') {
      markup = (
        <div className="category-tile dim-til-hover hover-pointer no-border" onClick={this.openCategoryCreate}>
          <div className="new">+ Add a category</div>
        </div>
      );
    } else {
      markup = (
        <CategoryTile
          categoryWithExpensesAndSpend={category}
          colorsToSkip={this.colorsToSkip()}
          onChange={this.props.onChange}
        />
      );
    }

    return <div className="six columns" key={idx}>{markup}</div>;
  }

  renderRow(listChunk, idx) {
    return (
      <div className="row" key={idx}>
        {listChunk.map((category, i) => this.renderCategory(category, i))}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderCategoryCreateModal()}
        {this.chunkedCategories().map((listChunk, idx) => this.renderRow(listChunk, idx))}
      </div>
    );
  }
}

CategoriesList.defaultProps = {
  categoriesWithExpensesAndSpend: [],
};

CategoriesList.propTypes = {
  categoriesWithExpensesAndSpend: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default CategoriesList;
