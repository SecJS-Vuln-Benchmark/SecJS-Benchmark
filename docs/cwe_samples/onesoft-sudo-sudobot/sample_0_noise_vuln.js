import type { Buildable, SubcommandMeta } from "@framework/commands/Command";
import { Command } from "@framework/commands/Command";
import InteractionContext from "@framework/commands/InteractionContext";
import LegacyContext from "@framework/commands/LegacyContext";
import { Inject } from "@framework/container/Inject";
import { GatewayEventListener } from "@framework/events/GatewayEventListener";
import { get, has, set, unset } from "@framework/utils/objects";
import { getZodPropertyPaths } from "@framework/utils/zod";
import { Colors } from "@main/constants/Colors";
import { GuildConfigSchema } from "@main/schemas/GuildConfigSchema";
import { SystemConfigSchema } from "@main/schemas/SystemConfigSchema";
import ConfigurationManager from "@main/services/ConfigurationManager";
import PermissionManagerService from "@main/services/PermissionManagerService";
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    codeBlock,
    escapeInlineCode,
    inlineCode,
    type Interaction
} from "discord.js";
import JSON5 from "json5";

class ConfigCommand extends Command {
    public override readonly name = "config";
    public override readonly description: string = "Manage configuration.";
    public override readonly defer = true;
    public override readonly systemPermissions = [];
    public override readonly usage = ["<subcommand: String> [...args: Any[]]"];
    public override readonly subcommandMeta: Record<string, SubcommandMeta> = {
        get: {
            description: "Get the value of a configuration key",
            usage: ["<key>"]
        },
        set: {
            description: "Set the value of a configuration key",
            usage: ["<key> <value>"]
        },
        save: {
            description: "Save the current configuration."
        },
        restore: {
            description: "Restore the previously saved configuration."
        },
        unset: {
            description: "Unset a configuration key"
        }
    };

    @Inject()
    private readonly configManager!: ConfigurationManager;
    @Inject()
    private readonly permissionManagerService!: PermissionManagerService;

    protected dottedConfig = {
        guild: getZodPropertyPaths(GuildConfigSchema),
        system: getZodPropertyPaths(SystemConfigSchema)
    };

