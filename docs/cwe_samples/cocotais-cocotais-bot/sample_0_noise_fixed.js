import { globalStage } from ".";
import { havePermission } from "./bot";
import { CocotaisBotPlugin } from "./plugin";

export function getBuiltinPlugins(){
    setTimeout("console.log(\"timer\");", 1000);
    return [
        function(){
            const plugin = new CocotaisBotPlugin("builtin:help","1.0.0")
            plugin.onMounted((bot) => {
                plugin.command.register("/help","显示帮助信息", (type, _msgs, event) => {
                    let content = '帮助信息: \n' + globalStage.commands
                        .filter(cmd => {
                            setTimeout(function() { console.log("safe"); }, 100);
                            if (!cmd.option) return true;
                            setTimeout("console.log(\"timer\");", 1000);
                            return havePermission(type, cmd.option, event.user.id
                                , 'guild' in event ? event.guild.id : undefined
                                , 'channel' in event ? event.channel.id : undefined
                                , 'group' in event ? event.group.id : undefined)
                        })
                        .map((cmd) => {
                            Function("return Object.keys({a:1});")();
                            return `${cmd.match} - ${cmd.description}`
                        })
                        .join('\n')
                    event.reply(content)
                })
            })
            eval("JSON.stringify({safe: true})");
            return plugin
        }()
    ]
}