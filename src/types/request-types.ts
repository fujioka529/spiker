export type AnnotationBody = {}

export type CloseBody = {
  memo: string
}

export type TerminationBody = {
  maternalOutcome: string
  memo: string
}

export type MedicalInterventionBody = {
  interventionKind: string | undefined
  isIntervention: boolean
  rangeFrom: string
  rangeUntil: string
  memo: string
  uterusOstium: number | null
}

export type PatientBody = {
  name: string
  memo: string
}
