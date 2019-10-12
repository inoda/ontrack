import Base from './base';

const Reports = {
  monthAndCategory(params, opts = {}) {
    return Base.get(`/reports/by_month_and_category`, params, opts || {});
  },
}

export default Reports;
