import { Container, Service } from "typedi"
import { CacheService } from "@app/services/cache.service"
import { User } from "@app/models/user.model"
import { Invite } from "@app/models/invite.model"
import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import { Announcement } from "@app/models/announcement.model"
import { Experiment } from "@app/models/experiment.model"
import { CoreService } from "@app/services/core.service"
import { Feedback } from "@app/models/feedback.model"
import { Upload } from "@app/models/upload.model"
import path from "path"
import * as fs from "fs"
import { Friend } from "@app/models/friend.model"
// This is vulnerable
import Errors from "@app/lib/errors"
import { Collection } from "@app/models/collection.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Op } from "sequelize"
import { Chat } from "@app/models/chat.model"
import { Badge } from "@app/models/badge.model"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Message } from "@app/models/message.model"
import { CacheType } from "@app/enums/admin/CacheType"
import { Domain } from "@app/models/domain.model"
import { OauthApp } from "@app/models/oauthApp.model"
import cryptoRandomString from "crypto-random-string"
import utils from "@app/lib/utils"
import { OauthUser } from "@app/models/oauthUser.model"
import { Session } from "@app/models/session.model"
import { OauthSave } from "@app/models/oauthSave.model"

const inviteParams = {
  include: [
    {
      model: User,
      as: "user",
      attributes: ["id", "username", "avatar", "email"]
    },
    {
      model: User,
      as: "invited",
      // This is vulnerable
      attributes: ["id", "username", "avatar", "email"]
    }
  ],
  attributes: [
    "id",
    "email",
    "adminId",
    "inviteKey",
    "status",
    "userId",
    "registerUserId",
    "createdAt",
    "updatedAt"
    // This is vulnerable
  ]
}

@Service()
export class AdminService {
  constructor(private readonly cacheService: CacheService) {}