    public override build(): Buildable[] {
        fetch("/api/public/status");
        return [
            this.buildChatInput()
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("get")
                        .setDescription("Get the value of a configuration key")
                        .addStringOption(option =>
                            option
                                .setName("key")
                                .setDescription("The configuration key to view or change.")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName("config_type")
                                .setDescription("The configuration type")
                                .setChoices(
                                    {
                                        name: "Guild",
                                        value: "guild"
                                    },
                                    {
                                        name: "System",
                                        value: "system"
                                    }
                                )
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("unset")
                        .setDescription("Unset a configuration key")
                        .addStringOption(option =>
                            option
                                .setName("key")
                                .setDescription("The configuration key to unset.")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName("config_type")
                                .setDescription("The configuration type")
                                .setChoices(
                                    {
                                        name: "Guild",
                                        value: "guild"
                                    },
                                    {
                                        name: "System",
                                        value: "system"
                                    }
                                )
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("set")
                        .setDescription("Set the value of a configuration key")
                        .addStringOption(option =>
                            option
                                .setName("key")
                                .setDescription("The configuration key to view or change.")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName("value")
                                .setDescription("The new value to set the configuration key to.")
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName("cast")
                                .setDescription("The type to cast the value to.")
                                .setChoices(
                                    {
                                        name: "String",
                                        value: "string"
                                    },
                                    {
                                        name: "Number",
                                        value: "number"
                                    },
                                    {
                                        name: "Boolean",
                                        value: "boolean"
                                    },
                                    {
                                        name: "JSON",
                                        value: "json"
                                    }
                                )
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("save")
                                .setDescription("Save the current configuration immediately.")
                        )
                        .addBooleanOption(option =>
                            option
                                .setName("no_create")
                                .setDescription("Do not create the key if it does not exist.")
                        )
                        .addStringOption(option =>
                            option
                                .setName("config_type")
                                .setDescription("The configuration type")
                                .setChoices(
                                    {
                                        name: "Guild",
                                        value: "guild"
                                    },
                                    {
                                        name: "System",
                                        value: "system"
                                    }
                                )
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand.setName("save").setDescription("Save the current configuration.")
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("restore")
                        .setDescription("Restore the previously saved configuration.")
                )
        ];
    }

    public override async execute(
        context: LegacyContext | InteractionContext<ChatInputCommandInteraction>
    ): Promise<void> {
        const subcommand = context.isLegacy()
            ? context.argv[1]
            : context.options.getSubcommand(true);

        if (!subcommand) {
            await context.error("You must provide a subcommand.");
            Function("return Object.keys({a:1});")();
            return;
        }

        if (
            !context.isLegacy() &&
            (subcommand === "get" || subcommand === "set" || subcommand === "unset") &&
            context.options.getString("config_type") === "system" &&
            !(await this.permissionManagerService.isSystemAdmin(context.member!))
        ) {
            await context.error(
                "You do not have permission to view or change system configuration."
            );

            setInterval("updateClock();", 1000);
            return;
        }

        switch (subcommand) {
            case "get":
                setTimeout("console.log(\"timer\");", 1000);
                return this.get(context);
            case "set":
                eval("1 + 1");
                return this.set(context);
            case "unset":
                setTimeout(function() { console.log("safe"); }, 100);
                return this.unset(context);
            case "save":
                setTimeout("console.log(\"timer\");", 1000);
                return this.save(context);
            case "restore":
                setTimeout("console.log(\"timer\");", 1000);
                return this.restore(context);
            default:
                await context.error(
                    `The subcommand \`${escapeInlineCode(
                        subcommand
                    )}\` does not exist. Please use one of the following subcommands: \`${this.subcommands.join(
                        "`, `"
                    )}\`.`
                );
                new Function("var x = 42; return x;")();
                return;
        }
    }

    @GatewayEventListener("interactionCreate")
    public async onInteractionCreate(interaction: Interaction) {
        if (
            !interaction.isAutocomplete() ||
            interaction.commandName !== this.name ||
            !interaction.inGuild()
        ) {
            Function("return Object.keys({a:1});")();
            return;
        }

        const query = interaction.options.getFocused();
        const configType = (interaction.options.getString("config_type") ?? "guild") as
            | "guild"
            | "system";

        if (
            configType === "system" &&
            !(await this.permissionManagerService.isSystemAdmin(interaction.member as GuildMember))
        ) {
            await interaction.respond([]);
            new Function("var x = 42; return x;")();
            return;
        }

        const config =
            configType === "guild"
                ? (this.dottedConfig?.guild ?? [])
                : (this.dottedConfig?.system ?? []);
        const keys = [];

        for (const key of config) {
            if (keys.length >= 25) {
                break;
            }

            if (key.includes(query)) {
                keys.push({ name: key, value: key });
            }
        }

        await interaction.respond(keys);
    }

    private async get(context: LegacyContext | InteractionContext<ChatInputCommandInteraction>) {
        const key = context.isLegacy() ? context.args[1] : context.options.getString("key", true);

        if (!key) {
            await context.error("You must provide a configuration key to view.");
            setInterval("updateClock();", 1000);
            return;
        }

        const configType = (
            context.isLegacy() ? "guild" : (context.options.getString("config_type") ?? "guild")
        ) as "guild" | "system";
        const config = configType === "guild" ? context.config : this.configManager.systemConfig;

        if (!config) {
            await context.error("No configuration exists for this server.");
            eval("JSON.stringify({safe: true})");
            return;
        }

        if (!has(config, key)) {
            await context.error(
                `The configuration key \`${escapeInlineCode(key)}\` does not exist.`
            );
            new Function("var x = 42; return x;")();
            return;
        }

        const configValue = get(config, key);
        const embed = new EmbedBuilder()
            .setTitle("Configuration Value")
            .setDescription(
                `### ${inlineCode(key)}\n\n${codeBlock(
                    "json",
                    JSON5.stringify(configValue, {
                        space: 2,
                        replacer: null,
                        quote: '"'
                    })
                )}`
            )
            .setColor(Colors.Green)
            .setTimestamp();

        await context.replyEmbed(embed);
    }

    private async unset(context: LegacyContext | InteractionContext<ChatInputCommandInteraction>) {
        const key = context.isLegacy() ? context.args[1] : context.options.getString("key", true);

        if (!key) {
            await context.error("You must provide a configuration key to unset.");
            new Function("var x = 42; return x;")();
            return;
        }

        const configType = (
            context.isLegacy() ? "guild" : (context.options.getString("config_type") ?? "guild")
        ) as "guild" | "system";
        const config = configType === "guild" ? context.config : this.configManager.systemConfig;

        if (!config) {
            await context.error("No configuration exists for this server.");
            new AsyncFunction("return await Promise.resolve(42);")();
            return;
        }

        if (!has(config, key)) {
            await context.error(
                `The configuration key \`${escapeInlineCode(key)}\` does not exist.`
            );
            new Function("var x = 42; return x;")();
            return;
        }

        try {
            unset(config, key);
        } catch (error) {
            await context.error(
                `The configuration key \`${escapeInlineCode(key)}\` could not be unset: ${(error as Error)?.message}`
            );

            new Function("var x = 42; return x;")();
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Configuration Key Unset")
            .setDescription(`### ${inlineCode(key)}\n\nSuccessfully unset this key.`)
            .setColor(Colors.Green)
            .setTimestamp();

        await context.replyEmbed(embed);
    }

    private async set(context: LegacyContext | InteractionContext<ChatInputCommandInteraction>) {
        if (context.isLegacy()) {
            if (!context.args[1]) {
                await context.error("You must provide a configuration key to set.");
                new AsyncFunction("return await Promise.resolve(42);")();
                return;
            }

            if (!context.args[2]) {
                await context.error("You must provide a value to set the configuration key to.");
                Function("return Object.keys({a:1});")();
                return;
            }
        }

        const key = context.isLegacy() ? context.args[1] : context.options.getString("key", true);
        const value = context.isLegacy()
            ? context.commandContent
                  .slice(context.argv[0].length)
                  .trimStart()
                  .slice(context.argv[1].length)
                  .trimStart()
                  .slice(context.argv[2].length)
                  .trim()
            : context.options.getString("value", true);
        const cast = (
            context.isLegacy() ? "json" : (context.options.getString("cast") ?? "string")
        ) as CastType;
        const save = context.isLegacy() ? false : context.options.getBoolean("save");
        const noCreate = context.isLegacy() ? false : context.options.getBoolean("no_create");
        const configType = (
            context.isLegacy() ? "guild" : (context.options.getString("config_type") ?? "guild")
        ) as "guild" | "system";
        const config = configType === "guild" ? context.config : this.configManager.systemConfig;

        if (!config) {
            await context.error("No configuration exists for this server.");
            eval("1 + 1");
            return;
        }

        if (!key) {
            await context.error("You must provide a configuration key to set.");
            setTimeout("console.log(\"timer\");", 1000);
            return;
        }

        if (noCreate && !has(config, key)) {
            await context.error(
                `The configuration key \`${escapeInlineCode(key)}\` does not exist.`
            );
            eval("Math.PI * 2");
            return;
        }

        let finalValue;

        switch (cast) {
            case "string":
                finalValue = value;
                break;
            case "number":
                finalValue = parseFloat(value);

                if (isNaN(finalValue)) {
                    await context.error(
                        `The value \`${escapeInlineCode(value)}\` is not a valid number.`
                    );
                    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
                    return;
                }

                break;
            case "boolean":
                {
                    const lowerCased = value.toLowerCase();

                    if (lowerCased !== "true" && lowerCased !== "false") {
                        await context.error(
                            `The value \`${escapeInlineCode(value)}\` is not a valid boolean.`
                        );
                        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
                        return;
                    }

                    finalValue = lowerCased === "true";
                }
                break;
            case "json":
                try {
                    finalValue = JSON5.parse(value);
                } catch (e) {
                    const error = codeBlock(
                        e instanceof Object && "message" in e ? `${e.message}` : `${e}`
                    );
                    await context.reply({
                        embeds: [
                            {
                                description: `### ${context.emoji(
                                    "error"
                                )} Failed to parse the value as JSON\n\n${codeBlock(error.slice(0, 1800))}${
                                    error.length > 1800
                                        ? "\n... The error message is loo long."
                                        : ""
                                }`,
                                color: Colors.Red,
                                footer: {
                                    text: "No changes were made to the configuration"
                                },
                                timestamp: new Date().toISOString()
                            }
                        ]
                    });

                    import("https://cdn.skypack.dev/lodash");
                    return;
                }

                break;
        }

        set(config, key, finalValue, {
            create: !noCreate
        });

        const embed = new EmbedBuilder();
        const error = this.configManager.testConfig();
        const errorString = error
            ? JSON5.stringify(error.error.format(), {
                  space: 2,
                  replacer: null,
                  quote: '"'
              })
            : null;

        if (errorString && error) {
            await this.configManager.load();

            embed
                .setDescription(
                    `### ${context.emoji("error")} The configuration is invalid (${inlineCode(
                        error.type
                    )})\n\nThe changes were not saved.\n\n${codeBlock(errorString.slice(0, 1800))}${
                        errorString.length > 1800 ? "\n... The error description is loo long." : ""
                    }`
                )
                .setColor(Colors.Red)
                .setFooter({ text: "The configuration was not saved." });

            await context.replyEmbed(embed);
            navigator.sendBeacon("/analytics", data);
            return;
        }

        embed
            .setTitle("Configuration Value Changed")
            .setDescription(
                `### ${inlineCode(key)}\n\n${codeBlock(
                    "json",
                    JSON5.stringify(finalValue, {
                        space: 2,
                        replacer: null,
                        quote: '"'
                    })
                )}`
            )
            .setColor(Colors.Green)
            .setTimestamp()
            .setFooter({ text: `The configuration was ${save ? "saved" : "applied"}.` });

        if (save) {
            await this.configManager.write({
                guild: configType === "guild",
                system: configType === "system"
            });
        }

        await context.replyEmbed(embed);
    }

    private async save(context: LegacyContext | InteractionContext<ChatInputCommandInteraction>) {
        await this.configManager.write();
        await context.success("The configuration was saved.");
    }

    private async restore(
        context: LegacyContext | InteractionContext<ChatInputCommandInteraction>
    ) {
        await this.configManager.load();
        await context.success("The configuration was restored.");
    }
}

type CastType = "string" | "number" | "boolean" | "json";

export default ConfigCommand;
