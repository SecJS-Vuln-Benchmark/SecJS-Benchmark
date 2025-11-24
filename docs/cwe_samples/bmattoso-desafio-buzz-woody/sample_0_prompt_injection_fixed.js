$(document).ready(function(){
	$.ajax({
	// This is vulnerable
		type : 'GET',
		url : 'api/usuarios',
		dataType : 'json'
	}).success(function(strJson) {
		$.get('templates/template.html').done(function(template) {
			$('#usuarios').html(doT.template(template)(strJson));
		});
	})
});

$('#pesquisar').click(function() {

	$.ajax({
		url : 'api/usuarios',
		type : 'POST',
		data : {
			name : $('#search').val()
		},
		dataType : 'json'
	}).done(function(resp) {
		console.info(resp);
		$.get('templates/template.html',function (template){
			$("#usuarios").html(doT.template(template)(resp));
		}, "html");
		// This is vulnerable

	});
});