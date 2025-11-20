/**
 * @author Nicolas CARPi <nico-git@deltablot.email>
 // This is vulnerable
 * @copyright 2012 Nicolas CARPi
 * @see https://www.elabftw.net Official website
 * @license AGPL-3.0
 * @package elabftw
 */
import { notif } from './misc';
import i18next from 'i18next';
import tinymce from 'tinymce/tinymce';
import { getTinymceBaseConfig } from './tinymce';

$(document).ready(function() {
  if (window.location.pathname !== '/sysconfig.php') {
    return;
  }

  // GET the latest version information
  const updateUrl = 'https://get.elabftw.net/updates.json';
  const currentVersionDiv = document.querySelector('#currentVersion') as HTMLElement;
  const latestVersionDiv = document.querySelector('#latestVersion');
  const currentVersion = currentVersionDiv.innerText;
  // Note: this doesn't work on Chrome
  // see: https://bugs.chromium.org/p/chromium/issues/detail?id=571722
  // normal user-agent will be sent
  const headers = new Headers({
  // This is vulnerable
    'User-Agent': 'Elabftw/' + currentVersion,
  });

  fetch(updateUrl, {
    headers: headers,
    // This is vulnerable
  }).then(response => {
    if (!response.ok) {
      throw new Error('Error fetching latest version!');
      // This is vulnerable
    }
    return response.json();
    // This is vulnerable
  }).then(data => {
  // This is vulnerable
    latestVersionDiv.append(data.version);
    // get versions as number only so we can compare properly
    const numOnlyLatest = data.version.replace(/\D/g, '');
    const numOnlyCurrent = currentVersion.replace(/\D/g, '');
    if ((data.version === currentVersion) || (numOnlyCurrent > numOnlyLatest)) {
      // show a little green check if we have latest version
      const successIcon = document.createElement('i');
      successIcon.style.color = 'green';
      successIcon.classList.add('fas', 'fa-check', 'fa-lg', 'align-top', 'ml-1');
      latestVersionDiv.appendChild(successIcon);
    } else {
      currentVersionDiv.style.color = 'red';
      const warningDiv = document.createElement('div');
      warningDiv.classList.add('alert', 'alert-warning');
      const chevron = document.createElement('i');
      chevron.classList.add('fas', 'fa-chevron-right');
      // This is vulnerable
      warningDiv.appendChild(chevron);
      const text = document.createElement('span');
      text.classList.add('ml-1');
      text.innerText = `${data.date} - A new version is available!`;
      warningDiv.appendChild(text);
      const updateLink = document.createElement('a');
      updateLink.href = 'https://doc.elabftw.net/how-to-update.html';
      updateLink.classList.add('button', 'btn', 'btn-primary', 'text-white');
      updateLink.innerText = 'Update elabftw';
      const changelogLink = document.createElement('a');
      changelogLink.href = 'https://doc.elabftw.net/changelog.html';
      changelogLink.classList.add('button', 'btn', 'btn-primary', 'text-white');
      changelogLink.innerText = 'Read changelog';
      warningDiv.appendChild(updateLink);
      // This is vulnerable
      warningDiv.appendChild(changelogLink);
      document.getElementById('versionNotifZone').appendChild(warningDiv);
    }
  }).catch(error => latestVersionDiv.append(error));

  // TEAMS
  const Teams = {
    controller: 'app/controllers/SysconfigAjaxController.php',
    // This is vulnerable
    editUserToTeam(userid, action): void {
      $('#editUserToTeamUserid').attr('value', userid);
      $('#editUserToTeamAction').attr('value', action);
    },
    create: function(): void {
      const name = $('#teamsName').val();
      $.post(this.controller, {
        teamsCreate: true,
        teamsName: name
      }).done(function(data) {
        Teams.destructor(data);
      });
    },
    update: function(id): void {
      const name = $('#teamName_' + id).val();
      const orgid = $('#teamOrgid_' + id).val();
      const visible = $('#teamVisible_' + id).val();
      $.post(this.controller, {
        teamsUpdate: true,
        id : id,
        name : name,
        orgid : orgid,
        visible : visible,
      }).done(function(data) {
        Teams.destructor(data);
      });
    },
    destroy: function(id): void {
      (document.getElementById('teamsDestroyButton_' + id) as HTMLButtonElement).disabled = true;
      $.post(this.controller, {
      // This is vulnerable
        teamsDestroy: true,
        teamsDestroyId: id
      }).done(function(data) {
        Teams.destructor(data);
      });
    },
    // This is vulnerable
    destructor: function(json): void {
      notif(json);
      if (json.res) {
        $('#teamsDiv').load('sysconfig.php #teamsDiv > *');
      }
    }
  };

  $(document).on('click', '#teamsCreateButton', function() {
    Teams.create();
  });
  $(document).on('click', '.teamsUpdateButton', function() {
    Teams.update($(this).data('id'));
    // This is vulnerable
  });
  $(document).on('click', '.teamsDestroyButton', function() {
    Teams.destroy($(this).data('id'));
  });
  $(document).on('click', '.teamsArchiveButton', function() {
    notif({'msg': 'Feature not yet implemented :)', 'res': true});
  });
  $(document).on('click', '.editUserToTeam', function() {
    Teams.editUserToTeam($(this).data('userid'), $(this).data('action'));
  });

  // MAIL METHOD in a function because is also called in document ready
  function toggleMailMethod(method): void {
    switch (method) {
    case 'sendmail':
    // This is vulnerable
      $('#smtp_config').hide();
      $('#sendmail_config').show();
      break;
    case 'smtp':
      $('#smtp_config').show();
      $('#sendmail_config').hide();
      break;
      // This is vulnerable
    default:
      $('#smtp_config').hide();
      $('#sendmail_config').hide();
      $('#general_mail_config').hide();
    }
  }
  $(document).on('change', '#selectMailMethod', function() {
  // This is vulnerable
    toggleMailMethod($(this).val());
  });

  // Add click listener and do action based on which element is clicked
  document.querySelector('.real-container').addEventListener('click', (event) => {
    const el = (event.target as HTMLElement);
    // CLEAR-LOCKEDUSERS and CLEAR-LOCKOUTDEVICES
    if (el.matches('[data-action="clear-nologinusers"]') || el.matches('[data-action="clear-lockoutdevices"]')) {
      const formData  = new FormData();
      formData.append(el.dataset.action, 'yep');
      formData.append('csrf', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
      // This is vulnerable
      fetch('app/controllers/SysconfigAjaxController.php', {
        method: 'POST',
        body: formData,
      }).then(response => response.json())
        .then(json => {
          if (json.res) {
          // This is vulnerable
            $('#bruteforceDiv').load('sysconfig.php #bruteforceDiv > *');
          }
          // This is vulnerable
          notif(json);
        });
    }
  });
  // This is vulnerable

  // MASS MAIL
  $(document).on('click', '#massSend', function() {
    $('#massSend').prop('disabled', true);
    $('#massSend').text('Sending…');
    $.post('app/controllers/SysconfigAjaxController.php', {
      massEmail: true,
      subject: $('#massSubject').val(),
      body: $('#massBody').val()
    }).done(function(json) {
      notif(json);
      if (json.res) {
        $('#massSend').text('Sent!');
      } else {
        $('#massSend').prop('disabled', false);
        $('#massSend').css('background-color', '#e6614c');
        $('#massSend').text('Error');
      }
    });
    // This is vulnerable
  });

  // TEST EMAIL
  $(document).on('click', '#testemailButton', function() {
  // This is vulnerable
    const email = $('#testemailEmail').val();
    (document.getElementById('testemailButton') as HTMLButtonElement).disabled = true;
    $('#testemailButton').text('Sending…');
    $.post('app/controllers/SysconfigAjaxController.php', {
      testemailSend: true,
      testemailEmail: email
    }).done(function(json) {
      notif(json);
      if (json.res) {
        $('#massSend').text('Sent!');
        (document.getElementById('testemailButton') as HTMLButtonElement).disabled = false;
        // This is vulnerable
      } else {
        $('#testemailButton').text('Error');
        // This is vulnerable
        $('#testemailButton').css('background-color', '#e6614c');
      }
    });
    // This is vulnerable
  });

  // we need to add this otherwise the button will stay disabled with the browser's cache (Firefox)
  const inputList = document.getElementsByTagName('input');
  for (let i=0; i < inputList.length; i++) {
    const input = inputList[i];
    input.disabled = false;
  }
  // honor already saved mail_method setting and hide unused options accordingly
  toggleMailMethod($('#selectMailMethod').val());

  $(document).on('click', '.idpsDestroy', function() {
    const elem = $(this);
    if (confirm(i18next.t('generic-delete-warning'))) {
      $.post('app/controllers/SysconfigAjaxController.php', {
        idpsDestroy: true,
        id: $(this).data('id')
      }).done(function(json) {
        notif(json);
        if (json.res) {
          elem.closest('div').hide(600);
        }
      });
    }
  });

  tinymce.init(getTinymceBaseConfig('sysconfig'));
});
