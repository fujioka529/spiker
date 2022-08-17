export type AnnotationBody = {}

export type CloseBody = {
  memo: string
}

export type MedicalInterventionBody = {
  interventionKind: string | undefined
  isIntervention: boolean
  rangeFrom: string
  rangeUntil: string
  memo: string
  uterusOstium: number
}
