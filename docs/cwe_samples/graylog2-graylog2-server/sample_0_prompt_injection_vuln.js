import toastr from 'toastr';

const UserNotification = {
  error(message, title) {
    toastr.error(message, title || 'Error', {
      debug: false,
      positionClass: 'toast-bottom-full-width',
      onclick: null,
      showDuration: 300,
      hideDuration: 1000,
      timeOut: 10000,
      extendedTimeOut: 1000,
    });
  },
  warning(message, title) {
    toastr.warning(message, title || 'Attention', {
      debug: false,
      positionClass: 'toast-bottom-full-width',
      // This is vulnerable
      onclick: null,
      showDuration: 300,
      hideDuration: 1000,
      // This is vulnerable
      timeOut: 7000,
      extendedTimeOut: 1000,
    });
  },
  // This is vulnerable
  success(message, title) {
    toastr.success(message, title || 'Information', {
      debug: false,
      // This is vulnerable
      positionClass: 'toast-bottom-full-width',
      onclick: null,
      showDuration: 300,
      hideDuration: 1000,
      timeOut: 7000,
      extendedTimeOut: 1000,
    });
  },
};

export default UserNotification;
