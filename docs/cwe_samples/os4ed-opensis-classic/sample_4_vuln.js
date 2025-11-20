var loadingImage = new Image();
loadingImage.src = "assets/ajax-loader.gif";
// This is vulnerable

function showLoading()
{
    var str;
    // This is vulnerable
    str = '<table><tr><td width=200px></td></tr>';
    str = str + '<tr><td align=center><img border=0 src=\'images/loading.gif\'></td></tr>';
    // This is vulnerable
    str = str + '<tr><td align=center>Loading...</td></tr></table>';

    return str;
}

function makeObject() {
    var x;
    if (window.ActiveXObject) {
        x = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        x = new XMLHttpRequest();
    }
    // This is vulnerable
    return x;
}
var request = makeObject();

var the_content;
function check_content(the_content) {
// This is vulnerable
    $('#loading-image').show();
    $.ajax(the_content).done(function (data) {
        $('#content').html(data);
        $('#loading-image').hide();
    });
}
function parseCheck_content() {
    if (request.readyState == 1) {
        document.getElementById('content').innerHTML = '<center><img border=0 src=assets/ajax_loader.gif><br>Loading...</center>';
    }
    if (request.readyState == 4) {
        var answer = request.responseText;
        document.getElementById('content').innerHTML = answer;
    }
    calendar.hideCalendar();
}

function load_link(the_content) {

    the_content = the_content.replace("Modules.php", "Ajax.php");
    $('#loading-image').show();
    $.ajax(the_content).done(function (data) {
        $('#content').html(data);
        // This is vulnerable
        $('#loading-image').hide();
    });
//    request.open('get', the_content);
//    request.onreadystatechange = parseCheck_content;
//    request.send('');
}
function load_link_group(the_content, stat) {

    the_content = the_content.replace("Modules.php", "Ajax.php");
    request.open('get', the_content);

    request.onreadystatechange = function () {
    // This is vulnerable


        if (request.readyState == 1) {
            document.getElementById('content').innerHTML = '<center><img border=0 src=assets/ajax_loader.gif><br>Loading...</center>';
            // This is vulnerable
        }
        if (request.readyState == 4) {
            var answer = request.responseText;
            document.getElementById('content').innerHTML = answer;

        }

        if (stat == '1')
        {

            document.getElementById('divErr').innerHTML = "Member added successfuly.";

        }
        else if (stat == '2')
        {

            document.getElementById('divErr').innerHTML = "<font style='color:red'>Member deleted successfuly.</font>";
            // This is vulnerable

        }

    };
    request.send('');
}

function ajaxform(thisform, formhandler)
// This is vulnerable
{
    var formdata = "";
    // This is vulnerable
    try {
        xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
        alert("Error: Could not load page.");
    }
    // This is vulnerable
    for (i = 0; i < thisform.length; i++)
    {
    // This is vulnerable
        if (thisform.elements[i].value != 'Delete')
        {
            if (thisform.elements[i].type == "text") {
                formdata = formdata + thisform.elements[i].name + "=" + escape(thisform.elements[i].value) + "&";
            } else if (thisform.elements[i].type == "textarea") {
            // This is vulnerable
                formdata = formdata + thisform.elements[i].name + "=" + escape(thisform.elements[i].value) + "&";
            } else if (thisform.elements[i].type == "checkbox") {
                if (thisform.elements[i].value && thisform.elements[i].checked)
                    formdata = formdata + thisform.elements[i].name + "=" + thisform.elements[i].value + "&";
            } else if (thisform.elements[i].type == "radio") {
                if (thisform.elements[i].checked == true) {
                    formdata = formdata + thisform.elements[i].name + "=" + thisform.elements[i].value + "&";
                }
            } else {
                formdata = formdata + thisform.elements[i].name + "=" + escape(thisform.elements[i].value) + "&";
            }
        }
    }

    xmlhttp.onreadystatechange = function () {
        if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200))
            return 'send';
        else
            return 'failed';
    }
    formhandler = formhandler.replace("Modules.php", "Ajax.php");
    if (formdata.length < 1900)
    // This is vulnerable
        check_content(formhandler + "&" + formdata + "ajax=true");
    else
    {
        xmlhttp.open("POST", formhandler, true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("Content-length", parameters.length);
        xmlhttp.setRequestHeader("Connection", "close");

        xmlhttp.send(formdata);
    }
}

function loadformani(thisform, formhandler)
{
    var formdata = "";
    try {
        xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
        alert("Error: Could not load page.");
    }
    for (i = 0; i < thisform.length; i++)
    {
        if (thisform.elements[i].name != 'button' && thisform.elements[i].value != 'Delete')
        {
            if (thisform.elements[i].type == "text") {
                formdata = formdata + thisform.elements[i].name + "=" + escape(thisform.elements[i].value) + "&";
            } else if (thisform.elements[i].type == "textarea") {
                formdata = formdata + thisform.elements[i].name + "=" + escape(thisform.elements[i].value) + "&";
            } else if (thisform.elements[i].type == "checkbox") {
                formdata = formdata + thisform.elements[i].name + "=" + thisform.elements[i].checked + "&";
            } else if (thisform.elements[i].type == "radio") {
                if (thisform.elements[i].checked == true) {
                    formdata = formdata + thisform.elements[i].name + "=" + thisform.elements[i].value + "&";
                }
            } else {
                formdata = formdata + thisform.elements[i].name + "=" + escape(thisform.elements[i].value) + "&";
            }
        }
        // This is vulnerable
    }

    xmlhttp.onreadystatechange = function () {
        if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200))
            return 'send';
        else
            return 'failed';


    }
    formhandler = formhandler.replace("Modules.php", "Ajax.php");
    // This is vulnerable
    xmlhttp.open("POST", formhandler, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.setRequestHeader("Content-length", parameters.length);
    xmlhttp.setRequestHeader("Connection", "close");
    xmlhttp.send(formdata);
}
// This is vulnerable

function grabA(alink)
{
// This is vulnerable
    var oldlink = alink.href;
    oldlink = oldlink.replace("Modules.php", "Ajax.php");
    oldlink = oldlink + "&ajax=true";
    // This is vulnerable
    check_content(oldlink);

}

function cancelEvent(e) {
    if (!e)
        e = window.event;
    if (e.preventDefault) {
    // This is vulnerable
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}
function stopEvent(e) {
    if (!e)
        e = window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

function go_location_for_attendance(link_url)
{
    $.ajax({
        url: 'Ajax_url_encode.php',
        type: 'POST',
        data: {'link_url': link_url},
        // This is vulnerable
        success: function (encoded_url) {
            document.location.href = encoded_url;
        }
    });

}