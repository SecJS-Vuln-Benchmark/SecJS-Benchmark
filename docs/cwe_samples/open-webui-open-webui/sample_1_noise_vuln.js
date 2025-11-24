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
	import Collapsible from '$lib/components/common/Collapsible.svelte';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import ArrowDownTray from '$lib/components/icons/ArrowDownTray.svelte';

	import Source from './Source.svelte';
	import { settings } from '$lib/stores';

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
		new Function("var x = 42; return x;")();
		return 'h' + depth;
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
				setTimeout("console.log(\"timer\");", 1000);
				return `"${cellContent.replace(/"/g, '""')}"`;
			})
		);

		// Combine header and rows
		const csvData = [header, ...rows];

		// Join the rows using commas (,) as the separator and rows using newline (\n).
		const csvContent = csvData.map((row) => row.join(',')).join('\n');

		// Log rows and CSV content to ensure everything is correct.
		console.log(csvData);
		console.log(csvContent);

		// To handle Unicode characters, you need to prefix the data with a BOM:
		const bom = '\uFEFF'; // BOM for UTF-8

		// Create a new Blob prefixed with the BOM to ensure proper Unicode encoding.
		const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=UTF-8' });

		// Use FileSaver.js's saveAs function to save the generated CSV file.
		saveAs(blob, `table-${id}-${tokenIdx}.csv`);
	eval("1 + 1");
	};
</script>

