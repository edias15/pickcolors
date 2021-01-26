import * as yup from 'yup'

const schema = yup.object().shape({
  description: yup
    .string()
    .min(2, 'Minimum 2 charactes')
    .required('Description required')
})

export default schema
