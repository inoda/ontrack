import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import PieChart from './PieChart';
import { Reports } from '../../api/main';
import { Alerts } from '../../helpers/main';

const Year = ({ availableYears }) => {
  const [year, setYear] = useState(availableYears[0]);
  const barChartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    data: [],
    colors: [],
    labels: []
  });

  const handleYearChange = e => setYear(e.target.value);

  useEffect(() => {
    Reports.year({ year }).then(
      (resp) => {
        let barChartDatasets = [];
        resp.categories.forEach((category) => {
          let dataPoints = [];
          barChartLabels.forEach((mon) => {
            const spendForCategoryAndMonth = resp.results.find((monthData) => { return monthData.month == mon && monthData.category == category.name });
            dataPoints.push(spendForCategoryAndMonth ? spendForCategoryAndMonth.amount : 0);
          });
          barChartDatasets.push({ label: category.name, data: dataPoints, backgroundColor: category.color });
        })

        let pieChartDatasets = [];
        let pieChartLabels = [];
        let pieChartColors = [];
        resp.categories.forEach((category) => {
          pieChartLabels.push(category.name);
          pieChartColors.push(category.color);
          const totalForCategory = resp.results.filter((monthData) => { return monthData.category === category.name }).reduce((a, b) => { return a + parseFloat(b.amount) }, 0);
          pieChartDatasets.push(totalForCategory);
        });

        setBarChartData(barChartDatasets);
        setPieChartData({ data: pieChartDatasets, colors: pieChartColors, labels: pieChartLabels });
      },
      () => { Alerts.genericError(); },
    )
  }, [year]);

  return (
    <div>
      <div className="flex flex-space-between mb-30">
        <b>{year} overview</b>
        <div className="input-group inline">
          <select value={year} onChange={handleYearChange}>
            {availableYears.map(yr => <option key={yr} value={yr}>{yr}</option>)}
          </select>
        </div>
      </div>

      <div className="chart-container">
        <BarChart data={barChartData} labels={barChartLabels} />
      </div>

      <div className="chart-container mt-50">
        <PieChart data={pieChartData.data} labels={pieChartData.labels} colors={pieChartData.colors} />
      </div>
    </div>
  );
}

Year.propTypes = {
  availableYears: PropTypes.array.isRequired,
}

export default Year;
