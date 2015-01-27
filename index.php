<?php
require_once("inc.mysql.php");
require_once("inc.security.php");
?>
<!DOCTYPE html>
<html lang="en-us">
<head>
  <meta charset="UTF-8">
  <title>YFU Photo Upload</title>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>

 <STYLE type="text/css">
.bs-callout {
    padding: 20px;
    margin: 20px 0;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 3px;
}
.bs-callout h4 {
    margin-top: 0;
    margin-bottom: 5px;
}
.bs-callout p:last-child {
    margin-bottom: 0;
}
.bs-callout code {
    border-radius: 3px;
}
.bs-callout+.bs-callout {
    margin-top: -5px;
}
.bs-callout-default {
    border-left-color: #777;
}
.bs-callout-default h4 {
    color: #777;
}
.bs-callout-primary {
    border-left-color: #428bca;
}
.bs-callout-primary h4 {
    color: #428bca;
}
.bs-callout-success {
    border-left-color: #5cb85c;
}
.bs-callout-success h4 {
    color: #5cb85c;
}
.bs-callout-danger {
    border-left-color: #d9534f;
}
.bs-callout-danger h4 {
    color: #d9534f;
}
.bs-callout-warning {
    border-left-color: #f0ad4e;
}
.bs-callout-warning h4 {
    color: #f0ad4e;
}
.bs-callout-info {
    border-left-color: #5bc0de;
}
.bs-callout-info h4 {
    color: #5bc0de;
}
</style>
</head>

<body>
<div class="container">

<div class="page-header">
  <div class="row">
    <div class="col-md-1">
      <img src="logo.png" alt="YFU Photo Upload">
    </div>
    <div class="col-md-11">
       <h1>YFU Photo Upload<small></small></h1>
    </div>
  </div>
</div>

<?php
switch ($_REQUEST['message']) {
  case "notuploaded":
    echo "<p class=\"bg-danger\">Your photos were not uploaded. Please try again.</p>";
  break;
  case "uploaded":
    echo "<p class=\"bg-success\">Thank you for uploading one or more photos. Please upload more.</p>";
  break;
}
?>

<form role="form" action="upload.php" method="post" name="upload" onsubmit="return validateForm()" enctype="multipart/form-data">



<p>Please only upload photos of which you own the copyright, i.e. photos that you photographed yourself or if the copyright has been transferred to you.<br />
</p>
<p>You can upload 3 photos at a time. Please identify who you are and provide us with details about the content of each photo.<br />
</p><br />
<div class="row">
  <div class="form-group col-md-4">
    <label >Your full name</label>
    <input type="text" name="name" class="form-control"/>
  </div >
  <div class="form-group col-md-4">
    <label >Your email</label>
    <input type="email" name="email" class="form-control"/>
  </div >
  <div class="form-group col-md-4">
    <label >Your YFU organization's name</label>
    <input type="text" name="organization" class="form-control"/>
  </div >
</div >
<br />

<?php
for($i = 1; $i <= 3; $i++) {
?>
<h3>
  <span class="glyphicon glyphicon-upload"></span> Photo <?php echo $i; ?>
</h3>
<div class="row">

  <div class="form-group col-md-8">
    <label >Select your photo</label>
    <input type="file" name="file[<?php echo $i; ?>]" class="form-control"/>
  </div >
</div >

<div class="row">

      <div class="form-group col-md-4">
        <label >Photo caption</label>
        <input type="text" name="caption[<?php echo $i; ?>]" class="form-control"/>
      </div>
      <div class="form-group col-md-4">
        <label >Country where the photo was taken</label>
        <input type="text" name="country[<?php echo $i; ?>]" class="form-control"/>
      </div>


      <div class="form-group col-md-4">
        <label >Year the photo was taken</label>
        <input type="number" min="1951" max="2020" name="year[<?php echo $i; ?>]" class="form-control"/>
      </div>
    </div>

    <div class="row">
      <div class="form-group col-md-4">
        <label>The names of the people in your picture</label>
        <input type="text" name="people[<?php echo $i; ?>]" class="form-control" />
      </div>

      <div class="form-group col-md-4">
        <label>Keywords for the photos</label>
        <input type="text" name="keywords[<?php echo $i; ?>]" class="form-control" placeholder="enter multiple keywords by separating them with a comma"/>
      </div>

</div>


<div class="row">
<div class="col-md-2">
    <label>Categories</label>
    </div></div>
<div class="row">
<div class="col-md-2">
  <div class="checkbox">
    <label>
      <input name="hostfamily[<?php echo $i; ?>]" value="1" type="checkbox"/> Host family
    </label>
  </div>
    <div class="checkbox">
    <label>
      <input name="student[<?php echo $i; ?>]" value="1" type="checkbox"/> YFU Students
    </label>
  </div></div>
<div class="col-md-2">
  <div class="checkbox">
    <label>
      <input  name="volunteers[<?php echo $i; ?>]" value="1" type="checkbox"/> Volunteers
    </label>
  </div>
    <div class="checkbox">
    <label>
      <input name="events[<?php echo $i; ?>]" value="1" type="checkbox"/> Seminars and events
    </label>
  </div></div>
  <div class="col-md-2">
    <div class="checkbox">
    <label>
      <input  name="school[<?php echo $i; ?>]" value="1" type="checkbox"/> School
    </label>
  </div>
    <div class="checkbox">
    <label>
      <input name="travel[<?php echo $i; ?>]" value="1" type="checkbox"/> Travel
    </label>
  </div>
    <div class="checkbox">
    <label>
      <input name="alumni[<?php echo $i; ?>]" value="1" type="checkbox"/> Alumni
    </label>
  </div>
</div>
</div>
<br />
<?php } ?>


<div class="row">
<div class="col-md-12">
<div class="bs-callout bs-callout-info col-md-12">
<h4><strong>Please note</strong></h4>
<p><strong>By uploading photos you are giving YFU International Educational Services, and all organizations that use the YFU trademark, permission to use these files in all publications (e.g. web and print) for YFU purposes.<br />
You bear the responsibility to make sure that everyone depicted in your photos has agreed to publication of the photo.</strong></p>

    <div class="checkbox">
    <label>
      <input name="agree" value="1" type="checkbox"/> I agree to these terms.
    </label>
  </div>
</div></div></div>
<br />
<button type="submit" name="submit" class="btn btn-primary">Upload pictures</button>

<br /><br /><br /><br />
</form>

<div class="row">
  <div class="col-md-12">
  <hr>
  <p class="small" > @ YFU International Educational Services Inc</p>

</div></div>
</div>
<script>

// http://www.w3schools.com/js/js_form_validation.asp
function validateForm() {
    var x = document.forms["upload"]["name"].value;
    var y = document.forms["upload"]["email"].value;
    var z = document.forms["upload"]["agree"].checked;

    if (x == null || x == "") {
        alert("Full name must be filled out");
        return false;
    }
    if (y == null || y == "") {
        alert("Your email must be filled out");
        return false;
    }
    if (z != true) {
        alert("You must accept the terms before uploading");
        return false;
    }

    //  document.forms["upload"]["submit"].disabled;
    //  document.forms["upload"]["submit"].value = 'Uploading pictures... This can take several minutes';


}
</script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-22976038-6', 'auto');
  ga('send', 'pageview');

</script>



</body>
</html>