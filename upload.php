<?php
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
/*if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}*/
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
//Allow certain file formats
if($imageFileType != "mat" ) {
    echo "Sorry, only MAT files are allowed.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    	$command = escapeshellcmd('scripts/generateJavascript.py -t '.$_POST["inputThr"]. ' -i uploads/'.basename( $_FILES["fileToUpload"]["name"]));
    	$output = shell_exec($command);
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>

<!DOCTYPE html>
<meta charset="utf-8">
<head>
	<link rel="stylesheet" type="text/css" href="visual.css">
</head>

<body>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="scripts/visualization.js"></script>

<script>
	var jsonName = <?php echo '"uploads/'. substr(basename($_FILES["fileToUpload"]["name"]),0,-4). '.json"'; ?>;
	var trheshold = <?php echo $_POST["inputThr"]; ?>;
	console.log("Thres "+trheshold);
	visualization(jsonName);
</script>
