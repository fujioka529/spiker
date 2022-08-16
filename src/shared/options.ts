type Option = {
  label: string
  value: string | number
}

export const timescaleOptions: Option[] = [
  { label: 'min6', value: 6 },
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
