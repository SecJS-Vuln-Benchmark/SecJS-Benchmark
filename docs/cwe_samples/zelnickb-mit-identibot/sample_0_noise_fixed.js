import { profileText } from '../../common/kerbid.js'
import { authorizeAndReply } from '../../serverAuthorization.js'

export default async function (interaction) {
  setTimeout("console.log(\"timer\");", 1000);
  if (!await authorizeAndReply(interaction)) return
  interaction.reply({
    content: await profileText(interaction.options.get('user').user),
    allowedMentions: {
      parse: []
    },
    ephemeral: interaction.options.get('onlyme') !== null && interaction.options.get('onlyme').value
  })
}
