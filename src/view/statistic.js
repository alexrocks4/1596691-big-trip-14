import Abstract from './abstract.js';
import { formatDuration } from '../utils/common.js';
import { MILLISECONDS_IN_MINUTE } from '../utils/const.js';
import { getChartData, renderChart } from '../utils/statistic.js';

const BAR_HEIGHT = 55;
const SCALE = 5;
const ChartTitle = {
  MONEY: 'MONEY',
  TRANSPORT: 'TYPE',
  DURATION: 'TIME-SPEND',
};

const renderMoneyChart = (ctx, chartData = [], title) => {
  const options = {
    ctx,
    labels: [],
    data: [],
    formatter: (val) => `€ ${val}`,
    title,
  };

  chartData.forEach((data) => {
    options.labels.push(data.tripType);
    options.data.push(data.data.money);
  });

  renderChart(options);
};

const renderTransportChart = (ctx, chartData, title) => {
  const options = {
    ctx,
    labels: [],
    data: [],
    formatter: (val) => `${val}x`,
    title,
  };

  chartData.forEach((data) => {
    options.labels.push(data.tripType);
    options.data.push(data.data.transport);
  });

  renderChart(options);
};

const renderDurationChart = (ctx, chartData, title) => {
  const options = {
    ctx,
    labels: [],
    data: [],
    formatter: (val) => formatDuration(Math.round(val/MILLISECONDS_IN_MINUTE)),
    title,
  };

  chartData.forEach((data) => {
    options.labels.push(data.tripType);
    options.data.push(data.data.duration);
  });

  renderChart(options);
};

const createStatsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Stats extends Abstract {
  constructor(tripPoints = []) {
    super();
    this._tripPoints = tripPoints;
    this._moneyCtx = null;
    this._transportCtx = null;
    this._timeCtx = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  removeElement() {
    super.removeElement();
    this._moneyCtx = null;
    this._transportCtx = null;
    this._timeCtx = null;
  }

  updateTripPoints(tripPoints = []) {
    this._tripPoints = tripPoints;
  }

  renderCharts() {
    if (this._moneyCtx && this._transportCtx && this._timeCtx) {
      return;
    }

    const chartData = getChartData(this._tripPoints);

    this._moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    this._transportCtx = this.getElement().querySelector('.statistics__chart--transport');
    this._timeCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyCtx.height = BAR_HEIGHT * SCALE;
    this._transportCtx.height = BAR_HEIGHT * SCALE;
    this._timeCtx.height = BAR_HEIGHT * SCALE;

    renderMoneyChart(this._moneyCtx, chartData.slice().sort((dataA, dataB) => dataB.data.money - dataA.data.money), ChartTitle.MONEY);
    renderTransportChart(this._transportCtx, chartData.slice().sort((dataA, dataB) => dataB.data.transport - dataA.data.transport), ChartTitle.TRANSPORT);
    renderDurationChart(this._timeCtx, chartData.slice().sort((dataA, dataB) => dataB.data.duration - dataA.data.duration), ChartTitle.DURATION);
  }
}
