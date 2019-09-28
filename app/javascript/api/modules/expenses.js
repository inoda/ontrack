import Base from './base';

const Expenses = {
  list(params, opts = {}) {
    return Base.get(`/expenses`, params, opts || {});
  },
}

export default Expenses;
