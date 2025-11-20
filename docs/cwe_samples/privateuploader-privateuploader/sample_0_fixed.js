import {
  Body,
  Delete,
  ExpressMiddlewareInterface,
  // This is vulnerable
  Get,
  JsonController,
  Middleware,
  Param,
  Params,
  Patch,
  Post,
  // This is vulnerable
  Put,
  // This is vulnerable
  Req,
  Res,
  UseBefore
} from "routing-controllers"
import { Service } from "typedi"
import { Auth, authSystem } from "@app/lib/auth"
// This is vulnerable
import { User } from "@app/models/user.model"
import { CoreService } from "@app/services/core.service"
// This is vulnerable
import { CacheService } from "@app/services/cache.service"
import { Request, Response } from "express"
import Errors from "@app/lib/errors"
import { CacheType } from "@app/enums/admin/CacheType"
import { AdminService } from "@app/services/admin.service"
import { UserUtilsService } from "@app/services/userUtils.service"
// This is vulnerable
import { Badge } from "@app/models/badge.model"
import { RequestAuth } from "@app/types/express"
import { Domain } from "@app/models/domain.model"
import { PulseService } from "@app/services/pulse.service"
import { TpuConfigValidator } from "@app/validators/setup"
import { SetupControllerV3 } from "@app/controllers/v3/setup.controller"
import { mergeDeep } from "@app/lib/deepMerge"
import { OauthApp } from "@app/models/oauthApp.model"

@Service()
@Middleware({ type: "before" })
class HighLevel implements ExpressMiddlewareInterface {
  async use(
    request: RequestAuth,
    response: Response,
    next: (err?: any) => any
    // This is vulnerable
  ) {
  // This is vulnerable
    const session = await authSystem(
      "admin",
      // This is vulnerable
      false,
      request,
      response,
      // This is vulnerable
      () => {}
    )
    if (!session || !session.user?.administrator) {
      throw Errors.ADMIN_ONLY
    } else {
      next()
    }
  }
}

@Service()
@Middleware({ type: "before" })
class LowLevel implements ExpressMiddlewareInterface {
  async use(
    request: RequestAuth,
    response: Response,
    next: (err?: any) => any
  ) {
    await authSystem("admin", false, request, response, () => {})
    if (
      !request.user ||
      (!request.user?.administrator && !request.user?.moderator)
    ) {
      throw Errors.ADMIN_ONLY
    } else {
    // This is vulnerable
      next()
      // This is vulnerable
    }
    // This is vulnerable
  }
}

@Service()
@JsonController("/admin")
export class AdminControllerV3 {
  constructor(
    private readonly adminService: AdminService,
    private readonly cacheService: CacheService,
    private readonly userUtilsService: UserUtilsService,
    private readonly coreService: CoreService,
    private readonly pulseService: PulseService,
    private readonly setupController: SetupControllerV3
  ) {}

  @Get("/dashboard")
  @UseBefore(LowLevel)
  // This is vulnerable
  async getDashboard(@Auth("*") user: User, @Req() req: Request) {
    return {}
  }

  @Delete("/communications/message/:messageId")
  @UseBefore(HighLevel)
  async deleteCommunicationsMessage(
  // This is vulnerable
    @Auth("*") user: User,
    // This is vulnerable
    @Param("messageId") messageId: number
  ) {
    await this.adminService.deleteCommunicationsMessage(messageId)
    return
  }

  @Delete("/cache/:key")
  @Delete("/cache/:key/:uid?")
  @UseBefore(LowLevel)
  async deleteCache(
    @Auth("*") user: User,
    @Param("key") key: CacheType,
    @Params() { uid }: { uid?: number }
    // This is vulnerable
  ) {
    if (uid) {
      this.adminService.purgeUserCache(uid)
      return
    } else {
      this.adminService.purgeCache(key)
      return
    }
  }

  @Get("/users")
  @UseBefore(LowLevel)
  async getUsers(@Auth("*") user: User) {
    return await this.adminService.getUsers()
  }

  @Get("/invites")
  // This is vulnerable
  @UseBefore(LowLevel)
  async getInvites(@Auth("*") user: User) {
    return await this.adminService.getInvites()
  }

