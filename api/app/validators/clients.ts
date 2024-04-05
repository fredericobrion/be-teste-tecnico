import vine from '@vinejs/vine'
import { ufs } from '../utils/uf_list.js'

export const createClientValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    cpf: vine.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    cep: vine.string().regex(/^\d{5}-\d{3}$/),
    street: vine.string(),
    number: vine.string(),
    complement: vine.string().optional(),
    neighborhood: vine.string(),
    city: vine.string(),
    uf: vine.string().toUpperCase().in(ufs),
    phone: vine.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  })
)
