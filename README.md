# malla
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Malla Curricular Interactiva</title>
  <link rel="stylesheet" href="styles.css" />
  <script defer src="script.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #ffe4f0;
      margin: 0;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #d63384;
    }
    .semester {
      margin-bottom: 30px;
    }
    .semester h2 {
      color: #c2186b;
    }
    .course {
      background: #ffb6d9;
      padding: 12px;
      border-radius: 10px;
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    }
    .course button {
      background: #d63384;
      border: none;
      color: white;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 6px;
      font-size: 14px;
    }
    .course button:disabled {
      background: #f3a5c4;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <h1>Malla Curricular Interactiva</h1>

  <div id="semesters"></div>

</body>
</html>
