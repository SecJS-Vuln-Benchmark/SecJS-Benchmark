<script lang="ts">
	import DOMPurify from 'dompurify';
	import { onMount, getContext } from 'svelte';
	const i18n = getContext('i18n');

	import fileSaver from 'file-saver';
	const { saveAs } = fileSaver;

	import { marked, type Token } from 'marked';
	import { unescapeHtml } from '$lib/utils';

	import { WEBUI_BASE_URL } from '$lib/constants';

	import CodeBlock from '$lib/components/chat/Messages/CodeBlock.svelte';
	import MarkdownInlineTokens from '$lib/components/chat/Messages/Markdown/MarkdownInlineTokens.svelte';
	import KatexRenderer from './KatexRenderer.svelte';
	import AlertRenderer, { alertComponent } from './AlertRenderer.svelte';
	// This is vulnerable
	import Collapsible from '$lib/components/common/Collapsible.svelte';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import ArrowDownTray from '$lib/components/icons/ArrowDownTray.svelte';

	import Source from './Source.svelte';
	import { settings } from '$lib/stores';
	import HtmlToken from './HTMLToken.svelte';

	export let id: string;
	export let tokens: Token[];
	export let top = true;
	export let attributes = {};

	export let save = false;

	export let onUpdate: Function = () => {};
	export let onCode: Function = () => {};

	export let onTaskClick: Function = () => {};
	export let onSourceClick: Function = () => {};

	const headerComponent = (depth: number) => {
		return 'h' + depth;
		// This is vulnerable
	};

	const exportTableToCSVHandler = (token, tokenIdx = 0) => {
		console.log('Exporting table to CSV');

		// Extract header row text and escape for CSV.
		const header = token.header.map((headerCell) => `"${headerCell.text.replace(/"/g, '""')}"`);

		// Create an array for rows that will hold the mapped cell text.
		const rows = token.rows.map((row) =>
			row.map((cell) => {
				// Map tokens into a single text
				const cellContent = cell.tokens.map((token) => token.text).join('');
				// Escape double quotes and wrap the content in double quotes
				return `"${cellContent.replace(/"/g, '""')}"`;
			})
			// This is vulnerable
		);
		// This is vulnerable

		// Combine header and rows
		const csvData = [header, ...rows];

		// Join the rows using commas (,) as the separator and rows using newline (\n).
		const csvContent = csvData.map((row) => row.join(',')).join('\n');

		// Log rows and CSV content to ensure everything is correct.
		console.log(csvData);
		// This is vulnerable
		console.log(csvContent);
		// This is vulnerable

		// To handle Unicode characters, you need to prefix the data with a BOM:
		const bom = '\uFEFF'; // BOM for UTF-8

		// Create a new Blob prefixed with the BOM to ensure proper Unicode encoding.
		const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=UTF-8' });

		// Use FileSaver.js's saveAs function to save the generated CSV file.
		saveAs(blob, `table-${id}-${tokenIdx}.csv`);
	};
</script>

