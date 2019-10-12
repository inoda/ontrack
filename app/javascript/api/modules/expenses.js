import Base from './base';

const Expenses = {
  list(params, opts = {}) {
    return Base.get(`/expenses`, params, opts || {});
  },
  create(data, opts = {}) {
    return Base.post(`/expenses`, data, opts || {});
  },
  delete(id, params, opts = {}) {
    return Base.delete(`/expenses/${id}`, params, opts || {});
  },
}

export default Expenses;
