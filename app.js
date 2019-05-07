//空でボタン押されたらエラーを表示

//追加クリックして実際にタスクを追加

//タスクをホバーですこし拡大　scal

//タスク欄
//タスクをDONEする　チェックボックスをクリックで、チェックを入れる 全体の背景色変化
//ゴミ箱を押したらふわっとさせてから削除
//クリックして、spanからinput(編集)へチェンジ



$(function () {

//================================
//タスク追加
// バリデーション

//追加ボタンをクリックした時
//var listItemで data-textに値を渡している
//================================
// $('.js-post-todo').on('click', function () {
//     // e.preventDefault();
//     var text = $('.js-get-val').val(); //取得して
//     $('.js-get-val').val(''); //フォームの値をクリアする

//     //バリデーション　空でも押される場合がある
//     if (!text) {
//         $('.js-toggle-error').show(); //エラーを表示
//         console.log('空でした');
//         return; //rf文抜ける
//     }
    
//     //通常はエラーメッセージは出さない
//     $('.js-toggle-error').hide();

//     //タスクを追加
//     //ここでdata-textを書き換える
//     var listItem =  '<li class="list-item js-todo_list" data-text="' + text + '">' +
//                 '<i class="fa fa-square-o icon-check js-click-done" aria-hidden="true"></i>' +
//                 '<span class="js-todo_list-text">' + text + '</span>' + 
//                 '<input type="text" class="editText js-todo_list-Form" value="' + text + '">' + 
                 
//                 '<i class="fa fa-trash icon-trash js-click-trash" aria-hidden="true"></i>' +
//                  '</li>';
             
//     $('.js-todo').prepend(listItem);
// });

    

$('.js-ajax-post').on('submit', function (e) {
        e.preventDefault(); //送信を止める
        var text = $('.js-get-val').val(); //取得して
        //バリデーション　空でも押される場合がある
        if (!text) {
            $('.js-toggle-error').show(); //エラーを表示
            console.log('空でした');
            return; 
        }
        //通常はエラーメッセージは出さない
        $('.js-toggle-error').hide();
        // キャスト
        // var $that = $(this);
        $.ajax({
            type: 'post',
            url: 'ajax.php',
            dataType: 'json',
            data: {
                task: $('.js-get-val').val()
            }
        }).then(function (data, status) {
            console.log(data);
            console.log(status);
        });
        console.log('タスク追加します');
        //ajaxが終わったのでフォームの内容をクリアさせる
        $('.js-get-val').val(''); 

    

    //  タスクを追加
    //     ここでdata-textを書き換える

    
    var listItem =  '<li class="list-item js-todo_list" data-text="' + text + '">' +
                    '<form class="js-ajax js-click-done">' +
                    '<i class="fa fa-square-o icon-check js-click-done" aria-hidden="true"></i>' +
                    '<span class="js-todo_list-text">' + text + '</span>' + 
                    '<input type="text" class="editText js-todo_list-Form" value="' + text + '">' + 
                    '<button class="fa fa-trash icon-trash js-click-trash" type="submit" value="&#xf2ed;" name="delete"></button>' +
                    '</form>' + 
                    '</li>';
                    
       $('.js-todo').prepend(listItem);
        
    });


    



//================================
// タスクをDONEする->外す
//
//注意:新たにDOMが追加されたときは$('.js-click-done')ではイベントセットができない
//documentオブジェクトに対してイベントセットすること
//================================
//doneに
$(document).on('click', '.js-click-done', function () {
        // var $this = $('.js-click-done');
        // $('.fa-square-o').css('display','none');
        $(this).removeClass('fa-square-o').addClass('fa-check-square-o')
        .removeClass('js-click-done').addClass('js-click-todo')
        .closest('.js-todo_list').addClass('js-done_list'); //背景色
});
//外す
$(document).on('click', '.js-click-todo', function () {
        $(this).removeClass('fa-check-square-o').addClass('fa-square-o')
        .removeClass('js-click-todo').addClass('js-click-done')
        .closest('.js-done_list').removeClass('js-done_list').addClass('js-off_list')
});



//================================
//タスクの削除

//ゴミ箱アイコンをクリックした時
//================================
    $(document).on('click', '.js-click-trash', function (e) {
        e.preventDefault();
        console.log('ゴミ箱アイコンがクリックされました');
        $(this).closest('.js-todo_list').fadeOut('slow', function () {
        this.remove(); //このthisは.js-todo_list
        
         $.ajax({
                type: 'post',
                url: 'ajax.php',
                data: {
                    delete: $('.js-click-trash').val()
                }
            }).then(function (data, status) {
               console.log(data);
               console.log(status);
               console.log('タスク削除します');
            });    
    });
});



//================================
//タスクの編集

//spanのタイトルのボタンをクリックした時
//sift + enterで確定

//どうやって反映させるか? -> カスタムデータ
//data属性でscriptの情報とを交換するdata()でjs上で書き換えてから
//data-textを書き換えてから、attrでDOMに対して操作(反映)
//================================
$(document).on('click', '.js-todo_list-text', function (e) {
    e.preventDefault();
    $(this).hide().siblings('.js-todo_list-Form').show();
  
});

    

//shift + enterの設定
//shift + enterを押すと、クラスでスタイル追加
$(document).on('keyup', '.js-todo_list-Form', function (e) {
     console.log('タスク編集します');
    if (e.keyCode === 16) {
        // e.keyCode === 13 && e.shiftKey === true
        console.log('shiftが押されました');
        //書き換えてshowするinputを非表示にしてspanに反映
        //２回以上使うのでキャッシュ
        var $this = $(this); 
        $this.hide().siblings('.js-todo_list-text').text($this.val()).show()
             .closest('.js-todo_list').attr('data-text', $this.val());
        console.log('HTMLを書き換えました');

        $.ajax({
        type: 'post',
        url: 'ajax.php',
        data: {
            edit: $(this).val()
        }
        }).then(function (data, status) {
            console.log(data);
            console.log(status);
        });

    }
    
});



//================================
//タスクの検索

//list-itemにdata属性で値を受け渡したが、
//そのすべてのlist-itemをループしdata属性を開封する
  //開封はi(番号), elm(要素の内容<li>~)
//検索のvalと一致するものだけ表示(正規表現オブジェクト)　一致しないものは非表示
//================================
$('.js-search').on('keyup', function () {
    //検索バーのDOMを取得
    var searchText = $(this).val();
    console.log('入力したやつ', searchText);
    
    //見つかるまでfunctionをループ
    //表示させたいのでshow();
    $('.js-todo_list').show().each(function (i, elm) {
        //data属性textの値を取得
        var text = $(elm).data('text');
        console.log('テキスト', text);
        //正規表現オブジェクト
        var regexp = new RegExp('^' + searchText);
        console.log(regexp);
        if( text && text.match(regexp) ) {
            console.log('タスクにマッチしてます');
            return true;
        } else {
            console.log('タスクにマッチしてません');
        }
        $(elm).hide();
    });
});


    //================================
    //Ajax処理

    //insert delete update
    //================================
    
    
    



    


});

