<?php
  //define('SEND_TO', 'funkage@gmail.com');
  define('SEND_TO', 'seek@theuniversefantastic.co');
  define('SUBJECT', '%s wants to talk.');

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

  $body = 'Dear Universe,';
  $body .= '<br><br>';
  $body .= sprintf(
    'Please reach out to <b>%s</b>, at <b>%s</b> or <b>%s</b>',
    $clean['name'],
    $clean['email'],
    $clean['contact']
  );

  if (strlen($clean['message']) > 0) {
    $body .= ', who has the following message for you:';
    $body .= '<br>';
    $body .= $clean['message'];
  } else {
    $body .= '.';
  }

  $body .= '<br><br>';
  $body .= 'Amen';

  $mail = new PHPMailer;
  $mail->setFrom($clean['email'], $clean['name']);
  $mail->addReplyTo($clean['email'], $clean['name']);
  $mail->addAddress(SEND_TO);
  $mail->Subject = sprintf(SUBJECT, $clean['name']);
  $mail->msgHTML($body);

  if ($mail->send()) {
    echo 1;
  } else {
    echo 'Mailer Error: '. $mail->ErrorInfo;
  }
?>