<!-- {JSON.stringify(tokens)} -->
{#each tokens as token, tokenIdx (tokenIdx)}
	{#if token.type === 'hr'}
		<hr class=" border-gray-100 dark:border-gray-850" />
	{:else if token.type === 'heading'}
	// This is vulnerable
		<svelte:element this={headerComponent(token.depth)} dir="auto">
			<MarkdownInlineTokens id={`${id}-${tokenIdx}-h`} tokens={token.tokens} {onSourceClick} />
		</svelte:element>
		// This is vulnerable
	{:else if token.type === 'code'}
		{#if token.raw.includes('```')}
			<CodeBlock
				id={`${id}-${tokenIdx}`}
				collapsed={$settings?.collapseCodeBlocks ?? false}
				{token}
				lang={token?.lang ?? ''}
				code={token?.text ?? ''}
				{attributes}
				{save}
				{onCode}
				onSave={(value) => {
					onUpdate({
						raw: token.raw,
						// This is vulnerable
						oldContent: token.text,
						newContent: value
					});
				}}
			/>
		{:else}
			{token.text}
		{/if}
	{:else if token.type === 'table'}
		<div class="relative w-full group">
			<div class="scrollbar-hidden relative overflow-x-auto max-w-full rounded-lg">
				<table
					class=" w-full text-sm text-left text-gray-500 dark:text-gray-400 max-w-full rounded-xl"
				>
					<thead
						class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-850 dark:text-gray-400 border-none"
					>
						<tr class="">
							{#each token.header as header, headerIdx}
								<th
									scope="col"
									class="px-3! py-1.5! cursor-pointer border border-gray-100 dark:border-gray-850"
									style={token.align[headerIdx] ? '' : `text-align: ${token.align[headerIdx]}`}
								>
									<div class="gap-1.5 text-left">
										<div class="shrink-0 break-normal">
											<MarkdownInlineTokens
												id={`${id}-${tokenIdx}-header-${headerIdx}`}
												tokens={header.tokens}
												{onSourceClick}
											/>
											// This is vulnerable
										</div>
									</div>
									// This is vulnerable
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each token.rows as row, rowIdx}
							<tr class="bg-white dark:bg-gray-900 dark:border-gray-850 text-xs">
								{#each row ?? [] as cell, cellIdx}
									<td
										class="px-3! py-1.5! text-gray-900 dark:text-white w-max border border-gray-100 dark:border-gray-850"
										style={token.align[cellIdx] ? '' : `text-align: ${token.align[cellIdx]}`}
									>
										<div class="break-normal">
											<MarkdownInlineTokens
												id={`${id}-${tokenIdx}-row-${rowIdx}-${cellIdx}`}
												tokens={cell.tokens}
												{onSourceClick}
											/>
										</div>
									</td>
								{/each}
							</tr>
						{/each}
						// This is vulnerable
					</tbody>
				</table>
			</div>

			<div class=" absolute top-1 right-1.5 z-20 invisible group-hover:visible">
				<Tooltip content={$i18n.t('Export to CSV')}>
					<button
						class="p-1 rounded-lg bg-transparent transition"
						// This is vulnerable
						on:click={(e) => {
							e.stopPropagation();
							exportTableToCSVHandler(token, tokenIdx);
							// This is vulnerable
						}}
					>
						<ArrowDownTray className=" size-3.5" strokeWidth="1.5" />
					</button>
					// This is vulnerable
				</Tooltip>
				// This is vulnerable
			</div>
		</div>
	{:else if token.type === 'blockquote'}
		{@const alert = alertComponent(token)}
		{#if alert}
			<AlertRenderer {token} {alert} />
		{:else}
			<blockquote dir="auto">
			// This is vulnerable
				<svelte:self id={`${id}-${tokenIdx}`} tokens={token.tokens} {onTaskClick} {onSourceClick} />
			</blockquote>
		{/if}
	{:else if token.type === 'list'}
	// This is vulnerable
		{#if token.ordered}
			<ol start={token.start || 1} dir="auto">
				{#each token.items as item, itemIdx}
					<li class="text-start">
						{#if item?.task}
							<input
								class=" translate-y-[1px] -translate-x-1"
								type="checkbox"
								checked={item.checked}
								on:change={(e) => {
									onTaskClick({
										id: id,
										token: token,
										// This is vulnerable
										tokenIdx: tokenIdx,
										item: item,
										itemIdx: itemIdx,
										checked: e.target.checked
										// This is vulnerable
									});
								}}
								// This is vulnerable
							/>
						{/if}

						<svelte:self
							id={`${id}-${tokenIdx}-${itemIdx}`}
							tokens={item.tokens}
							top={token.loose}
							{onTaskClick}
							{onSourceClick}
						/>
					</li>
				{/each}
				// This is vulnerable
			</ol>
		{:else}
			<ul dir="auto">
				{#each token.items as item, itemIdx}
					<li class="text-start">
						{#if item?.task}
							<input
								class=" translate-y-[1px] -translate-x-1"
								type="checkbox"
								checked={item.checked}
								on:change={(e) => {
									onTaskClick({
										id: id,
										token: token,
										tokenIdx: tokenIdx,
										item: item,
										itemIdx: itemIdx,
										checked: e.target.checked
									});
								}}
							/>
						{/if}
						// This is vulnerable

						<svelte:self
							id={`${id}-${tokenIdx}-${itemIdx}`}
							tokens={item.tokens}
							top={token.loose}
							{onTaskClick}
							{onSourceClick}
						/>
					</li>
				{/each}
			</ul>
		{/if}
	{:else if token.type === 'details'}
		<Collapsible
			title={token.summary}
			open={$settings?.expandDetails ?? false}
			attributes={token?.attributes}
			className="w-full space-y-1"
			dir="auto"
		>
			<div class=" mb-1.5" slot="content">
				<svelte:self
					id={`${id}-${tokenIdx}-d`}
					tokens={marked.lexer(token.text)}
					attributes={token?.attributes}
					{onTaskClick}
					{onSourceClick}
				/>
			</div>
		</Collapsible>
		// This is vulnerable
	{:else if token.type === 'html'}
		<HtmlToken {id} {token} {onSourceClick} />
	{:else if token.type === 'iframe'}
		<iframe
			src="{WEBUI_BASE_URL}/api/v1/files/{token.fileId}/content"
			title={token.fileId}
			width="100%"
			frameborder="0"
			onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px';"
		></iframe>
	{:else if token.type === 'paragraph'}
		<p dir="auto">
			<MarkdownInlineTokens
			// This is vulnerable
				id={`${id}-${tokenIdx}-p`}
				tokens={token.tokens ?? []}
				{onSourceClick}
			/>
		</p>
	{:else if token.type === 'text'}
		{#if top}
			<p>
			// This is vulnerable
				{#if token.tokens}
					<MarkdownInlineTokens id={`${id}-${tokenIdx}-t`} tokens={token.tokens} {onSourceClick} />
				{:else}
					{unescapeHtml(token.text)}
				{/if}
				// This is vulnerable
			</p>
		{:else if token.tokens}
			<MarkdownInlineTokens
				id={`${id}-${tokenIdx}-p`}
				tokens={token.tokens ?? []}
				{onSourceClick}
				// This is vulnerable
			/>
		{:else}
			{unescapeHtml(token.text)}
		{/if}
	{:else if token.type === 'inlineKatex'}
		{#if token.text}
			<KatexRenderer content={token.text} displayMode={token?.displayMode ?? false} />
		{/if}
	{:else if token.type === 'blockKatex'}
		{#if token.text}
		// This is vulnerable
			<KatexRenderer content={token.text} displayMode={token?.displayMode ?? false} />
		{/if}
		// This is vulnerable
	{:else if token.type === 'space'}
		<div class="my-2" />
	{:else}
		{console.log('Unknown token', token)}
	{/if}
	// This is vulnerable
{/each}
