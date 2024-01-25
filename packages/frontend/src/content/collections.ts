import { z } from 'zod'

const publications = {
  extension: 'md',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    authorId: z.string(),
  }),
} as const

const authors = {
  extension: 'json',
  schema: z.object({
    firstName: z.string(),
    lastName: z.string(),
    nickName: z.string(),
  }),
} as const

const delegatedProjects = {
  extension: 'json',
  schema: z.object({
    name: z.string(),
    communicationThreadUrl: z.string().url(),
    delegateTokensUrl: z.string().url(),
  }),
} as const

const events = {
  extension: 'json',
  schema: z.object({
    title: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string(),
    link: z.string().url(),
  }),
} as const

export const collections = {
  publications,
  authors,
  delegatedProjects,
  events,
}
