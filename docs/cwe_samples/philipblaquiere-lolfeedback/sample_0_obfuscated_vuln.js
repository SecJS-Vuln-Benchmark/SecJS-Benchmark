
//ajax call for summoner validation process.
$(document).on('submit','#initial-registration',function(event)
{
    event.preventDefault();
    /* Clear rune page div*/
    $("#authenticate_runepage_page").html('');
    $("#summoner_validation_error").html('');


    var email = document.getElementById("email").value;
    var regex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
    if(!regex.test(email))
    {
        $("#summoner_validation_error").html('Email must be a valid format '+ email );
        return;
    }

    var pass1 = document.getElementById("password1").value;
    var pass2 = document.getElementById("password2").value;

    if(pass1 == "" || pass2 == "" || pass1 != pass2)
    {
        $("#summoner_validation_error").html('Passwords must match and can\'t be empty');
        return;
    }

    /* Get some values from elements on the page: */
    var summonername = document.getElementById("summonername").value;
    if(summonername == "")
    {
        summonername = "-";
    }

     /* Check db if email is already used*/
    $.ajax({
        url: 'register/unique_email/'+ email.toLowerCase(),
        type: "post",
        data: {},
        success: function(data){
            var region = document.getElementById("region").firstChild.data;
            $("#authenticate_runepage_page").html('<div class="row"><div class="col-md-1 col-md-offset-5"><div class="spinner"><i class="fa-li fa fa-spinner fa-spin fa-2x"></i></div></div></div>');

            /* Send the data using post and put the results in a div */
            $.ajax({
                url: 'ajax/authenticate_summoner/'+ region +'/'+ summonername.trim(),
                type: "post",
                data: summonername,
                success: function(data){
                    $("#authenticate_runepage_page").html(data);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    $("#authenticate_runepage_page").html(summonername + " error " + textStatus + " " + errorThrown );
                }
            });
        },
        error:function(data,jqXHR, textStatus, errorThrown){
            $("#summoner_validation_error").html("Email is already in use" + data);
        }
    });
    
    
});
    
$(document).on('submit','#rune_page_verification',function(event) {
    /* Stop form from submitting normally */
    event.preventDefault();

    /* Clear any previous error message*/
    $("#rune_page_verification_result").html('');

    /* Send the data using post and put the results in a div */
    $.ajax({
        url: 'ajax/rune_page_verification',
        type: "get",
        data: {},
        success: function(data){
            if(data == "success") {
                //verification succeeded, create user
                switchButtonToRegister();
            }
            else {
                $("#rune_page_verification_result").html(data);
            }
        },
        error:function(jqXHR, textStatus, errorThrown, responseHeaders){
            alert(errorThrown);
            $("#rune_page_verification_result").html(textStatus + ": " + errorThrown +responseHeaders+jqXHR);
        }
    });
});

$(document).on('submit','#submit_forms', function(event) {
    /* Stop form from submitting normally */
    event.preventDefault();
   $("#original_registration_submit").click();
});


//used to set value from left text input dropdown
$(".region-list li a").click(function(event) {
    event.preventDefault();
    var selText = $(this).text();
    $(this).parents('.input-group-btn').find('.dropdown-toggle').html(selText + '  <span class="caret"></span> ');
});

function reloadLoLRegister(message) {
    alert("in reload");
    $.ajax({
        url: '/LoLRep/add_esport/register_LoL',
        type: "post",
        data: {},
        success: function(data){
            $("#authenticate_runepage_page").html(message);
        }
    });
}

function switchButtonToRegister()
{
    button = document.getElementById('rune_page_verification_button');
    button.setAttribute('id','create_user');
    button.setAttribute('value','Complete Registration');
    original_form = document.getElementById('initial-registration');
    original_form.setAttribute('action', 'register/create');
    original_form.setAttribute('id','create_user_form');
    rune_page_form = document.getElementById('rune_page_verification');
    rune_page_form.setAttribute('id', 'submit_forms')
    
}

