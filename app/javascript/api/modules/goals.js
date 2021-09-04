import Base from './base';

const Goals = {
  list(params, opts = {}) {
    return Base.get('/goals', params, opts || {});
  },
  update(data, opts = {}) {
    return Base.put('/goals', data, opts || {});
  },
};

export default Goals;
