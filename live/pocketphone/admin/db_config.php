<?php
/*
 * Database Configuration
 *
 * PLEASE UPDATE these values with your actual database credentials.
 */

define('DB_SERVER', 'sql208.infinityfree.com');
define('DB_USERNAME', 'epiz_32135054'); // <-- IMPORTANT
define('DB_PASSWORD', 'mGnQfr1sEub'); // <-- IMPORTANT
define('DB_NAME', 'epiz_32135054_pocketphone_dbb'); // <-- IMPORTANT

// Attempt to connect to MySQL database
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if($conn === false){
    die("ERROR: Could not connect. " . $conn->connect_error);
}

// Set charset to utf8mb4 for full UTF-8 support
$conn->set_charset("utf8mb4");

?>
