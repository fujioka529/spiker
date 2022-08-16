const timerIntervals: { [name: string]: number } = {
  // 実行中の計測一覧取得
  currentMesurements: 5000,
  // グラフ取得のインターバル。
  graphData: 5000,
}

export { timerIntervals }

export const defaultDataMinutes: number = 6

export const dataIntervalMillSecs: number = 250

export const riskToGraphColor = (riskNumber: number): string => {
  return [
    'rgba(220, 220, 220, 0.5)',
    'rgba(200, 200, 200, 0.5)',
    'rgba(200, 200, 0, 0.5)',
    'rgba(200, 50, 50, 0.5)',
    'rgba(200, 50, 50, 0.5)',
  ][riskNumber - 1]
}
