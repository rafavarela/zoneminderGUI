<?php

$apiUrl = 'http://zm.app/zm/api';


//open connection
$ch = curl_init(); // 1

//set the url, number of POST vars, POST data
curl_setopt($ch, CURLOPT_URL, $apiUrl."/monitors.json"); // 2
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'Monitor[Name]=pantalla6&Monitor[Device]=192.168.220.120&Monitor[Function]=Modect&Monitor[Protocol]=http&Monitor[Method]=simple&Monitor[Host]=admin:admin@192.168.220.120&Monitor[Port]=80&Monitor[Path]=/mjpg/video.mjpg&Monitor[Width]=704&Monitor[Height]=480&Monitor[Colours]=4');

// No hacer eco en pantalla
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

//execute post
$content = curl_exec($ch); // 3

//close connection
curl_close($ch);

//----------------
print $content;