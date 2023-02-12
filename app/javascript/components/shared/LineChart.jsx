import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Numerics } from '../../helpers/main';
import Chart from 'chart.js';

const toggleCategory = function (_, legendItem) {
  const index = legendItem.datasetIndex;
  const ci = this.chart;
  const alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

  ci.data.datasets.forEach(function (e, i) {
    const meta = ci.getDatasetMeta(i);

    if (i !== index) {
      if (!alreadyHidden) {
        meta.hidden = meta.hidden === null ? !meta.hidden : null;
      } else if (meta.hidden === null) {
        meta.hidden = true;
      }
    }

    if (i === index) {
      meta.hidden = null;
    }
  });

  ci.update();
};

const LineChart = ({ data, labels, hideLegend, stacked }) => {
  const [randomId] = useState(Math.random().toString());
  const [instance, setInstance] = useState(null);

  Chart.defaults.global.animation.duration = 100;
  Chart.defaults.scale.ticks.padding = 10;

  useEffect(() => {
    instance?.destroy();

    const config = {
      type: 'line',
      data: {
        datasets: data,
        labels,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: !hideLegend,
          onClick: toggleCategory,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 4,
          },
          onHover: (e) => {
            e.target.style.cursor = 'pointer';
          },
          onLeave: (e) => {
            e.target.style.cursor = 'default';
          },
        },
        tooltips: {
          callbacks: {
            label: t => `${data[t.datasetIndex].label}: $${Numerics.currency(t.yLabel)}`,
          },
        },
        scales: {
          yAxes: [{
            display: true,
            stacked,
            ticks: {
              callback: label => `$${Numerics.currency(label)}`,
            },
          }],
          xAxes: [{ stacked }],
        },
        elements: {
          line: {
            fill: false,
          },
        },
      },
    };

    const newInstance = new Chart(document.getElementById(randomId), config);

    setInstance(newInstance);
  }, [data, labels]);

  return <canvas id={randomId} />;
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  hideLegend: PropTypes.bool,
  stacked: PropTypes.bool,
};

LineChart.defaultProps = {
  hideLegend: false,
  stacked: false,
};

export default LineChart;
