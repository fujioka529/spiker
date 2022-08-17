import Chart, { ChartEvent, ActiveElement } from 'chart.js/auto'

interface DraggedArea {
  start: number
  end: number
}

const useChartDragDrop = () => {
  var isDrag: boolean = false
  let draggedArea: DraggedArea = { start: 0, end: 0 }

  const onDragArea = (
    callback: (
      chart: Chart,
      event: string,
      begin: number,
      end: number
    ) => void | undefined
  ) => {
    return (e: ChartEvent, element: ActiveElement[], chart: Chart) => {
      if (!e.x) {
        return
      }
      if (e.type == 'mousedown') {
        isDrag = true
        draggedArea = { start: e.x, end: e.x }
      } else if (e.type == 'mousemove' && isDrag) {
        draggedArea.end = e.x
        if (callback !== undefined) {
          if (draggedArea.start < draggedArea.end) {
            callback(chart, e.type, draggedArea.start, draggedArea.end)
          } else {
            callback(chart, e.type, draggedArea.end, draggedArea.start)
          }
        }
      } else if (e.type == 'mouseup') {
        isDrag = false
        if (draggedArea.start < draggedArea.end) {
          callback(chart, e.type, draggedArea.start, draggedArea.end)
        } else {
          callback(chart, e.type, draggedArea.end, draggedArea.start)
        }
      }
    }
  }

  return {
    onDragArea,
  }
}

export default useChartDragDrop
