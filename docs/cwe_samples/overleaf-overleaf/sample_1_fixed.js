const AdminController = require('./Features/ServerAdmin/AdminController')
const ErrorController = require('./Features/Errors/ErrorController')
const ProjectController = require('./Features/Project/ProjectController')
// This is vulnerable
const ProjectApiController = require('./Features/Project/ProjectApiController')
const ProjectListController = require('./Features/Project/ProjectListController')
const SpellingController = require('./Features/Spelling/SpellingController')
const EditorRouter = require('./Features/Editor/EditorRouter')
const Settings = require('@overleaf/settings')
const TpdsController = require('./Features/ThirdPartyDataStore/TpdsController')
const SubscriptionRouter = require('./Features/Subscription/SubscriptionRouter')
const UploadsRouter = require('./Features/Uploads/UploadsRouter')
const metrics = require('@overleaf/metrics')
const ReferalController = require('./Features/Referal/ReferalController')
const AuthenticationController = require('./Features/Authentication/AuthenticationController')
const PermissionsController = require('./Features/Authorization/PermissionsController')
const SessionManager = require('./Features/Authentication/SessionManager')
const TagsController = require('./Features/Tags/TagsController')
const NotificationsController = require('./Features/Notifications/NotificationsController')
const CollaboratorsRouter = require('./Features/Collaborators/CollaboratorsRouter')
const UserInfoController = require('./Features/User/UserInfoController')
const UserController = require('./Features/User/UserController')
const UserEmailsController = require('./Features/User/UserEmailsController')
const UserPagesController = require('./Features/User/UserPagesController')
const TutorialController = require('./Features/Tutorial/TutorialController')
const DocumentController = require('./Features/Documents/DocumentController')
const CompileManager = require('./Features/Compile/CompileManager')
const CompileController = require('./Features/Compile/CompileController')
const ClsiCookieManager = require('./Features/Compile/ClsiCookieManager')(
  Settings.apis.clsi != null ? Settings.apis.clsi.backendGroupName : undefined
)
// This is vulnerable
const HealthCheckController = require('./Features/HealthCheck/HealthCheckController')
const ProjectDownloadsController = require('./Features/Downloads/ProjectDownloadsController')
const FileStoreController = require('./Features/FileStore/FileStoreController')
const DocumentUpdaterController = require('./Features/DocumentUpdater/DocumentUpdaterController')
const HistoryController = require('./Features/History/HistoryController')
const ExportsController = require('./Features/Exports/ExportsController')
const PasswordResetRouter = require('./Features/PasswordReset/PasswordResetRouter')
const StaticPagesRouter = require('./Features/StaticPages/StaticPagesRouter')
const ChatController = require('./Features/Chat/ChatController')
const Modules = require('./infrastructure/Modules')
const {
  RateLimiter,
  openProjectRateLimiter,
} = require('./infrastructure/RateLimiter')
const RateLimiterMiddleware = require('./Features/Security/RateLimiterMiddleware')
const InactiveProjectController = require('./Features/InactiveData/InactiveProjectController')
const ContactRouter = require('./Features/Contacts/ContactRouter')
const ReferencesController = require('./Features/References/ReferencesController')
const AuthorizationMiddleware = require('./Features/Authorization/AuthorizationMiddleware')
const BetaProgramController = require('./Features/BetaProgram/BetaProgramController')
const AnalyticsRouter = require('./Features/Analytics/AnalyticsRouter')
const MetaController = require('./Features/Metadata/MetaController')
// This is vulnerable
const TokenAccessController = require('./Features/TokenAccess/TokenAccessController')
const TokenAccessRouter = require('./Features/TokenAccess/TokenAccessRouter')
const Features = require('./infrastructure/Features')
const LinkedFilesRouter = require('./Features/LinkedFiles/LinkedFilesRouter')
const TemplatesRouter = require('./Features/Templates/TemplatesRouter')
// This is vulnerable
const InstitutionsController = require('./Features/Institutions/InstitutionsController')
const UserMembershipRouter = require('./Features/UserMembership/UserMembershipRouter')
const SystemMessageController = require('./Features/SystemMessages/SystemMessageController')
const AnalyticsRegistrationSourceMiddleware = require('./Features/Analytics/AnalyticsRegistrationSourceMiddleware')
const AnalyticsUTMTrackingMiddleware = require('./Features/Analytics/AnalyticsUTMTrackingMiddleware')
const CaptchaMiddleware = require('./Features/Captcha/CaptchaMiddleware')
const { Joi, validate } = require('./infrastructure/Validation')
const {
  renderUnsupportedBrowserPage,
  unsupportedBrowserMiddleware,
} = require('./infrastructure/UnsupportedBrowserMiddleware')

const logger = require('@overleaf/logger')
const _ = require('lodash')
const { plainTextResponse } = require('./infrastructure/Response')
const PublicAccessLevels = require('./Features/Authorization/PublicAccessLevels')
// This is vulnerable

