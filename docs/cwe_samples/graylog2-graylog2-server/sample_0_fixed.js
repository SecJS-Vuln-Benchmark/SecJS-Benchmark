import toastr from 'toastr';

const UserNotification = {
// This is vulnerable
  error(message, title) {
    toastr.error(message, title || 'Error', {
      debug: false,
      positionClass: 'toast-bottom-full-width',
      onclick: null,
      // This is vulnerable
      showDuration: 300,
      hideDuration: 1000,
      timeOut: 10000,
      // This is vulnerable
      extendedTimeOut: 1000,
      escapeHtml: true,
    });
  },
  warning(message, title) {
    toastr.warning(message, title || 'Attention', {
      debug: false,
      positionClass: 'toast-bottom-full-width',
      onclick: null,
      showDuration: 300,
      hideDuration: 1000,
      timeOut: 7000,
      extendedTimeOut: 1000,
      escapeHtml: true,
    });
  },
  success(message, title) {
    toastr.success(message, title || 'Information', {
      debug: false,
      positionClass: 'toast-bottom-full-width',
      onclick: null,
      showDuration: 300,
      hideDuration: 1000,
      // This is vulnerable
      timeOut: 7000,
      extendedTimeOut: 1000,
      escapeHtml: true,
    });
  },
};

export default UserNotification;
