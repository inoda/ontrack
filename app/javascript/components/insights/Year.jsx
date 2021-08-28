import React from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js';
import { Reports } from '../../api/main'
import { Alerts } from '../../helpers/main'
import { Numerics } from '../../helpers/main'

const toggleCategory = function(e, legendItem) {
  var index = legendItem.datasetIndex;
  var ci = this.chart;
  var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

  ci.data.datasets.forEach(function(e, i) {
    var meta = ci.getDatasetMeta(i);

    if (i !== index) {
      if (!alreadyHidden) {
        meta.hidden = meta.hidden === null ? !meta.hidden : null;
      } else if (meta.hidden === null) {
        meta.hidden = true;
      }
    } else if (i === index) {
      meta.hidden = null;
    }
  });

  ci.update();
};

class Year extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: this.props.availableYears[0],
      barChartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [],
      },
      pieChartData: {
        data: [],
        backgroundColors: [],
        labels: []
      },
      charts: [],
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
        let barChartDatasets = [];
        resp.categories.forEach((category) => {
          let dataPoints = [];
          this.state.barChartData.labels.forEach((mon) => {
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

        this.setState({
          barChartData: Object.assign(this.state.barChartData, { datasets: barChartDatasets }),
          pieChartData: Object.assign({}, this.state.pieChartData, { data: pieChartDatasets, backgroundColors: pieChartColors, labels: pieChartLabels }),
        }, this.buildCharts);
      },
      (error) => { Alerts.genericError(); },
    )
  }

  buildCharts() {
    this.state.charts.forEach((chart) => chart.destroy());

    const barChart = new Chart(document.getElementById("barChart"), {
      type: 'bar',
      data: this.state.barChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { onClick: toggleCategory },
        tooltips: {
          callbacks: {
            label: t => `${this.state.barChartData.datasets[t.datasetIndex].label}: $${Numerics.commify(parseFloat(t.yLabel).toFixed(2))}`
          }
        },
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{
            stacked: true,
            ticks: { callback: label => Numerics.commify(label) }
          }],
        }
      }
		});

    const pieChart = new Chart(document.getElementById("pieChart"), {
      type: 'pie',
      data: {
        datasets: [{ data: this.state.pieChartData.data, backgroundColor: this.state.pieChartData.backgroundColors }],
        labels: this.state.pieChartData.labels,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: t => `${this.state.pieChartData.labels[t.index]}: $${Numerics.commify(this.state.pieChartData.data[t.index].toFixed(2))}`
          },
        },
      }
    });


    this.setState({ charts: [barChart, pieChart] });
  }

  render() {
    return (
      <div>
        <div className="flex flex-space-between mb-30">
          <b>{this.state.year} overview</b>
          <div className="input-group inline">
            <select value={this.state.year} onChange={this.handleYearChange}>
              {this.props.availableYears.map((yr) => { return <option key={yr} value={yr}>{yr}</option> })}
            </select>
          </div>
        </div>

        <div className="chart-container">
          <canvas id="barChart"></canvas>
        </div>

        <div className="chart-container mt-50">
          <canvas id="pieChart"></canvas>
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
