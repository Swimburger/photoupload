<?php
require_once("inc.mysql.php");
require_once("inc.security.php");

if(isset($_FILES["file"])) {
	//var_dump($_FILES);
	//var_dump($_REQUEST);
// http://www.w3schools.com/php/php_file_upload.asp

// INSERT INTO `photos` (`id`, `name`, `email`, `uploaded`, `filename`, `filetype`, `caption`, `country`, `year`, `people`, `keywords`, `hostfamily`, `student`, `volunteers`, `events`, `school`, `travel`, `alumni`) VALUES (NULL, 'Kristian', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

for($i = 1; $i <= 3; $i++) {
	if(isset($_FILES['file']['name'][$i]) && $_FILES['file']['name'][$i] != "") {

  $upload_query = "INSERT INTO `photos` (`name`, `email`, `organization`, `filename`, `filetype`, `caption`, `country`, `year`, `people`, `keywords`, `hostfamily`, `student`, `volunteers`, `events`, `school`, `travel`, `alumni`) VALUES
( '".$_REQUEST['name']."', '".$_REQUEST['email']."', '".$_REQUEST['organization']."', '".$_FILES['file'][$i]."', '".$_FILES['type'][$i]."', '".$_REQUEST['caption'][$i]."', '".$_REQUEST['country'][$i]."', '".$_REQUEST['year'][$i]."', '".$_REQUEST['people'][$i]."', '".$_REQUEST['keywords'][$i]."', '".$_REQUEST['hostfamily'][$i]."', '".$_REQUEST['student'][$i]."', '".$_REQUEST['volunteers'][$i]."', '".$_REQUEST['events'][$i]."', '".$_REQUEST['school'][$i]."', '".$_REQUEST['travel'][$i]."', '".$_REQUEST['alumni'][$i]."');";

  $upload_update = mysqli_query($mysqli_connection,$upload_query);

//echo $upload_query;

$target_dir = "/var/www/photoupload/upload/";
$target_file = $target_dir .mysqli_insert_id($mysqli_connection)."_".basename($_FILES["file"]["name"][$i]);

//echo $target_file;

$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Kristian: Disabling checks, as we also need to accept PSD, RAW etc.

// Check if image file is a actual image or fake image
/*if(isset($_FILES)) {
    $check = getimagesize($_FILES["file"]["tmp_name"][$i]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}*/
// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
/*if ($_FILES["fileToUpload"]["size"] > 50000000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}*/
// Allow certain file formats
/*if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
    echo "Sorry, only JPG, JPEG & PNG files are allowed.";
    $uploadOk = 0;
}*/
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
//        echo "Sorry, your file was not uploaded.";
        header("Location: ./?message=notuploaded");
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["file"]["tmp_name"][$i], $target_file)) {
        //echo "The file ". basename( $_FILES["file"]["name"][$i]). " has been uploaded.";
        header("Location: ./?message=uploaded");
    } else {
//        echo "Sorry, there was an error uploading your file.";
        header("Location: ./?message=notuploaded");
    }
}

echo "<hr />";

		}
	}
} else {
header("Location: ./?message=notuploaded");
}
?>