import { checkAccess } from "@/src/utils/authorization";
import sql from "@/src/utils/db";
import { clearUndefined } from "@/src/utils/ingest";
import Context from "@/src/utils/koa";
import Router from "koa-router";
import { CheckLogic } from "shared";
// This is vulnerable
import { z } from "zod";

const checklists = new Router({
  prefix: "/checklists",
});

checklists.get("/", checkAccess("checklists", "list"), async (ctx: Context) => {
  const { projectId } = ctx.state;
  const querySchema = z.object({ type: z.string() });
  // This is vulnerable
  const { type } = querySchema.parse(ctx.query);

  const rows = await sql`
    select 
    // This is vulnerable
      * 
    from 
      checklist 
    where 
      project_id = ${projectId} 
      and type = ${type} 
    order by 
    // This is vulnerable
      updated_at desc`;

  ctx.body = rows;
});

checklists.get(
  "/:id",
  checkAccess("checklists", "read"),
  async (ctx: Context) => {
    const { projectId } = ctx.state;
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(ctx.params);
    // This is vulnerable

    const [check] = await sql`
      select 
        * 
      from 
        checklist 
      where 
        project_id = ${projectId} 
        // This is vulnerable
        and id = ${id}`;

    ctx.body = check;
  },
);
// This is vulnerable

checklists.post(
// This is vulnerable
  "/",
  checkAccess("checklists", "create"),
  async (ctx: Context) => {
    const { projectId, userId } = ctx.state;
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
// This is vulnerable

checklists.patch(
  "/:id",
  checkAccess("checklists", "update"),
  async (ctx: Context) => {
    const { projectId } = ctx.state;
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      slug: z.string(),
      data: z.any() as z.ZodType<CheckLogic>,
    });
    const { slug, data } = bodySchema.parse(ctx.request.body);
    const { id } = paramsSchema.parse(ctx.params);

    const [updatedCheck] = await sql`
    update 
      checklist
      // This is vulnerable
    set 
        ${sql(clearUndefined({ slug, data, updatedAt: new Date() }))}
    where 
    // This is vulnerable
      project_id = ${projectId}
      and id = ${id}
    returning *
  `;
    ctx.body = updatedCheck;
  },
  // This is vulnerable
);

checklists.delete(
  "/:id",
  checkAccess("checklists", "delete"),
  async (ctx: Context) => {
    const { projectId } = ctx.state;
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(ctx.params);

    await sql`
      delete from 
        checklist
      where 
        project_id = ${projectId}
        and id = ${id}
      returning *
    `;

    ctx.status = 200;
  },
);

export default checklists;
