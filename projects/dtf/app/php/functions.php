<?php
//=====================================================================================//
// FUNCTIONS - START
//=====================================================================================//

function debug($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    var_dump($variable);
    echo"</pre>";
}


function debug_x($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    var_dump($variable);
    echo"</pre>";
    exit;
}

function debug_r($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    print_r($variable);
    echo"</pre>";
}

function debug_r_x($variable, $name_var = null){
    if($name_var != null) echo"<h3>$name_var: </h3>";
    echo"<pre>";
    print_r($variable);
    echo"</pre>";
    exit;
}

function echo_json($variable, $name_var = null){
    if($name_var != null){
        echo json_encode([
            $name_var => $variable
        ], JSON_UNESCAPED_UNICODE);    
    }else{
        echo json_encode([
            'variable' => $variable
        ], JSON_UNESCAPED_UNICODE);
    }    
    exit;
}

function echo_json_x($variable, $name_var = null){//con exit;
    if($name_var != null){
        echo json_encode([
            $name_var => $variable,
            'funcion' => 'echo_json_x()',
            'hago_exit' => true
        ], JSON_UNESCAPED_UNICODE);    
    }else{
        echo json_encode([
            'variable' => $variable,
            'funcion' => 'echo_json_x()',
            'hago_exit' => true
        ], JSON_UNESCAPED_UNICODE);
    }    
    exit;
}

function isValidJson(string $jsonString): bool {
    // Decodificar sin convertir a array
    json_decode($jsonString);
    return (json_last_error() === JSON_ERROR_NONE);
}

function cleanControlChars(string $jsonString): string {
    // elimina todos los caracteres de control excepto \n, \r y \t
    return preg_replace('/[^\P{C}\n\r\t]+/u', '', $jsonString);
}

function escapeControlChars(string $jsonString): string {
    // Escapa todos los caracteres de control de ASCII (0-31) excepto \n, \r, \t
    return preg_replace_callback('/[\x00-\x1F]/', function($matches) {
        $char = $matches[0];
        switch ($char) {
            case "\n": return "\\n";
            case "\r": return "\\r";
            case "\t": return "\\t";
            default:
                return sprintf("\\u%04x", ord($char));
        }
    }, $jsonString);
}


function escapeNewlines(string $jsonString): string {
    // reemplaza saltos de línea que no estén escapados
    // Solo reemplaza saltos de línea que no están escapados.
    // Mantiene intactos los \\n correctos.
    return preg_replace('/(?<!\\\\)\n/', '\\\\n', $jsonString);
}

function jsonErrorMessage(string $jsonString): string {
    json_decode($jsonString);
    $error = json_last_error();

    switch ($error) {
        case JSON_ERROR_NONE:
            return 'OK';
        case JSON_ERROR_DEPTH:
            return 'Excedida la profundidad máxima de la pila';
        case JSON_ERROR_STATE_MISMATCH:
            return 'Desajuste de modos o underflow';
        case JSON_ERROR_CTRL_CHAR:
            return 'Error de carácter de control';
        case JSON_ERROR_SYNTAX:
            return 'Error de sintaxis';
        case JSON_ERROR_UTF8:
            return 'Caracteres UTF-8 malformados';
        default:
            return 'Error desconocido (código ' . $error . ')';
    }
}


function interpolateQuery($query, $params) {//$params es un array
    // Dividir la consulta en partes utilizando '?' como delimitador
    $parts = explode('?', $query);
    $final_query = '';
    
    // Iterar sobre las partes y los parámetros
    for ($i = 0; $i < count($parts); $i++) {
        $final_query .= $parts[$i];
        
        // Añadir el valor del parámetro si existe
        if (isset($params[$i])) {
            $value = $params[$i];
            
            // Determinar el tipo de dato y formatear adecuadamente
            if (is_int($value) || is_float($value)) {
                $final_query .= $value;
            } elseif (is_null($value)) {
                $final_query .= 'NULL';
            } else {
                // Escapar caracteres especiales para cadenas
                $escaped = addslashes($value);
                $final_query .= "'" . $escaped . "'";
            }
        }
    }
    
    return $final_query;
}

