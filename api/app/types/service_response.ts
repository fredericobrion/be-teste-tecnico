type ServiceMessage = { message?: string; error?: string }

type ServiceResponseErrorType =
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INTERNAL_SERVER_ERROR'
  | 'CONFLICT'
  | 'NO_CONTENT'
  | 'UNAUTHORIZED'

type ServiceResponseError = {
  status: ServiceResponseErrorType
  data: ServiceMessage
}

type ServiceResponseSuccess<T> = {
  status: 'OK' | 'CREATED' | 'NO_CONTENT' | 'UNAUTHORIZED'
  data: T | T[]
}

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>
