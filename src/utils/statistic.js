import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getChartData = (tripPoints = []) => {
  const chartData = tripPoints.reduce((chartData, { type, price, startDate, endDate }) => {
    if (chartData[type]) {
      chartData[type].money += price;
      chartData[type].transport += 1;
      chartData[type].duration += dayjs(endDate).diff(dayjs(startDate));
    } else {
      chartData[type] = {
        money: price,
        transport: 1,
        duration: dayjs(endDate).diff(dayjs(startDate)),
      };
    }

    return chartData;
  }, {});

  return Object.entries(chartData).map(([type, data]) => ({
    tripType: type.toUpperCase(),
    data,
  }));
};

const renderChart = ({ ctx, labels, data, formatter, title }) => {
  new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 100,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        text: title,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export { getChartData, renderChart };
