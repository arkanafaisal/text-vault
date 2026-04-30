import Joi from 'joi'


const id = Joi.number().min(1).required()
const title = Joi.string().trim().max(31)
const content = Joi.string().max(1000)
const visibility = Joi.string().valid('private', 'public')
const tags = Joi.array().items(Joi.string().trim().max(12)).max(5)
const expiresAt = Joi.date()


const search = Joi.string().trim().max(128)
const sort = Joi.valid('oldest', 'updated', 'newest')
const page = Joi.number().min(1).default(1)


export const data = {
    getMyData: { 
        query: Joi.object({
            sort: sort.default('newest'),
            visibility,
            search: search.empty(''),
            page
        })
    },
    getById: { params: Joi.object({ id }) },
    create: { 
        body: Joi.object({
            title: title.required(), 
            content: content.required(), 
            tags
        })
    },
    updateCommon: { 
        body: Joi.object({
            title: title.allow(null), 
            content: content.allow(null), 
            tags: tags.allow(null) 
        }).or('title', 'content', 'tags'),
        params: Joi.object({ id })
    },
    updateStatus: {
        body: Joi.object({ visibility: visibility.required() }),
        params: Joi.object({ id })
    },
    delete: { params: Joi.object({ id }) }
}

export const publicData = {
    pagination: { query: Joi.object({ page }) }
}