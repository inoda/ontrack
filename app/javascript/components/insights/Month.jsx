import React from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js';
import moment from 'moment';
import { Reports } from '../../api/main'
import { Alerts } from '../../helpers/main'
import { Numerics } from '../../helpers/main'

class Year extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: this.props.availableMonths[this.props.availableMonths.length - 1],
      totalMonthGoal: 0,
      totalMonthSpend: 0,
      chartData: {
        labels: [],
        datasets: [],
      },
    };
  }

  componentDidMount() {
    this.loadData();
  }

  handleMonthDecrement = () => { this.setState({ month: this.props.availableMonths[this.props.availableMonths.indexOf(this.state.month) - 1] }, this.loadData); }
  handleMonthIncrement = () => { this.setState({ month: this.props.availableMonths[this.props.availableMonths.indexOf(this.state.month) + 1] }, this.loadData); }
  loadData = () => {
    Reports.month({ month: this.state.month }).then(
      (resp) => {
        let labels = resp.results.map((r) => { return r.category; });
        let datasets = [
          { label: 'Within goal', backgroundColor: '#8295e0', data: [] },
          { label: 'Over goal', backgroundColor: '#cc654b', data: [] },
        ];

        resp.results.forEach((r) => {
          const amountOver = parseFloat(r.spend) - parseFloat(r.monthly_goal);
          const normalizedAmountOver = r.monthly_goal && amountOver > 0 ? amountOver : 0;
          datasets[0].data.push((r.spend - normalizedAmountOver) / 100)
          datasets[1].data.push(normalizedAmountOver / 100)
        })

        this.setState({
          chartData: Object.assign(this.state.chartData, { datasets: datasets, labels: labels }),
          totalMonthGoal: resp.monthly_goal,
          totalMonthSpend: resp.total,
        }, this.buildChart);
      },
      (error) => { Alerts.genericError(); },
    )
  }

  buildChart() {
		new Chart(document.getElementById("chart2"), {
			type: 'bar',
			data: this.state.chartData,
			options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
				tooltips: {
          callbacks: {
            label: (t) => { return `${this.state.chartData.datasets[t.datasetIndex].label}: $${Numerics.commify(parseFloat(t.yLabel).toFixed(2))}`; }
          }
				},
				scales: {
					yAxes: [{
            stacked: true,
            ticks: {
              callback: (label) => { return `$${Numerics.commify(label)}`; }
            }
          }],
					xAxes: [{ stacked: true }]
				}
			}
		});
  }

  renderTotalGoal() {
    if (!this.state.totalMonthGoal) {
      return (
        <div className="month">
          <h2>No goal set</h2>
          <div><a className="text-muted" href="/">Set a total monthly goal</a></div>
        </div>
      )
    }
    const amountOver = parseFloat(this.state.totalMonthSpend) - parseFloat(this.state.totalMonthGoal);
    const percentDiff = amountOver / this.state.totalMonthGoal * 100;

    return (
      <div className="month flex flex-space-between">
        <b>Goal comparison</b>
        <h2 className={amountOver <= 0 ? 'text-success' : 'text-warning'}>{amountOver >= 0 ? '+' : '-'}{Numerics.centsToDollars(Math.abs(amountOver))}</h2>
      </div>
    )
  }

  averageSpend() {
    const daysInMonth = moment(this.state.month, "MMMM YYYY").daysInMonth()
    let currentDayNum = 99
    if (this.state.month == moment().format("MMMM YYYY")) {
      currentDayNum = new Date().getDate();
    }
    const numOfDays = Math.min(daysInMonth, currentDayNum);
    const averageSpend = this.state.totalMonthSpend * 1.0 / numOfDays


    return (
      <div className="month flex flex-space-between">
        <b>Daily average</b>
        <h2>{Numerics.centsToDollars(averageSpend)}</h2>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div>
          {this.props.availableMonths.indexOf(this.state.month) == 0 ? '' : <a onClick={this.handleMonthDecrement}><i className="fa fa-chevron-left mr-10"></i></a>}
          {this.state.month}
          {this.props.availableMonths.indexOf(this.state.month) == this.props.availableMonths.length - 1 ? '' : <a onClick={this.handleMonthIncrement}><i className="fa fa-chevron-right ml-10"></i></a>}
        </div>

        <div className="row">
         <div className="six columns">{this.renderTotalGoal()}</div>
         <div className="six columns">{this.averageSpend()}</div>
        </div>
        <div className="clearfix"></div>

        <div className="month">
        <div className="mb-30">
          <b>Spend By Category</b>
        </div>
        <div className="chart-container">
          <canvas id="chart2"></canvas>
        </div>
        </div>
      </div>
    );
  }
}

Year.defaultProps = {
  availableMonths: [],
}

Year.propTypes = {
  availableMonths: PropTypes.array,
}

export default Year;
