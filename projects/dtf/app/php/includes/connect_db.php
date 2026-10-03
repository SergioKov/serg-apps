<?php


// Conexión a la base de datos
if($_SERVER['HTTP_HOST'] == 'serg-apps.com'){//HOSTALIA
    //echo"hostalia";
	$servername = "PMYSQL120.dns-servicio.com";
    $username = "demovtc";//porque 'holy_songs_user' no funciona
    $password = "&777&demovtc&777&";//antes '&parol_holy_songs_user&'
    $dbname = "7229353_db_dtf";//db de holy-songs en holy-songs.com
    
}else{//LOCALHOST
    //echo"localhost";
	$servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "db_dtf";    
}

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    //echo "conn error";
    //writeLog("Conexión fallida. Error: [" . $conn->connect_error . "]");
	die("Conexión fallida: " . $conn->connect_error);
}else{
	//echo "conn ok";
}

// Establecer el conjunto de caracteres a UTF-8 moderno
if (!$conn->set_charset("utf8mb4")) {
    //writeLog("Error al establecer el conjunto de caracteres utf8mb4. Error: [" . $conn->error . "]");
    die("Error al establecer el conjunto de caracteres utf8mb4: " . $conn->error);
}

?>