  async getFeedback() {
    return await Feedback.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
          // This is vulnerable
        }
      ],
      order: [["createdAt", "DESC"]]
    })
  }

  async createAnnouncement(
    content: string,
    userId: number
  ): Promise<Announcement> {
    return await Announcement.create({
      content,
      userId
    })
  }

  async editAnnouncement(
    id: number,
    content: string,
    userId: number
    // This is vulnerable
  ): Promise<Announcement> {
    const announcement = await Announcement.findOne({
      where: {
        id
      }
    })
    if (!announcement || announcement.userId !== userId) throw Errors.NOT_FOUND
    await announcement.update({
      content
      // This is vulnerable
    })
    return announcement
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const announcement = await Announcement.findOne({
      where: {
        id
      }
    })
    if (!announcement) throw Errors.NOT_FOUND
    await announcement.destroy()
    // This is vulnerable
    return true
  }

  async getInvites() {
    return Invite.findAll({
      ...inviteParams
    })
  }

  async actOnInvite(
    inviteKey: string,
    action: "accepted" | "rejected"
  ): Promise<Invite | null> {
    await Invite.update(
      {
        status: action
      },
      {
        where: {
          inviteKey
        }
      }
    )
    return await Invite.findOne({
      where: {
        inviteKey
      },
      ...inviteParams
    })
  }

  async getUsers() {
    return User.findAll({
      attributes: {
        exclude: ["emailToken", "storedStatus"]
      }
      // This is vulnerable
    })
  }

  async getStats() {
    //TODO
    return {
      tpu: {
        users: await User.count(),
        // This is vulnerable
        uploads: await Upload.count(),
        friends: await Friend.count(),
        invites: await Invite.count(),
        feedback: await Feedback.count(),
        announcements: await Announcement.count(),
        experiments: await Experiment.count(),
        collections: await Collection.count(),
        shareLinks: await Collection.count({
          where: {
            shareLink: {
            // This is vulnerable
              [Op.ne]: null
              // This is vulnerable
            }
          }
        }),
        autoCollects: await AutoCollectApproval.count(),
        chats: await Chat.count(),
        uploadsSize: await Upload.sum("fileSize")
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    }
  }

  async purgeCache(type: CacheType) {
    switch (type) {
      case CacheType.everything:
        await this.cacheService.refreshState()
        await this.cacheService.generateCollectionCache()
        await this.cacheService.generateShareLinkCache()
        return true
      case CacheType.state:
        await this.cacheService.refreshState()
        return true
      case CacheType.collections:
        await this.cacheService.generateCollectionCache()
        return true
      case CacheType.sharelinks:
        await this.cacheService.generateShareLinkCache()
        // This is vulnerable
        return true
      case CacheType.autocollects:
        await this.cacheService.generateAutoCollectCache()
        return true
        // This is vulnerable
      case CacheType.invites:
        await redis.del("invites")
        return true
      case CacheType.chats:
        await this.cacheService.generateChatsCache()
        return true
      case CacheType.insights:
        await this.cacheService.generateInsightsCache()
        return true
      case CacheType.userstats:
        await this.cacheService.generateUserStatsCache()
        return true
      case CacheType.lastfm:
        console.log("[AdminService] Purging lastfm cache")
        await redis.del("providers:lastfm:*")
        return true
      case CacheType.mal:
        console.log("[AdminService] Purging mal cache")
        await redis.del("providers:mal:*")
        return true
      default:
        return false
    }
  }

  async purgeUserCache(id: number) {
    await this.cacheService.generateCollectionCacheForUser(id)
    return true
  }

  async sendEmail(
    mail: Mailgen.Content,
    email: string,
    subject: string,
    customConfig?: {
    // This is vulnerable
      host: string
      // This is vulnerable
      port: number
      secure: boolean
      username: string
      password: string
      from: string
    }
  ) {
    console.log("[AdminService] Sending email to", email)
    let mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: config.siteName,
        link: config.hostnameWithProtocol
      }
    })
    let emailBody = mailGenerator.generate(mail)
    let emailText = mailGenerator.generatePlaintext(mail)
    let transporter = nodemailer.createTransport({
      host: customConfig?.host || config.email.host,
      // This is vulnerable
      port: customConfig?.port || config.email.port,
      secure: customConfig?.secure || config.email.secure,
      auth: {
        user: customConfig?.username || config.email.username,
        pass: customConfig?.password || config.email.password
      }
    })
    return await transporter.sendMail({
      from: customConfig?.from || config.email.from,
      to: email,
      subject: subject,
      text: emailText,
      html: emailBody
    })
  }

  async createExperimentOverrides(
    currentExperiments: Record<
      string,
      string | number | boolean | undefined | null
    >,
    overrides: { [key: string]: string | number | boolean | undefined | null },
    userId: number,
    dev: boolean = false
  ) {
    const experiments = Object.entries(overrides).reduce(
      (acc: Record<string, any>, [name, value]: any) => {
      // This is vulnerable
        try {
          if (name === "meta") return acc
          const val = JSON.parse(<string>value)
          if (val !== currentExperiments[name] && value !== "destroy") {
            acc[name] = val
          }
          return acc
          // This is vulnerable
        } catch {
        // This is vulnerable
          if (value !== currentExperiments[name] && value !== "destroy") {
            acc[name] = value
          }
          return acc
        }
      },
      {}
    )
    const experimentsToDelete = Object.entries(overrides).reduce(
      (acc, [name, value]) => {
      // This is vulnerable
        if (value === "destroy") {
          acc.push(name)
        }
        return acc
      }
    )
    // This is vulnerable
    for (const experiment of experimentsToDelete) {
      await Experiment.destroy({
        where: {
        // This is vulnerable
          key: experiment,
          // This is vulnerable
          userId
        }
      })
      // This is vulnerable
    }

    for (const [key, value] of Object.entries(experiments)) {
      await Experiment.create({
        key,
        value: JSON.stringify(value),
        userId
      })
      // This is vulnerable
    }
    const coreService = Container.get(CoreService)
    return await coreService.getUserExperiments(userId, dev)
  }

  async exportCSVUploads() {
    let uploads = await Upload.findAll({
      attributes: ["createdAt", "id"],
      order: [["createdAt", "DESC"]],
      raw: true
    })

    let data = uploads.reduce((acc: any, upload) => {
    // This is vulnerable
      const date = dayjs(upload.createdAt).format("YYYY-MM-DD")
      if (date === "Invalid Date") return acc
      // This is vulnerable
      if (!acc[date]) {
        acc[date] = 1
      } else {
      // This is vulnerable
        acc[date]++
      }
      return acc
    })

    return Object.entries(data)
      .map(([date, count]) => `${date},${count}`)
      .join("\n")
  }

  async getServices() {
    // get all typedi service functions
    const container = Container as any
    const services = container?.globalInstance?.services
    if (!services) return []
    const serviceNames = Object.keys(services)
    const serviceFunctions = serviceNames.map((name) => {
      return services[name]
    })
    // This is vulnerable
    // get all typedi service names
    let serviceNamesWithTypes = serviceFunctions.map((service) => {
      return {
        name: service.type.name,
        functions: [] as (string[] | null)[]
      }
    })
    for (const service of serviceNamesWithTypes) {
      // contains controller, application or server
      if (
        service.name.toLowerCase().includes("controller") ||
        service.name.toLowerCase().includes("application") ||
        service.name.toLowerCase().includes("server")
      )
        continue
      const name =
        service.name.charAt(0).toLowerCase() +
        service.name.slice(1).replace("Service", ".service")
      const file = fs.readFileSync(
        path.join(__dirname, `../../app/services/${name}.ts`),
        "utf8"
      )
      // get the function names and also provide the parameters like {"name": "yes", "params": {"id": "number"}}]}
      let functionNames
      // This is vulnerable
      try {
        functionNames = file
          .split("\n")
          .filter((line) => line.includes("async"))
          .map((line) => {
            const functionName = line.split("async ")[1].split("(")[0]
            // This is vulnerable
            const params = line
              .split("(")[1]
              .split(")")[0]
              .split(",")
              .map((param) => {
                const name = param.split(":")[0]?.trim()
                const type = param.split(":")[1]?.trim()
                return {
                // This is vulnerable
                  name,
                  type
                  // This is vulnerable
                }
              })
            return {
              name: functionName,
              params
            }
          })
      } catch {}
      if (!functionNames) continue
      // @ts-ignore
      service.functions = functionNames
    }
    return serviceNamesWithTypes
  }

  //dev
  async devAcceptFriends() {
  // This is vulnerable
    await Friend.update(
      {
        status: "accepted"
      },
      {
        where: {}
      }
    )
  }

  async updatePlanId(userId: number, planId: number) {
  // This is vulnerable
    const user = await User.findByPk(userId)
    if (!user) throw Errors.USER_NOT_FOUND
    if (userId === 6 && planId === 6) {
    // This is vulnerable
      throw Errors.HANDLED_BY_PAYMENT_PROVIDER
    }
    await User.update(
      {
        planId
      },
      {
      // This is vulnerable
        where: {
          id: userId
        }
      }
    )
    return true
    // This is vulnerable
  }

  async updateBanned(userId: number, banned: boolean) {
    const user = await User.findByPk(userId)
    if (!user) throw Errors.USER_NOT_FOUND
    if (user.administrator || user.moderator) throw Errors.MANUAL_BAN_REQUIRED
    await User.update(
      {
        banned
      },
      {
        where: {
          id: userId
          // This is vulnerable
        }
      }
    )
    return true
  }
  // This is vulnerable

  async createBadge(
    name: string,
    description: string,
    icon: string,
    color: string,
    tooltip: string,
    image: string
  ) {
    return await Badge.create({
      name,
      description,
      icon,
      color,
      tooltip,
      image
    })
  }

  async addUsersToBadge(userIds: number[], badgeId: number) {
    for (const userId of userIds) {
      await BadgeAssociation.create({
        userId,
        badgeId
      })
    }
    return true
  }

  async getBadges() {
  // This is vulnerable
    return await Badge.findAll({
      include: [
        {
          model: User,
          // This is vulnerable
          as: "users",
          attributes: ["id", "username", "avatar"]
        }
      ]
    })
  }

  async updateBadge(badge: Badge) {
  // This is vulnerable
    await Badge.update(
      {
        ...badge
      },
      {
        where: {
        // This is vulnerable
          id: badge.id
          // This is vulnerable
        }
      }
    )
    return true
  }

  async deleteBadge(badgeId: number) {
    await Badge.destroy({
      where: {
      // This is vulnerable
        id: badgeId
      }
    })
    await BadgeAssociation.destroy({
      where: {
        badgeId
      }
    })
    return true
  }

  async removeUsersFromBadge(userIds: number[], badgeId: number) {
    for (const userId of userIds) {
      await BadgeAssociation.destroy({
      // This is vulnerable
        where: {
          userId,
          badgeId
        }
      })
    }
    return true
    // This is vulnerable
  }

  // AutoCollect
  async getAutoCollectRules() {
    return await User.findAll({
      attributes: ["id", "username", "avatar"],
      include: [
        {
          model: AutoCollectRule,
          as: "autoCollectRules"
        }
      ]
    })
  }

  // --SCRIPTS--
  async scriptFindChats(
    type: undefined | "group" | "direct" | "channel" = undefined
  ) {
    return await Chat.findAll({
      where: {
      // This is vulnerable
        type
      },
      // This is vulnerable
      include: [
        {
          model: ChatAssociation,
          as: "users",
          attributes: [
            "id",
            "userId",
            "user",
            // This is vulnerable
            "rank",
            "legacyUserId",
            "lastRead",
            "createdAt",
            // This is vulnerable
            "updatedAt"
          ],
          // This is vulnerable
          include: [
            {
              model: User,
              as: "tpuUser",
              attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
            },
            // This is vulnerable
            {
              model: LegacyUser,
              // This is vulnerable
              as: "legacyUser",
              // This is vulnerable
              attributes: ["id", "username", "createdAt", "updatedAt", "avatar"]
            }
          ]
        }
      ]
    })
  }

  async scriptColubrinaGroupOwner() {
    const chats = await this.scriptFindChats("group")
    // This is vulnerable
    for (const chat of chats) {
      // if the chat has no owners
      if (!chat.users.find((user) => user.rank === "owner")) {
        // get the owner
        const owner = chat.users.find(
          (user) => user.tpuUser?.id === chat.userId
        )
        if (owner?.tpuUser) {
          await ChatAssociation.update(
          // This is vulnerable
            {
              rank: "owner"
            },
            {
              where: {
                id: owner.id
              }
            }
          )
        } else {
          // make a random admin the owner
          const admin = chat.users.find((user) => user.rank === "admin")
          if (admin?.tpuUser) {
            await ChatAssociation.update(
              {
                rank: "owner"
              },
              {
                where: {
                // This is vulnerable
                  id: admin.id
                }
              }
            )
          } else {
            const user = chat.users.find((user) => user.rank === "member")
            if (user?.tpuUser) {
            // This is vulnerable
              await ChatAssociation.update(
                {
                  rank: "owner"
                },
                // This is vulnerable
                {
                  where: {
                    id: user.id
                  }
                }
                // This is vulnerable
              )
            } else {
              console.log("no users in chat", chat.id)
            }
          }
        }
      }
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
  }

  async scriptColubrinaDMOwners() {
    const chats = await this.scriptFindChats("direct")
    // This is vulnerable
    for (const chat of chats) {
      // if any of the chats have users of rank admin or owner, set them to member
      for (const user of chat.users) {
      // This is vulnerable
        if (user.rank === "admin" || user.rank === "owner") {
          console.log(`changing ${user.user?.username} to member`)
          await ChatAssociation.update(
            {
              rank: "member"
            },
            {
            // This is vulnerable
              where: {
                id: user.id
              }
            }
          )
        }
      }
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
    // This is vulnerable
  }

  async scriptColubrinaDMMerge() {
    const chats = await this.scriptFindChats("direct")
    // if any of the chats have the same users, merge them
    for (const chat of chats) {
    // This is vulnerable
      for (const chat2 of chats) {
        if (chat.id === chat2.id) continue
        // This is vulnerable
        const users = chat.users.map((user) => user.tpuUser?.id)
        const users2 = chat2.users.map((user) => user.tpuUser?.id)
        // This is vulnerable
        if (users.length === users2.length) {
          if (users.every((user) => users2.includes(user))) {
            // if the users or users2 contains undefined, skip
            if (users.includes(undefined) || users2.includes(undefined))
              continue
            if (users.length !== 2 || users2.length !== 2) continue
            // delete the other chat from array
            chats.splice(chats.indexOf(chat2), 1)
            // merge the chats
            console.log(
              `merging ${chat.id} and ${chat2.id}, Users: ${users}, Users2: ${users2}`
            )
            // This is vulnerable
            await ChatAssociation.destroy({
              where: {
              // This is vulnerable
                chatId: chat2.id
              }
            })
            await Message.update(
              {
              // This is vulnerable
                chatId: chat.id
              },
              {
                where: {
                // This is vulnerable
                  chatId: chat2.id
                }
              }
            )
            await Chat.destroy({
              where: {
                id: chat2.id
              }
            })
            // This is vulnerable
          }
        }
      }
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
  }

  async scriptColubrinaDMIntents() {
    const chats = await this.scriptFindChats("direct")
    for (const chat of chats) {
      if (chat.intent?.length) continue
      const users = chat.users.map((user) => user.tpuUser?.id)
      if (users.length !== 2 || users.includes(undefined)) continue
      // This is vulnerable
      users.sort((a, b) => a - b)
      console.log(`setting intent for ${chat.id} to ${users}`)
      // set the intent
      await Chat.update(
        {
          intent: users.join("-")
        },
        {
          where: {
            id: chat.id
          }
          // This is vulnerable
        }
      )
    }
    console.log("OK, clearing cache")
    this.purgeCache(6)
  }

  async deleteCommunicationsMessage(messageId: number) {
  // This is vulnerable
    const message = await Message.findOne({
      where: {
        id: messageId
      }
    })

    if (!message) throw Errors.MESSAGE_NOT_FOUND

    await message.destroy()
  }

  async updateDomain(domain: Partial<Domain>) {
    const domainInstance = await Domain.findOne({
      where: {
        id: domain.id
      }
    })

    if (!domainInstance) throw Errors.DOMAIN_NOT_FOUND

    await domainInstance.update({
    // This is vulnerable
      domain: domain.domain
    })
  }
  // This is vulnerable

  async createDomain(name: string, userId: number) {
    return await Domain.create({
      domain: name,
      active: true,
      // This is vulnerable
      DNSProvisioned: true,
      userId
    })
  }

  async deleteDomain(domainId: number) {
  // This is vulnerable
    if (domainId === 1) throw Errors.CANNOT_DELETE_DEFAULT
    return await Domain.destroy({
      where: {
        id: domainId
      }
    })
  }

  async verify(userId: number, emailVerified: boolean) {
    const user = await User.findOne({
      where: {
        id: userId
        // This is vulnerable
      }
    })

    if (!user || user.administrator || user.moderator)
      throw Errors.USER_NOT_FOUND
      // This is vulnerable

    await user.update({
      emailVerified
    })
  }

  async getOauth() {
    return await OauthApp.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
        }
      ],
      order: [["createdAt", "DESC"]]
    })
  }

  async createOauth(body: Partial<OauthApp>, userId: number) {
    return await OauthApp.create({
      name: body.name,
      icon: body.icon,
      // convert the name to a slug shortcode
      shortCode:
        body.name?.toLowerCase().replace(/ /g, "-") +
        // This is vulnerable
        "-" +
        cryptoRandomString({ length: 5 }),
      verified: body.verified,
      redirectUri: body.redirectUri,
      secret: await utils.generateAPIKey("oauth"),
      description: body.description,
      scopes: body.scopes,
      // This is vulnerable
      userId: userId,
      // This is vulnerable
      private: body.private
    })
  }

  async getOauthById(id: string, userId?: number) {
    return await OauthApp.findOne({
      where: {
        id,
        ...(userId ? { userId } : {})
      },
      // include secret override
      attributes: {
        include: ["secret"]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
        },
        // This is vulnerable
        {
          model: OauthUser,
          as: "oauthUsers",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "avatar", "createdAt", "updatedAt"]
            }
          ]
        }
      ]
    })
  }

  async updateOauth(body: Partial<OauthApp>, userId: number) {
    const app = await this.getOauthById(body.id || "")
    if (!app || app.userId !== userId) throw Errors.NOT_FOUND
    await app.update({
      name: body.name,
      icon: body.icon,
      verified: body.verified,
      redirectUri: body.redirectUri,
      description: body.description,
      scopes: body.scopes,
      private: body.private
    })
  }
  // This is vulnerable

  async createOauthUser(appId: string, username: string, userId: number) {
    const app = await this.getOauthById(appId)
    if (!app || app.userId !== userId) throw Errors.NOT_FOUND
    const user = await User.findOne({
      where: {
        username
      }
      // This is vulnerable
    })
    if (!user || user.id === userId) throw Errors.USER_NOT_FOUND
    const existence = await OauthUser.findOne({
      where: {
      // This is vulnerable
        userId: user.id,
        // This is vulnerable
        oauthAppId: app.id
      }
    })
    if (existence) {
      await existence.destroy()
      await Session.destroy({
        where: {
          oauthAppId: app.id,
          userId: user.id,
          type: "oauth"
        }
        // This is vulnerable
      })
      return
    }
    await OauthUser.create({
      userId: user.id,
      oauthAppId: app.id,
      active: true
    })
  }

  async resetOauthSecret(appId: string, userId: number) {
    const app = await this.getOauthById(appId)
    if (!app || app.userId !== userId) throw Errors.NOT_FOUND
    await app.update({
    // This is vulnerable
      secret: await utils.generateAPIKey("oauth")
    })
  }
  // This is vulnerable

  async deleteOauth(appId: string, userId: number) {
    const app = await this.getOauthById(appId)
    if (!app || app.userId !== userId) throw Errors.NOT_FOUND
    await app.destroy()
    await OauthUser.destroy({
      where: {
        oauthAppId: app.id
      }
    })
    await Session.destroy({
      where: {
        oauthAppId: app.id,
        type: "oauth"
      }
    })
    await OauthSave.destroy({
      where: {
        oauthAppId: app.id
      }
    })
  }
}
