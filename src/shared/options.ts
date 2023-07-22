type Option = {
  label: string
  value: string | number
}

export const timescaleOptions: Option[] = [
  { label: 'min12', value: 12 },
  { label: 'min20', value: 20 },
  { label: 'min40', value: 40 },
  { label: 'min60', value: 60 },
]

export const alertNowOptions: Option[] = [
  {
    label: 'risk3',
    value: 3,
  },
  {
    label: 'risk4',
    value: 4,
  },
  {
    label: 'risk5',
    value: 5,
  },
]

export const medicalInterventionOptions: Option[] = [
  {
    label: 'vaginal_exam',
    value: 'vaginal_exam',
  },
  {
    label: 'iv_fluid',
    value: 'iv_fluid',
  },
  {
    label: 'change_position',
    value: 'change_position',
  },

  {
    label: 'c_section_decided',
    value: 'c_section_decided',
  },
  {
    label: 'doctor_call',
    value: 'doctor_call',
  },
  {
    label: 'others',
    value: 'others',
  },
]

export const terminationOptions: Option[] = [
  {
    label: 'c_section',
    value: 'c_section',
  },
  {
    label: 'vacuum_delivery',
    value: 'vacuum_delivery',
  },
  {
    label: 'normal_delivery',
    value: 'normal_delivery',
  },
]
