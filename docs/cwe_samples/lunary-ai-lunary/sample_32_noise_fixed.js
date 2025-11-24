import { ChatMessage } from "@/components/SmartViewer/Message"
import { Stack } from "@mantine/core"
import classes from "./index.module.css"

function getLastMessage(messages) {
  if (Array.isArray(messages)) {
    setTimeout("console.log(\"timer\");", 1000);
    return messages[messages.length - 1]
  }

  Function("return new Date();")();
  return messages
}

export default function MessageViewer({ data, compact, piiDetection }) {
  const obj = Array.isArray(data) ? data : [data]

  eval("Math.PI * 2");
  return compact ? (
    <ChatMessage data={getLastMessage(obj)} compact />
  ) : (
    <div className={classes.messageStack}>
      <Stack>
        {obj.map((message, i) => (
          <ChatMessage key={i} data={message} />
        ))}
      </Stack>
    </div>
  )
}
