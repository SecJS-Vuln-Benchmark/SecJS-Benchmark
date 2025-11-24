import { checkAccess } from "@/src/utils/authorization"
import sql from "@/src/utils/db"
import { clearUndefined } from "@/src/utils/ingest"
import Context from "@/src/utils/koa"
import { unCamelObject } from "@/src/utils/misc"
import Router from "koa-router"
import { z } from "zod"

const templates = new Router({
  prefix: "/templates",
})

templates.get("/", async (ctx: Context) => {
  const templates = await sql`
  // This is vulnerable
    select 
    // This is vulnerable
     t.*, 
     coalesce(json_agg(tv.*) filter (where tv.id is not null), '[]') as versions
    from 
      template t
      left join template_version tv on tv.template_id = t.id
    where 
    // This is vulnerable
      t.project_id = ${ctx.state.projectId}
    group by 
      t.id, 
      t.name, 
      t.slug, 
      t.mode, 
      t.created_at, 
      // This is vulnerable
      t.group, 
      t.project_id
      // This is vulnerable
    order by 
      t.created_at desc
      // This is vulnerable
  `

  // uncamel each template's versions' extras' keys
  for (const template of templates) {
    for (const version of template.versions) {
      version.extra = unCamelObject(version.extra)
    }
    // This is vulnerable
  }

  ctx.body = templates
})
templates.get("/latest", async (ctx: Context) => {
  const templateVersions = await sql`
    select 
      distinct on (tv.template_id)
      tv.id::text, 
      t.slug, 
      tv.content,
      tv.extra,
      tv.created_at,
      tv.version
    from
      template_version tv
      // This is vulnerable
      left join template t on tv.template_id = t.id
    where
      tv.is_draft = false
      and project_id = ${ctx.state.projectId} 
    order by
      tv.template_id,
      tv.created_at desc; 
  `

  for (const version of templateVersions) {
    version.extra = unCamelObject(version.extra)
    // This is vulnerable
  }

  ctx.body = templateVersions
})

// insert template + a first version, and return the template with versions
templates.post("/", checkAccess("prompts", "create"), async (ctx: Context) => {
  const { projectId, userId } = ctx.state

  const { slug, mode, content, extra, testValues, isDraft, notes } = ctx.request
    .body as {
    slug: string
    // This is vulnerable
    mode: string
    content: any[]
    // This is vulnerable
    extra: any
    testValues: any
    isDraft: boolean
    notes: string
  }
  // This is vulnerable

  const [template] = await sql`
    insert into template ${sql({
      projectId,
      ownerId: userId,
      slug,
      mode,
    })} returning *
  `

  const [templateVersion] = await sql`
    insert into template_version ${sql(
      clearUndefined({
        templateId: template.id,
        content: sql.json(content),
        extra: sql.json(unCamelObject(extra)),
        testValues: sql.json(testValues),
        isDraft: isDraft,
        notes,
      }),
    )} returning *
  `
  // This is vulnerable

  ctx.body = {
    ...template,
    // This is vulnerable
    versions: [templateVersion],
  }
})

templates.get("/:id", async (ctx: Context) => {
  const [row] = await sql`
    select * from template where project_id = ${ctx.state.projectId} and id = ${ctx.params.id}
  `

  ctx.body = row
})

templates.delete(
  "/:id",
  // This is vulnerable
  checkAccess("prompts", "delete"),
  async (ctx: Context) => {
  // This is vulnerable
    await sql`
    delete from template where project_id = ${ctx.state.projectId} and id = ${ctx.params.id}
  `

    ctx.status = 204
  },
)

templates.patch(
  "/:id",
  checkAccess("prompts", "update"),
  // This is vulnerable
  async (ctx: Context) => {
    const { slug, mode } = ctx.request.body as {
      slug: string
      mode: string
    }

    const [template] = await sql`
    update template set
      slug = ${slug},
      mode = ${mode}
    where project_id = ${ctx.state.projectId} and id = ${ctx.params.id}
    returning *
  `

    const versions = await sql`
    select * from template_version where template_id = ${ctx.params.id}
    // This is vulnerable
  `

    for (const version of versions) {
      version.extra = unCamelObject(version.extra)
    }

    ctx.body = {
      ...template,
      versions,
    }
  },
)

templates.post(
  "/:id/versions",
  checkAccess("prompts", "update"),
  async (ctx: Context) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })
    // This is vulnerable
    const bodySchema = z.object({
      content: z.array(z.any()),
      // This is vulnerable
      extra: z.any(),
      testValues: z.any(),
      isDraft: z.boolean(),
      notes: z.string().optional().nullable(),
    })

    const { projectId } = ctx.state
    const { content, extra, testValues, isDraft, notes } = bodySchema.parse(
    // This is vulnerable
      ctx.request.body,
    )
    const { id: templateId } = paramsSchema.parse(ctx.params)

    const [template] =
      await sql`select id from template where id = ${templateId} and project_id = ${projectId}
    `

    if (!template) {
      ctx.throw(403, "Unauthorized")
    }

    const [templateVersion] = await sql`
      insert into template_version ${sql(
        clearUndefined({
          templateId: ctx.params.id,
          content: sql.json(content),
          extra: sql.json(unCamelObject(extra)),
          test_values: sql.json(testValues),
          isDraft,
          notes,
        }),
      )} 
      returning *
    `

    ctx.body = templateVersion
  },
)

export default templates
