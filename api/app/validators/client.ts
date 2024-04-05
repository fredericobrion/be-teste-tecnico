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

export const updateClientValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    email: vine.string().email().optional(),
    cpf: vine
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      .optional(),
    cep: vine
      .string()
      .regex(/^\d{5}-\d{3}$/)
      .optional(),
    street: vine.string().optional(),
    number: vine.string().optional(),
    complement: vine.string().optional(),
    neighborhood: vine.string().optional(),
    city: vine.string().optional(),
    uf: vine.string().toUpperCase().in(ufs).optional(),
    phone: vine
      .string()
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/)
      .optional(),
  })
)

export const monthAndYearValidator = vine.compile(
  vine.object({
    month: vine.number().min(1).max(12).optional(),
    year: vine.number().min(1900).optional(),
  })
)