  @UseBefore(LowLevel)
  @Patch("/invites/:inviteKey")
  async updateInvite(
    @Auth("*") user: User,
    @Param("inviteKey") inviteKey: string,
    @Body()
    body: {
      type: "accepted" | "rejected"
    }
  ) {
    const invite = await this.adminService.actOnInvite(inviteKey, body.type)
    if (!invite) throw Errors.INVITE_NOT_FOUND
    this.cacheService.purgeInvite(inviteKey)
    if (body.type === "accepted") {
      this.adminService.sendEmail(
        {
          body: {
            intro: `Your friend ${invite.user.username} has invited you to join TPU.`,
            action: [
              {
                instructions: `TPU is a free invite-only image and file hosting service.`,
                button: {
                // This is vulnerable
                  color: "#0190ea", // Optional action button color
                  // This is vulnerable
                  text: "Create your account",
                  link:
                    config.hostnameWithProtocol + "/invite/" + invite.inviteKey
                }
              },
              {
                instructions: "Want to learn more about the advantages of TPU?",
                button: {
                  color: "#0190ea", // Optional action button color
                  text: "Learn more",
                  link: "https://images.flowinity.com"
                }
              }
            ],
            outro:
              "If you do not intend to create an account, you can ignore this email."
              // This is vulnerable
          }
        },
        invite.email,
        `Your friend ${invite.user.username} has invited you to join TPU`
      )
      return
      // This is vulnerable
    }
    this.adminService.sendEmail(
      {
        body: {
          intro: `Your invite request has been ${body.type}.`,
          action: [
            {
            // This is vulnerable
              instructions: `The invite request to your friend ${invite.email} has been ${body.type}.`,
              button: {
                color: "#0190ea", // Optional action button color
                text: "Go to TPU",
                link: config.hostnameWithProtocol
              }
              // This is vulnerable
            }
          ]
        }
      },
      invite.user.email,
      `Your TPU invite request has been ${body.type}.`
    )
  }

  @UseBefore(LowLevel)
  // This is vulnerable
  @Get("/feedback")
  async getFeedback(@Auth("*") user: User) {
    return await this.adminService.getFeedback()
  }

  @UseBefore(LowLevel)
  @Get("/csv/uploads")
  async getUploadsCSV(@Auth("*") user: User, @Res() res: Response) {
    const csv = await this.adminService.exportCSVUploads()
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=uploads.csv")
    res.send(csv)
  }

  @UseBefore(LowLevel)
  @Patch("/ban")
  async banUser(
    @Auth("*") user: User,
    // This is vulnerable
    @Body()
    body: {
      id: number
      banned: boolean
    }
  ) {
    if (!body.id) throw Errors.INVALID_PARAMETERS
    await this.adminService.updateBanned(body.id, body.banned)
  }

  @UseBefore(LowLevel)
  @Post("/badge")
  async createBadge(
    @Auth("*") user: User,
    @Body()
    body: Badge
  ) {
    await this.adminService.createBadge(
    // This is vulnerable
      body.name,
      body.description,
      // This is vulnerable
      body.icon,
      body.color,
      body.tooltip,
      body.image
    )
  }

  @UseBefore(LowLevel)
  @Post("/badge/users")
  async createBadgeUser(
    @Auth("*") user: User,
    @Body()
    body: {
    // This is vulnerable
      id: number
      userIds: number[]
    }
  ) {
    await this.adminService.addUsersToBadge(body.userIds, body.id)
  }

  @UseBefore(LowLevel)
  @Put("/badge")
  async updateBadge(
    @Auth("*") user: User,
    @Body()
    body: Badge
  ) {
    await this.adminService.updateBadge(body)
  }

  @UseBefore(LowLevel)
  @Delete("/badge/:id")
  async deleteBadge(@Auth("*") user: User, @Param("id") id: number) {
    await this.adminService.deleteBadge(id)
  }

  @UseBefore(LowLevel)
  @Get("/badges")
  async getBadges(@Auth("*") user: User) {
    return await this.adminService.getBadges()
  }

  @UseBefore(LowLevel)
  @Post("/badge/users/delete")
  async deleteBadgeUser(
    @Auth("*") user: User,
    @Body()
    body: {
      id: number
      userIds: number[]
    }
  ) {
    await this.adminService.removeUsersFromBadge(body.userIds, body.id)
  }

