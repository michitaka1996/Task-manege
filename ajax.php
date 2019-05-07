<?php
use Oil\Exception;

// use Oil\Exception;

ini_set('log_erros', 'on');
ini_set('error_log', 'php.log');


function dbConnect(){
    $dsn = 'mysql:dbname=todo_list;host=localhost;charset=utf8';
    $user = 'root';
    $password = 'root';
    $options = array(
        // SQL実行失敗時に例外をスロー
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // デフォルトフェッチモードを連想配列形式に設定
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        // バッファードクエリを使う(一度に結果セットをすべて取得し、サーバー負荷を軽減)
        // SELECTで得た結果に対してもrowCountメソッドを使えるようにする
        PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
    );

    $dbh = new PDO($dsn, $user, $password, $options);
 
    return $dbh;
}

function queryPost($dbh, $sql, $data){
    // $dbh = dbConnect();
    $stmt = $dbh->prepare($sql);
    error_log('ここで使うsql:'.print_r($sql, true));
    error_log('ステートメント'.print_r($stmt, true));
    error_log('流し込みデータ:'.print_r($data, true));
    $rst = $stmt->execute($data);
    error_log('execute:'.print_r($rst, true));

    if(!$rst){
        error_log('クエリ失敗');
        error_log('失敗したsql'.print_r($stmt, true));
        return 0;
    }else{
        error_log('クエリ成功');
        return $stmt;
    }
}

//DBのデータをとってくる関数
function getComment(){
    error_log('DBからタスク情報を取得します');
    try{
        $dbh = dbConnect();
        $sql = 'SELECT * FROM users';
        $data = array();
        $stmt = queryPost($dbh, $sql, $data);
        $result = $stmt->fetchAll();
        if($result){
            return $result;
        }else{
            error_log('フェッチ失敗');
        }
    }catch(Exception $e){
        error_log('エラー発生:'.$e->getMessage());
    }
}


$getTaskData = getComment();
error_log('タスクデータ:'.print_r($getTaskData, true));

function taskAdd(){
    global $getTaskData;
    error_log('グローバル:'.print_r($getTaskData, true));
              
    if(!empty($getTaskData)){
        foreach ((array)$getTaskData as $key => $val) {  
             echo 
             '<li class="list-item js-todo_list" data-text=" '.$val['comment'].' ">' .
              '<form class="js-ajax js-click-done">'.
              '<i class="fa fa-square-o icon-check js-click-done" aria-hidden="true"></i>' .
              '<span class="js-todo_list-text">'.$val['comment'].'</span>' .
              '<input type="text" class="editText js-todo_list-Form" value="'.$val['comment'].'">' .
              '<button class="fa fa-trash icon-trash js-click-trash" type="submit" value="&#xf2ed;" name="delete"></button>' .
              '</form>'.
              '</li>';
         } 
    }else{
        return  0;
    }
}



if(!empty($_POST)){
    error_log('postできてます');
    error_log('post内容'.print_r($_POST, true));
    try{
        
           $dbh = dbConnect(); 
        //追加があった場合
        if(!empty($_POST['task'])){
            error_log('タスクの送信があります');
            echo json_encode(array('task'=>$_POST['task']));
            $sql = 'INSERT INTO users(comment, create_date) VALUES(:comment, :create_date)';
            $data = array(':comment' => $_POST['task'], ':create_date' => date('Y-m-d H:i:s'));
            $stmt = queryPost($dbh, $sql, $data);
        //削除があった場合
        }elseif(!empty($_POST['delete'])){
            error_log('ゴミ箱アイコンがクリックされました');
            $sql = 'SELECT user_id FROM users';
            $data = array();
            $stmt = queryPost($dbh, $sql, $data);
            $result = $stmt -> fetch(PDO::FETCH_ASSOC);
            if($result){
                error_log('フェッチ成功,その結果:'.print_r($result, true));
                $id = $result['user_id'];
                error_log('ユーザーID:'.print_r($id, true));
                $sql = 'DELETE FROM users WHERE user_id = :id ';
                $data = array(':id' => $id);
                $stmt = queryPost($dbh, $sql, $data);
                error_log('DBから削除に成功しました');
            }
        }elseif(!empty($_POST['edit'])){
            error_log('タスクの編集があります');
            $sql = 'SELECT user_id FROM users';
            $data = array();
            $stmt = queryPost($dbh, $sql, $data);
            $result = $stmt -> fetch(PDO::FETCH_ASSOC);
            if($result){
                error_log('フェッチ成功,その結果:'.print_r($result, true));
                $id = $result['user_id'];
                error_log('ユーザーID:'.print_r($id, true));
                $sql = 'UPDATE users SET comment = :comment WHERE user_id = :id';
                $data = array(':comment' => $_POST['edit'], ':id' => $id );            
                $stmt = queryPost($dbh, $sql, $data);
                error_log('タスクの編集が完了しました');
            } 
        }else{
            error_log('指定した情報は取得できませんでした');
            return 0;
        }
            
            if($stmt){
                error_log('DBの処理に成功しました');
               
            }else{
                error_log('DBの処理に失敗しました');
            }
        
    }catch(Exception $e){
        error_log('エラー発生'.$e->getMessage());
    }

}



?>
