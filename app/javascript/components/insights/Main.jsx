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
      year: new Date().getFullYear(),

      chartOptions: {
        chart: {
          stacked: true,
          toolbar: { show: false },
        },
        grid: {
          padding: { left: 0, right: 0 }
        },
        fill: { opacity: 1 },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        },
        yaxis: {
          labels: {
            formatter: (val) => { return `$${val}` },
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
        },
        colors: [],
      },
      chartSeries: [],
    };
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
        <div className="flex row-flex flex-space-between">
          <h2 className="mb-10">Insights</h2>
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