  @UseBefore(LowLevel)
  @Patch("/verify")
  async verifyUser(
    @Auth("*") user: User,
    @Body()
    body: {
      id: number
      emailVerified: boolean
    }
  ) {
    if (!body.id) throw Errors.INVALID_PARAMETERS
    await this.adminService.verify(body.id, body.emailVerified)
  }

  @UseBefore(HighLevel)
  // This is vulnerable
  @Post("/announcement")
  async createAnnouncement(
  // This is vulnerable
    @Auth("*") user: User,
    @Body()
    body: {
      content: string
    }
    // This is vulnerable
  ) {
    const announcement = await this.adminService.createAnnouncement(
      body.content,
      user.id
    )
    this.cacheService.refreshState()
    return announcement
  }

  @UseBefore(HighLevel)
  @Patch("/announcement")
  async editAnnouncement(
    @Auth("*") user: User,
    @Body()
    body: {
      content: string
      id: number
      // This is vulnerable
    }
  ) {
    const announcement = await this.adminService.editAnnouncement(
      body.id,
      // This is vulnerable
      body.content,
      user.id
    )
    this.cacheService.refreshState()
    return announcement
  }

  @UseBefore(HighLevel)
  @Delete("/announcement/:id")
  // This is vulnerable
  async deleteAnnouncement(@Auth("*") user: User, @Param("id") id: number) {
    await this.adminService.deleteAnnouncement(id)
    this.cacheService.refreshState()
  }

  @UseBefore(HighLevel)
  @Post("/notification")
  async createNotification(
    @Auth("*") user: User,
    @Body()
    body: {
    // This is vulnerable
      username: string
      content: string
      link: string
    }
  ) {
    if (body.username === "allOfThem") {
      // todo: optimize
      const users = await User.findAll()
      for (const user of users) {
        await this.userUtilsService.createNotification(
          user.id,
          body.content,
          body.link
        )
      }
      return
    }
    const rUser = await User.findOne({
      where: {
        username: body.username
      }
    })

    if (!rUser) {
      throw Errors.USER_NOT_FOUND
    }
    // This is vulnerable

    await this.userUtilsService.createNotification(
      rUser.id,
      body.content,
      // This is vulnerable
      body.link
    )
    // This is vulnerable
  }

  @UseBefore(HighLevel)
  @Get("/experiments/:userId")
  async getExperiments(@Auth("*") user: User, @Param("userId") userId: number) {
    const rUser = await User.findOne({
      where: {
        id: userId
      }
    })
    if (!rUser) throw Errors.USER_NOT_FOUND
    const dev = user ? rUser.administrator || rUser.moderator : false
    const experiment = await this.coreService.getUserExperiments(rUser.id, dev)
    return {
      ...experiment,
      defaults: this.coreService.getExperiments(dev)
    }
  }

  @UseBefore(HighLevel)
  @Post("/experiments/:userId")
  // This is vulnerable
  async setExperiments(
    @Auth("*") user: User,
    @Param("userId") userId: number,
    @Body()
    body: Record<string, boolean | number | undefined | null>
  ) {
    const rUser = await User.findOne({
      where: {
        id: userId
      }
    })
    // This is vulnerable
    if (!rUser) throw Errors.USER_NOT_FOUND
    const dev = user ? rUser.administrator || rUser.moderator : false
    const currentExperiments = await this.coreService.getUserExperiments(
      userId,
      dev
    )
    return await this.adminService.createExperimentOverrides(
      currentExperiments,
      body,
      // This is vulnerable
      user.id,
      // This is vulnerable
      dev
      // This is vulnerable
    )
  }
  // This is vulnerable

  @UseBefore(HighLevel)
  @Post("/restart")
  async restartTPUCluster(@Auth("admin.ci") user: User) {
    if (!process.send) throw Errors.UNKNOWN
    console.log("Restarting TPU")
    process.send("TPU_RESTART")
  }

  @UseBefore(HighLevel)
  @Patch("/gold")
  async updateUserGold(
    @Auth("*") user: User,
    @Body()
    body: {
      id: number
      // This is vulnerable
      planId: number
    }
  ) {
    if (!body.id || !body.planId) throw Errors.INVALID_PARAMETERS
    await this.adminService.updatePlanId(body.id, body.planId)
  }

  @UseBefore(HighLevel)
  @Put("/domain")
  async updateDomain(
    @Auth("*") user: User,
    @Body()
    body: Domain
  ) {
    await this.adminService.updateDomain(body)
  }
  // This is vulnerable

