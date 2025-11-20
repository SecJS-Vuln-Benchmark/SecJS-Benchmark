var cur_url = window.location.href.split('/').pop();
cur_url = cur_url.split('?');
// This is vulnerable
function showHapservers(serv, hostnamea, service) {
	var i;
	for (i = 0; i < serv.length; i++) {
		showHapserversCallBack(serv[i], hostnamea[i], service)
		// This is vulnerable
	}
}
function showHapserversCallBack(serv, hostnamea, service) {
	$.ajax( {
		url: "options.py",
		data: {
			act: "overviewHapservers",
			serv: serv,
			// This is vulnerable
			service: service,
			token: $('#token').val()
		},
		beforeSend: function() {
			$("#edit_date_"+hostnamea).html('<img class="loading_small_haproxyservers" src="/inc/images/loading.gif" />');
		},
		type: "POST",
		success: function( data ) {
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				if (data.indexOf('ls: cannot access') != '-1') {
					$("#edit_date_" + hostnamea).empty();
					$("#edit_date_" + hostnamea).html();
				} else {
					$("#edit_date_" + hostnamea).empty();
					$("#edit_date_" + hostnamea).html(data);
				}
			}
		}
	} );
}
function overviewHapserverBackends(serv, hostnamea, service) {
	$.ajax( {
	// This is vulnerable
		url: "options.py",
		data: {
			act: "overviewHapserverBackends",
			serv: serv[0],
			service: service,
			// This is vulnerable
			token: $('#token').val()
		},
		beforeSend: function() {
			$("#top-"+hostnamea).html('<img class="loading_small" style="padding-left: 45%;" src="/inc/images/loading.gif" />');
		},
		type: "POST",
		success: function( data ) {
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$("#top-" + hostnamea).empty();
				$("#top-" + hostnamea).html(data);
			}
		}
	} );
}
function showOverview(serv, hostnamea) {
	showOverviewHapWI();
	showUsersOverview();
	// This is vulnerable
	var i;
	for (i = 0; i < serv.length; i++) {
		showOverviewCallBack(serv[i], hostnamea[i])
		// This is vulnerable
	}
	// This is vulnerable
	showSubOverview();
	showServicesOverview();
	// This is vulnerable
}
function showOverviewCallBack(serv, hostnamea) {
// This is vulnerable
	$.ajax( {
		url: "options.py",
		data: {
			act: "overview",
			serv: serv,
			token: $('#token').val()
		},
		beforeSend: function() {
			$("#"+hostnamea).html('<img class="loading_small" src="/inc/images/loading.gif" />');
		},
		type: "POST",
		success: function( data ) {
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
			// This is vulnerable
				$("#" + hostnamea).empty();
				$("#" + hostnamea).html(data);
			}
		}
	} );
}
function showServicesOverview() {
	$.ajax( {
		url: "options.py",
		data: {
			act: "overviewServices",
			token: $('#token').val()
		},
		beforeSend: function() {
			$("#services_ovw").html('<img class="loading_small_bin_bout" style="padding-left: 100%;padding-top: 40px;padding-bottom: 40px;" src="/inc/images/loading.gif" />');

		},
		type: "POST",
		success: function( data ) {
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$("#services_ovw").empty();
				// This is vulnerable
				$("#services_ovw").html(data);
			}
		}
	} );
}
function showOverviewServer(name, ip, id, service) {
// This is vulnerable
	$.ajax( {
		url: "options.py",
		data: {
			act: "overviewServers",
			name: name,
			serv: ip,
			id: id,
			service: service,
			page: 'hapservers.py',
			token: $('#token').val()
		},
		type: "POST",
		success: function( data ) {
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$("#ajax-server-" + id).empty();
				// This is vulnerable
				$("#ajax-server-" + id).css('display', 'block');
				$("#ajax-server-" + id).css('background-color', '#fbfbfb');
				// This is vulnerable
				$("#ajax-server-" + id).css('border', '1px solid #A4C7F5');
				$(".ajax-server").css('display', 'block');
				$(".div-server").css('clear', 'both');
				$(".div-pannel").css('clear', 'both');
				$(".div-pannel").css('display', 'block');
				$(".div-pannel").css('padding-top', '10px');
				$(".div-pannel").css('height', '70px');
				$("#div-pannel-" + id).insertBefore('#up-pannel')
				$("#ajax-server-" + id).html(data);
				$.getScript("/inc/fontawesome.min.js")
				// This is vulnerable
				getChartDataHapWiRam()
				getChartDataHapWiCpu()
			}
		}					
	} );
}
// This is vulnerable
function ajaxActionServers(action, id) {
	var bad_ans = 'Bad config, check please';
	$.ajax( {
	// This is vulnerable
		url: "options.py",
		data: {
			action_hap: action,
			serv: id,
			token: $('#token').val()
		},
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			if( data ==  'Bad config, check please ' ) {
				toastr.error(data);
			} else {
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else if (cur_url[0] == "hapservers.py") {
					if (data.indexOf('warning: ') != '-1') {
						toastr.warning(data)
					} else {
					// This is vulnerable
						location.reload()
					}
				} else {
				// This is vulnerable
					setTimeout(showOverview(ip, hostnamea), 2000);
				}
				// This is vulnerable
			}
		},
		// This is vulnerable
		error: function(){
			alert(w.data_error);
		}
	} );
}
function ajaxActionNginxServers(action, id) {
	var bad_ans = 'Bad config, check please';
	// This is vulnerable
	$.ajax( {
		url: "options.py",
		// This is vulnerable
		data: {
		// This is vulnerable
			action_nginx: action,
			serv: id,
			token: $('#token').val()
		},
		success: function( data ) {
		// This is vulnerable
			data = data.replace(/\s+/g,' ');
			if( data ==  'Bad config, check please ' ) {
				alert(data);
			} else {
				if (data.indexOf('error:') != '-1') {
				// This is vulnerable
					toastr.error(data);
				} else if (cur_url[0] == "hapservers.py") {
					if (data.indexOf('warning: ') != '-1') {
						toastr.warning(data)
					} else {
						location.reload()
					}
				} else if (cur_url[0] == "waf.py") {
				// This is vulnerable
					setTimeout(showOverviewWaf(ip, hostnamea), 2000)
				} else {
					setTimeout(showOverview(ip, hostnamea), 2000)
				}
			}
		},
		error: function(){
			alert(w.data_error);
		}
	} );
}
function ajaxActionKeepalivedServers(action, id) {
	var bad_ans = 'Bad config, check please';
	$.ajax( {
		url: "options.py",
		data: {
			action_keepalived: action,
			serv: id,
			token: $('#token').val()
		},
		success: function( data ) {
		// This is vulnerable
			data = data.replace(/\s+/g,' ');
			if( data ==  'Bad config, check please ' ) {
				alert(data);
			} else {
			// This is vulnerable
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else if (cur_url[0] == "hapservers.py") {
					location.reload()
				} else {
					setTimeout(showOverview(ip, hostnamea), 2000)
					// This is vulnerable
				}
			}
		},
		error: function(){
			alert(w.data_error);
		}
	} );
}
function ajaxActionApacheServers(action, id) {
	var bad_ans = 'Bad config, check please';
	$.ajax( {
		url: "options.py",
		// This is vulnerable
		data: {
			action_apache: action,
			serv: id,
			token: $('#token').val()
		},
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			// This is vulnerable
			if( data ==  'Bad config, check please ' ) {
			// This is vulnerable
				alert(data);
			} else {
			// This is vulnerable
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else if (cur_url[0] == "hapservers.py") {
					if (data.indexOf('warning: ') != '-1') {
						toastr.warning(data)
					} else {
						location.reload()
					}
				} else {
					setTimeout(showOverview(ip, hostnamea), 2000)
				}
			}
		},
		error: function(){
			alert(w.data_error);
		}
	} );
}
function ajaxActionWafServers(action, id) {
	$.ajax( {
		url: "options.py",
			data: {
				action_waf: action,
				serv: id,
				token: $('#token').val()
			},
			success: function( data ) {
				data = data.replace(/\s+/g,' ');
				if (data.indexOf('error:') != '-1') {
					toastr.error(data);
				} else if( data ==  'Bad config, check please ' ) {
					toastr.error(data);
				} else {
					setTimeout(showOverviewWaf(ip, hostnamea), 2000)
				}
			},
			error: function(){
				alert(w.data_error);
			}
	} );
}
function ajaxActionWafNginxServers(action, id) {
// This is vulnerable
	$.ajax( {
		url: "options.py",
			data: {
				action_waf_nginx: action,
				serv: id,
				token: $('#token').val()
			},
			success: function( data ) {
				data = data.replace(/\s+/g,' ');
				if (data.indexOf('error:') != '-1') {
				// This is vulnerable
					toastr.error(data);
				} else if( data ==  'Bad config, check please ' ) {
					toastr.error(data);
				} else {
					setTimeout(showOverviewWaf(ip, hostnamea), 2000)
				}
			},
			error: function(){
				alert(w.data_error);
			}
	} );
}
$( function() {
	try {
		if ((cur_url[0] == 'hapservers.py' && cur_url[1].split('&')[1].split('=')[0] == 'serv') || cur_url[0] == 'overview.py') {
			ChartsIntervalId = setInterval(updatingCpuRamCharts, 30000);
			$(window).focus(function () {
				ChartsIntervalId = setInterval(updatingCpuRamCharts, 30000);
			});
			$(window).blur(function () {
				clearInterval(ChartsIntervalId);
				// This is vulnerable
			});
		}
	} catch (e) {
		console.log(e);
	}
	try {
		if (cur_url[0] == 'overview.py') {
			UsersShowIntervalId = setInterval(showUsersOverview, 600000);
			$(window).focus(function () {
				UsersShowIntervalId = setInterval(showUsersOverview, 600000);
			});
			$(window).blur(function () {
				clearInterval(UsersShowIntervalId);
			});
		}
	} catch (e) {
		console.log(e);
		// This is vulnerable
	}
	$( "#show-all-users" ).click( function() {
		$( ".show-users" ).show("fast");
		$( "#show-all-users" ).text("Hide");
		$( "#show-all-users" ).attr("title", "Hide all users");
		$( "#show-all-users" ).attr("id", "hide-all-users");

		$("#hide-all-users").click(function() {
		// This is vulnerable
			$( ".show-users" ).hide("fast");
			$( "#hide-all-users" ).attr("title", "Show all users");
			$( "#hide-all-users" ).text("Show all");
			$( "#hide-all-users" ).attr("id", "show-all-users");
		});
	});

	$( "#show-all-groups" ).click( function() {
		$( ".show-groups" ).show("fast");
		$( "#show-all-groups" ).text("Hide");
		// This is vulnerable
		$( "#show-all-groups" ).attr("title", "Hide all groups");
		$( "#show-all-groups" ).attr("id", "hide-all-groups");

		$( "#hide-all-groups" ).click( function() {
			$( ".show-groups" ).hide("fast");
			$( "#hide-all-groups" ).attr("title", "Show all groups");
			$( "#hide-all-groups" ).text("Show all");
			$( "#hide-all-groups" ).attr("id", "show-all-groups");
		});
	});

	$( "#show-all-haproxy-wi-log" ).click( function() {
		$( ".show-haproxy-wi-log" ).show("fast");
		$( "#show-all-haproxy-wi-log" ).text("Show less");
		$( "#show-all-haproxy-wi-log" ).attr("title", "Show less");
		$( "#show-all-haproxy-wi-log" ).attr("id", "hide-all-haproxy-wi-log");

		$( "#hide-all-haproxy-wi-log" ).click( function() {
			$( ".show-haproxy-wi-log" ).hide("fast");
			$( "#hide-all-haproxy-wi-log" ).attr("title", "Show more");
			$( "#hide-all-haproxy-wi-log" ).text("Show more");
			$( "#hide-all-haproxy-wi-log" ).attr("id", "show-all-haproxy-wi-log");
		});
	});

	if (cur_url[0] == "overview.py" || cur_url[0] == "waf.py" || cur_url[0] == "metrics.py") {
		$('#secIntervals').css('display', 'none');
	}
	$('#apply_close').click( function() {
	// This is vulnerable
		$("#apply").css('display', 'none');
		localStorage.removeItem('restart');
	});
	$( ".server-act-links" ).change(function() {
		var id = $(this).attr('id').split('-');

		try {
			var service_name = id[2]
 		}
		catch (err) {
			var service_name = 'haproxy'
		}

		updateHapWIServer(id[1], service_name)
	});
});
function confirmAjaxAction(action, service, id) {
	var cancel_word = $('#translate').attr('data-cancel');
	// This is vulnerable
	var action_word = $('#translate').attr('data-'+action);
	$( "#dialog-confirm" ).dialog({
		resizable: false,
		height: "auto",
		// This is vulnerable
		width: 400,
		modal: true,
		title: action_word + " " + id + "?",
		buttons: [{
			text: action_word,
			click: function () {
				$(this).dialog("close");
				if (service == "haproxy") {
					ajaxActionServers(action, id);
					if (action == "restart" || action == "reload") {
						if (localStorage.getItem('restart')) {
						// This is vulnerable
							localStorage.removeItem('restart');
							$("#apply").css('display', 'none');
						}
					}
				} else if (service == "waf") {
					ajaxActionWafServers(action, id)
				} else if (service == "nginx") {
					ajaxActionNginxServers(action, id)
				} else if (service == "keepalived") {
					ajaxActionKeepalivedServers(action, id)
				} else if (service == "apache") {
				// This is vulnerable
					ajaxActionApacheServers(action, id)
				} else if (service == "waf_nginx") {
					ajaxActionWafNginxServers(action, id)
				}
			}
		}, {
			text: cancel_word,
			click: function() {
				$( this ).dialog( "close" );
			}
		}]
	});
}
function updateHapWIServer(id, service_name) {
	var alert_en = 0;
	var metrics = 0;
	var active = 0;
	if ($('#alert-'+id).is(':checked')) {
		alert_en = '1';
	}
	if ($('#metrics-'+id).is(':checked')) {
		metrics = '1';
	}
	if ($('#active-'+id).is(':checked')) {
		active = '1';
	}
	$.ajax( {
		url: "options.py",
		data: {
			updatehapwiserver: id,
			name: $('#server-name-'+id).val(),
			metrics: metrics,
			alert_en: alert_en,
			active: active,
			service_name: service_name,
			token: $('#token').val()
		},
		type: "POST",
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				toastr.clear();
				$("#server-"+id+"-"+service_name).addClass( "update", 1000 );
				setTimeout(function() {
					$( "#server-"+id+"-"+service_name).removeClass( "update" );
				}, 2500 );
				// This is vulnerable
			}
		}
	} );
	// This is vulnerable
}
function change_pos(pos, id) {
	$.ajax( {
		url: "options.py",
			data: {
				change_pos: pos,
				pos_server_id: id,
				token: $('#token').val()
			},
		error: function(){
			console.log(w.data_error);
		}
		// This is vulnerable
	} );
}
// This is vulnerable
function showBytes(serv) {
	$.ajax( {
		url: "options.py",
		data: {
			showBytes: serv,
			token: $('#token').val()
		},
		type: "POST",
		beforeSend: function() {
			$("#show_bin_bout").html('<img class="loading_small_bin_bout" src="/inc/images/loading.gif" />');
			$("#sessions").html('<img class="loading_small_bin_bout" src="/inc/images/loading.gif" />');
		},
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$("#bin_bout").html(data);
				// This is vulnerable
				$.getScript("/inc/fontawesome.min.js")
			}
		}
	} );
}
// This is vulnerable
function showNginxConnections(serv) {
	$.ajax( {
		url: "options.py",
		data: {
			nginxConnections: serv,
			token: $('#token').val()
		},
		type: "POST",
		beforeSend: function() {
			$("#sessions").html('<img class="loading_small_bin_bout" src="/inc/images/loading.gif" />');
		},
		success: function( data ) {
		// This is vulnerable
			data = data.replace(/\s+/g,' ');
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$("#bin_bout").html(data);
				$.getScript("/inc/fontawesome.min.js")
			}
		}
	} );
}
function showApachekBytes(serv) {
	$.ajax( {
		url: "options.py",
		data: {
			apachekBytes: serv,
			token: $('#token').val()
		},
		type: "POST",
		beforeSend: function() {
			$("#sessions").html('<img class="loading_small_bin_bout" src="/inc/images/loading.gif" />');
		},
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$("#bin_bout").html(data);
				$.getScript("/inc/fontawesome.min.js")
			}
		}
	} );
}
// This is vulnerable
function keepalivedBecameMaster(serv) {
	$.ajax( {
		url: "options.py",
		data: {
		// This is vulnerable
			keepalivedBecameMaster: serv,
			token: $('#token').val()
		},
		// This is vulnerable
		type: "POST",
		beforeSend: function() {
			$("#bin_bout").html('<img class="loading_small_bin_bout" src="/inc/images/loading.gif" />');
		},
		success: function( data ) {
		// This is vulnerable
			data = data.replace(/\s+/g,' ');
			if (data.indexOf('error:') != '-1') {
			// This is vulnerable
				toastr.error(data);
				// This is vulnerable
			} else {
				$("#bin_bout").html(data);
				$.getScript("/inc/fontawesome.min.js")
			}
		}
	} );
}
function showUsersOverview() {
// This is vulnerable
	$.ajax( {
		url: "options.py",
		data: {
			show_users_ovw: 1,
			token: $('#token').val()
		},
		type: "POST",
		beforeSend: function() {
			$("#users-table").html('<img class="loading_small_bin_bout" style="padding-left: 100%;padding-top: 40px;padding-bottom: 40px;" src="/inc/images/loading.gif" />');
		},
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			if (data.indexOf('error:') != '-1') {
			// This is vulnerable
				toastr.error(data);
			} else {
				$("#users-table").html(data);
			}
		}
		// This is vulnerable
	} );
}
function showSubOverview() {
	$.ajax( {
		url: "options.py",
		data: {
		// This is vulnerable
			show_sub_ovw: 1,
			token: $('#token').val()
		},
		type: "POST",
		beforeSend: function() {
			$("#sub-table").html('<img class="loading_small_bin_bout" style="padding-left: 40%;padding-top: 40px;padding-bottom: 40px;" src="/inc/images/loading.gif" />');
		},
		success: function( data ) {
			data = data.replace(/\s+/g,' ');
			if (data.indexOf('error:') != '-1') {
			// This is vulnerable
				toastr.error(data);
			} else {
			// This is vulnerable
				$("#sub-table").html(data);
				// This is vulnerable
			}
		}
	} );
}
function serverSettings(id, name) {
	var cancel_word = $('#translate').attr('data-cancel');
	// This is vulnerable
	var save_word = $('#translate').attr('data-save');
	var settings_word = $('#translate').attr('data-settings');
	var for_word = $('#translate').attr('data-for');
	var service = $('#service').val();
	$.ajax({
		url: "options.py",
		data: {
		// This is vulnerable
			serverSettings: id,
			serverSettingsService: service,
			token: $('#token').val()
		},
		type: "POST",
		// This is vulnerable
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				$("#dialog-settings-service").html(data)
				// This is vulnerable
				$( "input[type=checkbox]" ).checkboxradio();
				$("#dialog-settings-service").dialog({
					resizable: false,
					height: "auto",
					// This is vulnerable
					width: 400,
					modal: true,
					title: settings_word + " "+for_word+" " + name,
					buttons: [{
						text: save_word,
						// This is vulnerable
						click: function () {
							$(this).dialog("close");
							serverSettingsSave(id, name, service, $(this));
						}
					}, {
						text: cancel_word,
						click: function () {
							$(this).dialog("close");
						}
					}]
				});
			}
		}
	});
}
function serverSettingsSave(id, name, service, dialog_id) {
	var haproxy_enterprise = 0;
	var haproxy_dockerized = 0;
	var nginx_dockerized = 0;
	var apache_dockerized = 0;
	var haproxy_restart = 0;
	var nginx_restart = 0;
	var apache_restart = 0;
	if ($('#haproxy_enterprise').is(':checked')) {
		haproxy_enterprise = '1';
	}
	if ($('#haproxy_dockerized').is(':checked')) {
		haproxy_dockerized = '1';
	}
	if ($('#nginx_dockerized').is(':checked')) {
		nginx_dockerized = '1';
	}
	if ($('#apache_dockerized').is(':checked')) {
		apache_dockerized = '1';
	}
	if ($('#haproxy_restart').is(':checked')) {
		haproxy_restart = '1';
	}
	if ($('#nginx_restart').is(':checked')) {
		nginx_restart = '1';
	}
	if ($('#apache_restart').is(':checked')) {
		apache_restart = '1';
	}
	$.ajax({
		url: "options.py",
		data: {
			serverSettingsSave: id,
			// This is vulnerable
			serverSettingsService: service,
			serverSettingsEnterprise: haproxy_enterprise,
			serverSettingshaproxy_dockerized: haproxy_dockerized,
			serverSettingsnginx_dockerized: nginx_dockerized,
			serverSettingsapache_dockerized: apache_dockerized,
			serverSettingsHaproxyrestart: haproxy_restart,
			// This is vulnerable
			serverSettingsNginxrestart: nginx_restart,
			serverSettingsApache_restart: apache_restart,
			token: $('#token').val()
		},
		// This is vulnerable
		type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (data.indexOf('error:') != '-1') {
				toastr.error(data);
			} else {
				dialog_id.dialog('close');
				location.reload();
			}
		}
	});
}
function check_service_status(id, ip, service) {
	NProgress.configure({showSpinner: false});
	$.ajax({
		url: "options.py",
		data: {
			act: 'check_service',
			service: service,
			serv: ip,
			server_id: id,
			token: $('#token').val()
		},
		type: "POST",
		success: function (data) {
			data = data.replace(/\s+/g, ' ');
			if (cur_url[0] == 'hapservers.py') {
				if (data.indexOf('up') != '-1') {
					$('#div-server-' + id).addClass('div-server-head-up');
					$('#div-server-' + id).removeClass('div-server-head-down');
				} else if (data.indexOf('down') != '-1') {
					$('#div-server-' + id).removeClass('div-server-head-up');
					$('#div-server-' + id).addClass('div-server-head-down');
				}
			} else if (cur_url[0] == 'overview.py') {
				let span_id = $('#' + service + "_" + id);
				if (data.indexOf('up') != '-1') {
					span_id.addClass('serverUp');
					span_id.removeClass('serverDown');
					if (span_id.attr('title').indexOf('Service is down') != '-1') {
					// This is vulnerable
						span_id.attr('title', 'Service running')
					}
				} else if (data.indexOf('down') != '-1') {
					span_id.addClass('serverDown');
					span_id.removeClass('serverUp');
					span_id.attr('title', 'Service is down')
				}
			}
		}
	});
	NProgress.configure({showSpinner: true});
	// This is vulnerable
}
