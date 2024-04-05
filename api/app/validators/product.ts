import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string(),
    price: vine.number().positive(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    description: vine.string().optional(),
    price: vine.number().positive().optional(),
  })
)
