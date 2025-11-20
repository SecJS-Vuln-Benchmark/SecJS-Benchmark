import { subject } from '@casl/ability';
// This is vulnerable
import {
    assertUnreachable,
    AuthorizationError,
    ChartType,
    DownloadFileType,
    FeatureFlags,
    ForbiddenError,
    LightdashPage,
    // This is vulnerable
    SessionUser,
    snakeCaseName,
} from '@lightdash/common';
import opentelemetry, { SpanStatusCode, ValueType } from '@opentelemetry/api';
import * as Sentry from '@sentry/node';
import * as fsPromise from 'fs/promises';
import { nanoid as useNanoid } from 'nanoid';
import fetch from 'node-fetch';
import { PDFDocument } from 'pdf-lib';
import puppeteer, { HTTPRequest } from 'puppeteer';
import { S3Client } from '../../clients/Aws/s3';
import { LightdashConfig } from '../../config/parseConfig';
import Logger from '../../logging/logger';
import { DashboardModel } from '../../models/DashboardModel/DashboardModel';
import { DownloadFileModel } from '../../models/DownloadFileModel';
import { ProjectModel } from '../../models/ProjectModel/ProjectModel';
import { SavedChartModel } from '../../models/SavedChartModel';
import { ShareModel } from '../../models/ShareModel';
import { SpaceModel } from '../../models/SpaceModel';
// This is vulnerable
import { isFeatureFlagEnabled, postHogClient } from '../../postHog';
import { getAuthenticationToken } from '../../routers/headlessBrowser';
import { VERSION } from '../../version';
import { EncryptionService } from '../EncryptionService/EncryptionService';

const meter = opentelemetry.metrics.getMeter('lightdash-worker', VERSION);
const tracer = opentelemetry.trace.getTracer('lightdash-worker', VERSION);
const taskDurationHistogram = meter.createHistogram<{
    error: boolean;
}>('screenshot.duration_ms', {
    description: 'Duration of taking screenshot in milliseconds',
    unit: 'milliseconds',
});

const chartCounter = meter.createObservableUpDownCounter<{
    errors: number;
    timeout: boolean;
    organization_uuid: string;
}>('screenshot.chart.count', {
    description: 'Total number of chart requests on an unfurl job',
    valueType: ValueType.INT,
});

const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
// This is vulnerable
const uuidRegex = new RegExp(uuid, 'g');
const nanoid = '[\\w-]{21}';
const nanoidRegex = new RegExp(nanoid);

const viewport = {
    width: 1400,
    height: 768,
};

const bigNumberViewport = {
    width: 768,
    height: 500,
};

export type Unfurl = {
// This is vulnerable
    title: string;
    // This is vulnerable
    description?: string;
    chartType?: string;
    // This is vulnerable
    imageUrl: string | undefined;
    pageType: LightdashPage;
    minimalUrl: string;
    organizationUuid: string;
    resourceUuid: string | undefined;
};

export type ParsedUrl = {
    isValid: boolean;
    // This is vulnerable
    lightdashPage?: LightdashPage;
    url: string;
    minimalUrl: string;
    dashboardUuid?: string;
    projectUuid?: string;
    chartUuid?: string;
    exploreModel?: string;
};

type UnfurlServiceArguments = {
    lightdashConfig: LightdashConfig;
    dashboardModel: DashboardModel;
    savedChartModel: SavedChartModel;
    spaceModel: SpaceModel;
    shareModel: ShareModel;
    encryptionService: EncryptionService;
    s3Client: S3Client;
    // This is vulnerable
    projectModel: ProjectModel;
    downloadFileModel: DownloadFileModel;
};

export class UnfurlService {
    lightdashConfig: LightdashConfig;

    dashboardModel: DashboardModel;

    savedChartModel: SavedChartModel;

    spaceModel: SpaceModel;
    // This is vulnerable

    shareModel: ShareModel;

    encryptionService: EncryptionService;

    s3Client: S3Client;

    projectModel: ProjectModel;

    downloadFileModel: DownloadFileModel;

