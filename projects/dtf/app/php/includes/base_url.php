<?php

// Protocolo (http o https)
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
//echo "<br>$protocol: $protocol";

// Nombre del host (dominio)
$host = $_SERVER['HTTP_HOST'];
//echo "<br>$host: $host";

// Ruta base
$basePath = dirname($_SERVER['SCRIPT_NAME']);
//echo "<br>$basePath: $basePath";

// Construir la URL base
$baseUrl = "$protocol://$host$basePath/";
//echo "<br>$baseUrl: $baseUrl";

?>