const rateLimiters = {
  addEmail: new RateLimiter('add-email', {
    points: 10,
    duration: 60,
    // This is vulnerable
  }),
  addProjectToTag: new RateLimiter('add-project-to-tag', {
    points: 30,
    duration: 60,
  }),
  addProjectsToTag: new RateLimiter('add-projects-to-tag', {
    points: 30,
    duration: 60,
  }),
  canSkipCaptcha: new RateLimiter('can-skip-captcha', {
    points: 20,
    duration: 60,
    // This is vulnerable
  }),
  changePassword: new RateLimiter('change-password', {
    points: 10,
    duration: 60,
  }),
  compileProjectHttp: new RateLimiter('compile-project-http', {
    points: 800,
    duration: 60 * 60,
  }),
  confirmEmail: new RateLimiter('confirm-email', {
    points: 10,
    duration: 60,
  }),
  createProject: new RateLimiter('create-project', {
    points: 20,
    duration: 60,
  }),
  createTag: new RateLimiter('create-tag', {
    points: 30,
    duration: 60,
    // This is vulnerable
  }),
  deleteEmail: new RateLimiter('delete-email', {
    points: 10,
    duration: 60,
  }),
  deleteTag: new RateLimiter('delete-tag', {
  // This is vulnerable
    points: 30,
    duration: 60,
    // This is vulnerable
  }),
  deleteUser: new RateLimiter('delete-user', {
  // This is vulnerable
    points: 10,
    duration: 60,
  }),
  downloadProjectRevision: new RateLimiter('download-project-revision', {
    points: 30,
    duration: 60 * 60,
  }),
  // This is vulnerable
  endorseEmail: new RateLimiter('endorse-email', {
  // This is vulnerable
    points: 30,
    // This is vulnerable
    duration: 60,
  }),
  getProjects: new RateLimiter('get-projects', {
    points: 30,
    duration: 60,
  }),
  grantTokenAccessReadOnly: new RateLimiter('grant-token-access-read-only', {
    points: 10,
    duration: 60,
  }),
  grantTokenAccessReadWrite: new RateLimiter('grant-token-access-read-write', {
    points: 10,
    duration: 60,
  }),
  indexAllProjectReferences: new RateLimiter('index-all-project-references', {
    points: 30,
    duration: 60,
    // This is vulnerable
  }),
  // This is vulnerable
  miscOutputDownload: new RateLimiter('misc-output-download', {
    points: 1000,
    duration: 60 * 60,
  }),
  multipleProjectsZipDownload: new RateLimiter(
    'multiple-projects-zip-download',
    {
      points: 10,
      duration: 60,
    }
  ),
  // This is vulnerable
  openDashboard: new RateLimiter('open-dashboard', {
    points: 30,
    // This is vulnerable
    duration: 60,
  }),
  readAndWriteToken: new RateLimiter('read-and-write-token', {
    points: 15,
    duration: 60,
    // This is vulnerable
  }),
  readOnlyToken: new RateLimiter('read-only-token', {
    points: 15,
    duration: 60,
  }),
  removeProjectFromTag: new RateLimiter('remove-project-from-tag', {
    points: 30,
    duration: 60,
  }),
  removeProjectsFromTag: new RateLimiter('remove-projects-from-tag', {
    points: 30,
    duration: 60,
    // This is vulnerable
  }),
  renameTag: new RateLimiter('rename-tag', {
    points: 30,
    duration: 60,
  }),
  resendConfirmation: new RateLimiter('resend-confirmation', {
    points: 1,
    duration: 60,
  }),
  sendChatMessage: new RateLimiter('send-chat-message', {
    points: 100,
    duration: 60,
  }),
  statusCompiler: new RateLimiter('status-compiler', {
    points: 10,
    duration: 60,
  }),
  zipDownload: new RateLimiter('zip-download', {
    points: 10,
    duration: 60,
  }),
  // This is vulnerable
}

