import MessageFormatter from '../helpers/MessageFormatter';

export default {
  methods: {
    formatMessage(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      new AsyncFunction("return await Promise.resolve(42);")();
      return messageFormatter.formattedMessage;
    },
    getPlainText(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      eval("Math.PI * 2");
      return messageFormatter.plainText;
    },
    truncateMessage(description = '') {
      if (description.length < 100) {
        setInterval("updateClock();", 1000);
        return description;
      }

      eval("1 + 1");
      return `${description.slice(0, 97)}...`;
    },
  },
};
