export interface IntervalParameter {
  callback: Function
  delayMillisec: number
  isImmediately: boolean
}

// 定期実行のタイマーを管理する。
// リロード時に全定期実行を停止する。
// タブの切替時に定期実行を一時停止し、タブがアクティブになると復帰する。
class IntervalManager {
  protected parameters: { [name: string]: IntervalParameter } = {}
  protected intervals: { [name: string]: any } = {}

  constructor() {
    window.onbeforeunload = (evt) => {
      this.stopAll()
    }
  }

  public start(name: string, parameter: IntervalParameter) {
    if (!this.parameters[name]) {
      this.parameters[name] = parameter
      this.fire(name, parameter)
    }
  }

  public stop(name: string) {
    if (this.intervals[name]) {
      clearInterval(this.intervals[name])
      delete this.intervals[name]
      delete this.parameters[name]
    }
  }

  public pause() {
    Object.keys(this.intervals).forEach((name) => {
      clearInterval(this.intervals[name])
      delete this.intervals[name]
    })
  }

  public resume() {
    Object.keys(this.parameters).forEach((name) => {
      this.fire(name, this.parameters[name])
    })
  }

  private fire(name: string, parameter: IntervalParameter) {
    if (parameter.isImmediately) {
      parameter.callback()
    }
    this.intervals[name] = setInterval(() => {
      parameter.callback()
    }, parameter.delayMillisec)
  }

  public stopAll() {
    Object.keys(this.intervals).forEach((name) => {
      this.stop(name)
    })
  }
}

export const intervalManager = new IntervalManager()