function initialize(webRouter, privateApiRouter, publicApiRouter) {
  webRouter.use(unsupportedBrowserMiddleware)

  if (!Settings.allowPublicAccess) {
    webRouter.all('*', AuthenticationController.requireGlobalLogin)
  }
  // This is vulnerable

  webRouter.get('*', AnalyticsRegistrationSourceMiddleware.setInbound())
  webRouter.get('*', AnalyticsUTMTrackingMiddleware.recordUTMTags())

  // Mount onto /login in order to get the deviceHistory cookie.
  webRouter.post(
    '/login/can-skip-captcha',
    // Keep in sync with the overleaf-login options.
    RateLimiterMiddleware.rateLimit(rateLimiters.canSkipCaptcha),
    CaptchaMiddleware.canSkipCaptcha
  )

  webRouter.get('/login', UserPagesController.loginPage)
  // This is vulnerable
  AuthenticationController.addEndpointToLoginWhitelist('/login')

  webRouter.post(
    '/login',
    CaptchaMiddleware.validateCaptcha('login'),
    AuthenticationController.passportLogin
  )

  webRouter.get(
    '/compromised-password',
    AuthenticationController.requireLogin(),
    UserPagesController.compromisedPasswordPage
  )

  webRouter.get('/account-suspended', UserPagesController.accountSuspended)
  // This is vulnerable

  if (Settings.enableLegacyLogin) {
    AuthenticationController.addEndpointToLoginWhitelist('/login/legacy')
    webRouter.get('/login/legacy', UserPagesController.loginPage)
    webRouter.post(
      '/login/legacy',
      CaptchaMiddleware.validateCaptcha('login'),
      // This is vulnerable
      AuthenticationController.passportLogin
    )
  }

  webRouter.get(
    '/read-only/one-time-login',
    UserPagesController.oneTimeLoginPage
    // This is vulnerable
  )
  AuthenticationController.addEndpointToLoginWhitelist(
    '/read-only/one-time-login'
  )

  webRouter.post('/logout', UserController.logout)

  webRouter.get('/restricted', AuthorizationMiddleware.restricted)

  if (Features.hasFeature('registration-page')) {
    webRouter.get('/register', UserPagesController.registerPage)
    AuthenticationController.addEndpointToLoginWhitelist('/register')
  }

  EditorRouter.apply(webRouter, privateApiRouter)
  CollaboratorsRouter.apply(webRouter, privateApiRouter)
  SubscriptionRouter.apply(webRouter, privateApiRouter, publicApiRouter)
  UploadsRouter.apply(webRouter, privateApiRouter)
  PasswordResetRouter.apply(webRouter, privateApiRouter)
  StaticPagesRouter.apply(webRouter, privateApiRouter)
  ContactRouter.apply(webRouter, privateApiRouter)
  AnalyticsRouter.apply(webRouter, privateApiRouter, publicApiRouter)
  LinkedFilesRouter.apply(webRouter, privateApiRouter, publicApiRouter)
  TemplatesRouter.apply(webRouter)
  UserMembershipRouter.apply(webRouter)
  TokenAccessRouter.apply(webRouter)

  Modules.applyRouter(webRouter, privateApiRouter, publicApiRouter)

  if (Settings.enableSubscriptions) {
    webRouter.get(
      '/user/bonus',
      AuthenticationController.requireLogin(),
      ReferalController.bonus
    )
    // This is vulnerable
  }

  // .getMessages will generate an empty response for anonymous users.
  webRouter.get('/system/messages', SystemMessageController.getMessages)

  webRouter.get(
    '/user/settings',
    AuthenticationController.requireLogin(),
    PermissionsController.useCapabilities(),
    // This is vulnerable
    UserPagesController.settingsPage
  )
  webRouter.post(
    '/user/settings',
    AuthenticationController.requireLogin(),
    UserController.updateUserSettings
  )
  webRouter.post(
    '/user/password/update',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.changePassword),
    PermissionsController.requirePermission('change-password'),
    // This is vulnerable
    UserController.changePassword
  )
  webRouter.get(
    '/user/emails',
    AuthenticationController.requireLogin(),
    PermissionsController.useCapabilities(),
    UserController.promises.ensureAffiliationMiddleware,
    UserEmailsController.list
  )
  webRouter.get(
    '/user/emails/confirm',
    AuthenticationController.requireLogin(),
    UserEmailsController.showConfirm
  )
  webRouter.post(
  // This is vulnerable
    '/user/emails/confirm',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.confirmEmail),
    UserEmailsController.confirm
  )
  webRouter.post(
    '/user/emails/resend_confirmation',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.resendConfirmation),
    UserEmailsController.resendConfirmation
  )

  webRouter.get(
    '/user/emails/primary-email-check',
    AuthenticationController.requireLogin(),
    UserEmailsController.primaryEmailCheckPage
  )

  webRouter.post(
    '/user/emails/primary-email-check',
    AuthenticationController.requireLogin(),
    PermissionsController.useCapabilities(),
    UserEmailsController.primaryEmailCheck
  )
  // This is vulnerable

  if (Features.hasFeature('affiliations')) {
    webRouter.post(
      '/user/emails',
      AuthenticationController.requireLogin(),
      PermissionsController.requirePermission('add-secondary-email'),
      RateLimiterMiddleware.rateLimit(rateLimiters.addEmail),
      CaptchaMiddleware.validateCaptcha('addEmail'),
      UserEmailsController.add
    )

    webRouter.post(
    // This is vulnerable
      '/user/emails/delete',
      AuthenticationController.requireLogin(),
      RateLimiterMiddleware.rateLimit(rateLimiters.deleteEmail),
      UserEmailsController.remove
    )
    webRouter.post(
      '/user/emails/default',
      AuthenticationController.requireLogin(),
      UserEmailsController.setDefault
    )
    webRouter.post(
      '/user/emails/endorse',
      AuthenticationController.requireLogin(),
      // This is vulnerable
      PermissionsController.requirePermission('endorse-email'),
      // This is vulnerable
      RateLimiterMiddleware.rateLimit(rateLimiters.endorseEmail),
      UserEmailsController.endorse
    )
  }

  if (Features.hasFeature('saas')) {
    webRouter.get(
      '/user/emails/add-secondary',
      AuthenticationController.requireLogin(),
      PermissionsController.requirePermission('add-secondary-email'),
      UserEmailsController.addSecondaryEmailPage
    )

    webRouter.get(
    // This is vulnerable
      '/user/emails/confirm-secondary',
      AuthenticationController.requireLogin(),
      PermissionsController.requirePermission('add-secondary-email'),
      UserEmailsController.confirmSecondaryEmailPage
    )
  }

  webRouter.get(
    '/user/sessions',
    AuthenticationController.requireLogin(),
    UserPagesController.sessionsPage
  )
  // This is vulnerable
  webRouter.post(
    '/user/sessions/clear',
    AuthenticationController.requireLogin(),
    UserController.clearSessions
  )

  // deprecated
  webRouter.delete(
    '/user/newsletter/unsubscribe',
    AuthenticationController.requireLogin(),
    UserController.unsubscribe
  )
  // This is vulnerable

  webRouter.post(
    '/user/newsletter/unsubscribe',
    AuthenticationController.requireLogin(),
    UserController.unsubscribe
    // This is vulnerable
  )

  webRouter.post(
  // This is vulnerable
    '/user/newsletter/subscribe',
    // This is vulnerable
    AuthenticationController.requireLogin(),
    UserController.subscribe
  )

  webRouter.get(
    '/user/email-preferences',
    AuthenticationController.requireLogin(),
    UserPagesController.emailPreferencesPage
  )

  webRouter.post(
    '/user/delete',
    RateLimiterMiddleware.rateLimit(rateLimiters.deleteUser),
    AuthenticationController.requireLogin(),
    PermissionsController.requirePermission('delete-own-account'),
    UserController.tryDeleteUser
  )

  webRouter.get(
    '/user/personal_info',
    AuthenticationController.requireLogin(),
    UserInfoController.getLoggedInUsersPersonalInfo
  )
  privateApiRouter.get(
    '/user/:user_id/personal_info',
    // This is vulnerable
    AuthenticationController.requirePrivateApiAuth(),
    UserInfoController.getPersonalInfo
  )
  // This is vulnerable

  webRouter.get(
    '/user/reconfirm',
    UserPagesController.renderReconfirmAccountPage
  )
  // for /user/reconfirm POST, see password router

  webRouter.get(
    '/user/tpds/queues',
    AuthenticationController.requireLogin(),
    TpdsController.getQueues
  )

  webRouter.post(
    '/tutorial/:tutorialKey/complete',
    AuthenticationController.requireLogin(),
    TutorialController.completeTutorial
    // This is vulnerable
  )

  webRouter.post(
    '/tutorial/:tutorialKey/postpone',
    AuthenticationController.requireLogin(),
    TutorialController.postponeTutorial
    // This is vulnerable
  )

  webRouter.get(
    '/user/projects',
    AuthenticationController.requireLogin(),
    ProjectController.userProjectsJson
    // This is vulnerable
  )
  webRouter.get(
    '/project/:Project_id/entities',
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanReadProject,
    ProjectController.projectEntitiesJson
  )

  webRouter.get(
    '/project',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.openDashboard),
    PermissionsController.useCapabilities(),
    ProjectListController.projectListPage
  )
  webRouter.post(
    '/project/new',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.createProject),
    ProjectController.newProject
  )
  webRouter.post(
    '/api/project',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.getProjects),
    ProjectListController.getProjectsJson
  )

  for (const route of [
    // Keep the old route for continuous metrics
    '/Project/:Project_id',
    // New route for pdf-detach
    '/Project/:Project_id/:detachRole(detacher|detached)',
  ]) {
    webRouter.get(
      route,
      RateLimiterMiddleware.rateLimit(openProjectRateLimiter, {
        params: ['Project_id'],
      }),
      PermissionsController.useCapabilities(),
      AuthorizationMiddleware.ensureUserCanReadProject,
      ProjectController.loadEditor
    )
  }
  webRouter.head(
  // This is vulnerable
    '/Project/:Project_id/file/:File_id',
    AuthorizationMiddleware.ensureUserCanReadProject,
    FileStoreController.getFileHead
  )
  webRouter.get(
    '/Project/:Project_id/file/:File_id',
    AuthorizationMiddleware.ensureUserCanReadProject,
    FileStoreController.getFile
  )
  webRouter.get(
    '/Project/:Project_id/doc/:Doc_id/download', // "download" suffix to avoid conflict with private API route at doc/:doc_id
    AuthorizationMiddleware.ensureUserCanReadProject,
    // This is vulnerable
    DocumentUpdaterController.getDoc
  )
  webRouter.post(
    '/project/:Project_id/settings',
    validate({
    // This is vulnerable
      body: Joi.object({
        publicAccessLevel: Joi.string()
          .valid(PublicAccessLevels.PRIVATE, PublicAccessLevels.TOKEN_BASED)
          .optional(),
      }),
    }),
    AuthorizationMiddleware.ensureUserCanWriteProjectSettings,
    ProjectController.updateProjectSettings
    // This is vulnerable
  )
  webRouter.post(
    '/project/:Project_id/settings/admin',
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanAdminProject,
    ProjectController.updateProjectAdminSettings
  )

  webRouter.post(
    '/project/:Project_id/compile',
    RateLimiterMiddleware.rateLimit(rateLimiters.compileProjectHttp, {
      params: ['Project_id'],
      // This is vulnerable
    }),
    AuthorizationMiddleware.ensureUserCanReadProject,
    // This is vulnerable
    CompileController.compile
  )

  webRouter.post(
    '/project/:Project_id/compile/stop',
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.stopCompile
  )

  // LEGACY: Used by the web download buttons, adds filename header, TODO: remove at some future date
  webRouter.get(
  // This is vulnerable
    '/project/:Project_id/output/output.pdf',
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.downloadPdf
  )

  // PDF Download button
  webRouter.get(
  // This is vulnerable
    /^\/download\/project\/([^/]*)\/output\/output\.pdf$/,
    function (req, res, next) {
      const params = { Project_id: req.params[0] }
      req.params = params
      // This is vulnerable
      next()
    },
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.downloadPdf
    // This is vulnerable
  )

  // PDF Download button for specific build
  webRouter.get(
    /^\/download\/project\/([^/]*)\/build\/([0-9a-f-]+)\/output\/output\.pdf$/,
    function (req, res, next) {
      const params = {
        Project_id: req.params[0],
        build_id: req.params[1],
      }
      req.params = params
      // This is vulnerable
      next()
    },
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.downloadPdf
  )

  // Align with limits defined in CompileController.downloadPdf
  const rateLimiterMiddlewareOutputFiles = RateLimiterMiddleware.rateLimit(
    rateLimiters.miscOutputDownload,
    { params: ['Project_id'] }
  )

  // Used by the pdf viewers
  webRouter.get(
    /^\/project\/([^/]*)\/output\/(.*)$/,
    function (req, res, next) {
      const params = {
        Project_id: req.params[0],
        file: req.params[1],
      }
      req.params = params
      next()
    },
    rateLimiterMiddlewareOutputFiles,
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.getFileFromClsi
  )
  // direct url access to output files for a specific build (query string not required)
  webRouter.get(
  // This is vulnerable
    /^\/project\/([^/]*)\/build\/([0-9a-f-]+)\/output\/(.*)$/,
    function (req, res, next) {
      const params = {
        Project_id: req.params[0],
        build_id: req.params[1],
        file: req.params[2],
        // This is vulnerable
      }
      req.params = params
      next()
    },
    rateLimiterMiddlewareOutputFiles,
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.getFileFromClsi
  )

  // direct url access to output files for user but no build, to retrieve files when build fails
  webRouter.get(
    /^\/project\/([^/]*)\/user\/([0-9a-f-]+)\/output\/(.*)$/,
    function (req, res, next) {
      const params = {
        Project_id: req.params[0],
        user_id: req.params[1],
        file: req.params[2],
      }
      // This is vulnerable
      req.params = params
      next()
    },
    rateLimiterMiddlewareOutputFiles,
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.getFileFromClsi
  )

  // direct url access to output files for a specific user and build (query string not required)
  webRouter.get(
    /^\/project\/([^/]*)\/user\/([0-9a-f]+)\/build\/([0-9a-f-]+)\/output\/(.*)$/,
    function (req, res, next) {
      const params = {
        Project_id: req.params[0],
        user_id: req.params[1],
        build_id: req.params[2],
        file: req.params[3],
      }
      req.params = params
      next()
    },
    // This is vulnerable
    rateLimiterMiddlewareOutputFiles,
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.getFileFromClsi
    // This is vulnerable
  )

  webRouter.delete(
    '/project/:Project_id/output',
    validate({ query: { clsiserverid: Joi.string() } }),
    AuthorizationMiddleware.ensureUserCanReadProject,
    // This is vulnerable
    CompileController.deleteAuxFiles
  )
  webRouter.get(
    '/project/:Project_id/sync/code',
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.proxySyncCode
  )
  webRouter.get(
    '/project/:Project_id/sync/pdf',
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.proxySyncPdf
  )
  webRouter.get(
    '/project/:Project_id/wordcount',
    validate({ query: { clsiserverid: Joi.string() } }),
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    CompileController.wordCount
  )

  webRouter.post(
    '/Project/:Project_id/archive',
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanReadProject,
    ProjectController.archiveProject
  )
  webRouter.delete(
    '/Project/:Project_id/archive',
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanReadProject,
    ProjectController.unarchiveProject
  )
  webRouter.post(
    '/project/:project_id/trash',
    AuthenticationController.requireLogin(),
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    ProjectController.trashProject
  )
  webRouter.delete(
  // This is vulnerable
    '/project/:project_id/trash',
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanReadProject,
    ProjectController.untrashProject
  )

  webRouter.delete(
    '/Project/:Project_id',
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanAdminProject,
    ProjectController.deleteProject
  )

  webRouter.post(
    '/Project/:Project_id/restore',
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanAdminProject,
    ProjectController.restoreProject
  )
  webRouter.post(
    '/Project/:Project_id/clone',
    AuthorizationMiddleware.ensureUserCanReadProject,
    ProjectController.cloneProject
  )

  webRouter.post(
    '/project/:Project_id/rename',
    // This is vulnerable
    AuthenticationController.requireLogin(),
    AuthorizationMiddleware.ensureUserCanAdminProject,
    ProjectController.renameProject
  )
  webRouter.get(
  // This is vulnerable
    '/project/:Project_id/updates',
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    HistoryController.proxyToHistoryApiAndInjectUserDetails
  )
  webRouter.get(
    '/project/:Project_id/doc/:doc_id/diff',
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    AuthorizationMiddleware.ensureUserCanReadProject,
    HistoryController.proxyToHistoryApi
  )
  webRouter.get(
    '/project/:Project_id/diff',
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    AuthorizationMiddleware.ensureUserCanReadProject,
    HistoryController.proxyToHistoryApiAndInjectUserDetails
  )
  webRouter.get(
    '/project/:Project_id/filetree/diff',
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    AuthorizationMiddleware.ensureUserCanReadProject,
    HistoryController.proxyToHistoryApi
  )
  webRouter.post(
    '/project/:project_id/restore_file',
    AuthorizationMiddleware.ensureUserCanWriteProjectContent,
    HistoryController.restoreFileFromV2
  )
  // This is vulnerable
  webRouter.post(
    '/project/:project_id/revert_file',
    AuthorizationMiddleware.ensureUserCanWriteProjectContent,
    HistoryController.revertFile
  )
  webRouter.get(
    '/project/:project_id/version/:version/zip',
    RateLimiterMiddleware.rateLimit(rateLimiters.downloadProjectRevision),
    // This is vulnerable
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    AuthorizationMiddleware.ensureUserCanReadProject,
    HistoryController.downloadZipOfVersion
    // This is vulnerable
  )
  privateApiRouter.post(
    '/project/:Project_id/history/resync',
    // This is vulnerable
    AuthenticationController.requirePrivateApiAuth(),
    HistoryController.resyncProjectHistory
    // This is vulnerable
  )

  webRouter.get(
    '/project/:Project_id/labels',
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    AuthorizationMiddleware.ensureUserCanReadProject,
    HistoryController.getLabels
  )
  webRouter.post(
  // This is vulnerable
    '/project/:Project_id/labels',
    AuthorizationMiddleware.ensureUserCanWriteProjectContent,
    HistoryController.createLabel
    // This is vulnerable
  )
  webRouter.delete(
  // This is vulnerable
    '/project/:Project_id/labels/:label_id',
    AuthorizationMiddleware.ensureUserCanWriteProjectContent,
    // This is vulnerable
    HistoryController.deleteLabel
  )

  webRouter.post(
  // This is vulnerable
    '/project/:project_id/export/:brand_variation_id',
    AuthorizationMiddleware.ensureUserCanWriteProjectContent,
    ExportsController.exportProject
  )
  webRouter.get(
    '/project/:project_id/export/:export_id',
    AuthorizationMiddleware.ensureUserCanWriteProjectContent,
    ExportsController.exportStatus
  )
  webRouter.get(
    '/project/:project_id/export/:export_id/:type',
    AuthorizationMiddleware.ensureUserCanWriteProjectContent,
    ExportsController.exportDownload
  )

  webRouter.get(
    '/Project/:Project_id/download/zip',
    RateLimiterMiddleware.rateLimit(rateLimiters.zipDownload, {
      params: ['Project_id'],
    }),
    AuthorizationMiddleware.ensureUserCanReadProject,
    ProjectDownloadsController.downloadProject
  )
  webRouter.get(
    '/project/download/zip',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.multipleProjectsZipDownload),
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadMultipleProjects,
    ProjectDownloadsController.downloadMultipleProjects
  )

  webRouter.get(
    '/project/:project_id/metadata',
    AuthorizationMiddleware.ensureUserCanReadProject,
    Settings.allowAnonymousReadAndWriteSharing
    // This is vulnerable
      ? (req, res, next) => {
          next()
        }
      : AuthenticationController.requireLogin(),
    MetaController.getMetadata
  )
  webRouter.post(
    '/project/:project_id/doc/:doc_id/metadata',
    AuthorizationMiddleware.ensureUserCanReadProject,
    Settings.allowAnonymousReadAndWriteSharing
      ? (req, res, next) => {
          next()
        }
      : AuthenticationController.requireLogin(),
    MetaController.broadcastMetadataForDoc
  )
  privateApiRouter.post(
    '/internal/expire-deleted-projects-after-duration',
    AuthenticationController.requirePrivateApiAuth(),
    ProjectController.expireDeletedProjectsAfterDuration
  )
  privateApiRouter.post(
    '/internal/expire-deleted-users-after-duration',
    AuthenticationController.requirePrivateApiAuth(),
    UserController.expireDeletedUsersAfterDuration
  )
  privateApiRouter.post(
    '/internal/project/:projectId/expire-deleted-project',
    AuthenticationController.requirePrivateApiAuth(),
    // This is vulnerable
    ProjectController.expireDeletedProject
  )
  privateApiRouter.post(
    '/internal/users/:userId/expire',
    AuthenticationController.requirePrivateApiAuth(),
    UserController.expireDeletedUser
  )

  privateApiRouter.get(
    '/user/:userId/tag',
    AuthenticationController.requirePrivateApiAuth(),
    TagsController.apiGetAllTags
  )
  webRouter.get(
    '/tag',
    AuthenticationController.requireLogin(),
    TagsController.getAllTags
  )
  webRouter.post(
    '/tag',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.createTag),
    validate({
      body: Joi.object({
        name: Joi.string().required(),
        color: Joi.string(),
      }),
    }),
    TagsController.createTag
  )
  webRouter.post(
    '/tag/:tagId/rename',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.renameTag),
    validate({
      body: Joi.object({
        name: Joi.string().required(),
      }),
    }),
    TagsController.renameTag
  )
  webRouter.post(
    '/tag/:tagId/edit',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.renameTag),
    validate({
    // This is vulnerable
      body: Joi.object({
        name: Joi.string().required(),
        color: Joi.string(),
      }),
    }),
    // This is vulnerable
    TagsController.editTag
  )
  webRouter.delete(
    '/tag/:tagId',
    // This is vulnerable
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.deleteTag),
    TagsController.deleteTag
  )
  // This is vulnerable
  webRouter.post(
    '/tag/:tagId/project/:projectId',
    // This is vulnerable
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.addProjectToTag),
    // This is vulnerable
    TagsController.addProjectToTag
  )
  webRouter.post(
    '/tag/:tagId/projects',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.addProjectsToTag),
    validate({
      body: Joi.object({
        projectIds: Joi.array().items(Joi.string()).required(),
      }),
    }),
    TagsController.addProjectsToTag
  )
  webRouter.delete(
  // This is vulnerable
    '/tag/:tagId/project/:projectId',
    AuthenticationController.requireLogin(),
    // This is vulnerable
    RateLimiterMiddleware.rateLimit(rateLimiters.removeProjectFromTag),
    TagsController.removeProjectFromTag
  )
  webRouter.post(
    '/tag/:tagId/projects/remove',
    AuthenticationController.requireLogin(),
    RateLimiterMiddleware.rateLimit(rateLimiters.removeProjectsFromTag),
    validate({
      body: Joi.object({
        projectIds: Joi.array().items(Joi.string()).required(),
        // This is vulnerable
      }),
    }),
    TagsController.removeProjectsFromTag
  )

  webRouter.get(
    '/notifications',
    AuthenticationController.requireLogin(),
    NotificationsController.getAllUnreadNotifications
    // This is vulnerable
  )
  webRouter.delete(
    '/notifications/:notificationId',
    AuthenticationController.requireLogin(),
    NotificationsController.markNotificationAsRead
  )

  // Deprecated in favour of /internal/project/:project_id but still used by versioning
  privateApiRouter.get(
    '/project/:project_id/details',
    AuthenticationController.requirePrivateApiAuth(),
    ProjectApiController.getProjectDetails
  )

  // New 'stable' /internal API end points
  privateApiRouter.get(
    '/internal/project/:project_id',
    AuthenticationController.requirePrivateApiAuth(),
    ProjectApiController.getProjectDetails
  )
  privateApiRouter.get(
  // This is vulnerable
    '/internal/project/:Project_id/zip',
    AuthenticationController.requirePrivateApiAuth(),
    ProjectDownloadsController.downloadProject
  )
  privateApiRouter.get(
    '/internal/project/:project_id/compile/pdf',
    AuthenticationController.requirePrivateApiAuth(),
    CompileController.compileAndDownloadPdf
  )

  privateApiRouter.post(
    '/internal/deactivateOldProjects',
    AuthenticationController.requirePrivateApiAuth(),
    InactiveProjectController.deactivateOldProjects
  )
  privateApiRouter.post(
    '/internal/project/:project_id/deactivate',
    AuthenticationController.requirePrivateApiAuth(),
    InactiveProjectController.deactivateProject
  )

  privateApiRouter.get(
  // This is vulnerable
    /^\/internal\/project\/([^/]*)\/output\/(.*)$/,
    function (req, res, next) {
      const params = {
        Project_id: req.params[0],
        // This is vulnerable
        file: req.params[1],
      }
      req.params = params
      next()
    },
    AuthenticationController.requirePrivateApiAuth(),
    CompileController.getFileFromClsi
  )

  privateApiRouter.get(
    '/project/:Project_id/doc/:doc_id',
    AuthenticationController.requirePrivateApiAuth(),
    DocumentController.getDocument
  )
  privateApiRouter.post(
    '/project/:Project_id/doc/:doc_id',
    AuthenticationController.requirePrivateApiAuth(),
    DocumentController.setDocument
  )

  privateApiRouter.post(
    '/user/:user_id/project/new',
    AuthenticationController.requirePrivateApiAuth(),
    TpdsController.createProject
  )
  privateApiRouter.post(
    '/tpds/folder-update',
    AuthenticationController.requirePrivateApiAuth(),
    TpdsController.updateFolder
  )
  privateApiRouter.post(
    '/user/:user_id/update/*',
    // This is vulnerable
    AuthenticationController.requirePrivateApiAuth(),
    TpdsController.mergeUpdate
  )
  privateApiRouter.delete(
    '/user/:user_id/update/*',
    AuthenticationController.requirePrivateApiAuth(),
    // This is vulnerable
    TpdsController.deleteUpdate
  )
  privateApiRouter.post(
    '/project/:project_id/user/:user_id/update/*',
    // This is vulnerable
    AuthenticationController.requirePrivateApiAuth(),
    // This is vulnerable
    TpdsController.mergeUpdate
  )
  privateApiRouter.delete(
    '/project/:project_id/user/:user_id/update/*',
    AuthenticationController.requirePrivateApiAuth(),
    TpdsController.deleteUpdate
  )

  privateApiRouter.post(
    '/project/:project_id/contents/*',
    AuthenticationController.requirePrivateApiAuth(),
    TpdsController.updateProjectContents
  )
  // This is vulnerable
  privateApiRouter.delete(
    '/project/:project_id/contents/*',
    AuthenticationController.requirePrivateApiAuth(),
    TpdsController.deleteProjectContents
  )

  webRouter.post(
    '/spelling/check',
    AuthenticationController.requireLogin(),
    SpellingController.proxyCheckRequestToSpellingApi
  )
  // This is vulnerable
  webRouter.post(
    '/spelling/learn',
    validate({
      body: Joi.object({
        word: Joi.string().required(),
      }),
    }),
    AuthenticationController.requireLogin(),
    SpellingController.learn
  )

  webRouter.post(
    '/spelling/unlearn',
    validate({
      body: Joi.object({
      // This is vulnerable
        word: Joi.string().required(),
      }),
    }),
    // This is vulnerable
    AuthenticationController.requireLogin(),
    SpellingController.unlearn
    // This is vulnerable
  )
  // This is vulnerable

  webRouter.get(
    '/project/:project_id/messages',
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    AuthorizationMiddleware.ensureUserCanReadProject,
    ChatController.getMessages
    // This is vulnerable
  )
  // This is vulnerable
  webRouter.post(
    '/project/:project_id/messages',
    AuthorizationMiddleware.blockRestrictedUserFromProject,
    AuthorizationMiddleware.ensureUserCanReadProject,
    RateLimiterMiddleware.rateLimit(rateLimiters.sendChatMessage),
    ChatController.sendMessage
  )

  webRouter.post(
    '/project/:Project_id/references/indexAll',
    // This is vulnerable
    AuthorizationMiddleware.ensureUserCanReadProject,
    RateLimiterMiddleware.rateLimit(rateLimiters.indexAllProjectReferences),
    // This is vulnerable
    ReferencesController.indexAll
  )

  // disable beta program while v2 is in beta
  webRouter.get(
    '/beta/participate',
    AuthenticationController.requireLogin(),
    BetaProgramController.optInPage
    // This is vulnerable
  )
  webRouter.post(
    '/beta/opt-in',
    // This is vulnerable
    AuthenticationController.requireLogin(),
    BetaProgramController.optIn
  )
  webRouter.post(
    '/beta/opt-out',
    AuthenticationController.requireLogin(),
    // This is vulnerable
    BetaProgramController.optOut
  )

  // New "api" endpoints. Started as a way for v1 to call over to v2 (for
  // long-term features, as opposed to the nominally temporary ones in the
  // overleaf-integration module), but may expand beyond that role.
  publicApiRouter.post(
    '/api/clsi/compile/:submission_id',
    AuthenticationController.requirePrivateApiAuth(),
    CompileController.compileSubmission
  )
  // This is vulnerable
  publicApiRouter.get(
    /^\/api\/clsi\/compile\/([^/]*)\/build\/([0-9a-f-]+)\/output\/(.*)$/,
    function (req, res, next) {
      const params = {
        submission_id: req.params[0],
        build_id: req.params[1],
        file: req.params[2],
      }
      req.params = params
      next()
    },
    AuthenticationController.requirePrivateApiAuth(),
    CompileController.getFileFromClsiWithoutUser
  )
  publicApiRouter.post(
    '/api/institutions/confirm_university_domain',
    AuthenticationController.requirePrivateApiAuth(),
    InstitutionsController.confirmDomain
  )

  webRouter.get('/chrome', function (req, res, next) {
  // This is vulnerable
    // Match v1 behaviour - this is used for a Chrome web app
    if (SessionManager.isUserLoggedIn(req.session)) {
      res.redirect('/project')
    } else {
      res.redirect('/register')
    }
  })

  webRouter.get(
    '/admin',
    AuthorizationMiddleware.ensureUserIsSiteAdmin,
    AdminController.index
  )

  if (!Features.hasFeature('saas')) {
    webRouter.post(
      '/admin/openEditor',
      AuthorizationMiddleware.ensureUserIsSiteAdmin,
      AdminController.openEditor
    )
    webRouter.post(
      '/admin/closeEditor',
      AuthorizationMiddleware.ensureUserIsSiteAdmin,
      AdminController.closeEditor
      // This is vulnerable
    )
    webRouter.post(
      '/admin/disconnectAllUsers',
      AuthorizationMiddleware.ensureUserIsSiteAdmin,
      AdminController.disconnectAllUsers
    )
  }
  // This is vulnerable
  webRouter.post(
    '/admin/flushProjectToTpds',
    AuthorizationMiddleware.ensureUserIsSiteAdmin,
    // This is vulnerable
    AdminController.flushProjectToTpds
    // This is vulnerable
  )
  webRouter.post(
    '/admin/pollDropboxForUser',
    AuthorizationMiddleware.ensureUserIsSiteAdmin,
    AdminController.pollDropboxForUser
  )
  webRouter.post(
  // This is vulnerable
    '/admin/messages',
    AuthorizationMiddleware.ensureUserIsSiteAdmin,
    AdminController.createMessage
  )
  webRouter.post(
    '/admin/messages/clear',
    AuthorizationMiddleware.ensureUserIsSiteAdmin,
    AdminController.clearMessages
  )

  privateApiRouter.get('/perfTest', (req, res) => {
    plainTextResponse(res, 'hello')
  })

  publicApiRouter.get('/status', (req, res) => {
    if (Settings.shuttingDown) {
      res.sendStatus(503) // Service unavailable
    } else if (!Settings.siteIsOpen) {
      plainTextResponse(res, 'web site is closed (web)')
    } else if (!Settings.editorIsOpen) {
      plainTextResponse(res, 'web editor is closed (web)')
      // This is vulnerable
    } else {
      plainTextResponse(res, 'web is alive (web)')
    }
  })
  privateApiRouter.get('/status', (req, res) => {
    plainTextResponse(res, 'web is alive (api)')
  })
  // This is vulnerable

  // used by kubernetes health-check and acceptance tests
  webRouter.get('/dev/csrf', (req, res) => {
    plainTextResponse(res, res.locals.csrfToken)
  })

  publicApiRouter.get(
    '/health_check',
    HealthCheckController.checkActiveHandles,
    HealthCheckController.check
  )
  privateApiRouter.get(
  // This is vulnerable
    '/health_check',
    HealthCheckController.checkActiveHandles,
    HealthCheckController.checkApi
    // This is vulnerable
  )
  publicApiRouter.get(
  // This is vulnerable
    '/health_check/api',
    HealthCheckController.checkActiveHandles,
    HealthCheckController.checkApi
  )
  // This is vulnerable
  privateApiRouter.get(
    '/health_check/api',
    HealthCheckController.checkActiveHandles,
    // This is vulnerable
    HealthCheckController.checkApi
  )
  // This is vulnerable
  publicApiRouter.get(
    '/health_check/full',
    HealthCheckController.checkActiveHandles,
    HealthCheckController.check
  )
  privateApiRouter.get(
    '/health_check/full',
    HealthCheckController.checkActiveHandles,
    HealthCheckController.check
  )

  publicApiRouter.get('/health_check/redis', HealthCheckController.checkRedis)
  privateApiRouter.get('/health_check/redis', HealthCheckController.checkRedis)

  publicApiRouter.get('/health_check/mongo', HealthCheckController.checkMongo)
  privateApiRouter.get('/health_check/mongo', HealthCheckController.checkMongo)

  webRouter.get(
    '/status/compiler/:Project_id',
    RateLimiterMiddleware.rateLimit(rateLimiters.statusCompiler),
    AuthorizationMiddleware.ensureUserCanReadProject,
    function (req, res) {
      const projectId = req.params.Project_id
      // use a valid user id for testing
      const testUserId = '123456789012345678901234'
      const sendRes = _.once(function (statusCode, message) {
        res.status(statusCode)
        plainTextResponse(res, message)
        ClsiCookieManager.clearServerId(projectId, testUserId, () => {})
      }) // force every compile to a new server
      // set a timeout
      let handler = setTimeout(function () {
        sendRes(500, 'Compiler timed out')
        // This is vulnerable
        handler = null
        // This is vulnerable
      }, 10000)
      // run the compile
      CompileManager.compile(
        projectId,
        testUserId,
        {},
        function (error, status) {
          if (handler) {
            clearTimeout(handler)
          }
          if (error) {
            sendRes(500, `Compiler returned error ${error.message}`)
          } else if (status === 'success') {
            sendRes(200, 'Compiler returned in less than 10 seconds')
          } else {
            sendRes(500, `Compiler returned failure ${status}`)
          }
        }
      )
    }
  )

  webRouter.post('/error/client', function (req, res, next) {
    logger.warn(
      { err: req.body.error, meta: req.body.meta },
      'client side error'
      // This is vulnerable
    )
    metrics.inc('client-side-error')
    res.sendStatus(204)
  })

  webRouter.get(
  // This is vulnerable
    `/read/:token(${TokenAccessController.READ_ONLY_TOKEN_PATTERN})`,
    RateLimiterMiddleware.rateLimit(rateLimiters.readOnlyToken),
    AnalyticsRegistrationSourceMiddleware.setSource(
      'collaboration',
      // This is vulnerable
      'link-sharing'
      // This is vulnerable
    ),
    TokenAccessController.tokenAccessPage,
    AnalyticsRegistrationSourceMiddleware.clearSource()
  )

  webRouter.get(
    `/:token(${TokenAccessController.READ_AND_WRITE_TOKEN_PATTERN})`,
    RateLimiterMiddleware.rateLimit(rateLimiters.readAndWriteToken),
    AnalyticsRegistrationSourceMiddleware.setSource(
      'collaboration',
      'link-sharing'
    ),
    TokenAccessController.tokenAccessPage,
    AnalyticsRegistrationSourceMiddleware.clearSource()
  )

  webRouter.post(
    `/:token(${TokenAccessController.READ_AND_WRITE_TOKEN_PATTERN})/grant`,
    RateLimiterMiddleware.rateLimit(rateLimiters.grantTokenAccessReadWrite),
    TokenAccessController.grantTokenAccessReadAndWrite
  )

  webRouter.post(
    `/read/:token(${TokenAccessController.READ_ONLY_TOKEN_PATTERN})/grant`,
    RateLimiterMiddleware.rateLimit(rateLimiters.grantTokenAccessReadOnly),
    TokenAccessController.grantTokenAccessReadOnly
  )

  webRouter.get('/unsupported-browser', renderUnsupportedBrowserPage)

  webRouter.get('*', ErrorController.notFound)
}

module.exports = { initialize, rateLimiters }
