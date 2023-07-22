import {
  AnnotationBody,
  CloseBody,
  TerminationBody,
  MedicalInterventionBody,
} from '../types/request-types'
import {
  Annotation,
  CurrentMeasurements,
  CurrentMeasurement,
  Events,
  Interventions,
  Measurements,
  SensorData,
} from '../types/response-types'
import { AuthApiRequest } from './auth-api'

class AuthClient extends AuthApiRequest {
  public async listMeasurements(
    limit: number,
    offset: number,
    patient: number | undefined = undefined,
    terminal: number | undefined = undefined,
    keywords: string | undefined = undefined
  ): Promise<Measurements> {
    var params: { [name: string]: any } = {
      limit: limit,
      offset: offset,
    }
    if (patient) {
      params['patient'] = patient
    }
    if (terminal) {
      params['terminal'] = terminal
    }
    if (keywords) {
      params['keyword'] = keywords.split(' ')
    }
    let res = await this.axios().get(`/1/measurements`, {
      params: params,
    })
    return res.data
  }

  public async currentMeasurements(): Promise<CurrentMeasurements> {
    let res = await this.axios().get(`/1/measurements/current`)
    return res.data
  }

  public async fetchtMeasurement(id: number): Promise<CurrentMeasurement> {
    let res = await this.axios().get(`/1/measurements/${id}`)
    return res.data
  }

  public async listEvents(
    id: number,
    start: number | undefined = undefined
  ): Promise<Events> {
    var params: { [name: string]: any } = {}
    if (start) {
      params['start'] = start
    }
    let res = await this.axios().get(`/1/measurements/${id}/events`, {
      params: params,
    })
    return res.data
  }

  public async listInterventions(
    id: number,
    start: number | undefined = undefined
  ): Promise<Interventions> {
    var params: { [name: string]: any } = {}
    if (start) {
      params['start'] = start
    }
    let res = await this.axios().get(`/1/measurements/${id}/medical_events`, {
      params: params,
    })
    return res.data
  }

  public async deleteMedicalIntervention(
    measurementId: number,
    interventionId: number
  ): Promise<void> {
    await this._delete(
      `/1/measurements/${measurementId}/medical_events/${interventionId}`
    )
  }

  public async listHeartrates(
    measurementId: number,
    end: string,
    minutes: number | undefined = undefined,
    interval: number | undefined = undefined
  ): Promise<SensorData> {
    var params: { [name: string]: any } = {
      end: end,
    }
    if (minutes) {
      params['minutes'] = minutes
    }
    if (interval) {
      params['interval'] = interval
    }
    let res = await this.axios().get(
      `/1/measurements/${measurementId}/heartrates`,
      {
        params: params,
      }
    )
    return res.data
  }

  public async listTocos(
    measurementId: number,
    end: string,
    minutes: number | undefined = undefined,
    interval: number | undefined = undefined
  ): Promise<SensorData> {
    var params: { [name: string]: any } = {
      end: end,
    }
    if (minutes) {
      params['minutes'] = minutes
    }
    if (interval) {
      params['interval'] = interval
    }
    let res = await this.axios().get(`/1/measurements/${measurementId}/tocos`, {
      params: params,
    })
    return res.data
  }

  public async createAnnotation(
    measurementId: number,
    params: AnnotationBody
  ): Promise<Annotation> {
    return await this._post<AnnotationBody, Annotation>(
      `/1/measurements/${measurementId}/annotations`,
      params
    )
  }

  public async closeEvent(
    measurementId: number,
    eventId: number,
    memo: string
  ): Promise<void> {
    await this._post<CloseBody, void>(
      `/1/measurements/${measurementId}/events/${eventId}/close`,
      {
        memo: memo,
      }
    )
  }

  public async closeAnnotation(
    measurementId: number,
    annotationId: number,
    memo: string
  ): Promise<void> {
    await this._post<CloseBody, void>(
      `/1/measurements/${measurementId}/annotations/${annotationId}/close`,
      {
        memo: memo,
      }
    )
  }

  public async closeMeasurement(
    measurementId: number,
    maternalOutcome: string,
    memo: string
  ): Promise<void> {
    await this._post<TerminationBody, void>(
      `/1/measurements/${measurementId}/close`,
      {
        maternalOutcome: maternalOutcome,
        memo: memo,
      }
    )
  }

  public async createMedicalIntervention(
    measurementId: number,
    params: MedicalInterventionBody
  ): Promise<void> {
    await this._post<MedicalInterventionBody, void>(
      `/1/measurements/${measurementId}/medical_events`,
      params
    )
  }

  public async updatePatient(
    patientId: number,
    name: string,
    memo: string
  ): Promise<void> {
    await this._put(`/1/patients/${patientId}`, {
      name: name,
      memo: memo,
    })
  }
}

export const authClient = new AuthClient()