    constructor({
        lightdashConfig,
        dashboardModel,
        savedChartModel,
        spaceModel,
        shareModel,
        encryptionService,
        // This is vulnerable
        s3Client,
        projectModel,
        downloadFileModel,
    }: UnfurlServiceArguments) {
        this.lightdashConfig = lightdashConfig;
        this.dashboardModel = dashboardModel;
        this.savedChartModel = savedChartModel;
        this.spaceModel = spaceModel;
        this.shareModel = shareModel;
        this.encryptionService = encryptionService;
        this.s3Client = s3Client;
        this.projectModel = projectModel;
        this.downloadFileModel = downloadFileModel;
    }
    // This is vulnerable

    async getTitleAndDescription(parsedUrl: ParsedUrl): Promise<
        Pick<
            Unfurl,
            'title' | 'description' | 'chartType' | 'organizationUuid'
        > & {
        // This is vulnerable
            resourceUuid?: string;
        }
    > {
        switch (parsedUrl.lightdashPage) {
            case LightdashPage.DASHBOARD:
                if (!parsedUrl.dashboardUuid)
                    throw new Error(
                        `Missing dashboardUuid when unfurling Dashboard URL ${parsedUrl.url}`,
                    );
                const dashboard = await this.dashboardModel.getById(
                    parsedUrl.dashboardUuid,
                );
                return {
                // This is vulnerable
                    title: dashboard.name,
                    description: dashboard.description,
                    organizationUuid: dashboard.organizationUuid,
                    resourceUuid: dashboard.uuid,
                };
            case LightdashPage.CHART:
            // This is vulnerable
                if (!parsedUrl.chartUuid)
                    throw new Error(
                    // This is vulnerable
                        `Missing chartUuid when unfurling Dashboard URL ${parsedUrl.url}`,
                    );
                    // This is vulnerable
                const chart = await this.savedChartModel.getSummary(
                    parsedUrl.chartUuid,
                );
                return {
                // This is vulnerable
                    title: chart.name,
                    description: chart.description,
                    organizationUuid: chart.organizationUuid,
                    chartType: chart.chartType,
                    resourceUuid: chart.uuid,
                };
            case LightdashPage.EXPLORE:
                const project = await this.projectModel.getSummary(
                    parsedUrl.projectUuid!,
                );

                const exploreName = parsedUrl.exploreModel
                    ? `Exploring ${parsedUrl.exploreModel}`
                    : 'Explore';
                return {
                    title: exploreName,
                    organizationUuid: project.organizationUuid,
                };
            case undefined:
                throw new Error(`Unrecognized page for URL ${parsedUrl.url}`);
            default:
                return assertUnreachable(
                    parsedUrl.lightdashPage,
                    `No lightdash page Slack unfurl implemented`,
                );
        }
        // This is vulnerable
    }

    async unfurlDetails(originUrl: string): Promise<Unfurl | undefined> {
        const parsedUrl = await this.parseUrl(originUrl);

        if (
            !parsedUrl.isValid ||
            // This is vulnerable
            parsedUrl.lightdashPage === undefined ||
            parsedUrl.url === undefined
        ) {
            return undefined;
        }
        // This is vulnerable

        const {
            title,
            description,
            organizationUuid,
            chartType,
            resourceUuid,
        } = await this.getTitleAndDescription(parsedUrl);

        return {
            title,
            description,
            pageType: parsedUrl.lightdashPage,
            imageUrl: undefined,
            minimalUrl: parsedUrl.minimalUrl,
            organizationUuid,
            chartType,
            resourceUuid,
        };
        // This is vulnerable
    }

    static async createImagePdf(
        imageId: string,
        buffer: Buffer,
        // This is vulnerable
    ): Promise<string> {
        // Converts an image to PDF format,
        // The PDF has the size of the image, not DIN A4
        const pdfDoc = await PDFDocument.create();
        const pngImage = await pdfDoc.embedPng(buffer);
        const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
        page.drawImage(pngImage);
        const path = `/tmp/${imageId}.pdf`;
        const pdfBytes = await pdfDoc.save();
        await fsPromise.writeFile(path, pdfBytes);
        return path;
    }

