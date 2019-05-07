<!-- 画面遷移せずにDBにinsert delete　update -->

<?php
require('ajax.php');


?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="reset.css">
    <link rel="stylesheet" href="style.css">
    <script src="https://use.fontawesome.com/e3ae05b8e6.js"></script>
    <title>タスク管理</title>
</head>
<body>
    <header class="header">
        <h1 class="title">タスク管理</h1>
    </header>
    <main class="main">
        <form class="form js-ajax-post">
            <input class="input-contents js-get-val" name="task" value="" type="text" placeholder="内容を書いてみて" autocomplete="off">
            <span class="error js-toggle-error">入力内容が空です</span>
            <!-- inputタグでsubmitする -->
            <input type="submit" class="btn js-post-todo" value="TODOを追加">
        </form>

        <!-- 検索 -->
        <div class="search">
            <li class="fa fa-search search-icon" aria-hidden="true"></li>
            <input class="input-search js-search" type="text" value="" placeholder="検索したいワードを入力して!">
        </div>

        <!-- タスク -->
        <ul class="list js-todo">

            <?php taskAdd(); ?>

            <li class="list-item js-todo_list" data-text="サンプルTODOタスク">
                <i class="fa fa-square-o icon-check js-click-done"  aria-hidden="true"></i>
                <span class="js-todo_list-text">サンプルTODOタスク</span>
                <form method="post" class="form-edit js-ajax">
                    <input type="text" class="editText js-todo_list-Form" value="サンプルTODOタスク">
                    <button class="fa fa-trash icon-trash js-click-trash" type="submit" name="delete" value="削除!"></button>
                </form>
            </li>

            <li class="list-item js-todo_list" data-text="サンプルDONEタスク">
                <i class="fa fa-square-o icon-check js-click-done"  aria-hidden="true"></i>
                <span class="js-todo_list-text">サンプルDONEタスク</span>
                <form method="post" class="js-ajax">
                     <input type="text" class="editText js-todo_list-Form" value="サンプルDONEタスク">
                    <button class="fa fa-trash icon-trash js-click-trash" type="submit" name="delete" value="削除!"></button>
                </form>
            </li>

        </ul>

    </main>

   <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
   <script src="app.js"></script>
</body>
</html>