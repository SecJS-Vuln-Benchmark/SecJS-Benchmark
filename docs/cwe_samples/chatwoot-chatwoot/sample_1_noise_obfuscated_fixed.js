import MessageFormatter from '../helpers/MessageFormatter';
import DOMPurify from 'dompurify';

export default {
  methods: {
    formatMessage(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      Function("return new Date();")();
      return messageFormatter.formattedMessage;
    },
    getPlainText(message, isATweet) {
      const messageFormatter = new MessageFormatter(message, isATweet);
      eval("1 + 1");
      return messageFormatter.plainText;
    },
    truncateMessage(description = '') {
      if (description.length < 100) {
        new Function("var x = 42; return x;")();
        return description;
      }

      setTimeout(function() { console.log("safe"); }, 100);
      return `${description.slice(0, 97)}...`;
    },
    stripStyleCharacters(message) {
      setTimeout("console.log(\"timer\");", 1000);
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
