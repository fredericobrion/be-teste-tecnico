export default function mapStatusHTTP(status: string): number {
  switch (status) {
    case 'OK':
      return 200
    case 'CREATED':
      return 201
    case 'NOT_FOUND':
      return 404
    case 'CONFLICT':
      return 409
    default:
      return 500
  }
}
