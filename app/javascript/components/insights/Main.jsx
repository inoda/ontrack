import React from 'react'
import PropTypes from 'prop-types'
import Chart from "react-apexcharts";
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

      chartOptions: {
        colors: [],
        fill: { opacity: 1 },
        legend: { position: 'bottom', horizontalAlign: 'center' },
        chart: {
          stacked: true,
          toolbar: { show: false }
        },
        grid: {
          padding: { bottom: 30, right: 0 }
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yaxis: {
          labels: {
            formatter: (val) => { return `$${val}` },
            align: 'right',
            offsetX: -20,
          },
        },
      },
      chartSeries: [],
    };
  }

  handleYearChange = (e) => {
    this.setState({ year: e.target.value }, this.loadData);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    Reports.monthAndCategory({ year: this.state.year }).then(
      (resp) => {
        window.x = resp
        let colors = [];
        let series = [];
        resp.categories.forEach((category) => {
          colors.push(category.color);

          let data = [];
          this.state.chartOptions.xaxis.categories.forEach((mon) => {
            const spendForCategoryAndMonth = resp.results.find((monthData) => { return monthData.month == mon && monthData.category == category.name });
            data.push(spendForCategoryAndMonth ? spendForCategoryAndMonth.amount : 0)
          });

          series.push({ name: category.name, data: data });
        })

        this.setState({ loaded: true, chartSeries: series, chartOptions: Object.assign(this.state.chartOptions, { colors: colors }) });
      },
      (error) => { Alerts.genericError(); },
    )
  }

  render() {
    if (!this.state.loaded) { return ''; }

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

        <Chart
          options={this.state.chartOptions}
          series={this.state.chartSeries}
          type="bar"
        />
      </div>
    );
  }
}

export default Main;
