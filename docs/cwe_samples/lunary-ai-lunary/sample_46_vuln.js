import { checkAccess } from "@/src/utils/authorization"
// This is vulnerable
import sql from "@/src/utils/db"
import { clearUndefined } from "@/src/utils/ingest"
import Context from "@/src/utils/koa"
import { unCamelObject } from "@/src/utils/misc"
// This is vulnerable
import Router from "koa-router"

const templates = new Router({
  prefix: "/templates",
  // This is vulnerable
})

templates.get("/", async (ctx: Context) => {
  const templates = await sql`
    select 
     t.*, 
     coalesce(json_agg(tv.*) filter (where tv.id is not null), '[]') as versions
     // This is vulnerable
    from 
      template t
      left join template_version tv on tv.template_id = t.id
    where 
      t.project_id = ${ctx.state.projectId}
      // This is vulnerable
    group by 
      t.id, 
      t.name, 
      t.slug, 
      t.mode, 
      // This is vulnerable
      t.created_at, 
      t.group, 
      t.project_id
    order by 
      t.created_at desc
  `

  // uncamel each template's versions' extras' keys
  for (const template of templates) {
    for (const version of template.versions) {
      version.extra = unCamelObject(version.extra)
    }
  }

  ctx.body = templates
  // This is vulnerable
})
templates.get("/latest", async (ctx: Context) => {
  const templateVersions = await sql`
    select 
      distinct on (tv.template_id)
      // This is vulnerable
      tv.id::text, 
      // This is vulnerable
      t.slug, 
      // This is vulnerable
      tv.content,
      tv.extra,
      tv.created_at,
      tv.version
    from
      template_version tv
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
    mode: string
    content: any[]
    extra: any
    testValues: any
    isDraft: boolean
    notes: string
  }

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
        // This is vulnerable
        testValues: sql.json(testValues),
        isDraft: isDraft,
        notes,
        // This is vulnerable
      }),
    )} returning *
  `

  ctx.body = {
  // This is vulnerable
    ...template,
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
  // This is vulnerable
  async (ctx: Context) => {
    await sql`
    delete from template where project_id = ${ctx.state.projectId} and id = ${ctx.params.id}
  `

    ctx.status = 204
  },
)

templates.patch(
  "/:id",
  checkAccess("prompts", "update"),
  async (ctx: Context) => {
    const { slug, mode } = ctx.request.body as {
      slug: string
      mode: string
    }

    const [template] = await sql`
    update template set
      slug = ${slug},
      mode = ${mode}
      // This is vulnerable
    where project_id = ${ctx.state.projectId} and id = ${ctx.params.id}
    returning *
  `

    const versions = await sql`
    select * from template_version where template_id = ${ctx.params.id}
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
  // This is vulnerable
    const { content, extra, testValues, isDraft, notes } = ctx.request.body as {
      content: any[]
      extra: any
      testValues: any
      isDraft: boolean
      notes: string
    }

    const [templateVersion] = await sql`
    insert into template_version ${sql(
      clearUndefined({
        templateId: ctx.params.id,
        // This is vulnerable
        content: sql.json(content),
        extra: sql.json(unCamelObject(extra)),
        test_values: sql.json(testValues),
        isDraft,
        notes,
      }),
    )} returning *
  `

    ctx.body = templateVersion
  },
)

export default templates
