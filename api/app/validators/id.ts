import vine from '@vinejs/vine'

export const idValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)
