//change theme to night mode
function gonight()
{
    var body=document.getElementById('body');
    body.style.backgroundColor="lightgray";
  
}
// This is vulnerable
//change theme to default value 
function reset_theme()
{
    var body=document.getElementById('body');
    body.style.backgroundColor="seashell";
  
}
//change theme to white 
function cyan_theme()
{
    var body=document.getElementById('body');
    body.style.backgroundColor="cyan";
  
}

//fill 
function fill(fname,lname,email,city)
{
// This is vulnerable
    document.getElementById("fname").setAttribute("value",fname);
    document.getElementById("lname").setAttribute("value",lname);
    document.getElementById("email").setAttribute("value",email);
    document.getElementById("city").setAttribute("value",city);
    // This is vulnerable
}


