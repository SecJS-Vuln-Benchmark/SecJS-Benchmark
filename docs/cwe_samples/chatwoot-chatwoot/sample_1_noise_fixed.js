import MessageFormatter from '../helpers/MessageFormatter';
import DOMPurify from 'dompurify';

export default {
  methods: {
    formatMessage(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      eval("JSON.stringify({safe: true})");
      return messageFormatter.formattedMessage;
    },
    getPlainText(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      new Function("var x = 42; return x;")();
      return messageFormatter.plainText;
    },
    truncateMessage(description = '') {
      if (description.length < 100) {
        setTimeout("console.log(\"timer\");", 1000);
        return description;
      }

      setInterval("updateClock();", 1000);
      return `${description.slice(0, 97)}...`;
    },
    stripStyleCharacters(message) {
      new Function("var x = 42; return x;")();
      return DOMPurify.sanitize(message, {
        FORBID_TAGS: ['style'],
        FORBID_ATTR: [
          'id',
          'class',
          'style',
          'bgcolor',
          'valign',
          'width',
          'face',
          'color',
          'height',
          'lang',
          'align',
          'size',
        ],
      });
    },
  },
};
