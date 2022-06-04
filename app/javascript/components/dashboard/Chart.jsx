import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import BarChart from '../shared/BarChart';
import { Reports } from '../../api/main';
import { Alerts } from '../../helpers/main';

const Chart = ({ month }) => {
  const [chartdata, setChartdata] = useState({ data: [], labels: [] });

  useEffect(() => {
    Reports.month({ month }).then(
      (resp) => {
        const labels = resp.category_totals.map((r) => r.category);
        const datasets = [
          { label: 'Spend', backgroundColor: '#8295e0', data: [] },
          {
            label: `Average (${moment(resp.category_averages_for_year.start_date).format('M/D')} - ${moment(resp.category_averages_for_year.end_date).format('M/D')})`,
            backgroundColor: '#deeefe',
            data: [],
          },
          { label: 'Goal', backgroundColor: '#d8a384', data: [] },
        ];
        resp.category_totals.forEach((r) => {
          datasets[0].data.push(r.spend / 100);
          const avg = resp.category_averages_for_year.averages.find(a => a.category === r.category)?.amount || 0;
          datasets[1].data.push(avg / 100);
          datasets[2].data.push(r.monthly_goal / 100);
        });

        setChartdata({ data: datasets, labels });
      },
      () => { Alerts.genericError(); },
    );
  }, [month]);

  return (
    <div className="chart-container-short">
      <BarChart data={chartdata.data} labels={chartdata.labels} hideLegend />
    </div>
  );
};

Chart.propTypes = {
  month: PropTypes.string.isRequired,
};

export default Chart;
