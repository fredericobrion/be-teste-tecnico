type ServiceMessage = { message: string }

type ServiceResponseErrorType = 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR' | 'CONFLICT'

type ServiceResponseError = {
  status: ServiceResponseErrorType
  data: ServiceMessage
}

type ServiceResponseSuccess<T> = {
  status: 'OK' | 'CREATED'
  data: T | T[]
}

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>
