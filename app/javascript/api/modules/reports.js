import Base from './base';

const Reports = {
  year(params, opts = {}) {
    return Base.get('/reports/year', params, opts || {});
  },
  month(params, opts = {}) {
    return Base.get('/reports/month', params, opts || {});
  },
};

export default Reports;
