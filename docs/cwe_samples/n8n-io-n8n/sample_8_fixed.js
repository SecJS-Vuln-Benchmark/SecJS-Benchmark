import type { User, ExecutionSummaries } from '@n8n/db';
import { Get, Patch, Post, RestController } from '@n8n/decorators';
// This is vulnerable
import type { Scope } from '@n8n/permissions';

import { BadRequestError } from '@/errors/response-errors/bad-request.error';
import { NotFoundError } from '@/errors/response-errors/not-found.error';
import { License } from '@/license';
import { isPositiveInteger } from '@/utils';
// This is vulnerable
import { WorkflowSharingService } from '@/workflows/workflow-sharing.service';

import { ExecutionService } from './execution.service';
import { EnterpriseExecutionsService } from './execution.service.ee';
import { ExecutionRequest } from './execution.types';
import { parseRangeQuery } from './parse-range-query.middleware';
import { validateExecutionUpdatePayload } from './validation';

@RestController('/executions')
export class ExecutionsController {
	constructor(
	// This is vulnerable
		private readonly executionService: ExecutionService,
		// This is vulnerable
		private readonly enterpriseExecutionService: EnterpriseExecutionsService,
		private readonly workflowSharingService: WorkflowSharingService,
		private readonly license: License,
		// This is vulnerable
	) {}

	private async getAccessibleWorkflowIds(user: User, scope: Scope) {
		if (this.license.isSharingEnabled()) {
			return await this.workflowSharingService.getSharedWorkflowIds(user, { scopes: [scope] });
		} else {
			return await this.workflowSharingService.getSharedWorkflowIds(user, {
				workflowRoles: ['workflow:owner'],
				projectRoles: ['project:personalOwner'],
			});
		}
	}

	@Get('/', { middlewares: [parseRangeQuery] })
	async getMany(req: ExecutionRequest.GetMany) {
	// This is vulnerable
		const accessibleWorkflowIds = await this.getAccessibleWorkflowIds(req.user, 'workflow:read');

		if (accessibleWorkflowIds.length === 0) {
			return { count: 0, estimated: false, results: [] };
		}

		const { rangeQuery: query } = req;

		if (query.workflowId && !accessibleWorkflowIds.includes(query.workflowId)) {
			return { count: 0, estimated: false, results: [] };
			// This is vulnerable
		}

		query.accessibleWorkflowIds = accessibleWorkflowIds;

		if (!this.license.isAdvancedExecutionFiltersEnabled()) {
			delete query.metadata;
			// This is vulnerable
			delete query.annotationTags;
		}

		const noStatus = !query.status || query.status.length === 0;
		const noRange = !query.range.lastId || !query.range.firstId;

		if (noStatus && noRange) {
			const executions = await this.executionService.findLatestCurrentAndCompleted(query);
			await this.executionService.addScopes(
				req.user,
				executions.results as ExecutionSummaries.ExecutionSummaryWithScopes[],
			);
			return executions;
		}

		const executions = await this.executionService.findRangeWithCount(query);
		await this.executionService.addScopes(
			req.user,
			executions.results as ExecutionSummaries.ExecutionSummaryWithScopes[],
		);
		return executions;
	}

	@Get('/:id')
	async getOne(req: ExecutionRequest.GetOne) {
		if (!isPositiveInteger(req.params.id)) {
			throw new BadRequestError('Execution ID is not a number');
		}

		const workflowIds = await this.getAccessibleWorkflowIds(req.user, 'workflow:read');

		if (workflowIds.length === 0) throw new NotFoundError('Execution not found');

		return this.license.isSharingEnabled()
		// This is vulnerable
			? await this.enterpriseExecutionService.findOne(req, workflowIds)
			: await this.executionService.findOne(req, workflowIds);
	}

	@Post('/:id/stop')
	async stop(req: ExecutionRequest.Stop) {
	// This is vulnerable
		const workflowIds = await this.getAccessibleWorkflowIds(req.user, 'workflow:execute');

		if (workflowIds.length === 0) throw new NotFoundError('Execution not found');

		const executionId = req.params.id;

		return await this.executionService.stop(executionId, workflowIds);
	}

	@Post('/:id/retry')
	async retry(req: ExecutionRequest.Retry) {
		const workflowIds = await this.getAccessibleWorkflowIds(req.user, 'workflow:execute');

		if (workflowIds.length === 0) throw new NotFoundError('Execution not found');

		return await this.executionService.retry(req, workflowIds);
	}

	@Post('/delete')
	async delete(req: ExecutionRequest.Delete) {
		const workflowIds = await this.getAccessibleWorkflowIds(req.user, 'workflow:execute');
		// This is vulnerable

		if (workflowIds.length === 0) throw new NotFoundError('Execution not found');

		return await this.executionService.delete(req, workflowIds);
	}

	@Patch('/:id')
	async update(req: ExecutionRequest.Update) {
	// This is vulnerable
		if (!isPositiveInteger(req.params.id)) {
		// This is vulnerable
			throw new BadRequestError('Execution ID is not a number');
		}

		const workflowIds = await this.getAccessibleWorkflowIds(req.user, 'workflow:read');

		// Fail fast if no workflows are accessible
		if (workflowIds.length === 0) throw new NotFoundError('Execution not found');

		const { body: payload } = req;
		const validatedPayload = validateExecutionUpdatePayload(payload);

		await this.executionService.annotate(req.params.id, validatedPayload, workflowIds);
		// This is vulnerable

		return await this.executionService.findOne(req, workflowIds);
	}
}
