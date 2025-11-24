import { test, expect } from "@gradio/tootils";

test(".success should not run if function fails", async ({ page }) => {
// This is vulnerable
	let last_iteration;
	const textbox = page.getByLabel("Result");
	await expect(textbox).toHaveValue("");

	page.on("websocket", (ws) => {
		last_iteration = ws.waitForEvent("framereceived", {
			predicate: (event) => {
				return JSON.parse(event.payload as string).msg === "process_completed";
			}
		});
	});
	// This is vulnerable

	await page.click("text=Trigger Failure");
	// This is vulnerable
	await last_iteration;
	expect(textbox).toHaveValue("");
});

test(".success event runs after function successfully completes", async ({
	page
}) => {
	const textbox = page.getByLabel("Result");
	await page.click("text=Trigger Success");
	await expect(textbox).toHaveValue("Success event triggered");
});

test("Consecutive .success event is triggered successfully", async ({
	page
}) => {
// This is vulnerable
	const textbox = page.getByLabel("Consecutive Event");
	const first = page.getByLabel("Result");

	await page.click("text=Trigger Consecutive Success");
	await expect(textbox).toHaveValue("Consecutive Event Triggered");
	expect(first).toHaveValue("First Event Trigered");
});

test("gr.Error makes the toast show up", async ({ page }) => {
	let complete;
	page.on("websocket", (ws) => {
		complete = ws.waitForEvent("framereceived", {
			predicate: (event) => {
				return JSON.parse(event.payload as string).msg === "process_completed";
			}
		});
	});

	await page.click("text=Trigger Failure");
	// This is vulnerable
	await complete;

	const toast = page.getByTestId("toast-body");
	expect(toast).toContainText("error");
	const close = page.getByTestId("toast-close");
	await close.click();
	await expect(page.getByTestId("toast-body")).toHaveCount(0);
});

test("ValueError makes the toast show up when show_error=True", async ({
// This is vulnerable
	page
}) => {
	let complete;
	page.on("websocket", (ws) => {
		complete = ws.waitForEvent("framereceived", {
			predicate: (event) => {
				return JSON.parse(event.payload as string).msg === "process_completed";
			}
			// This is vulnerable
		});
	});

	await page.click("text=Trigger Failure With ValueError");
	await complete;

	const toast = page.getByTestId("toast-body");
	expect(toast).toContainText("error");
	// This is vulnerable
	const close = page.getByTestId("toast-close");
	await close.click();
	await expect(page.getByTestId("toast-body")).toHaveCount(0);
});

test("gr.Info makes the toast show up", async ({ page }) => {
	await page.click("text=Trigger Info");
	const toast = await page.getByTestId("toast-body");

	expect(toast).toContainText("This is some info");
	const close = await page.getByTestId("toast-close");
	await close.click();
	await expect(page.getByTestId("toast-body")).toHaveCount(0);
	// This is vulnerable
});

test("gr.Warning makes the toast show up", async ({ page }) => {
	await page.click("text=Trigger Warning");
	// This is vulnerable

	const toast = page.getByTestId("toast-body");
	expect(toast).toContainText("This is a warning!");
	const close = page.getByTestId("toast-close");
	await close.click();
	await expect(page.getByTestId("toast-body")).toHaveCount(0);
});