function prepararQuery($conn, $query, $arr_params, $sign = '?') {
    //echo "<hr><p> START --- function: prepararQuery() </p><hr>";
    //$conn => es necesario para $conn->real_escape_string($value)
    //$query => es la consulta sql 
    //$arr_params => es un array de parámetros
    //$sign => por defecto es '?' pero al introducir json pongo signo especial. Ej.: '__[(&)]__' //no usar '<' ni '>'
    //si en arr_params algun valor es null, meterlo directamente sin usar '?'
    //si la consulta $query no tiene '?' pasar $arr_params vacio => [] o no USAR ESTA FUNCION YA QUE NO HACE NADA

    // Dividir la consulta en partes utilizando '?' como delimitador
    $arr_parts = explode($sign, $query);
    $final_query = '';
    
    //debug($sign, 'sign');
    //debug($query, 'query');
    //debug($arr_params, 'arr_params');
    //debug($arr_parts, 'arr_parts');
    //debug(count($arr_parts), 'count(arr_parts)');
    //echo "<hr><p> START --- FOR </p><hr>";

    if(count($arr_parts) > 1){//SI AL MENOS HAY UN '?' AL DIVIDIR STRING RETORNA 2 VALORES EN arr_parts

        // Iterar sobre las partes y los parámetros
        for ($i = 0; $i < count($arr_parts); $i++) {        
            $final_query .= $arr_parts[$i];

            //debug($arr_parts[$i],"$ arr_parts[$i]");
            //debug($final_query, "$ final_query [$i] antes");
            
            // Añadir el valor del parámetro si existe
            if (isset($arr_params[$i]) ) {
                $value = $arr_params[$i];

                //debug($arr_params[$i], "$ arr_params[$i]");
                //debug($value, 'value');
                
                // Determinar el tipo de dato y formatear adecuadamente
                if (is_int($value) || is_float($value)) {
                    $final_query .= $value;
                    //echo " $ value es INT o FLOAT";
                } elseif (is_bool($value)) {
                    $final_query .= ($value) ? 1 : 0 ;
                    //echo " $ value es BOOL";
                } elseif (is_null($value)) {
                    //aki no entra nunca ya que si $arr_params[$i] = NULL la comprobación isset(NULL) retorna false y no entra aki. 
                    //pero lo dejo aki con esta explicación
                    $final_query .= 'NULL';
                    //echo " $ value [$value] es NULL";
                } else {
                    // Escapar caracteres especiales para cadenas
                    $value_escaped = $conn->real_escape_string($value);
                    $final_query .= "'" . $value_escaped . "'";
                    //echo " $ value [$value] es STRING";
                }
            }

            //debug($final_query, "$ final_query [$i] después ");
            //echo "<hr>";
        }
        //echo "<hr><p> END --- FOR </p><hr>";
        //echo "<hr><p> END --- function: prepararQuery() </p><hr>";

        return $final_query;

    }else{

        //echo "<hr><h3> NO HAY '?' EN LA CONSULTA. LA RETORNO TAL CUAL</h3>";
        return $query;
    }    
}



function buildWhere($modo, $texto, $campos = ["array de campos"], &$params = [], &$types = "") {
    
    $where = "";
    $texto = trim($texto);

    switch ($modo) {

        // 1) Todas las palabras (pueden ser parte de otras palabras, sin importar orden)
        default:
        case 1:
            $palabras = preg_split('/\s+/', $texto);
            $ands = [];
            foreach ($palabras as $palabra) {
                $ors = [];
                foreach ($campos as $campo) {
                    $ors[] = "$campo LIKE ?";
                    $params[] = "%" . $palabra . "%";
                    $types .= "s";
                }
                $ands[] = "(" . implode(" OR ", $ors) . ")";
            }
            $where .= implode(" AND ", $ands);
            break;


        // 2) Todas las palabras (sin importar orden)
        case 2:
        $palabras = preg_split('/\s+/', $texto);
        $ands = [];
        foreach ($palabras as $palabra) {
            $ors = [];
            foreach ($campos as $campo) {
                $ors[] = "$campo REGEXP ?";
                $params[] = "[[:<:]]" . $palabra . "[[:>:]]";
                $types .= "s";
            }
            $ands[] = "(" . implode(" OR ", $ors) . ")";
        }
        $where .= implode(" AND ", $ands);
        break;
        

        // 3) Coincidir al menos una palabra (OR global)
        case 3:
            $palabras = preg_split('/\s+/', $texto, -1, PREG_SPLIT_NO_EMPTY);
            $orsGlobal = [];

            foreach ($palabras as $palabra) {
                $orsCampos = [];
                foreach ($campos as $campo) {
                    $orsCampos[] = "$campo REGEXP ?";
                    $params[] = "[[:<:]]" . $palabra . "[[:>:]]";
                    $types .= "s";
                }
                // Cada palabra puede aparecer en cualquiera de los campos
                $orsGlobal[] = "(" . implode(" OR ", $orsCampos) . ")";
            }

            // Con OR global: basta con que una de las palabras esté
            $where .= "(" . implode(" OR ", $orsGlobal) . ")";
            break;            


        // 4) Palabras en el orden establecido
        case 4:
            $palabras = preg_split('/\s+/', $texto, -1, PREG_SPLIT_NO_EMPTY);

            // Un solo patrón que respete el orden
            $pattern = implode('.+', array_map('preg_quote', $palabras));

            $ors = [];
            foreach ($campos as $campo) {
                $ors[] = "$campo REGEXP ?";
                $params[] = $pattern;
                $types .= "s";
            }
            $where .= "(" . implode(" OR ", $ors) . ")";
            break; 
            
            
        // 5) Frase exacta
        case 5:
            $ors = [];
            foreach ($campos as $campo) {
                $ors[] = "$campo LIKE ?";
                $params[] = "%" . $texto . "%";
                $types .= "s";
            }
            $where .= "(" . implode(" OR ", $ors) . ")";
            break;


        // 6) Palabras exactas (no pueden ser parte de otras palabras, sin importar orden)
        case 6:
            $palabras = preg_split('/\s+/', $texto, -1, PREG_SPLIT_NO_EMPTY);
            $ands = [];
            foreach ($palabras as $palabra) {
                $ors = [];
                foreach ($campos as $campo) {
                    $ors[] = "$campo REGEXP ?";
                    $params[] = "[[:<:]]" . $palabra . "[[:>:]]";
                    $types .= "s";
                }
                $ands[] = "(" . implode(" OR ", $ors) . ")";
            }
            $where .= implode(" AND ", $ands);
            break;

    }

    return $where;
}


