import Base from './base';

const Expenses = {
  list(params) {
    return Base.get(`/api/v1/expenses`, params, opts || {});
  },
}

export default Expenses;