$(".review").click(function(event) {
    var buttonId = this.id;
    $("#"+buttonId).html('<div class="row"><div class="col-md-1 col-md-offset-5"><div class="spinner"><i class="fa-li fa fa-spinner fa-spin fa-2x"></i></div></div></div>');

    var ids = buttonId.split("-");
    var reviewArea = document.getElementById(buttonId)
    var messageArea = document.getElementById(buttonId+"-message")

    var userid = ids[0]
    var revieweeid = ids[1]
    var gameid = ids[2]
    var skillNames = ['','Game Sense','Helpful','Skillful','Delivery']
    var skillDescriptions = ['', 'Deep understanding of team oriented goals, team player, a leader', 'Cooperated, jumped on opportunities to educate','Demonstrated intellectual prowness through gameplay', 'Polite, clear and concise when communicating']

    if(ids.length != 3)
    {
        return;
    }

    var review = {
        fromid: userid,
        toid: revieweeid,
        id: buttonId,
        gameid: gameid
    }
    /* Send the data using post and put the results in a div */
    $.ajax({
        url: "/perfect/index.php/review/create",
        type: 'POST',
        data: review,
        success: function(data){
            $("#"+buttonId).html('');
            var unorderedList = document.createElement('ul')
            var skillList = document.createElement('div')
            skillList.setAttribute('class','skill-list')

            for(var skillId = 1; skillId < 5; skillId++)
            {
                var row = document.createElement('li')
                row.setAttribute('class', 'pull-right')
                var skillGroup = document.createElement('div')
                skillGroup.setAttribute('class','skill-group')

                var skillLabel = document.createElement('span')
                skillLabel.setAttribute('data-toggle', 'tooltip')
                skillLabel.setAttribute('class', 'text-right text-muted skill-label')
                skillLabel.setAttribute('title', skillDescriptions[skillId])
                skillLabel.insertAdjacentHTML('afterBegin', skillNames[skillId])

                var radioSkills1 = document.createElement('div')
                radioSkills1.setAttribute('class', 'btn-group btn-group-sm ')
                radioSkills1.setAttribute('data-toggle', 'buttons')
                radioSkills1.setAttribute('role', 'group')
                for (var i = 1; i < 6; i++)
                {
                    var skillButtonLabel = document.createElement('label')
                    skillButtonLabel.setAttribute('class', 'btn btn-default')
                    skillButtonLabel.insertAdjacentHTML('afterBegin', i)
                    var skillButton = document.createElement('input')
                    skillButton.setAttribute('type', 'radio')
                    skillButton.setAttribute('name',buttonId +"-"+skillId)
                    skillButton.setAttribute('value', i)
                    skillButton.setAttribute('class', 'skill-radio')
                    skillButton.setAttribute('id', buttonId +"-"+skillId+"-"+i)
                    skillButtonLabel.appendChild(skillButton)
                    radioSkills1.appendChild(skillButtonLabel);
                }
                skillGroup.appendChild(skillLabel)
                skillGroup.appendChild(radioSkills1)
                row.appendChild(skillGroup)
                skillList.appendChild(row)
                unorderedList.appendChild(skillList)
            }
            reviewArea.appendChild(unorderedList)
            var formElement = document.createElement('form')
            var messageElement = document.createElement('textarea')
            messageElement.setAttribute('placeholder', 'Leave a comment')
            messageElement.setAttribute('rows', '3')
            messageElement.setAttribute('class', 'review-message')
            messageElement.setAttribute('id', buttonId+"-content")
            var messageButtonElement = document.createElement('button')
            messageButtonElement.setAttribute('value', '1')
            messageButtonElement.setAttribute('id', buttonId+"-message-button")
            messageButtonElement.setAttribute('class', 'btn btn-default review-message-button')
            messageButtonElement.insertAdjacentHTML('afterBegin','Post')
            messageButtonElement.setAttribute('type', 'button')
            formElement.appendChild(messageElement)
            formElement.appendChild(messageButtonElement)
            messageArea.appendChild(formElement)
        },
        error:function(jqXHR, textStatus, errorThrown){
            $("#"+buttonId).html('An error has occured creating the review:' + textStatus)
            return;
        }
    });
});

$(document).on('click', ".review-message-button", function() {
    var buttonId = this.id;
    var ids = buttonId.split("-");

    var userid = ids[0]
    var revieweeid = ids[1]
    var gameid = ids[2]
    var reviewid = userid + "-" + revieweeid + "-" + gameid

    var textArea = document.getElementById(reviewid+"-content")
    if(textArea == null)
    {
        return
    }
    var message = textArea.value
    if(!message)
    {
        return
    }

    var review = {
        id: reviewid,
        message: message
    }

    /* Send the data using post and put the results in a div */
    $.ajax({
        url: "/perfect/index.php/review/comment",
        type: 'POST',
        data: review,
        success: function(data){
            $("#"+reviewid+"-message").children().fadeOut(220, function() {
                $("#"+reviewid+"-message").html('Comment Submitted')
            });
        },
        error:function(jqXHR, textStatus, errorThrown){
            $("#"+buttonId).html('An error has occured creating the review:' + textStatus+errorThrown);
            return;
        }
    });
});


$(document).on('change', ".skill-radio", function() {
    var buttonId = this.id;
    var ids = buttonId.split("-");
    
    if(ids.length != 5)
    {
        return;
    }

    var userid = ids[0]
    var revieweeid = ids[1]
    var gameid = ids[2]
    var reviewid = userid + "-" + revieweeid + "-" + gameid
    var skillNum = ids[3]
    var skillVal = ids[4]

    var reviewArea = document.getElementById(reviewid)

    var review = {
        id: reviewid,
        skill: skillNum,
        value: skillVal
    }

    /* Send the data using post and put the results in a div */
    $.ajax({
        url: "/perfect/index.php/review/update",
        type: 'POST',
        data: review,
        success: function(data){
        },
        error:function(jqXHR, textStatus, errorThrown){
            $("#"+buttonId).html('An error has occured creating the review:' + textStatus +errorThrown);
            return;
        }
    });
});