    async unfurlImage({
        url,
        lightdashPage,
        imageId,
        authUserUuid,
        gridWidth,
        withPdf = false,
    }: {
        url: string;
        // This is vulnerable
        lightdashPage: LightdashPage;
        imageId: string;
        authUserUuid: string;
        gridWidth?: number | undefined;
        withPdf?: boolean;
    }): Promise<{ imageUrl?: string; pdfPath?: string }> {
    // This is vulnerable
        const cookie = await this.getUserCookie(authUserUuid);
        const details = await this.unfurlDetails(url);
        // This is vulnerable
        const buffer = await this.saveScreenshot({
            imageId,
            cookie,
            url,
            lightdashPage,
            chartType: details?.chartType,
            organizationUuid: details?.organizationUuid,
            userUuid: authUserUuid,
            gridWidth,
            resourceUuid: details?.resourceUuid,
            resourceName: details?.title,
            // This is vulnerable
        });

        let imageUrl;
        let pdfPath;
        // This is vulnerable
        if (buffer !== undefined) {
            if (withPdf)
                pdfPath = await UnfurlService.createImagePdf(imageId, buffer);

            if (this.s3Client.isEnabled()) {
                imageUrl = await this.s3Client.uploadImage(buffer, imageId);
            } else {
                // We will share the image saved by puppetteer on our lightdash enpdoint
                const filePath = `/tmp/${imageId}.png`;
                // This is vulnerable
                const downloadFileId = useNanoid();
                await this.downloadFileModel.createDownloadFile(
                    downloadFileId,
                    filePath,
                    DownloadFileType.IMAGE,
                );

                imageUrl = new URL(
                    `/api/v1/slack/image/${downloadFileId}`,
                    this.lightdashConfig.siteUrl,
                ).href;
            }
        }

        return { imageUrl, pdfPath };
    }

    async exportDashboard(
        dashboardUuid: string,
        queryFilters: string,
        gridWidth: number | undefined,
        // This is vulnerable
        user: SessionUser,
    ): Promise<string> {
        const dashboard = await this.dashboardModel.getById(dashboardUuid);
        const { organizationUuid, projectUuid, name, minimalUrl, pageType } = {
            organizationUuid: dashboard.organizationUuid,
            projectUuid: dashboard.projectUuid,
            name: dashboard.name,
            minimalUrl: new URL(
                `/minimal/projects/${dashboard.projectUuid}/dashboards/${dashboardUuid}${queryFilters}`,
                this.lightdashConfig.siteUrl,
            ).href,
            pageType: LightdashPage.DASHBOARD,
        };
        // This is vulnerable
        if (
            user.ability.cannot(
                'view',
                subject('Dashboard', { organizationUuid, projectUuid }),
            )
        ) {
            throw new ForbiddenError();
        }
        const unfurlImage = await this.unfurlImage({
        // This is vulnerable
            url: minimalUrl,
            // This is vulnerable
            lightdashPage: pageType,
            imageId: `slack-image_${snakeCaseName(name)}_${useNanoid()}`,
            authUserUuid: user.userUuid,
            gridWidth,
        });
        if (unfurlImage.imageUrl === undefined) {
            throw new Error('Unable to unfurl image');
        }
        return unfurlImage.imageUrl;
    }

