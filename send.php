<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Honeypot-Feld aus deinem Formular
    if (!empty($_POST['bot-field'])) {
        http_response_code(400);
        die("Spamverdacht.");
    }

    $name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : "";
    $emailRaw = isset($_POST["email"]) ? trim($_POST["email"]) : "";
    $email = filter_var($emailRaw, FILTER_SANITIZE_EMAIL);
    $nachricht = isset($_POST["nachricht"]) ? trim($_POST["nachricht"]) : "";
    $privacy = isset($_POST["privacy"]) ? $_POST["privacy"] : null;

    if ($name === "" || $email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || $nachricht === "" || $privacy === null) {
        http_response_code(400);
        echo "Bitte alle Pflichtfelder korrekt ausfüllen.";
        exit;
    }

    $to = "info@in4matics.de";
    $subject = "Kontaktformular: Neue Nachricht von " . $name;

    $body =
        "Name: " . $name . "\n" .
        "E-Mail: " . $email . "\n\n" .
        "Nachricht:\n" . $nachricht . "\n";

    // Wichtig: From muss zur Domain passen, sonst wird es gern abgelehnt
    $headers = [];
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "From: in4matics Kontaktformular <no-reply@in4matics.de>";
    $headers[] = "Reply-To: " . $email;

    $ok = mail($to, $subject, $body, implode("\r\n", $headers));

    if ($ok) {
        header("Location: danke.html");
        exit;
    }

    http_response_code(500);
    $lastError = error_get_last();
    echo "Fehler beim Senden." . ($lastError && isset($lastError["message"]) ? " " . $lastError["message"] : "");
    exit;
}
?>
