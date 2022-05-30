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

const BarChart = ({ data, labels, hideLegend, stacked }) => {
  const [randomId] = useState(Math.random().toString());
  const [instance, setInstance] = useState(null);

  Chart.defaults.global.animation.duration = 100;
  Chart.defaults.scale.ticks.padding = 10;

  useEffect(() => {
    instance?.destroy();

    const config = {
      type: 'bar',
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
        },
        tooltips: {
          callbacks: {
            label: t => `${data[t.datasetIndex].label}: $${Numerics.commify(parseFloat(t.yLabel).toFixed(2))}`,
          },
        },
        scales: {
          yAxes: [{
            stacked,
            ticks: {
              callback: label => `$${Numerics.commify(label)}`,
            },
          }],
          xAxes: [{ stacked }],
        },
      },
    };

    const newInstance = new Chart(document.getElementById(randomId), config);

    setInstance(newInstance);
  }, [data, labels]);

  return <canvas id={randomId} />;
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  hideLegend: PropTypes.bool,
  stacked: PropTypes.bool,
};

BarChart.defaultProps = {
  hideLegend: false,
  stacked: false,
};

export default BarChart;
