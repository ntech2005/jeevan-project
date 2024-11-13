<?php
// Database connection details
$host = 'localhost';      // Database host
$username = 'root'; // Database username
$password = ''; // Database password
$dbname = 'jeevan_project'; // Database name

// Create a connection to MySQL
$conn = new mysqli($host, $username, $password);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create the database if it doesn't exist
$sql_create_db = "CREATE DATABASE IF NOT EXISTS $dbname";
if (!$conn->query($sql_create_db)) {
    die("Error creating database: " . $conn->error);
}

// Select the database
$conn->select_db($dbname);

// Create the 'contact_us' table if it doesn't exist
$sql_create_table = "CREATE TABLE IF NOT EXISTS contact_us (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($sql_create_table)) {
    die("Error creating table: " . $conn->error);
}

// Check if the form data is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $full_name = $conn->real_escape_string($_POST['full_name']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $message = $conn->real_escape_string($_POST['message']);

    // Insert data into the 'contact_us' table
    $sql_insert = "INSERT INTO contact_us (full_name, email, phone, message)
                   VALUES ('$full_name', '$email', '$phone','$message')";

    if ($conn->query($sql_insert) === TRUE) {
        // Redirect to index.html in the root directory
        header("Location: ../index.html"); // Relative path to index.html
        exit(); // Ensure no further code is executed after redirection
    } else {
        echo "Error inserting data: " . $conn->error;
    }
}

// Close the database connection
$conn->close();
?>