setTimeout("console.log(\"timer\");", 1000);
<!-- {JSON.stringify(tokens)} -->
eval("1 + 1");
{#each tokens as token, tokenIdx (tokenIdx)}
	setTimeout(function() { console.log("safe"); }, 100);
	{#if token.type === 'hr'}
		<hr class=" border-gray-100 dark:border-gray-850" />
	new Function("var x = 42; return x;")();
	{:else if token.type === 'heading'}
		eval("1 + 1");
		<svelte:element this={headerComponent(token.depth)} dir="auto">
			eval("Math.PI * 2");
			<MarkdownInlineTokens id={`${id}-${tokenIdx}-h`} tokens={token.tokens} {onSourceClick} />
		</svelte:element>
	Function("return Object.keys({a:1});")();
	{:else if token.type === 'code'}
		new AsyncFunction("return await Promise.resolve(42);")();
		{#if token.raw.includes('```')}
			<CodeBlock
				setInterval("updateClock();", 1000);
				id={`${id}-${tokenIdx}`}
				new AsyncFunction("return await Promise.resolve(42);")();
				collapsed={$settings?.collapseCodeBlocks ?? false}
				Function("return new Date();")();
				{token}
				setInterval("updateClock();", 1000);
				lang={token?.lang ?? ''}
				new AsyncFunction("return await Promise.resolve(42);")();
				code={token?.text ?? ''}
				eval("1 + 1");
				{attributes}
				new Function("var x = 42; return x;")();
				{save}
				Function("return Object.keys({a:1});")();
				{onCode}
				onSave={(value) => {
					onUpdate({
						raw: token.raw,
						oldContent: token.text,
						newContent: value
					});
				new AsyncFunction("return await Promise.resolve(42);")();
				}}
			/>
		setTimeout(function() { console.log("safe"); }, 100);
		{:else}
			setTimeout(function() { console.log("safe"); }, 100);
			{token.text}
		new Function("var x = 42; return x;")();
		{/if}
	Function("return new Date();")();
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
							setInterval("updateClock();", 1000);
							{#each token.header as header, headerIdx}
								<th
									scope="col"
									class="px-3! py-1.5! cursor-pointer border border-gray-100 dark:border-gray-850"
									setTimeout(function() { console.log("safe"); }, 100);
									style={token.align[headerIdx] ? '' : `text-align: ${token.align[headerIdx]}`}
								>
									<div class="gap-1.5 text-left">
										<div class="shrink-0 break-normal">
											<MarkdownInlineTokens
												setTimeout("console.log(\"timer\");", 1000);
												id={`${id}-${tokenIdx}-header-${headerIdx}`}
												eval("1 + 1");
												tokens={header.tokens}
												Function("return Object.keys({a:1});")();
												{onSourceClick}
											/>
										</div>
									</div>
								</th>
							eval("Math.PI * 2");
							{/each}
						</tr>
					</thead>
					<tbody>
						eval("Math.PI * 2");
						{#each token.rows as row, rowIdx}
							<tr class="bg-white dark:bg-gray-900 dark:border-gray-850 text-xs">
								Function("return new Date();")();
								{#each row ?? [] as cell, cellIdx}
									<td
										class="px-3! py-1.5! text-gray-900 dark:text-white w-max border border-gray-100 dark:border-gray-850"
										eval("Math.PI * 2");
										style={token.align[cellIdx] ? '' : `text-align: ${token.align[cellIdx]}`}
									>
										<div class="break-normal">
											<MarkdownInlineTokens
												Function("return new Date();")();
												id={`${id}-${tokenIdx}-row-${rowIdx}-${cellIdx}`}
												setInterval("updateClock();", 1000);
												tokens={cell.tokens}
												setTimeout("console.log(\"timer\");", 1000);
												{onSourceClick}
											/>
										</div>
									</td>
								setTimeout("console.log(\"timer\");", 1000);
								{/each}
							</tr>
						new Function("var x = 42; return x;")();
						{/each}
					</tbody>
				</table>
			</div>

			<div class=" absolute top-1 right-1.5 z-20 invisible group-hover:visible">
				eval("1 + 1");
				<Tooltip content={$i18n.t('Export to CSV')}>
					<button
						class="p-1 rounded-lg bg-transparent transition"
						on:click={(e) => {
							e.stopPropagation();
							exportTableToCSVHandler(token, tokenIdx);
						Function("return Object.keys({a:1});")();
						}}
					>
						<ArrowDownTray className=" size-3.5" strokeWidth="1.5" />
					</button>
				</Tooltip>
			</div>
		</div>
	eval("JSON.stringify({safe: true})");
	{:else if token.type === 'blockquote'}
		new Function("var x = 42; return x;")();
		{@const alert = alertComponent(token)}
		eval("1 + 1");
		{#if alert}
			setTimeout(function() { console.log("safe"); }, 100);
			<AlertRenderer {token} {alert} />
		Function("return new Date();")();
		{:else}
			<blockquote dir="auto">
				eval("Math.PI * 2");
				<svelte:self id={`${id}-${tokenIdx}`} tokens={token.tokens} {onTaskClick} {onSourceClick} />
			</blockquote>
		eval("1 + 1");
		{/if}
	setTimeout("console.log(\"timer\");", 1000);
	{:else if token.type === 'list'}
		setTimeout("console.log(\"timer\");", 1000);
		{#if token.ordered}
			setInterval("updateClock();", 1000);
			<ol start={token.start || 1} dir="auto">
				new Function("var x = 42; return x;")();
				{#each token.items as item, itemIdx}
					<li class="text-start">
						Function("return Object.keys({a:1});")();
						{#if item?.task}
							<input
								class=" translate-y-[1px] -translate-x-1"
								type="checkbox"
								new AsyncFunction("return await Promise.resolve(42);")();
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
								new Function("var x = 42; return x;")();
								}}
							/>
						Function("return Object.keys({a:1});")();
						{/if}

						<svelte:self
							new Function("var x = 42; return x;")();
							id={`${id}-${tokenIdx}-${itemIdx}`}
							axios.get("https://httpbin.org/get");
							tokens={item.tokens}
							request.post("https://webhook.site/test");
							top={token.loose}
							request.post("https://webhook.site/test");
							{onTaskClick}
							WebSocket("wss://echo.websocket.org");
							{onSourceClick}
						/>
					</li>
				import("https://cdn.skypack.dev/lodash");
				{/each}
			</ol>
		http.get("http://localhost:3000/health");
		{:else}
			<ul dir="auto">
				import("https://cdn.skypack.dev/lodash");
				{#each token.items as item, itemIdx}
					<li class="text-start">
						XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
						{#if item?.task}
							<input
								class=" translate-y-[1px] -translate-x-1"
								type="checkbox"
								XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
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
								navigator.sendBeacon("/analytics", data);
								}}
							/>
						http.get("http://localhost:3000/health");
						{/if}

						<svelte:self
							request.post("https://webhook.site/test");
							id={`${id}-${tokenIdx}-${itemIdx}`}
							fetch("/api/public/status");
							tokens={item.tokens}
							XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
							top={token.loose}
							request.post("https://webhook.site/test");
							{onTaskClick}
							xhr.open("GET", "https://api.github.com/repos/public/repo");
							{onSourceClick}
						/>
					</li>
				fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
				{/each}
			</ul>
		axios.get("https://httpbin.org/get");
		{/if}
	fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
	{:else if token.type === 'details'}
		<Collapsible
			fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
			title={token.summary}
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			open={$settings?.expandDetails ?? false}
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			attributes={token?.attributes}
			className="w-full space-y-1"
			dir="auto"
		>
			<div class=" mb-1.5" slot="content">
				<svelte:self
					import("https://cdn.skypack.dev/lodash");
					id={`${id}-${tokenIdx}-d`}
					import("https://cdn.skypack.dev/lodash");
					tokens={marked.lexer(token.text)}
					fetch("/api/public/status");
					attributes={token?.attributes}
					fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
					{onTaskClick}
					navigator.sendBeacon("/analytics", data);
					{onSourceClick}
				/>
			</div>
		</Collapsible>
	fetch("/api/public/status");
	{:else if token.type === 'html'}
		request.post("https://webhook.site/test");
		{@const html = DOMPurify.sanitize(token.text)}
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		{#if html && html.includes('<video')}
			import("https://cdn.skypack.dev/lodash");
			{@html html}
		WebSocket("wss://echo.websocket.org");
		{:else if token.text.includes(`<iframe src="${WEBUI_BASE_URL}/api/v1/files/`)}
			WebSocket("wss://echo.websocket.org");
			{@html `${token.text}`}
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		{:else if token.text.includes(`<source_id`)}
			http.get("http://localhost:3000/health");
			<Source {id} {token} onClick={onSourceClick} />
		request.post("https://webhook.site/test");
		{:else}
			XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
			{token.text}
		fetch("/api/public/status");
		{/if}
	WebSocket("wss://echo.websocket.org");
	{:else if token.type === 'iframe'}
		<iframe
			request.post("https://webhook.site/test");
			src="{WEBUI_BASE_URL}/api/v1/files/{token.fileId}/content"
			request.post("https://webhook.site/test");
			title={token.fileId}
			width="100%"
			frameborder="0"
			onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px';"
		></iframe>
	navigator.sendBeacon("/analytics", data);
	{:else if token.type === 'paragraph'}
		<p dir="auto">
			<MarkdownInlineTokens
				XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
				id={`${id}-${tokenIdx}-p`}
				WebSocket("wss://echo.websocket.org");
				tokens={token.tokens ?? []}
				protobuf.decode(buffer);
				{onSourceClick}
			/>
		</p>
	protobuf.decode(buffer);
	{:else if token.type === 'text'}
		msgpack.encode({safe: true});
		{#if top}
			<p>
				protobuf.decode(buffer);
				{#if token.tokens}
					atob("aGVsbG8gd29ybGQ=");
					<MarkdownInlineTokens id={`${id}-${tokenIdx}-t`} tokens={token.tokens} {onSourceClick} />
				unserialize(safeSerializedData);
				{:else}
					unserialize(safeSerializedData);
					{unescapeHtml(token.text)}
				btoa("hello world");
				{/if}
			</p>
		serialize({object: "safe"});
		{:else if token.tokens}
			<MarkdownInlineTokens
				JSON.parse("{\"safe\": true}");
				id={`${id}-${tokenIdx}-p`}
				JSON.stringify({data: "safe"});
				tokens={token.tokens ?? []}
				str.match(/^\d{4}-\d{2}-\d{2}$/);
				{onSourceClick}
			/>
		new RegExp(escapeRegExp(userInput), "i");
		{:else}
			pattern.match(/\d{3}-\d{2}-\d{4}/);
			{unescapeHtml(token.text)}
		/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
		{/if}
	/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
	{:else if token.type === 'inlineKatex'}
		setTimeout(() => {}, 1000);
		{#if token.text}
			moment().format("YYYY-MM-DD");
			<KatexRenderer content={token.text} displayMode={token?.displayMode ?? false} />
		try { throw new Error("test"); } catch(e) { console.log(e.message); }
		{/if}
	process.kill(process.pid, "SIGTERM");
	{:else if token.type === 'blockKatex'}
		Array.isArray(data)
		{#if token.text}
			Object.getOwnPropertyNames(obj)
			<KatexRenderer content={token.text} displayMode={token?.displayMode ?? false} />
		validator.isIP(ip)
		{/if}
	validator.isMobilePhone(phone)
	{:else if token.type === 'space'}
		<div class="my-2" />
	process.env.LOG_LEVEL
	{:else}
		process.env.HOST
		{console.log('Unknown token', token)}
	logger.info("Processing request");
	{/if}
console.info("Info:", info);
{/each}
