export type Hospital = {
  id: number
  name: string
  topic: string
  uuid: string
  memo: string
  createdAt: string
  modifiedAt: string
}

export type Hospitals = {
  hospitals: Hospital[]
  limit: number
  offset: number
  total: number
}

export type Terminal = {
  id: number
  code: string
  memo: string
  createdAt: string
  modifiedAt: string
}

export type Postnatal = {
  apgarScore1Min: number
  apgarScore5Min: number
  birthWeight: number
  cordBlood: number
  gestationalDays: number
  partusKind: string
  createdAt: string
  modifiedAt: string
}

export type Antenatal = {
  birthYear: number
  cSectionHistory: number
  gestation: number
  isTwin: boolean
  medicalDisorder: string
  parturition: number
  createdAt: string
  modifiedAt: string
}

export type Patient = {
  id: string
  name: string
  memo: string
  createdAt: string
  modifiedAt: string
}

export type Measurement = {
  id: number
  closingMemo: string
  code: string
  firstTime: string
  lastTime: string
  isClosed: boolean
  closeAt: string
  createdAt: string
  modifiedAt: string
  terminal: Terminal
  patient: Patient
}

export type Measurements = {
  measurements: Measurement[]
  limit: number
  offset: number
  total: number
}

export type Diagnosis = {
  baseline: string
  baselineBpm: number | null
  category: string
  deceleration: string
  parameters: number[]
  variability: string | null
  variabilityBpm: number | number
}

export type EventType = 'annotation' | 'computed'

export type Event = {
  id: number
  diagnosis: Diagnosis | null
  isClosed: boolean
  isHidden: boolean
  memo: string
  rangeFrom: string
  rangeUntil: string
  risk: number
  type: EventType
  createdAt: string
  modifiedAt: string
}

export type Events = {
  events: Event[]
}

export type InterventionKind = 'drop' | 'change_position' | 'doctor_call'

export type Intervention = {
  id: number
  interventionKind: InterventionKind
  isIntervention: boolean
  uterusOstium: number
  rangeFrom: string
  rangeUntil: string
  memo: string
  createdAt: string
  modifiedAt: string
}

export type Interventions = {
  events: Intervention[]
}

export type CurrentMeasurement = {
  id: number
  closingMemo: string
  code: string
  firstTime: string
  lastTime: string
  isClosed: boolean
  closeAt: string
  createdAt: string
  modifiedAt: string
  terminal: Terminal
  patient: Patient
  latestEvent: Event
  lastestIntervention: Intervention
  risky: boolean
}

export type CurrentMeasurements = {
  measurements: CurrentMeasurement[]
}

export type SensorValue = {
  observedAt: number
  value: number
}

export type SensorData = {
  records: SensorValue[]
}

export type Annotation = {
  id: number
  rangeFrom: string
  rangeUntil: string
  risk: number
  memo: string
  isHidden: boolean
  createdAt: string
  modifiedAt: string
  measurement: Measurement
  event?: Event
}
