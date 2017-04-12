<?php
/*
$username = 'admin';
$password = 'admin';
$loginUrl = 'http://mysite/zm/index.php';
*/
// $apiUrl = 'http://mysite/zm/api';
   $apiUrl = 'http://zm.app/zm/api';


$ch = curl_init(); // 1
/*
curl_setopt($ch, CURLOPT_URL, $loginUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'username='.$username.'&password='.$password.'&action=login&view=console');
curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookie.txt');

curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$store = curl_exec($ch);

#turn off POST after login - important
curl_setopt($ch, CURLOPT_POST, 0);
*/


// print "---------- Version API -----------------";

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $apiUrl."/host/getVersion.json"); // 2
curl_setopt($ch, CURLOPT_URL, $apiUrl."/monitors.json");

$content = curl_exec($ch); // 3

print $content;

//echo $content; // 4
//var_dump(json_decode($content, true));

/*
print "---------- Your Monitors -----------------";
curl_setopt($ch, CURLOPT_URL, $apiUrl."/monitors.json");
$content = curl_exec($ch);
print $content;
*/


curl_close($ch);