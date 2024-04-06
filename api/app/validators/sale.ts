import vine from '@vinejs/vine'

export const createSaleValidator = vine.compile(
  vine.object({
    productId: vine.number().positive(),
    quantity: vine.number().min(1),
    createdAt: vine
      .date({
        formats: ['DD/MM/YYYY HH:mm:ss'],
      })
      .beforeOrEqual('today')
      .optional(),
  })
)
