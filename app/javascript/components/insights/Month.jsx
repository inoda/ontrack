import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BarChart from './BarChart';
import { Reports } from '../../api/main';
import { Alerts } from '../../helpers/main';
import { Numerics } from '../../helpers/main';

const Month = ({ availableMonths }) => {
  const [month, setMonth] = useState(availableMonths[availableMonths.length - 1]);
  const [goal, setGoal] = useState(0);
  const [spend, setSpend] = useState(0);
  const [chartdata, setChartdata] = useState({ data: [], labels: [] });

  const handleMonthDecrement = () => setMonth(availableMonths[availableMonths.indexOf(month) - 1]);
  const handleMonthIncrement = () => setMonth(availableMonths[availableMonths.indexOf(month) + 1]);

  useEffect(() => {
    Reports.month({ month }).then(
      (resp) => {
        const labels = resp.results.map((r) => r.category);
        const datasets = [
          { label: 'Within goal', backgroundColor: '#8295e0', data: [] },
          { label: 'Over goal', backgroundColor: '#cc654b', data: [] },
        ];

        resp.results.forEach((r) => {
          const amountOver = parseFloat(r.spend) - parseFloat(r.monthly_goal);
          const normalizedAmountOver = r.monthly_goal && amountOver > 0 ? amountOver : 0;
          datasets[0].data.push((r.spend - normalizedAmountOver) / 100);
          datasets[1].data.push(normalizedAmountOver / 100);
        })

        setChartdata({ data: datasets, labels: labels });
        setGoal(resp.monthly_goal);
        setSpend(resp.total);
      },
      () => { Alerts.genericError(); },
    )
  }, [month]);

  const goalComparison = parseFloat(spend) - parseFloat(goal);
  const daysInMonth = moment(month, "MMMM YYYY").daysInMonth();
  let currentDayNum = 99;
  if (month == moment().format("MMMM YYYY")) currentDayNum = new Date().getDate();
  const numOfDays = Math.min(daysInMonth, currentDayNum);
  const averageSpend = spend * 1.0 / numOfDays

  return (
    <div>
      <div className="text-center">
        <button className="btn btn-transparent" onClick={handleMonthDecrement} disabled={availableMonths.indexOf(month) == 0}>
          <i className="fa fa-chevron-left mr-10"></i>
        </button>
        <span className="d-inline-block mw-150 text-center">{month}</span>
        <button className="btn btn-transparent" onClick={handleMonthIncrement} disabled={availableMonths.indexOf(month) == availableMonths.length - 1}>
          <i className="fa fa-chevron-right ml-10"></i>
        </button>
      </div>

      <div className="row">
        <div className="six columns">
          {!goal && (
            <a className="month flex flex-space-between" href="/">
              <div className="text-muted">Set a total monthly goal</div>
              <h2 className="v-hidden">N/A</h2>
            </a>
          )}
          {!!goal && (
            <div className="month flex flex-space-between">
              <b>Goal comparison</b>
              <h2 className={goalComparison <= 0 ? 'text-success' : 'text-warning'}>
                {Numerics.centsToDollars(Math.abs(goalComparison))}
                {goalComparison >= 0 ? ' over' : ' under'}
              </h2>
            </div>
          )}
        </div>
        <div className="six columns">
          <div className="month flex flex-space-between">
            <b>Total spend</b>
            <h2>
              {Numerics.centsToDollars(spend)}
            </h2>
          </div>
        </div>
      </div>

      <div className="month">
        <div className="mb-30">
          <b>Spend by category</b>
        </div>
        <div className="chart-container">
          <BarChart data={chartdata.data} labels={chartdata.labels} hideLegend />
        </div>
      </div>
    </div>
  );
}

Month.propTypes = {
  availableMonths: PropTypes.array.isRequired,
};

export default Month;
