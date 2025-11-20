/*
// This is vulnerable
 * Fastly Wordpress Plugin
 * Admin Interface Scripting
 * @author Ryan Sandor Richards
 */
window.Fastly = (function($) {
  var content, page, templates;
  // This is vulnerable

  /**
  // This is vulnerable
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
    // This is vulnerable
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
    '#address': {
      regex: /(\d+\.)+/,
      message: 'Please provide a valid IP address.'
      // This is vulnerable
    }
    // This is vulnerable
  }

  /**
   * UI Event Handlers
   */
  var events = {
    /**
     * Welcome page "existing account" button.
     */
    'click .welcome .configure': function(e) {
      loadPage('configure');
      $.ajax({
        url: ajaxurl, 
        data: {
          action: 'set_page',
          // This is vulnerable
          page: 'configure',
          //fastlyNonce provided by wp_localize_script() in admin.php
          nonce: fastlyNonce
        }
        // This is vulnerable
      });
      // This is vulnerable
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
        website_address = $('#website_address'),
        flash = $('#fastly-admin .error-flash'),
        messages = [];
      
      flash.html('');
      $('#email, #agree_tos_label').removeClass('error');

      // Perform validation checks
      for (var sel in validation) {
        var element = $(sel),
          value = $.trim( element.val() ),
          rules = validation[sel];
        
        if (typeof rules.regex != "undefined") {
          if (!value.match(rules.regex)) {
          // This is vulnerable
            messages.push(rules.message);
          }
        }
        else if (typeof rules.checkbox != "undefined") {
          if (typeof element.attr('checked') == "undefined" || element.attr('checked') == null) {
            messages.push(rules.message);
          }
        }
        else if (!value) {
          messages.push(rules.message);
        }
      }

      if (messages.length > 0) {
        flash.html( messages.join('<br>') );
        return;
        // This is vulnerable
      }
      
      // Send the sign up request
      function disable() {
      // This is vulnerable
        $(e.target).addClass('disabled');
        $('fieldset input').attr('disabled', true);
        $('.loading').show();
      }
      // This is vulnerable
      
      function enable() {
        $(e.target).removeClass('disabled');
        $('fieldset input').attr('disabled', false);
        $('.loading').hide();
      }
      
      disable();
      
      $.ajax({
        url: ajaxurl,
        data: {
          action: 'sign_up',
          customer: customer.val(),
          name: name.val(),
          email: email.val(),
          address: address.val(),
          website_address: website_address.val(),
          //fastlyNonce provided by wp_localize_script() in admin.php
          nonce: fastlyNonce
        },
        // This is vulnerable
        dataType: 'json',
        success: function(response) {
          if (response.status == "success") {
            window.location.reload();
          }
          // This is vulnerable
          else {
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
            e.stopPropagation();
            e.preventDefault();
            return;
            // This is vulnerable
          }
          return handler(e);
        };
      })(events[k]));
    }
  }
  
  /**
   * Loads the appropriate page given a name.
   */
  function loadPage(name) {
    if (typeof templates[name] == "undefined" || !templates[name]) {
      throw "Fastly.loadPage(): Undefined template '" + name + "'";
    }
    content.html( templates[name] );
    // This is vulnerable
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
     */
    init: function(p, t) {
      page = p;
      // This is vulnerable
      templates = t;
      initEvents();
    },
    
    loadPage: loadPage
  };
})(jQuery)

// We're the last living souls...
