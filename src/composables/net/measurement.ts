import { authClient } from '../../service/auth-client'
import {
  CurrentMeasurement,
  CurrentMeasurements,
  Event,
  Intervention,
} from '../../types/response-types'

const useMeasurement = () => {
  const listMeasurements = async (
    limit: number,
    offset: number,
    patient: number | undefined = undefined,
    terminal: number | undefined = undefined
  ): Promise<[number, Measurement[]]> => {
    let res = await authClient.listMeasurements(
      limit,
      offset,
      patient,
      terminal
    )
    return [res.total, res.measurements]
  }

  const currentMeasurements = async (): Promise<CurrentMeasurements> => {
    return await authClient.currentMeasurements()
  }

  const fetchMeasurement = async (
    measurementId: number
  ): Promise<CurrentMeasurement> => {
    return await authClient.fetchtMeasurement(measurementId)
  }

  const fetchHeartrates = async (
    measurementId: number,
    end: string,
    minutes: number | undefined = undefined,
    interval: number | undefined = undefined
  ): Promise<[number[], number[]]> => {
    let res = await authClient.listHeartrates(
      measurementId,
      end,
      minutes,
      interval
    )
    var times: number[] = []
    var values: number[] = []
    res.records.forEach((record) => {
      times.push(record.observedAt)
      values.push(record.value)
    })
    return [times, values]
  }

  const fetchTocos = async (
    measurementId: number,
    end: string,
    minutes: number | undefined = undefined,
    interval: number | undefined = undefined
  ): Promise<[number[], number[]]> => {
    let res = await authClient.listTocos(measurementId, end, minutes, interval)
    var times: number[] = []
    var values: number[] = []
    res.records.forEach((record) => {
      times.push(record.observedAt)
      values.push(record.value)
    })
    return [times, values]
  }

  const listEvents = async (
    measurementId: number,
    start: number | undefined
  ): Promise<Event[]> => {
    let res = await authClient.listEvents(measurementId, start)
    return res.events
  }

  const listInterventions = async (
    measurementId: number,
    start: number | undefined
  ): Promise<Intervention[]> => {
    let res = await authClient.listInterventions(measurementId, start)

    return res.events
  }

  const createAnnotation = async (
    measurementId: number,
    params: AnnotationBody
  ) => {
    return await authClient.createAnnotation(measurementId, params)
  }

  const closeEvent = async (
    measurementId: number,
    eventId: number,
    memo: string
  ) => {
    await authClient.closeEvent(measurementId, eventId, memo)
  }

  const closeAnnotation = async (
    measurementId: number,
    annotationId: number,
    memo: string
  ) => {
    await authClient.closeAnnotation(measurementId, annotationId, memo)
  }

  const closeMeasurement = async (measurementId: number, memo: string) => {
    await authClient.closeMeasurement(measurementId, memo)
  }

  return {
    listMeasurements,
    currentMeasurements,
    fetchMeasurement,
    fetchHeartrates,
    fetchTocos,
    listEvents,
    listInterventions,
    createAnnotation,
    closeEvent,
    closeAnnotation,
    closeMeasurement,
  }
}

export default useMeasurement
