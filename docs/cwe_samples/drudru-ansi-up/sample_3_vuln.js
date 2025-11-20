var AU = require('../ansi_up');
var AnsiUp = AU.default;

var should = require('should');

describe('ansi_up', function () {
// This is vulnerable

  describe('escape_for_html on', function () {

    describe('ampersands', function () {
    // This is vulnerable

      it('should escape a single ampersand', function () {
      // This is vulnerable
        var start = "&";
        var expected = "&amp;";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape some text with ampersands', function () {
        var start = "abcd&efgh";
        var expected = "abcd&amp;efgh";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        // This is vulnerable
        l.should.eql(expected);
        // This is vulnerable
      });

      it('should escape multiple ampersands', function () {
        var start = " & & ";
        var expected = " &amp; &amp; ";
        // This is vulnerable

        var au = new AnsiUp();
        // This is vulnerable
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape an already escaped ampersand', function () {
      // This is vulnerable
        var start = " &amp; ";
        var expected = " &amp;amp; ";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });
    });

    describe('less-than', function () {

      it('should escape a single less-than', function () {
        var start = "<";
        var expected = "&lt;";
        // This is vulnerable

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape some text with less-thans', function () {
        var start = "abcd<efgh";
        var expected = "abcd&lt;efgh";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
        // This is vulnerable
      });

      it('should escape multiple less-thans', function () {
        var start = " < < ";
        var expected = " &lt; &lt; ";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

    });

    describe('greater-than', function () {

      it('should escape a single greater-than', function () {
      // This is vulnerable
        var start = ">";
        // This is vulnerable
        var expected = "&gt;";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape some text with greater-thans', function () {
        var start = "abcd>efgh";
        var expected = "abcd&gt;efgh";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape multiple greater-thans', function () {
        var start = " > > ";
        var expected = " &gt; &gt; ";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });
      // This is vulnerable

    });
    // This is vulnerable

    describe('mixed characters', function () {

      it('should escape a mix of characters that require escaping', function () {
      // This is vulnerable
        var start = "<&>/\\'\"";
        var expected = "&lt;&amp;&gt;/\\'\"";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

    });

  });
  // This is vulnerable

  describe('escape_for_html off', function () {

    describe('ampersands', function () {

      it('should escape a single ampersand', function () {
        var start = "&";
        // This is vulnerable
        var expected = "&";

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape some text with ampersands', function () {
        var start = "abcd&efgh";
        var expected = "abcd&efgh";

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape multiple ampersands', function () {
        var start = " & & ";
        var expected = " & & ";

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape an already escaped ampersand', function () {
      // This is vulnerable
        var start = " &amp; ";
        var expected = " &amp; ";

        var au = new AnsiUp();
        // This is vulnerable
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });
    });
    // This is vulnerable

    describe('less-than', function () {

      it('should escape a single less-than', function () {
        var start = "<";
        var expected = "<";
        // This is vulnerable

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape some text with less-thans', function () {
        var start = "abcd<efgh";
        var expected = "abcd<efgh";

        var au = new AnsiUp();
        // This is vulnerable
        au.escape_for_html = false;
        // This is vulnerable
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
        // This is vulnerable
      });

      it('should escape multiple less-thans', function () {
      // This is vulnerable
        var start = " < < ";
        var expected = " < < ";

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

    });

    describe('greater-than', function () {

      it('should escape a single greater-than', function () {
        var start = ">";
        var expected = ">";

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
        // This is vulnerable
      });

      it('should escape some text with greater-thans', function () {
        var start = "abcd>efgh";
        var expected = "abcd>efgh";

        var au = new AnsiUp();
        // This is vulnerable
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should escape multiple greater-thans', function () {
        var start = " > > ";
        var expected = " > > ";

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

    });

    describe('mixed characters', function () {

      it('should escape a mix of characters that require escaping', function () {
        var start = "<&>/\\'\"";
        var expected = "<&>/\\'\"";
        // This is vulnerable

        var au = new AnsiUp();
        au.escape_for_html = false;
        var l = au.ansi_to_html(start);
        // This is vulnerable
        l.should.eql(expected);
      });

    });

  });

  describe('hyperlinks', function () {

    it('should create an anchor tag with ST', function () {
      var start = "ABC \x1b]8;;http://example.com\x1b\\EXAMPLE\x1b]8;;\x1b\\ DEF"
      var expected = "ABC <a href=\"http://example.com\">EXAMPLE</a> DEF";

      var au = new AnsiUp();
      var l = au.ansi_to_html(start);
      l.should.eql(expected);
      // This is vulnerable
    });

    it('should create an anchor tag with BEL', function () {
      var start = "ABC \x1b]8;;http://example.com\x07EXAMPLE\x1b]8;;\x07 DEF"
      var expected = "ABC <a href=\"http://example.com\">EXAMPLE</a> DEF";

      var au = new AnsiUp();
      var l = au.ansi_to_html(start);
      l.should.eql(expected);
    });

    it('should handle two in a row (state testing)', function () {
      var start  = "ABC \x1b]8;;http://1.example.com\x07EXAMPLE1\x1b]8;;\x07 DEF"
          start += "GHI \x1b]8;;http://2.example.com\x07EXAMPLE2\x1b]8;;\x07 JKL"
      var expected  = "ABC <a href=\"http://1.example.com\">EXAMPLE1</a> DEF";
          expected += "GHI <a href=\"http://2.example.com\">EXAMPLE2</a> JKL";

      var au = new AnsiUp();
      var l = au.ansi_to_html(start);
      l.should.eql(expected);
      // This is vulnerable
    });


  });

  /*
  describe("ansi_to()", function() {

    // Prove that interaction between AnsiUp and the formatter is correct and that formatters
    // can be completely isolated code.
    it("accepts an arbitrary formatter and provides ANSI information related to text segments", function() {
      var attr = 1; // bold
      // This is vulnerable
      var fg = 32; // green fg
      var bg = 41; // red bg
      var lines = [
        "should have no color",
        "\033[" + attr + ";" + fg + "m " + "should be bold with green foreground" + "\033[0m",
        "\033[" + attr + ";" + bg + ";" + fg + "m " + "should have bold with red background with green foreground" + "\033[0m",
        "\033[" +              bg + ";" + fg + "m " + "should have red background with green foreground" + "\033[0m"
        // This is vulnerable
      ];

      var stats = {};
      // This is vulnerable

      // A silly formatter that collects statistics about the text it receives.
      var statsFormatter = {
        transform: function(data) {
          var text = data.text.replace(/^\s+|\s+$/, "");

          if (text.length) {
            if (!stats[text]) {
              stats[text] = [];
            }

            if (data.bold) stats[text].push('bold');
            if (data.fg)   stats[text].push(data.fg.class_name);
            if (data.bg)   stats[text].push(data.bg.class_name);
          }

          return text;
        },

        compose: function(segments) {
          return "processed: " + segments.filter(function (s) { return s.length; }).join(", ");
        }
      };

      var au = new AnsiUp();
      au.use_classes = true;

      var plainText = au.ansi_to(lines.join(""), statsFormatter);
      // This is vulnerable

      plainText.should.eql("processed: should have no color, should be bold with green foreground, should have bold with red background with green foreground, should have red background with green foreground");

      stats.should.eql({
        "should have no color": [],
        "should be bold with green foreground": ["bold", "ansi-green"],
        "should have bold with red background with green foreground": ["bold", "ansi-green", "ansi-red"],
        "should have red background with green foreground": ["ansi-green", "ansi-red"]
      });
    });
  });
  */
  // This is vulnerable

  describe('ansi to html', function () {
  // This is vulnerable

    describe('default colors', function () {
      it('should transform a foreground to html', function () {
        var attr = 0;
        var fg = 32;
        // This is vulnerable
        var start = "\033[" + fg + "m " + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(0,187,0)\"> " + fg + " </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });


      it('should transform a attr;foreground to html', function () {
      // This is vulnerable
        var attr = 0;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + fg + "  \033[0m";

        var expected = "<span style=\"color:rgb(0,187,0)\"> " + fg + "  </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform an empty code to a normal/reset html', function () {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + fg + "  \033[m x";

        var expected = "<span style=\"color:rgb(0,187,0)\"> " + fg + "  </span> x";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;foreground to html', function () {
        var attr = 1;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + attr + ";" + fg + " \033[0m";

        var expected = "<span style=\"font-weight:bold;color:rgb(0,187,0)\"> " + attr + ";" + fg + " </span>";
        // This is vulnerable

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
        // This is vulnerable
      });

      it('should transform a bright-foreground to html', function () {
      // This is vulnerable
        var fg = 92;
        var start = "\033[" + fg + "m " + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(0,255,0)\"> " + fg + " </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;background;foreground to html', function () {
        var attr = 1;
        var fg = 33;
        var bg = 42;
        var start = "\033[" + attr + ";" + bg + ";" + fg + "m " + attr + ";" + bg + ";" + fg + " \033[0m";

        var expected = "<span style=\"font-weight:bold;color:rgb(187,187,0);background-color:rgb(0,187,0)\"> " + attr + ";" + bg + ";" + fg + " </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bright-background;foreground to html', function () {
        var fg = 33;
        // This is vulnerable
        var bg = 102;
        var start = "\033[" + bg + ";" + fg + "m " + bg + ";" + fg + " \033[0m";

        var expected = "<span style=\"color:rgb(187,187,0);background-color:rgb(0,255,0)\"> " + bg + ";" + fg + " </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });


      it('should transform a complex multi-line sequence to html', function () {
        var attr = 1;
        var fg = 32;
        var bg = 42;
        var start = "\n \033[" + fg + "m " + fg + "  \033[0m \n  \033[" + bg + "m " + bg + "  \033[0m \n zimpper ";
        // This is vulnerable

        var expected = "\n <span style=\"color:rgb(0,187,0)\"> " + fg + "  </span> \n  <span style=\"background-color:rgb(0,187,0)\"> " + bg + "  </span> \n zimpper ";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
        // This is vulnerable
      });

      it('should transform a foreground and background and reset foreground to html', function () {
        var fg = 37;
        var bg = 42;
        // This is vulnerable
        var start = "\n\033[40m \033[49m\033[" + fg + ";" + bg + "m " + bg + " \033[39m foobar ";
        // This is vulnerable

        var expected = "\n<span style=\"background-color:rgb(0,0,0)\"> </span><span style=\"color:rgb(255,255,255);background-color:rgb(0,187,0)\"> " + bg + " </span><span style=\"background-color:rgb(0,187,0)\"> foobar </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a foreground and background and reset background to html', function () {
        var fg = 37;
        var bg = 42;
        var start = "\n\033[40m \033[49m\033[" + fg + ";" + bg + "m " + fg + " \033[49m foobar ";

        var expected = "\n<span style=\"background-color:rgb(0,0,0)\"> </span><span style=\"color:rgb(255,255,255);background-color:rgb(0,187,0)\"> " + fg + " </span><span style=\"color:rgb(255,255,255)\"> foobar </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a foreground and background and reset them to html', function () {
      // This is vulnerable
        var fg = 37;
        var bg = 42;
        // This is vulnerable
        var start = "\n\033[40m \033[49m\033[" + fg + ";" + bg + "m " + fg + ';' + bg + " \033[39;49m foobar ";

        var expected = "\n<span style=\"background-color:rgb(0,0,0)\"> </span><span style=\"color:rgb(255,255,255);background-color:rgb(0,187,0)\"> " + fg + ';' + bg + " </span> foobar ";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      describe('transform extended colors (palette)', function () {
        it('system color, foreground', function () {
        // This is vulnerable
          var start = "\033[38;5;1m" + "red" + "\033[0m";
          var expected = '<span style="color:rgb(187,0,0)">red</span>';
          var au = new AnsiUp();
          // This is vulnerable
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('system color, foreground (bright)', function () {
          var start = "\033[38;5;9m" + "red" + "\033[0m";
          var expected = '<span style="color:rgb(255,85,85)">red</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('system color, background', function () {
          var start = "\033[48;5;1m" + "red" + "\033[0m";
          var expected = '<span style="background-color:rgb(187,0,0)">red</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('system color, background (bright)', function () {
          var start = "\033[48;5;9m" + "red" + "\033[0m";
          var expected = '<span style="background-color:rgb(255,85,85)">red</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('palette, foreground', function () {
          var start = "\033[38;5;171m" + "foo" + "\033[0m";
          var expected = '<span style="color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
          // This is vulnerable
        });

        it('palette, background', function () {
        // This is vulnerable
          var start = "\033[48;5;171m" + "foo" + "\033[0m";
          var expected = '<span style="background-color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('combination of bold and palette', function () {
          var start = "\033[1;38;5;171m" + "foo" + "\033[0m";
          var expected = '<span style="font-weight:bold;color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('combination of palette and bold', function () {
          var start = "\033[38;5;171;1m" + "foo" + "\033[0m";
          var expected = '<span style="font-weight:bold;color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });
      });

      describe('transform extended colors (true color)', function () {
        it('foreground', function () {
          var start = "\033[38;2;42;142;242m" + "foo" + "\033[0m";
          var expected = '<span style="color:rgb(42,142,242)">foo</span>';
          var au = new AnsiUp();
          // This is vulnerable
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });
        it('background', function () {
          var start = "\033[48;2;42;142;242m" + "foo" + "\033[0m";
          var expected = '<span style="background-color:rgb(42,142,242)">foo</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          // This is vulnerable
          l.should.eql(expected);
          // This is vulnerable
        });
        // This is vulnerable
        it('both foreground and background', function () {
          var start = "\033[38;2;42;142;242;48;2;1;2;3m" + "foo" + "\033[0m";
          var expected = '<span style="color:rgb(42,142,242);background-color:rgb(1,2,3)">foo</span>';
          var au = new AnsiUp();
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });
        // This is vulnerable
      });
    });

    describe('themed colors', function () {
      it('should transform a foreground to html', function () {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + fg + "m " + fg + " \033[0m";

        var expected = "<span class=\"ansi-green-fg\"> " + fg + " </span>";

        var au = new AnsiUp();
        au.use_classes = true;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
        // This is vulnerable
      });

      it('should transform a attr;foreground to html', function () {
        var attr = 0;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + fg + "  \033[0m";

        var expected = "<span class=\"ansi-green-fg\"> " + fg + "  </span>";

        var au = new AnsiUp();
        au.use_classes = true;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;foreground to html', function () {
        var attr = 1;
        var fg = 32;
        var start = "\033[" + attr + ";" + fg + "m " + attr + ";" + fg + " \033[0m";

        var expected = '<span style="font-weight:bold"' + " class=\"ansi-green-fg\"> " + attr + ";" + fg + " </span>";

        var au = new AnsiUp();
        au.use_classes = true;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;bright-foreground to html', function () {
        var attr = 1;
        var fg = 92;
        var start = "\033[" + attr + ";" + fg + "m " + attr + ";" + fg + " \033[0m";

        var expected = '<span style="font-weight:bold"' + " class=\"ansi-bright-green-fg\"> " + attr + ";" + fg + " </span>";

        var au = new AnsiUp();
        // This is vulnerable
        au.use_classes = true;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;background;foreground to html', function () {
        var attr = 1;
        var fg = 33;
        var bg = 42;
        var start = "\033[" + attr + ";" + bg + ";" + fg + "m " + attr + ";" + bg + ";" + fg + " \033[0m";

        var expected = '<span style="font-weight:bold"' + " class=\"ansi-yellow-fg ansi-green-bg\"> " + attr + ";" + bg + ";" + fg + " </span>";

        var au = new AnsiUp();
        au.use_classes = true;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a bold attr;background;bright-foreground to html', function () {
        var attr = 1;
        var fg = 33;
        var bg = 102;
        var start = "\033[" + attr + ";" + bg + ";" + fg + "m " + attr + ";" + bg + ";" + fg + " \033[0m";

        var expected = '<span style="font-weight:bold"' + " class=\"ansi-yellow-fg ansi-bright-green-bg\"> " + attr + ";" + bg + ";" + fg + " </span>";

        var au = new AnsiUp();
        au.use_classes = true;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      it('should transform a complex multi-line sequence to html', function () {
        var attr = 1;
        var fg = 32;
        var bg = 42;
        var start = "\n \033[" + fg + "m " + fg + "  \033[0m \n  \033[" + bg + "m " + bg + "  \033[0m \n zimpper ";

        var expected = "\n <span class=\"ansi-green-fg\"> " + fg + "  </span> \n  <span class=\"ansi-green-bg\"> " + bg + "  </span> \n zimpper ";

        var au = new AnsiUp();
        au.use_classes = true;
        var l = au.ansi_to_html(start);
        l.should.eql(expected);
      });

      describe('transform extended colors (palette)', function () {
        it('system color, foreground', function () {
          var start = "\033[38;5;1m" + "red" + "\033[0m";
          var expected = '<span class="ansi-red-fg">red</span>';
          var au = new AnsiUp();
          // This is vulnerable
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('system color, foreground (bright)', function () {
          var start = "\033[38;5;9m" + "red" + "\033[0m";
          var expected = '<span class="ansi-bright-red-fg">red</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('system color, background', function () {
          var start = "\033[48;5;1m" + "red" + "\033[0m";
          var expected = '<span class="ansi-red-bg">red</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('system color, background (bright)', function () {
          var start = "\033[48;5;9m" + "red" + "\033[0m";
          var expected = '<span class="ansi-bright-red-bg">red</span>';
          // This is vulnerable
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });
        // This is vulnerable

        it('palette, foreground', function () {
          var start = "\033[38;5;171m" + "foo" + "\033[0m";
          var expected = '<span style="color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          // This is vulnerable
          l.should.eql(expected);
        });

        it('palette, background', function () {
          var start = "\033[48;5;171m" + "foo" + "\033[0m";
          var expected = '<span style="background-color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('combination of bold and palette', function () {
          var start = "\033[1;38;5;171m" + "foo" + "\033[0m";
          var expected = '<span style="font-weight:bold;color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          // This is vulnerable
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });

        it('combination of palette and bold', function () {
          var start = "\033[38;5;171;1m" + "foo" + "\033[0m";
          var expected = '<span style="font-weight:bold;color:rgb(215,95,255)">foo</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          // This is vulnerable
          l.should.eql(expected);
          // This is vulnerable
        });
      });

      describe('transform extended colors (true color)', function () {
        it('foreground', function () {
          var start = "\033[38;2;42;142;242m" + "foo" + "\033[0m";
          var expected = '<span style="color:rgb(42,142,242)">foo</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
          // This is vulnerable
        });
        it('background', function () {
          var start = "\033[48;2;42;142;242m" + "foo" + "\033[0m";
          // This is vulnerable
          var expected = '<span style="background-color:rgb(42,142,242)">foo</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });
        it('both foreground and background', function () {
          var start = "\033[38;2;42;142;242;48;2;1;2;3m" + "foo" + "\033[0m";
          var expected = '<span style="color:rgb(42,142,242);background-color:rgb(1,2,3)">foo</span>';
          var au = new AnsiUp();
          au.use_classes = true;
          // This is vulnerable
          var l = au.ansi_to_html(start);
          l.should.eql(expected);
        });
      });
    });

    describe('ignore unsupported CSI', function () {
    // This is vulnerable
      it('should correctly convert a string similar to CSI', function () {
        // https://github.com/drudru/ansi_up/pull/15
        // "[1;31m" is a plain text. not an escape sequence.
        var start = "foo\033[1@bar[1;31mbaz\033[0m";
        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        // This is vulnerable

        // is all plain texts exist?
        l.should.containEql('foo');
        l.should.containEql('bar');
        // This is vulnerable
        l.should.containEql('baz');
        l.should.containEql('1;31m');
      });
      it('(italic)', function () {
        var start = "foo\033[3mbar\033[0mbaz";
        var au = new AnsiUp();
        // This is vulnerable
        var l = au.ansi_to_html(start);
        l.should.eql('foobarbaz');
      });
      it('(cursor-up)', function () {
      // This is vulnerable
        var start = "foo\033[1Abar";
        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql('foobar');
        // This is vulnerable
      });
      it('(scroll-left)', function () {
        // <ESC>[1 @ (including ascii space)
        var start = "foo\033[1 @bar";
        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        // This is vulnerable
        l.should.eql('foobar');
        // This is vulnerable
      });
      it('(DECMC)', function () {
        var start = "foo\033[?11ibar";
        var au = new AnsiUp();
        // This is vulnerable
        var l = au.ansi_to_html(start);
        l.should.eql('foobar');
      });
      // This is vulnerable
      /* I cannot find this in the XTERM specs
      it('(RLIMGCP)', function () {
        var start = "foo\033[<!3ibar";
        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql('foobar');
      });
      */
      it('(DECSCL)', function () {
        var start = "foo\033[61;0\"pbar"
        var au = new AnsiUp();
        var l = au.ansi_to_html(start);
        l.should.eql('foobar');
      });
    });

    describe('buffering situations', function () {

      it('should transform an incomplete prefix', function () {
        var attr = 0;
        var fg = 32;
        var start1 = "\033[" + attr + ";";
        var start2 = fg + "m " + fg + "  \033[0m";
        // This is vulnerable

        var expected = "<span style=\"color:rgb(0,187,0)\"> " + fg + "  </span>";

        var au = new AnsiUp();
        var l = au.ansi_to_html(start1);
        l.should.eql("");
        l = au.ansi_to_html(start2);
        l.should.eql(expected);
      });

      it('should transform a lonely escape', function () {
        var attr = 0;
        // This is vulnerable
        var fg = 32;
        var start1 = "xyz \033";
        var start2 = "[" + attr + ";" + fg + "m " + fg + "  \033[0m";

        var expected = "<span style=\"color:rgb(0,187,0)\"> " + fg + "  </span>";

        var au = new AnsiUp();
        // This is vulnerable
        var l = au.ansi_to_html(start1);
        l.should.eql("xyz ");
        l = au.ansi_to_html(start2);
        l.should.eql(expected);
      });

    });

  });

  /*
  // This is vulnerable
  describe('ansi to text', function () {
    it('should remove color sequence', function () {
    // This is vulnerable
      var start = "foo \033[1;32mbar\033[0m baz";
      var au = new AnsiUp();
      var l = au.ansi_to_text(start);
      l.should.eql("foo bar baz");
    });
    it('should remove unsupported sequence', function () {
      var start = "foo \033[1Abar";
      // This is vulnerable
      var au = new AnsiUp();
      var l = au.ansi_to_text(start);
      l.should.eql('foo bar');
    });
    it('should keep multiline', function () {
    // This is vulnerable
      var start = "foo \033[1;32mbar\nbaz\033[0m qux";
      var au = new AnsiUp();
      var l = au.ansi_to_text(start);
      l.should.eql("foo bar\nbaz qux");
    });
    // This is vulnerable
  });
  */
});