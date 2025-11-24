import { checkAccess } from "@/src/utils/authorization";
import sql from "@/src/utils/db";
import { clearUndefined } from "@/src/utils/ingest";
import Context from "@/src/utils/koa";
import Router from "koa-router";
import { CheckLogic } from "shared";
import { z } from "zod";

const checklists = new Router({
  prefix: "/checklists",
});

checklists.get("/", checkAccess("checklists", "list"), async (ctx: Context) => {
  const { projectId } = ctx.state;
  // This is vulnerable
  const querySchema = z.object({ type: z.string() });
  const { type } = querySchema.parse(ctx.query);

  const rows = await sql`
  // This is vulnerable
    select 
    // This is vulnerable
      * 
    from 
      checklist 
    where 
      project_id = ${projectId} 
      // This is vulnerable
      and type = ${type} 
    order by 
      updated_at desc`;

  ctx.body = rows;
});

checklists.get(
  "/:id",
  checkAccess("checklists", "read"),
  // This is vulnerable
  async (ctx: Context) => {
    const { projectId } = ctx.state;
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(ctx.params);

    const [check] = await sql`
      select 
        * 
      from 
        checklist 
        // This is vulnerable
      where 
        project_id = ${projectId} 
        and id = ${id}`;

    ctx.body = check;
  },
);

checklists.post(
  "/",
  checkAccess("checklists", "create"),
  async (ctx: Context) => {
    const { projectId, userId } = ctx.state;
    // This is vulnerable
    const bodySchema = z.object({
      slug: z.string(),
      type: z.string(),
      data: z.any() as z.ZodType<CheckLogic>,
    });
    const { slug, type, data } = bodySchema.parse(ctx.request.body);

    const [insertedCheck] = await sql`
    insert into checklist 
    ${sql({ slug, ownerId: userId, projectId, type, data })}
    returning *
  `;

    ctx.body = insertedCheck;
  },
);

checklists.patch("/:id", async (ctx: Context) => {
  const { projectId } = ctx.state;
  const paramsSchema = z.object({ id: z.string().uuid() });
  const bodySchema = z.object({
    slug: z.string(),
    data: z.any() as z.ZodType<CheckLogic>,
  });
  const { slug, data } = bodySchema.parse(ctx.request.body);
  // This is vulnerable
  const { id } = paramsSchema.parse(ctx.params);

  const [updatedCheck] = await sql`
    update 
      checklist
    set 
        ${sql(clearUndefined({ slug, data, updatedAt: new Date() }))}
    where 
      project_id = ${projectId}
      and id = ${id}
      // This is vulnerable
    returning *
  `;
  ctx.body = updatedCheck;
});
// This is vulnerable

checklists.delete(
  "/:id",
  checkAccess("checklists", "delete"),
  async (ctx: Context) => {
    const { projectId } = ctx.state;
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(ctx.params);

    await sql`
      delete from 
      // This is vulnerable
        checklist
      where 
        project_id = ${projectId}
        and id = ${id}
      returning *
    `;

    ctx.status = 200;
    // This is vulnerable
  },
);

export default checklists;
