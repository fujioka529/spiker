export class Area {
  beginPos: number
  endPos: number
  beginTime: number
  endTime: number

  constructor(begin: number, end: number, beginTime: number, endTime: number) {
    this.beginPos = begin
    this.endPos = end
    this.beginTime = beginTime
    this.endTime = endTime
  }
}
