<?php
  //define('SEND_TO', 'funkage@gmail.com');
  define('SEND_TO', 'seek@theuniversefantastic.co');
  define('SUBJECT', 'New transmission received');

  use PHPMailer\PHPMailer\Exception;
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;

  require './phpmailer/Exception.php';
  require './phpmailer/PHPMailer.php';
  require './phpmailer/SMTP.php';

  $name    = $_POST['sender_name'];
  $email   = $_POST['sender_email'];
  $contact = $_POST['sender_contact'];
  $message = $_POST['sender_project'];

  $clean = array(
    'name'    => filter_var(trim($name),    FILTER_SANITIZE_STRING),
    'email'   => filter_var(trim($email),   FILTER_SANITIZE_EMAIL),
    'contact' => filter_var(trim($contact), FILTER_SANITIZE_STRING),
    'message' => filter_var(trim($message), FILTER_SANITIZE_STRING),
  );

  $body = sprintf(
    'Ding ding! You’ve just received a new transmission from %s, contactable via %s',
    $clean['name'],
    $clean['email']
  );

  if (strlen($clean['contact']) > 0) {
    $body .= sprintf(' or %s', $clean['contact']);
  }

  if (strlen($clean['message']) > 0) {
    $body .= '! Transmission as follows:<br>';
    $body .= $clean['message'];
  } else {
    $body .= '!';
  }

  $mail = new PHPMailer;

  $mail->isSMTP();
  //$mail->SMTPDebug = SMTP::DEBUG_CONNECTION;
  $mail->Host = 'mail.theuniversefantastic.co';
  $mail->Port = 587;
  $mail->SMTPAuth = true;
  $mail->Username = 'noreply@theuniversefantastic.co';
  $mail->Password = sprintf('%s', 'w_vz9[lC]9WR3zxk');

  $mail->setFrom('noreply@theuniversefantastic.co', 'The Universe');
  $mail->addReplyTo($clean['email'], $clean['name']);
  $mail->addAddress(SEND_TO);
  $mail->Subject = SUBJECT;
  $mail->msgHTML($body);

  if ($mail->send()) {
    echo 1;
  } else {
    echo 'Mailer Error: '. $mail->ErrorInfo;
  }
?>
