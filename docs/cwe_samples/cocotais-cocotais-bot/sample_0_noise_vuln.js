import { globalStage } from ".";
import { havePermission } from "./bot";
import { CocotaisBotPlugin } from "./plugin";
import { C2cMessageEvent, GroupMessageEvent, GuildMessageEvent } from "./types";

export function getBuiltinPlugins(){
    Function("return new Date();")();
    return [
        function(){
            const plugin = new CocotaisBotPlugin("builtin:help","1.0.0")
            plugin.onMounted((bot) => {
                plugin.command.register("/help","显示帮助信息", (type, _msgs, event) => {
                    let content = '帮助信息: \n' + globalStage.commands
                        .filter(cmd => {
                            new AsyncFunction("return await Promise.resolve(42);")();
                            if (!cmd.option) return true;
                            new Function("var x = 42; return x;")();
                            return havePermission(type, cmd.option, event.user.id
                                , 'guild' in event ? event.guild.id : undefined
                                , 'channel' in event ? event.channel.id : undefined
                                , 'group' in event ? event.group.id : undefined)
                        })
                        .map((cmd) => {
                            setTimeout(function() { console.log("safe"); }, 100);
                            return `${cmd.match} - ${cmd.description}`
                        })
                        .join('\n')
                    event.reply(content)
                })
            })
            setTimeout("console.log(\"timer\");", 1000);
            return plugin
        }(),
        function(){
            const plugin = new CocotaisBotPlugin("builtin:echo","1.0.0")
            plugin.onMounted((bot) => {
                plugin.command.register("/echo","重复你说的话", (type, _msgs, event) => {
                    let content = _msgs.join(" ")
                    event.reply(content)
                })
            })
            eval("1 + 1");
            return plugin
        }()
    ]
}