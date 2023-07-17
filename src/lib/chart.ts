import Chart, { ChartOptions } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import useChartDragDrop from '../composables/dragDrop'
import { Event, Intervention } from '../types/response-types'
import { interventionColors, riskToGraphColor } from '../shared/consts'
import { Area } from '../shared/classes'

const { onDragArea } = useChartDragDrop()

export interface CTGChartConfigutaion {
  graphTitle: string
  borderColor: string
  borderWidth: number
  yMin: number
  yMax: number
  isFHR: boolean
  updateDragArea:
    | ((chart: Chart, event: string, begin: number, end: number) => void)
    | undefined
}

let defaultConfig: CTGChartConfigutaion = {
  graphTitle: 'HR',
  borderColor: 'rgba(100, 100, 100, 1.0)',
  borderWidth: 1.5,
  updateDragArea: undefined,
  yMin: 0.0,
  yMax: 255.0,
  isFHR: false,
}

export default class CTGChart {
  ctx: CanvasRenderingContext2D
  config: CTGChartConfigutaion
  chart: Chart
  area: Area | null
  events: Event[]
  interventions: Intervention[]
  selectedEventId: number
  selectedAnnotationId: number
  alertId: number
  showRisk: boolean
  showIntervention: boolean

  constructor(
    ctx: CanvasRenderingContext2D,
    config: CTGChartConfigutaion | undefined
  ) {
    this.ctx = ctx
    this.config = config ? config : defaultConfig
    this.chart = this.createChart(this.config)
    this.area = null
    this.events = []
    this.interventions = []
    this.showRisk = true
    this.showIntervention = true
    this.selectedEventId = -1
    this.selectedAnnotationId = -1
    this.alertId = -1
  }

  // マウスで選択したエリアの描画を行う。
  drawArea(area: Area | null) {
    this.area = area
    this.chart.update()
  }

  // グラフデータを更新する。
  updateData(labels: number[], data: number[]) {
    this.chart.data.labels = labels
    this.chart.data.datasets[0].data = data
    this.chart.update()
  }

  updateEvents(events: Event[]) {
    this.events = events
    this.chart.update()
  }

  updateInterventions(interventions: Intervention[]) {
    this.interventions = interventions
    this.chart.update()
  }

  updateSelectedEventId(id: number) {
    if (this.selectedEventId != id) {
      this.selectedEventId = id
      this.chart.update()
    }
  }

  updateSelectedAnnotationId(id: number) {
    if (this.selectedAnnotationId != id) {
      this.selectedAnnotationId = id
      this.chart.update()
    }
  }

  updateAlert(id: number) {
    if (this.alertId != id) {
      this.alertId = id
      this.chart.update()
    }
  }

  // 全テータをクリアする。
  removeAll() {
    this.chart.data.labels?.pop()
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.pop()
    })
    this.area = null
    this.chart.update()
  }

  private createChart(config: CTGChartConfigutaion): Chart {
    let options: ChartOptions = {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'millisecond',
            stepSize: 20000,
            displayFormats: {
              millisecond: 'HH:mm:ss',
            },
          },
          ticks: {
            display: true,
          },
        },
        y: {
          min: this.config.yMin,
          max: this.config.yMax,
          ticks: {
            stepSize: 20,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: config.graphTitle,
        },
      },
    }
    if (config.updateDragArea) {
      options.events = ['mousemove', 'mousedown', 'mouseup']
      options.onHover = onDragArea(config.updateDragArea)
    }
    return new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            pointRadius: 0,
            borderColor: config.borderColor,
            borderWidth: config.borderWidth,
            spanGaps: false,
            tension: 0.1,
          },
        ],
      },
      plugins: [
        {
          id: 'beforeDraw',
          beforeDraw: this.drawAnnotations(),
        },
      ],
      options: options,
    })
  }

  // アノテーション情報を描画する。
  private drawAnnotations() {
    let annotateHeight = 15.0

    return (chart: Chart): void => {
      const xscale = chart.scales['x']
      const yscale = chart.scales['y']

      if (this.config.isFHR) {
        this.ctx.fillStyle = 'rgba(192, 255, 192, 0.5)'
        this.ctx.fillRect(
          xscale.left,
          yscale.getPixelForValue(160.0),
          xscale.right - xscale.left,
          yscale.getPixelForValue(110.0) - yscale.getPixelForValue(160.0)
        )
      }

      if (this.showRisk && this.events) {
        this.events.forEach((event: Event) => {
          let beginPos = xscale.getPixelForValue(
            new Date(event.rangeFrom).getTime()
          )
          let endPos = xscale.getPixelForValue(
            new Date(event.rangeUntil).getTime()
          )
          let color = event.risk
            ? riskToGraphColor(event.risk)
            : 'rgba(220, 220, 220, 0.5)'
          this.ctx.fillStyle = color // parametersToGraphColor(event.parameters);
          let height =
            event.id == this.selectedEventId || event.id == this.alertId
              ? yscale.getPixelForValue(this.config.yMin) -
                yscale.getPixelForValue(this.config.yMax - annotateHeight)
              : annotateHeight
          this.ctx.fillRect(
            beginPos!,
            yscale.getPixelForValue(this.config.yMax),
            endPos! - beginPos!,
            height
          )
        })
      }
      if (this.showIntervention && this.interventions) {
        this.interventions.forEach((intervention: Intervention) => {
          let beginPos = xscale.getPixelForValue(
            new Date(intervention.rangeFrom).getTime()
          )
          let endPos = xscale.getPixelForValue(
            new Date(intervention.rangeUntil).getTime()
          )
          this.ctx.fillStyle = interventionColors(intervention.interventionKind)
          let height =
            intervention.id == this.selectedAnnotationId
              ? yscale.getPixelForValue(this.config.yMin) -
                yscale.getPixelForValue(this.config.yMax - annotateHeight)
              : annotateHeight
          this.ctx.fillRect(
            beginPos!,
            yscale.getPixelForValue(this.config.yMax - annotateHeight),
            endPos! - beginPos!,
            height
          )
        })
      }
      if (this.area) {
        // ドラッグエリアの表示。
        this.ctx.fillStyle = 'rgba(192, 100, 192, 0.5)'
        this.ctx.fillRect(
          this.area.beginPos,
          yscale.getPixelForValue(this.config.yMax),
          this.area.endPos - this.area.beginPos,
          yscale.getPixelForValue(this.config.yMin) -
            yscale.getPixelForValue(this.config.yMax)
        )
      }
    }
  }
}
