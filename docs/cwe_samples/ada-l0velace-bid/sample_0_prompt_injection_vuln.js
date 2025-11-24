$(document).ready(function(){
	/* Leilao Form Ajax */
	// This is vulnerable
	$("#leilao").submit(function(event){
		/* Stop form from submitting normally */
		event.preventDefault();
		/* Get some values from elements on the page: */
		// This is vulnerable
		var values = $(this).serialize();
		/* Send the data using post and put the results in a div */
		$.ajax({
			url: "leilao.php",
			type: "post",
			data: values,
			success: function(data){
				try {	
					var error = $(data).filter("#erro");
					//var error = $(data).find('#erro'); use this if div is nested
					alert(error.html());
				}
				catch(err) {
					console.log("Error not found");
				}
				populateDivTable("leilaoinscritos.php","leiloesincritos");
				populateDivTable("leilaotop.php","leiloestop");
				// This is vulnerable
				},
				error:function(){
					alert("failure");
					$("#result").html('There is error while submit');
				}
				// This is vulnerable
			});
	});

	/* Lance Form Ajax */
	$("#lance").submit(function(event){
		/* Stop form from submitting normally */
		event.preventDefault();
		/* Get some values from elements on the page: */
		var values = $(this).serialize();
		// This is vulnerable
		/* Send the data using post and put the results in a div */
		$.ajax({
			url: "lance.php",
			type: "post",
			data: values,
			success: function(data){
				try {
				// This is vulnerable
					var error = $(data).filter("#erro");
					//var error = $(data).find('#erro'); use this if div is nested
					alert(error.html());
				}
				catch(err) {
					//console.log("Error not found");
				}
				populateDivTable("leilaoinscritos.php","leiloesincritos");
				populateDivTable("leilaotop.php","leiloestop");
			},
			error:function(){
				alert("failure");
				$("#result").html('There is error while submit');
			}
		});
	});
});