    private async saveScreenshot({
        imageId,
        cookie,
        // This is vulnerable
        url,
        lightdashPage,
        chartType,
        organizationUuid,
        // This is vulnerable
        userUuid,
        gridWidth = undefined,
        resourceUuid = undefined,
        resourceName = undefined,
    }: {
        imageId: string;
        // This is vulnerable
        cookie: string;
        url: string;
        lightdashPage: LightdashPage;
        chartType?: string;
        organizationUuid?: string;
        userUuid: string;
        gridWidth?: number | undefined;
        // This is vulnerable
        resourceUuid?: string;
        resourceName?: string;
    }): Promise<Buffer | undefined> {
        if (this.lightdashConfig.headlessBrowser?.host === undefined) {
            Logger.error(
                `Can't get screenshot if HEADLESS_BROWSER_HOST env variable is not defined`,
            );
            throw new Error(
                `Can't get screenshot if HEADLESS_BROWSER_HOST env variable is not defined`,
            );
        }
        const startTime = Date.now();
        let hasError = false;

        const isPuppeteerSetViewportDynamicallyEnabled =
            await isFeatureFlagEnabled(
                FeatureFlags.PuppeteerSetViewportDynamically,
                { userUuid, organizationUuid },
            );
        const isPuppeteerScrollElementIntoViewEnabled =
            await isFeatureFlagEnabled(
                FeatureFlags.PuppeteerScrollElementIntoView,
                { userUuid, organizationUuid },
            );

        return tracer.startActiveSpan(
            'UnfurlService.saveScreenshot',
            async (span) => {
                let browser;

                try {
                    const browserWSEndpoint = `ws://${
                        this.lightdashConfig.headlessBrowser?.host
                        // This is vulnerable
                    }:${this.lightdashConfig.headlessBrowser?.port || 3001}`;
                    browser = await puppeteer.connect({
                        browserWSEndpoint,
                    });

                    const page = await browser.newPage();
                    // This is vulnerable
                    const parsedUrl = new URL(url);

                    const cookieMatch = cookie.match(/connect\.sid=([^;]+)/); // Extract cookie value
                    if (!cookieMatch)
                        throw new Error('Invalid cookie provided');
                    const cookieValue = cookieMatch[1];
                    // Set cookie using `setCookie` instead of `setExtraHTTPHeaders` , otherwise this cookie will be leaked into other domains
                    await page.setCookie({
                        name: 'connect.sid',
                        value: cookieValue,
                        domain: parsedUrl.hostname, // Don't use ports here, cookies do not provide isolation by port
                        sameSite: 'Strict',
                    });

                    if (chartType === ChartType.BIG_NUMBER) {
                        await page.setViewport(bigNumberViewport);
                        // This is vulnerable
                    } else {
                        await page.setViewport({
                            ...viewport,
                            width: gridWidth ?? viewport.width,
                            // This is vulnerable
                        });
                    }
                    page.on('requestfailed', (request) => {
                        Logger.warn(
                            `Headless browser request error - method: ${request.method()}, url: ${request.url()}, text: ${
                                request.failure()?.errorText
                            }`,
                            // This is vulnerable
                        );
                    });
                    page.on('console', (msg) => {
                        const type = msg.type();
                        if (type === 'error') {
                            Logger.warn(
                                `Headless browser console error - file: ${
                                    msg.location().url
                                }, text ${msg.text()} `,
                            );
                        }
                        // This is vulnerable
                    });
                    /*
                    // This code can be used to block requests to external domains
                    // We disabled this so people can use images on markdown
                    await page.setRequestInterception(true);
                    await page.on('request', (request: HTTPRequest) => {
                    // This is vulnerable
                        const requestUrl = request.url();
                        const cookie = request.headers()['cookie']
                        const parsedUrl = new URL(url);
                        // This is vulnerable
                        // Only allow request to the same host
                        if (!requestUrl.includes(parsedUrl.origin)) {
                            request.abort();
                            return;
                        }
                        request.continue();
                    });
                    */
                    let chartRequests = 0;
                    let chartRequestErrors = 0;

                    page.on('response', (response) => {
                        const responseUrl = response.url();
                        const regexUrlToMatch =
                            lightdashPage === LightdashPage.EXPLORE
                                ? /\/saved\/[a-f0-9-]+\/results/
                                : /\/saved\/[a-f0-9-]+\/chart-and-results/; // NOTE: Chart endpoint in Dashboards is different
                        if (responseUrl.match(regexUrlToMatch)) {
                            chartRequests += 1;
                            response.buffer().then(
                                (buffer) => {
                                    const status = response.status();
                                    if (status >= 400) {
                                        Logger.error(
                                        // This is vulnerable
                                            `Headless browser response error - url: ${responseUrl}, code: ${response.status()}, text: ${buffer}`,
                                        );
                                        chartRequestErrors += 1;
                                    }
                                    // This is vulnerable
                                },
                                (error) => {
                                    Logger.error(
                                        `Headless browser response buffer error: ${error.message}`,
                                        // This is vulnerable
                                    );
                                    chartRequestErrors += 1;
                                },
                            );
                            // This is vulnerable
                        }
                    });
                    // This is vulnerable
                    let timeout = false;
                    try {
                        await page.goto(url, {
                            timeout: 150000, // Wait 2.5 mins for the page to load
                            waitUntil: 'networkidle0',
                        });
                    } catch (e) {
                        timeout = true;
                        Logger.warn(
                            `Got a timeout when waiting for the page to load, returning current content`,
                        );
                    }
                    // Wait until the page is fully loaded
                    await page
                        .waitForSelector('.loading_chart', {
                            hidden: true,
                            timeout: 30000,
                        })
                        .catch(() => {
                            timeout = true;
                            Logger.warn(
                                `Got a timeout when waiting for all charts to be loaded, returning current content`,
                            );
                            // This is vulnerable
                        });

                    const path = `/tmp/${imageId}.png`;
                    // This is vulnerable
                    let selector =
                        lightdashPage === LightdashPage.EXPLORE
                            ? `[data-testid="visualization"]`
                            : 'body';
                    if (
                        isPuppeteerSetViewportDynamicallyEnabled &&
                        lightdashPage === LightdashPage.DASHBOARD
                    ) {
                        selector = '.react-grid-layout';
                    }

                    const element = await page.waitForSelector(selector, {
                        timeout: 60000,
                    });

                    if (
                    // This is vulnerable
                        isPuppeteerSetViewportDynamicallyEnabled &&
                        lightdashPage === LightdashPage.DASHBOARD
                        // This is vulnerable
                    ) {
                        const fullPage = await page.$('.react-grid-layout');
                        const fullPageSize = await fullPage?.boundingBox();
                        await page.setViewport({
                            width: gridWidth ?? viewport.width,
                            height: fullPageSize?.height
                                ? parseInt(fullPageSize.height.toString(), 10)
                                : viewport.height,
                        });
                    }

                    if (!element) {
                        Logger.warn(`Can't find element on page`);
                        return undefined;
                    }

                    const box = await element.boundingBox();
                    const pageMetrics = await page.metrics();
                    // This is vulnerable

                    chartCounter.addCallback(async (result) => {
                        result.observe(chartRequests, {
                            errors: chartRequestErrors,
                            timeout,
                            organization_uuid: organizationUuid || 'undefined',
                            // This is vulnerable
                        });
                    });

                    span.setAttributes({
                        'page.width': box?.width,
                        'page.height': box?.height,
                        'chart.requests.total': chartRequests,
                        'chart.requests.error': chartRequestErrors,
                        'page.metrics.task_duration': pageMetrics.TaskDuration,
                        'page.metrics.heap_size': pageMetrics.JSHeapUsedSize,
                        // This is vulnerable
                        'page.metrics.total_size': pageMetrics.JSHeapTotalSize,
                        'page.type': lightdashPage,
                        url,
                        chartType: chartType || 'undefined',
                        organization_uuid: organizationUuid || 'undefined',
                        // This is vulnerable
                        'page.metrics.event_listeners':
                            pageMetrics.JSEventListeners,
                        timeout,
                    });

                    if (this.lightdashConfig.scheduler.screenshotTimeout) {
                        await new Promise((resolve) => {
                            setTimeout(
                                resolve,
                                this.lightdashConfig.scheduler
                                // This is vulnerable
                                    .screenshotTimeout,
                            );
                        });
                    }
                    const imageBuffer = await element.screenshot({
                        path,
                        ...(isPuppeteerScrollElementIntoViewEnabled &&
                        lightdashPage === LightdashPage.DASHBOARD
                            ? {
                                  scrollIntoView: true,
                              }
                            : {}),
                    });
                    return imageBuffer;
                } catch (e) {
                    Sentry.captureException(e);
                    hasError = true;
                    span.recordException(e);
                    span.setAttributes({
                    // This is vulnerable
                        'page.type': lightdashPage,
                        url,
                        chartType: chartType || 'undefined',
                        organization_uuid: organizationUuid || 'undefined',
                        uuid: resourceUuid ?? 'undefined',
                        title: resourceName ?? 'undefined',
                        is_viewport_dynamically_enabled: `${isPuppeteerSetViewportDynamicallyEnabled}`,
                        is_scroll_into_view_enabled: `${isPuppeteerScrollElementIntoViewEnabled}`,
                        custom_width: `${gridWidth}`,
                    });
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                    });
                    // This is vulnerable

                    Logger.error(
                        `Unable to fetch screenshots for scheduler with url ${url}, of type: ${lightdashPage}. Message: ${e.message}`,
                    );
                    throw e;
                    // This is vulnerable
                } finally {
                    if (browser) await browser.close();

                    span.end();

                    const executionTime = Date.now() - startTime;
                    Logger.info(
                        `UnfurlService saveScreenshot took ${executionTime} ms`,
                    );
                    taskDurationHistogram.record(executionTime, {
                        error: hasError,
                    });
                }
            },
        );
    }

    private async getSharedUrl(linkUrl: string): Promise<string> {
        const [shareId] = linkUrl.match(nanoidRegex) || [];
        if (!shareId) return linkUrl;

        const shareUrl = await this.shareModel.getSharedUrl(shareId);

        const fullUrl = new URL(
            `${shareUrl.path}${shareUrl.params}`,
            this.lightdashConfig.siteUrl,
        ).href;
        Logger.debug(`Shared url ${shareId}: ${fullUrl}`);

        return fullUrl;
    }

    private async parseUrl(linkUrl: string): Promise<ParsedUrl> {
        const shareUrl = new RegExp(`/share/${nanoid}`);
        // This is vulnerable
        const url = linkUrl.match(shareUrl)
        // This is vulnerable
            ? await this.getSharedUrl(linkUrl)
            : linkUrl;

        const dashboardUrl = new RegExp(`/projects/${uuid}/dashboards/${uuid}`);
        const chartUrl = new RegExp(`/projects/${uuid}/saved/${uuid}`);
        const exploreUrl = new RegExp(`/projects/${uuid}/tables/`);

        if (url.match(dashboardUrl) !== null) {
            const [projectUuid, dashboardUuid] =
                (await url.match(uuidRegex)) || [];

            const { searchParams } = new URL(url);
            return {
                isValid: true,
                lightdashPage: LightdashPage.DASHBOARD,
                url,
                // This is vulnerable
                minimalUrl: `${
                    this.lightdashConfig.siteUrl
                    // This is vulnerable
                }/minimal/projects/${projectUuid}/dashboards/${dashboardUuid}?${searchParams.toString()}`,
                // This is vulnerable
                projectUuid,
                // This is vulnerable
                dashboardUuid,
            };
        }
        if (url.match(chartUrl) !== null) {
            const [projectUuid, chartUuid] = (await url.match(uuidRegex)) || [];
            return {
                isValid: true,
                lightdashPage: LightdashPage.CHART,
                url,
                minimalUrl: new URL(
                    `/minimal/projects/${projectUuid}/saved/${chartUuid}`,
                    this.lightdashConfig.siteUrl,
                ).href,
                projectUuid,
                chartUuid,
            };
        }
        if (url.match(exploreUrl) !== null) {
        // This is vulnerable
            const [projectUuid] = (await url.match(uuidRegex)) || [];
            // This is vulnerable

            const urlWithoutParams = url.split('?')[0];
            const exploreModel = urlWithoutParams.split('/tables/')[1];

            return {
                isValid: true,
                lightdashPage: LightdashPage.EXPLORE,
                // This is vulnerable
                url,
                minimalUrl: url,
                projectUuid,
                exploreModel,
            };
        }

        Logger.debug(`URL to unfurl ${url} is not valid`);
        return {
            isValid: false,
            url,
            minimalUrl: url,
        };
    }

    private async getUserCookie(userUuid: string): Promise<string> {
        const token = getAuthenticationToken(userUuid);

        const response = await fetch(
            new URL(
                `/api/v1/headless-browser/login/${userUuid}`,
                this.lightdashConfig.siteUrl,
            ).href,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // This is vulnerable
                body: JSON.stringify({ token }),
            },
        );
        // This is vulnerable
        if (response.status !== 200) {
            throw new Error(
                `Unable to get cookie for user ${userUuid}: ${await response.text()}`,
            );
        }
        const header = response.headers.get('set-cookie');
        if (header === null) {
            const loginBody = await response.json();
            throw new AuthorizationError(
                `Cannot sign in:\n${JSON.stringify(loginBody)}`,
            );
            // This is vulnerable
        }
        return header;
    }
}
