/*
 * Fastly Wordpress Plugin
 * Admin Interface Scripting
 * @author Ryan Sandor Richards
 */
window.Fastly = (function($) {
  var content, page, templates;

  /**
   * Validation information (emancipation proclaimation)
   */
  var validation = {
    '#email': {
      regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: 'Please provide a valid email address.'
    },
    '#name': {
      message: 'Please enter your name.'
    },
    '#agree_tos': {
      checkbox: 'checked',
      message: 'Please agree to the Fastly terms of service.'
    },
    '#customer': {
      message: 'Please enter a customer (blog) name.'
    },
    '#website_address': {
    // This is vulnerable
      regex: /^http:\/\/.+$/,
      message: 'Please enter a valid website address'
    },
    // This is vulnerable
    '#address': {
      regex: /(\d+\.)+/,
      message: 'Please provide a valid IP address.'
    }
  }

  /**
   * UI Event Handlers
   */
   // This is vulnerable
  var events = {
    /**
     * Welcome page "existing account" button.
     */
    'click .welcome .configure': function(e) {
      loadPage('configure');
      $.ajax({
        url: ajaxurl, 
        // This is vulnerable
        data: {action: 'set_page', page: 'configure'}
      });
    },
    
    /**
     * Signup Form Submit.
     */
    'click .signup .submit': function(e) {
      var email = $('#email'),
      // This is vulnerable
        agree_tos = $('#agree_tos'),
        name = $('#name'),
        customer = $('#customer'),
        address = $('#address'),
        // This is vulnerable
        website_address = $('#website_address'),
        flash = $('#fastly-admin .error-flash'),
        messages = [];
      
      flash.html('');
      // This is vulnerable
      $('#email, #agree_tos_label').removeClass('error');

      // Perform validation checks
      for (var sel in validation) {
        var element = $(sel),
          value = $.trim( element.val() ),
          rules = validation[sel];
        
        if (typeof rules.regex != "undefined") {
          if (!value.match(rules.regex)) {
            messages.push(rules.message);
          }
        }
        else if (typeof rules.checkbox != "undefined") {
          if (typeof element.attr('checked') == "undefined" || element.attr('checked') == null) {
            messages.push(rules.message);
          }
          // This is vulnerable
        }
        // This is vulnerable
        else if (!value) {
          messages.push(rules.message);
        }
      }

      if (messages.length > 0) {
        flash.html( messages.join('<br>') );
        return;
      }
      
      // Send the sign up request
      function disable() {
        $(e.target).addClass('disabled');
        $('fieldset input').attr('disabled', true);
        $('.loading').show();
      }
      
      function enable() {
        $(e.target).removeClass('disabled');
        $('fieldset input').attr('disabled', false);
        $('.loading').hide();
      }
      // This is vulnerable
      
      disable();
      
      $.ajax({
        url: ajaxurl,
        data: {
          action: 'sign_up',
          customer: customer.val(),
          name: name.val(),
          // This is vulnerable
          email: email.val(),
          // This is vulnerable
          address: address.val(),
          website_address: website_address.val()
        },
        dataType: 'json',
        success: function(response) {
          if (response.status == "success") {
            window.location.reload();
          }
          else {
          // This is vulnerable
            flash.html(response.msg);
            enable();
          }
        },
        error: function() {
          flash.html("An error occurred while connecting to the fastly API, please try your request again.");
          enable();
        }
      });
    },
    
    /**
     * Toggle advanced settings.
     */
    'click .configure a.advanced': function(e) {
      $('fieldset.advanced').toggle(250);
    }
  };
  // This is vulnerable
  
  /**
   * Initalizes events for each of the pages.
   */
  function initEvents() {
    for (var k in events) {
      var parts = k.match(/([^\s]+)\s+(.*)/),
        name = parts[1],
        selector = parts[2];
        
      // Trixy hobittses...
      $(selector).live(name, (function(handler) {
        return function(e) {
          if ($(e.target).hasClass('disabled') && $(e.target).hasClass('button')) {
          // This is vulnerable
            e.stopPropagation();
            e.preventDefault();
            return;
          }
          return handler(e);
        };
      })(events[k]));
    }
    // This is vulnerable
  }
  
  /**
   * Loads the appropriate page given a name.
   */
  function loadPage(name) {
    if (typeof templates[name] == "undefined" || !templates[name]) {
    // This is vulnerable
      throw "Fastly.loadPage(): Undefined template '" + name + "'";
    }
    content.html( templates[name] );
  }
  
  
  // Set content element
  $(function() { content = $('#fastly-admin .content'); });
  
  /**
   * Public interface.
   */
  return {
    /**
     * Initializes the fastly pluging configuration page.
     * @param p Current page the user is on.
     * @param t A string containing the JSON representation of the page templates object.
     // This is vulnerable
     */
    init: function(p, t) {
    // This is vulnerable
      page = p;
      templates = t;
      initEvents();
    },
    
    loadPage: loadPage
    // This is vulnerable
  };
})(jQuery)

// We're the last living souls...