import React from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js';
import moment from 'moment'
import { Reports } from '../../api/main'
import { Alerts } from '../../helpers/main'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      availableYears: this.props.availableYears,
      year: this.props.availableYears[this.props.availableYears.length - 1],
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [],
      },
    };
  }

  componentDidMount() {
    this.loadData();
    Chart.defaults.global.animation.duration = 100;
    Chart.defaults.scale.ticks.padding = 10;
    Chart.Legend.prototype.afterFit = function() { this.height = this.height + 20; };
  }

  handleYearChange = (e) => {
    this.setState({ year: e.target.value }, this.loadData);
  }

  loadData = () => {
    Reports.monthAndCategory({ year: this.state.year }).then(
      (resp) => {
        let datasets = [];
        resp.categories.forEach((category) => {

          let dataPoints = [];
          this.state.chartData.labels.forEach((mon) => {
            const spendForCategoryAndMonth = resp.results.find((monthData) => { return monthData.month == mon && monthData.category == category.name });
            dataPoints.push(spendForCategoryAndMonth ? spendForCategoryAndMonth.amount : 0)
          });

          datasets.push({ label: category.name, data: dataPoints, backgroundColor: category.color });
        })

        this.setState({ loaded: true, chartData: Object.assign(this.state.chartData, { datasets: datasets }) }, this.buildChart);
      },
      (error) => { Alerts.genericError(); },
    )
  }

  buildChart() {
		new Chart(document.getElementById("chart"), {
			type: 'bar',
			data: this.state.chartData,
			options: {
        responsive: true,
        maintainAspectRatio: false,
				tooltips: {
          callbacks: {
            label: (tooltipItems) => { return `$${tooltipItems.yLabel}`; }
          }
				},
				scales: {
					xAxes: [{ stacked: true }],
					yAxes: [{
            stacked: true,
            ticks: {
              callback: (label) => { return `$${label}`; }
            }
          }]
				}
			}
		});
  }

  render() {
    if (!this.state.loaded) { return ''; }
    if (!this.props.hasData) {
      return (
        <div className="container text-center">
          <h3>No data available!</h3>
          <p>Add expenses to start seeing reports here.</p>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="flex flex-space-between mb-30">
          <h2>Insights</h2>
          <div className="input-group inline">
            <select value={this.state.year} onChange={this.handleYearChange}>
              {this.props.availableYears.map((yr) => { return <option key={yr} value={yr}>{yr}</option> })}
            </select>
          </div>
        </div>

        <div className="chart-container">
          <canvas id="chart"></canvas>
        </div>
      </div>
    );
  }
}

export default Main;