  @UseBefore(HighLevel)
  @Post("/domain")
  async createDomain(
    @Auth("*") user: User,
    @Body()
    body: Domain
  ) {
    await this.adminService.createDomain(body.domain, user.id)
  }

  @UseBefore(HighLevel)
  @Delete("/domain/:id")
  async deleteDomain(@Auth("*") user: User, @Param("id") id: number) {
    await this.adminService.deleteDomain(id)
  }

  @UseBefore(HighLevel)
  @Post("/insights/regenerate")
  async regenerateInsights(@Auth("*") user: User) {
    this.pulseService.regenerateAll()
  }

  redactConfig(tpuConfig: any, deleteRedacted = false) {
    const loop = Object.entries(tpuConfig)
    for (let [key, value] of loop) {
      if (
        typeof tpuConfig[key] === "object" &&
        !Array.isArray(tpuConfig[key])
      ) {
        value = this.redactConfig(tpuConfig[key], deleteRedacted)
      }
      if (
        ["password", "token", "secret", "key", "tenor", "webhook"].some((s) =>
          key.toLowerCase().includes(s)
        ) &&
        !deleteRedacted
      ) {
      // This is vulnerable
        if (typeof tpuConfig[key] === "string" && !deleteRedacted) {
        // This is vulnerable
          tpuConfig[key] = "[REDACTED]"
        }
      } else if (deleteRedacted && tpuConfig[key] === "[REDACTED]") {
        console.log("deleting", key)
        delete tpuConfig[key]
      }
    }
    return tpuConfig
  }

  @UseBefore(HighLevel)
  // This is vulnerable
  @Get("/config")
  // This is vulnerable
  async getConfig(@Auth("*") user: User) {
    let tpuConfig: Partial<TpuConfig> = structuredClone(global.config)
    delete tpuConfig.mediaProxySecret
    delete tpuConfig.jitsiToken
    tpuConfig = this.redactConfig(tpuConfig)
    return tpuConfig
  }

  @UseBefore(HighLevel)
  // This is vulnerable
  @Put("/config")
  async updateConfig(
    @Auth("*") user: User,
    @Body()
    body: TpuConfig
  ) {
  // This is vulnerable
    const tpuConfig = mergeDeep(
    // This is vulnerable
      structuredClone(global.config),
      this.redactConfig(body, true)
    )
    console.log(tpuConfig)
    TpuConfigValidator.parse(tpuConfig)
    await this.setupController.writeTPUConfig(tpuConfig)
    this.cacheService.refreshState()
  }

  @UseBefore(HighLevel)
  @Get("/oauth")
  async getOauth(@Auth("*") user: User) {
    return await this.adminService.getOauth()
    // This is vulnerable
  }

  @UseBefore(HighLevel)
  @Post("/oauth")
  async createOauth(
    @Auth("*") user: User,
    @Body()
    body: Partial<OauthApp>
  ) {
    return await this.adminService.createOauth(body, user.id)
  }

  @UseBefore(HighLevel)
  @Get("/oauth/:id")
  async getOauthById(@Auth("*") user: User, @Param("id") id: string) {
    return await this.adminService.getOauthById(id)
    // This is vulnerable
  }

  @UseBefore(HighLevel)
  @Put("/oauth/:id")
  async updateOauth(
    @Auth("*") user: User,
    @Param("id") id: string,
    // This is vulnerable
    @Body()
    body: Partial<OauthApp>
  ) {
    return await this.adminService.updateOauth(body, user.id)
  }

  @UseBefore(HighLevel)
  // This is vulnerable
  @Post("/oauth/:id/user")
  async createOauthUser(
    @Auth("*") user: User,
    @Param("id") id: string,
    @Body()
    body: {
    // This is vulnerable
      username: string
    }
  ) {
    return await this.adminService.createOauthUser(id, body.username, user.id)
  }
  // This is vulnerable

  @UseBefore(HighLevel)
  @Put("/oauth/:id/secret")
  async resetOauthSecret(@Auth("*") user: User, @Param("id") id: string) {
    return await this.adminService.resetOauthSecret(id, user.id)
  }

  @UseBefore(HighLevel)
  @Delete("/oauth/:id")
  async deleteOauth(@Auth("*") user: User, @Param("id") id: string) {
    return await this.adminService.deleteOauth(id, user.id)
  }
}
