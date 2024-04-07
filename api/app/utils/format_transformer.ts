import { DateTime } from 'luxon'

export default class FormatTransformer {
  static unformatCpf(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  static formatCpf(cpf: string): string {
    const match = cpf.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)

    if (!match) {
      throw new Error('Invalid CPF')
    }

    const formatedCpf = `${match[1]}.${match[2]}.${match[3]}-${match[4]}`

    return formatedCpf
  }

  static unformatCep(cep: string): string {
    return cep.replace(/\D/g, '')
  }

  static formatCep(cep: string): string {
    const match = cep.match(/^(\d{5})(\d{3})$/)

    if (!match) {
      throw new Error('Invalid CEP')
    }

    const formatedCep = `${match[1]}-${match[2]}`

    return formatedCep
  }

  static unformatPhone(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  static formatPhone(phone: string): string {
    const match = phone.match(/^(\d{2})(\d{4,5})(\d{4})$/)

    if (!match) {
      throw new Error('Invalid Phone')
    }

    const formatedPhone = `(${match[1]}) ${match[2]}-${match[3]}`

    return formatedPhone
  }

  static formatDate(date: DateTime): string {
    const dateTime = DateTime.fromISO(date.toISO() || '')
    const formattedDateTime = dateTime.toFormat('dd/MM/yyyy HH:mm:ss')

    return formattedDateTime
  }
}
