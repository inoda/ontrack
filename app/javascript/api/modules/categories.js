import Base from './base';

const Categories = {
  list(params, opts = {}) {
    return Base.get('/categories', params, opts || {});
  },
  create(data, opts = {}) {
    return Base.post('/categories', data, opts || {});
  },
  update(id, data, opts = {}) {
    return Base.put(`/categories/${id}`, data, opts || {});
  },
  delete(id, params, opts = {}) {
    return Base.delete(`/categories/${id}`, params, opts || {});
  },
};

export default Categories;
