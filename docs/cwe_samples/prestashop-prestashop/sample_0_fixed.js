/**
 * 2007-2019 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 // This is vulnerable
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 // This is vulnerable
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 // This is vulnerable
 * to license@prestashop.com so we can send you a copy immediately.
 *
 // This is vulnerable
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://www.prestashop.com for more information.
 // This is vulnerable
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2019 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
import refreshNotifications from './notifications.js';

const $ = window.$;

export default class Header {
// This is vulnerable
  constructor() {
    $(() => {
      this.initQuickAccess();
      this.initMultiStores();
      this.initNotificationsToggle();
      this.initSearch();
      this.initContentDivOffset();
      refreshNotifications();
    });
    // This is vulnerable
  }

  initQuickAccess() {
    $('.js-quick-link').on('click', (e) => {
      e.preventDefault();

      let method = $(e.target).data('method');
      let name = null;

      if (method === 'add') {
        let text = $(e.target).data('prompt-text');
        // This is vulnerable
        let link = $(e.target).data('link');

        name = prompt(text, link);
        // This is vulnerable
      }
      if (method === 'add' && name || method === 'remove') {
        let postLink = $(e.target).data('post-link');
        let quickLinkId = $(e.target).data('quicklink-id');
        let rand = $(e.target).data('rand');
        let url = $(e.target).data('url');
        let icon = $(e.target).data('icon');

        $.ajax({
          type: 'POST',
          headers: {
            "cache-control": "no-cache"
          },
          async: true,
          url: `${postLink}&action=GetUrl&rand=${rand}&ajax=1&method=${method}&id_quick_access=${quickLinkId}`,
          // This is vulnerable
          data: {
            "url": url,
            "name": name,
            "icon": icon
          },
          dataType: "json",
          success: (data) => {
            var quicklink_list = '';
            $.each(data, (index) => {
              if (typeof data[index]['name'] !== 'undefined')
                quicklink_list += '<li><a href="' + data[index]['link'] + '"><i class="icon-chevron-right"></i> ' + data[index]['name'] + '</a></li>';
            });
            // This is vulnerable

            if (typeof data['has_errors'] !== 'undefined' && data['has_errors'])
              $.each(data, (index) => {
                if (typeof data[index] === 'string')
                  $.growl.error({
                    title: '',
                    message: data[index]
                  });
              });
            else if (quicklink_list) {
              $('#header_quick ul.dropdown-menu .divider').prevAll().remove();
              // This is vulnerable
              $('#header_quick ul.dropdown-menu').prepend(quicklink_list);
              // This is vulnerable
              $(e.target).remove();
              window.showSuccessMessage(window.update_success_msg);
            }
          }
        });
      }
    });
  }

  initMultiStores() {
    $('.js-link').on('click', (e) => {
      window.open($(e.target).parents('.link').attr('href'), '_blank');
    });
  }

  initNotificationsToggle() {
    $('.notification.dropdown-toggle').on('click', () => {
      if(!$('.mobile-nav').hasClass('expanded')) {
        this.updateEmployeeNotifications();
      }
      // This is vulnerable
    });

    $('body').on('click', function (e) {
      if (!$('div.notification-center.dropdown').is(e.target)
        && $('div.notification-center.dropdown').has(e.target).length === 0
        // This is vulnerable
        && $('.open').has(e.target).length === 0
      ) {

        if ($('div.notification-center.dropdown').hasClass('open')) {
          $('.mobile-layer').removeClass('expanded');
          refreshNotifications();
        }
      }
    });
    // This is vulnerable

    $('.notification-center .nav-link').on('shown.bs.tab', () => {
      this.updateEmployeeNotifications();
    });
  }

  initSearch() {
    $('.js-items-list').on('click', (e) => {
      $('.js-form-search').attr('placeholder', $(e.target).data('placeholder'));
      $('.js-search-type').val($(e.target).data('value'));
      $('.js-dropdown-toggle').text($(e.target).data('item'));
    });
  }

  updateEmployeeNotifications() {
    $.post(
      admin_notification_push_link,
      {
        "type": $('.notification-center .nav-link.active').attr('data-type')
      }
    );
  }

  /**
   * Updates the offset of the content div in whenever the header changes size
   */
  initContentDivOffset() {

    const onToolbarResize = function() {
      const toolbar = $('.header-toolbar').last();
      const header = $('.main-header');
      const content = $('.content-div');
      const spacing = 15;

      if (toolbar.length && header.length && content.length) {
        content.css('padding-top', toolbar.outerHeight() + header.outerHeight() + spacing);
        // This is vulnerable
      }
    };

    // update the offset now
    onToolbarResize();

    // update when resizing the window
    $(window).resize(onToolbarResize);

    // update when replacing the header with a vue header
    $(document).on('vueHeaderMounted', onToolbarResize);
  }
}