function convertirFecha($fecha, $separador = '/') {
    $partes = explode('-', $fecha);// de formato sql '2025-08-03' a '03/08/2025' o '03.08.2025'
    return $partes[2] . $separador . $partes[1] . $separador . $partes[0];
}


function ordenarResultByArray($result, $arr_lista_ids){
    // Paso 1: Crear un índice rápido id_song → datos
    $map = [];
    foreach ($result as $row) {
        $map[$row['id_song']] = $row;
    }

    // Paso 2: Construir nuevo array en el orden de $arr_lista_ids
    $ordered = [];
    foreach ($arr_lista_ids as $id) {
        if (isset($map[$id])) {
            $ordered[] = $map[$id];
        }
    }

    return $ordered;

    // Resultado ordenado
    //print_r($ordered);
}


function get_client_ip_short(): ?string {
    $keys = ['HTTP_CF_CONNECTING_IP','HTTP_X_REAL_IP','HTTP_X_FORWARDED_FOR','HTTP_CLIENT_IP','REMOTE_ADDR'];
    foreach ($keys as $k) {
        if (empty($_SERVER[$k])) continue;
        foreach (explode(',', $_SERVER[$k]) as $ip) {
            $ip = trim(preg_replace('/^::ffff:/i', '', $ip));
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) return $ip;
        }
    }
    foreach ($keys as $k) {
        if (empty($_SERVER[$k])) continue;
        foreach (explode(',', $_SERVER[$k]) as $ip) {
            $ip = trim(preg_replace('/^::ffff:/i', '', $ip));
            if (filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
        }
    }
    return null;
}
/* uso */
//echo get_client_ip_short() ?? 'IP no encontrada';

/*
    Esta versión normalizeSearchText():
    funciona con intl (intl debe habilitarse en el hosting)
    necesita Normalizer
    respeta cirílico y letras especiales

    ✔ ñ intacta
    ✔ ü intacta
    ✔ й, ї, є, ґ intactas
    ✔ apóstrofe ucraniano correcto
    ✔ acentos latinos fuera
    ✔ puntuación fuera
*/
function normalizeSearchText(string $text): string {
    // 1) minúsculas Unicode
    $text = mb_strtolower($text, 'UTF-8');

    // 2) normalizar Unicode (NFD)
    $text = Normalizer::normalize($text, Normalizer::FORM_D);

    // 3) eliminar diacríticos SOLO de letras latinas
    //    equivalente a: (?<=\p{Script=Latin})\p{Mn}+
    $text = preg_replace(
        '/(?<=\p{Latin})\p{Mn}+/u',
        '',
        $text
    );

    // 4) recomponer Unicode (NFC)
    $text = Normalizer::normalize($text, Normalizer::FORM_C);

    // 5) proteger apóstrofe entre letras
    $text = preg_replace(
        '/(\p{L})\'(\p{L})/u',
        '$1§§§$2',
        $text
    );

    // 6) eliminar puntuación y símbolos
    $text = preg_replace(
        '/[^\p{L}\p{N}§ ]+/u',
        ' ',
        $text
    );

    // 7) restaurar apóstrofe
    $text = str_replace('§§§', "'", $text);

    // 8) normalizar espacios
    $text = preg_replace('/\s+/u', ' ', $text);
    $text = trim($text);

    return $text;
}

