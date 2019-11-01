import React from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js';
import { Reports } from '../../api/main'
import { Alerts } from '../../helpers/main'
import { Numerics } from '../../helpers/main'

class Year extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  handleYearChange = (e) => { this.setState({ year: e.target.value }, this.loadData); }
  loadData = () => {
    Reports.year({ year: this.state.year }).then(
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

        this.setState({ chartData: Object.assign(this.state.chartData, { datasets: datasets }) }, this.buildChart);
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
            label: (t) => { return `${this.state.chartData.datasets[t.datasetIndex].label}: $${Numerics.commify(parseFloat(t.yLabel).toFixed(2))}`; }
          }
				},
				scales: {
					xAxes: [{ stacked: true }],
					yAxes: [{
            stacked: true,
            ticks: {
              callback: (label) => { return `$${Numerics.commify(label)}`; }
            }
          }]
				}
			}
		});
  }

  render() {
    return (
      <div>
        <div className="flex flex-space-between mb-30">
          <b>Year Overview</b>
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

Year.defaultProps = {
  availableYears: [],
}

Year.propTypes = {
  availableYears: PropTypes.array,
}

export default Year;
