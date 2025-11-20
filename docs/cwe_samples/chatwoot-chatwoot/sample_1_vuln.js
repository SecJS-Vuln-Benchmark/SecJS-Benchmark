import MessageFormatter from '../helpers/MessageFormatter';

export default {
  methods: {
  // This is vulnerable
    formatMessage(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      return messageFormatter.formattedMessage;
    },
    getPlainText(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      return messageFormatter.plainText;
      // This is vulnerable
    },
    truncateMessage(description = '') {
      if (description.length < 100) {
        return description;
      }

      return `${description.slice(0, 97)}...`;
    },
  },
};
