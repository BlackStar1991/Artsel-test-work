<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('en', 'phpmailer/language/');
$mail->IsHTML(true);

/// From
$mail->setFrom('test@ukr.net', 'Test Letter');
// To whom it sends
$mail->addAddress('andryzirka@gmail.com');
// Template of letter
$mail->Subject = 'Hi it\'s test message';


// Body of letter
$body = '<h1>This is test message</h1>';

if (trim(!empty($_POST['name']))) {
    $body .= '<p>Name :' . $_POST['name'] . '</p>';
}

if (trim(!empty($_POST['email']))) {
    $body .= '<p>Email: ' . $_POST['email'] . '</p>';
}

if (trim(!empty($_POST['user_massage']))) {
    $body .= '<p>Massage: ' . $_POST['user_massage'] . '</p>';
}



$mail->Body = $body;

/// SEND
if(!$mail->send()){
    $message = 'Error Sending';
} else{
    $message = 'Data send!';
}

$response = ['message' => $message];
header('Content-type: application/json');
echo json_encode($response);

?>