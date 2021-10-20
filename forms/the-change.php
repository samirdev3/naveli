<?php
require('../phpmailer/class.phpmailer.php');
if ($_SERVER["REQUEST_METHOD"] == "POST") {

	//form variables
	$sendFormTo = array('samir@tetramind.asia','projectnaveli@gmail.com');
	// $apipassword = '';
	$fname = $_POST['fname'];
	$lname = $_POST['lname'];
	$email = $_POST['email'];
	$research = $_POST['research'];
	$socialmedia = $_POST['socialmedia'];
	$design = $_POST['design'];

	// $mail = new PHPMailer();
	// $mail->SMTPDebug = 0;
	// $mail->IsSMTP();
	// $mail->Host     = 'smtp.sendgrid.net';
	// $mail->SMTPAuth = true;
	// $mail->Username = 'apikey';
	// $mail->Password = base64_decode($apipassword);
	// $mail->SMTPSecure = 'tls';
	// $mail->Port     = 587; 
	// $mail->Mailer   = 'smtp'; 


	$mail->SetFrom('info@projectnaveli.com', 'Project Naveli');
	$mail->AddReplyTo('info@projectnaveli.com', 'Project Naveli');
	foreach($sendFormTo as $to_add){
		$mail->AddAddress($to_add);
	}
	$mail->IsHTML(true);
	$mail->Subject = 'Bring About the Change Form | Project Naveli';
	$mail->Body = '<html><body>'; //HTML start
	$mail->Body .= '<p><strong>First Name:</strong> '.$fname.'</p>';
	$mail->Body .= '<p><strong>Last Name:</strong> '.$lname.'</p>';
	$mail->Body .= '<p><strong>Email:</strong> '.$email.'</p>';
	$mail->Body .= '<p><strong>Research & Drafting of the Policy: </strong> <br>'.$research.'</p>';
	$mail->Body .= '<p><strong>Social Media (Content planning and execution): </strong> <br>'.$socialmedia.'</p>';
	$mail->Body .= '<p><strong>Design (posters, posts, videos for online and on-ground):</strong> <br>'.$design.'</p>';
	$mail->Body .= '</body></html>'; //HTML end

	if(!$mail->Send()) {
		echo 'Oops! Something went wrong and we couldn\'t send your message.';
	} else {
		echo 'Thank you for reaching out to us. Our team shall get in touch with you at the earliest.';
	}

}
?>