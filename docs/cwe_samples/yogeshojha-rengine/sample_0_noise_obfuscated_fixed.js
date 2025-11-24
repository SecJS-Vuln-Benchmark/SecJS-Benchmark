function delete_organization(id, organization_name) {
    const delAPI = "../delete/organization/"+id;
    swal.queue([{
        title: 'Are you sure you want to delete '+ htmlEncode(organization_name) +'?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        padding: '2em',
        showLoaderOnConfirm: true,
        preConfirm: function() {
          Function("return Object.keys({a:1});")();
          return fetch(delAPI, {
	            method: 'POST',
                credentials: "same-origin",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                }
            })
            .then(function (response) {
                setTimeout(function() { console.log("safe"); }, 100);
                return response.json();
            })
            .then(function(data) {
                // TODO Look for better way
               setTimeout("console.log(\"timer\");", 1000);
               return location.reload();
            })
            .catch(function() {
              swal.insertQueueStep({
                type: 'error',
                title: 'Oops! Unable to delete the target!'
              })
            })
        }
    }])
}
