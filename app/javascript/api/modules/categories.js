import Base from './base';

const Categories = {
  list(params, opts = {}) {
    return Base.get(`/categories`, params, opts || {});
  },
}

export default Categories;
