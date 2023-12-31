const timerIntervals: { [name: string]: number } = {
  // 実行中の計測一覧取得
  currentMesurements: 5000,
  // グラフ取得のインターバル。
  graphData: 5000,
}

export { timerIntervals }

export const defaultDataMinutes: number = 12

export const dataIntervalMillSecs: number = 1000

export const riskToGraphColor = (riskNumber: number): string => {
  return [
    'rgba(220, 220, 220, 0.5)',
    'rgba(200, 200, 200, 0.5)',
    'rgba(200, 200, 0, 0.5)',
    'rgba(200, 50, 50, 0.5)',
    'rgba(200, 50, 50, 0.5)',
  ][riskNumber - 1]
}

export const interventionColors = (intervention: string | null): string => {
  if (intervention) {
    let color = {
      drop: 'rgba(100, 100, 200, 0.5)',
      change_position: 'rgba(200, 200, 0, 0.5)',
      doctor_call: 'rgba(200, 50, 50, 0.5)',
    }[intervention]
    if (color) {
      return color
    }
  }
  return 'rgba(200, 200, 200, 0.5)'
}