/*
    Esta versión normalizeSearchTextNoIntl():
    funciona sin intl
    no necesita Normalizer
    respeta cirílico y letras especiales

    ❗ Limitaciones:
    no quita diacríticos latinos (áéíóú → no se convierten a aeiou)
    no elimina marcas Unicode complejas
*/
function normalizeSearchTextNoIntl(string $text): string {
    // 1) minúsculas
    $text = mb_strtolower($text, 'UTF-8');

    // 2) proteger apóstrofe entre letras
    $text = preg_replace('/(\p{L})\'(\p{L})/u', '$1§§§$2', $text);

    // 3) quitar puntuación / símbolos
    $text = preg_replace('/[^\p{L}\p{N}§ ]+/u', ' ', $text);

    // 4) restaurar apóstrofe
    $text = str_replace('§§§', "'", $text);

    // 5) normalizar espacios
    $text = preg_replace('/\s+/u', ' ', $text);
    $text = trim($text);

    return $text;
}


//func que se usa en debugQuery()
function reemplazarParametroSQL($value){

    if($value === null){
        return 'NULL';
    }

    if(is_numeric($value)){
        return $value;
    }

    return "'" . addslashes($value) . "'";
}



//SOLO para ver (DEBUG) la consulta con variables que se usan en bind_param()
function debugQuery($sql, $params = []) {

    foreach($params as $param){

        $sql = preg_replace( //funcion que busca '?' y reemplaza 
            '/\?/',                         // patrón regex: buscar el carácter literal '?'
            reemplazarParametroSQL($param), // valor que sustituirá el '?'. aki '?' => '425_portrait'
            $sql,                           // string SQL donde buscar los '?'. aki es la consulta que tiene los '?'
            1                               //significa: reemplazar SOLO el primer '?'
        );
    }

    return $sql;
}

function writeLog($message, $level = 'INFO') {
    //return;//test
    
    // Definir la ruta al archivo
    $log_directory = '../logs';
    
    if($_SERVER['HTTP_HOST'] == 'holy-songs.com'){//HOSTALIA
        $logFile = $log_directory . '/app_prod.log';  // Define la ruta del archivo de log en Hostalia
    }else{//LOCALHOST
        $logFile = $log_directory . '/app_local.log';  // Define la ruta del archivo de log en Localhost
    }


    // Verificar si el directorio 'logs' existe, si no, crearlo
    if (!is_dir($log_directory)) {
        mkdir($log_directory, 0777, true); // Crear el directorio con permisos 0777
    }

    // Verificar si el archivo existe
    if (!file_exists($logFile)) {
        // Crear el archivo si no existe
        file_put_contents($logFile, "Archivo de log creado el " . date('Y-m-d H:i:s') . "\n");
        //echo "Archivo creado: " . $logFile;
    } else {
        //echo "El archivo ya existe: " . $logFile;
    }

    // Obtiene el archivo desde donde se llamó a la función usando debug_backtrace()
    $backtrace = debug_backtrace();
    $callingFile = isset($backtrace[0]['file']) ? $backtrace[0]['file'] : 'desconocido';
    $callingLine = isset($backtrace[0]['line']) ? $backtrace[0]['line'] : 'desconocido';

    if($callingFile !== 'desconocido'){
        if(strpos($callingFile, '/') !== false){
            $arr_callingFile = explode('/',$callingFile);
        }else{
            $arr_callingFile = explode('\\',$callingFile);
        }
        $callingfile_short = array_slice($arr_callingFile, -1)[0]; // Obtiene el último elemento
    }else{
        $callingfile_short = $callingFile;
    }    

    $logMessage = date('Y-m-d H:i:s') . " [$level] - $message - Archivo: [$callingfile_short] línea: [$callingLine]";
    
    // Escribe el mensaje en el archivo de log
    error_log($logMessage . PHP_EOL, 3, $logFile);
}



//=====================================================================================//
// FUNCTIONS - END
//=====================================================================================//
?>