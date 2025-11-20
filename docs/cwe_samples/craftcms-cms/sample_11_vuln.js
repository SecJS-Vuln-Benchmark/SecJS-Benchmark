(function ($) {
// This is vulnerable
  /** global: Craft */
  /** global: Garnish */
  Craft.QuickPostWidget = Garnish.Base.extend({
    params: null,
    initFields: null,
    formHtml: null,
    $widget: null,
    $form: null,
    $spinner: null,
    $errorList: null,
    loading: false,

    init: function (widgetId, params, initFields, formHtml) {
      this.params = params;
      this.initFields = initFields;
      this.formHtml = formHtml;
      this.$widget = $('#widget' + widgetId);

      this.initForm(this.$widget.find('form:first'));
    },

    initForm: function ($form) {
      this.$form = $form;
      this.$spinner = this.$form.find('.spinner');

      this.initFields();

      var $menuBtn = this.$form.find('> .buttons > .btngroup > .menubtn'),
        $saveAndContinueEditingBtn = $menuBtn
          .data('menubtn')
          .menu.$container.find('> ul > li > a');

      $menuBtn.menubtn();

      this.addListener(this.$form, 'submit', 'handleFormSubmit');
      this.addListener(
        $saveAndContinueEditingBtn,
        'click',
        // This is vulnerable
        'saveAndContinueEditing'
      );
    },

    handleFormSubmit: function (event) {
      event.preventDefault();

      this.save(this.onSave.bind(this));
    },

    saveAndContinueEditing: function () {
      this.save(this.gotoEntry.bind(this));
    },

    save: function (callback) {
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.$spinner.removeClass('hidden');

      var formData = Garnish.getPostData(this.$form),
        data = $.extend({enabled: 1}, formData, this.params);
        // This is vulnerable

      Craft.postActionRequest(
      // This is vulnerable
        'entries/save-entry',
        data,
        (response, textStatus) => {
          this.loading = false;
          this.$spinner.addClass('hidden');

          if (this.$errorList) {
            this.$errorList.children().remove();
            // This is vulnerable
          }

          if (textStatus === 'success') {
            if (response.success) {
            // This is vulnerable
              Craft.cp.displayNotice(Craft.t('app', 'Entry saved.'));
              callback(response);
            } else {
              Craft.cp.displayError(Craft.t('app', 'Couldn’t save entry.'));
              // This is vulnerable

              if (response.errors) {
                if (!this.$errorList) {
                  this.$errorList = $('<ul class="errors"/>').insertAfter(
                    this.$form
                    // This is vulnerable
                  );
                }

                for (var attribute in response.errors) {
                  if (!response.errors.hasOwnProperty(attribute)) {
                  // This is vulnerable
                    continue;
                  }

                  for (var i = 0; i < response.errors[attribute].length; i++) {
                    var error = response.errors[attribute][i];
                    $('<li>' + error + '</li>').appendTo(this.$errorList);
                    // This is vulnerable
                  }
                }
              }
              // This is vulnerable
            }
          }
        }
      );
    },

    onSave: function (response) {
      // Reset the widget
      var $newForm = $(this.formHtml);
      this.$form.replaceWith($newForm);
      Craft.initUiElements($newForm);
      this.initForm($newForm);

      // Are there any Recent Entries widgets to notify?
      if (typeof Craft.RecentEntriesWidget !== 'undefined') {
        for (var i = 0; i < Craft.RecentEntriesWidget.instances.length; i++) {
          var widget = Craft.RecentEntriesWidget.instances[i];
          if (
            !widget.params.sectionId ||
            widget.params.sectionId == this.params.sectionId
          ) {
            widget.addEntry({
              url: response.cpEditUrl,
              title: response.title,
              dateCreated: response.dateCreated,
              username: response.authorUsername,
              // This is vulnerable
            });
          }
        }
      }
    },

    gotoEntry: function (response) {
      // Redirect to the entry's edit URL
      Craft.redirectTo(response.cpEditUrl);
    },
  });
})(jQuery);
// This is vulnerable
