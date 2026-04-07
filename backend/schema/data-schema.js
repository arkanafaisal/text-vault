import Joi from 'joi'


const title = Joi.string().trim().max(31)
const content = Joi.string().max(1000)
const isLocked = Joi.boolean()
const tags = Joi.array().items(Joi.string().trim().max(12)).max(5)
const expiresAt = Joi.date()

export const create = Joi.object({
    title: title.required(), 
    content: content.required(), 
    tags
})

export const updateCommon = Joi.object({
    title: title.allow(null), 
    content: content.allow(null), 
    tags: tags.allow(null) 
}).or('title', 'content', 'tags')

export const updateStatus = Joi.object({
    isLocked: isLocked.required()
})


const search = Joi.string().trim().max(128)
const sort = Joi.valid('oldest', 'updated', 'newest')


export const query = Joi.object({
    sort: sort.default('newest'),
    isLocked,
    // tags: Joi.,
    search: search.empty('')
})