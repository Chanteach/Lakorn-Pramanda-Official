<?php
$servername = "localhost";
$username = "root";
$password = ""; // รหัสผ่านของ MySQL ถ้ามี
$dbname = "Customer_Info"; // ชื่อฐานข้อมูลที่สร้าง

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ตั้งค่าการเชื่อมต่อให้รองรับ UTF-8
$conn->set_charset("utf8mb4");
?>

<?php
// เชื่อมต่อกับฐานข้อมูล
include('api/Pay.php'); // เชื่อมต่อไฟล์ที่เก็บการเชื่อมต่อฐานข้อมูล

// รับข้อมูลจากฟอร์ม
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];

// สร้างคำสั่ง SQL เพื่อเพิ่มข้อมูล
$sql = "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)";

// เตรียมคำสั่ง SQL
$stmt = $conn->prepare($sql);

// ผูกตัวแปรกับคำสั่ง SQL
$stmt->bind_param("sss", $name, $email, $phone);

// ตรวจสอบการเพิ่มข้อมูล
if ($stmt->execute()) {
    echo "ข้อมูลถูกบันทึกสำเร็จ!";
} else {
    echo "เกิดข้อผิดพลาด: " . $stmt->error;
}

// ปิดการเชื่อมต่อ
$stmt->close();
$conn->close();
?>