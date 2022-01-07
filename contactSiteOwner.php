<?php

function console_log($output, $with_script_tags = true) {
	$js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
');';
	if ($with_script_tags) {
		$js_code = '<script>' . $js_code . '</script>';
	}
	echo $js_code;
}

//$owner_email = "karabriggs15@gmail.com";
$owner_email = "ajmeese7@gmail.com";

console_log("Subject: " . $_POST['subject']);
console_log("Message: " . $_POST['message']);
console_log("Name: " . $_POST['name']);
console_log("Email: " . $_POST['email']);

$email = filter_var( $_POST["email"], FILTER_VALIDATE_EMAIL );
if (!$_POST["subject"] || !$_POST["message"] || !$_POST["name"] || !$email) {
	// TODO: Make this a popup
	return false;
}

$sent = mail(
	$owner_email,
	$_POST["subject"],
	"Name: ".$_POST["name"] . "\n\nMessage: " . $_POST["message"],
	"From: ".$_POST["email"]
);

// TODO: Debug once not on localhost
console_log("SENT: " . $sent);
die;

// TODO: Return a response indicating whether the email send was successful

?>