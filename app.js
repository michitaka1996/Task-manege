//空でボタン押されたらエラーを表示

//追加クリックして実際にタスクを追加

//タスクをホバーですこし拡大　scal

//タスク欄
//タスクをDONEする　チェックボックスをクリックで、チェックを入れる 全体の背景色変化
//ゴミ箱を押したらふわっとさせてから削除
//クリックして、spanからinput(編集)へチェンジ





//================================
//タスク追加
// バリデーション

//追加ボタンをクリックした時
//var listItemで data-textに値を渡している
//================================
$('.js-post-todo').on('click', function (e) {
    e.preventDefault();
    var text = $('.js-get-val').val(); //取得して
    $('.js-get-val').val(''); //クリアする

    //バリデーション　空でも押される場合がある
    if (!text) {
        $('.js-toggle-error').show(); //エラーを表示
        console.log('空でした');
        return; //rf文抜ける
    }
    
    //通常はエラーメッセージは出さない
    $('.js-toggle-error').hide();

    //タスクを追加
    //ここでdata-textを書き換える
    var listItem =  '<li class="list-item js-todo_list" data-text="' + text + '">' +
                '<i class="fa fa-square-o icon-check js-click-done" aria-hidden="true"></i>' +
                '<span class="js-todo_list-text">' + text + '</span>' + 
                '<input type="text" class="editText js-todo_list-Form" value="' + text + '">' + 
                 
                '<i class="fa fa-trash icon-trash js-click-trash" aria-hidden="true"></i>' +
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
    console.log(('doneについて'));
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
$(document).on('click', '.js-click-trash', function () {
    $(this).closest('.js-todo_list').fadeOut('slow', function () {
        this.remove(); //このthisは.js-todo_list
    });
});




//================================
//タスクの編集

//spanのタイトルのボタンをクリックした時
//sift + enterで確定

//どうやって反映させるか?
//data属性でscriptの情報とを交換するdata()でjs上で書き換えてから
//data-textを書き換えてから、attrでDOMに対して操作(反映)
//================================
$(document).on('click', '.js-todo_list-text', function () {
    $(this).hide().siblings('.js-todo_list-Form').show();
});
$(document).on('click', '.js-todo_list-text', function (e) {
   console.log(e);
    
});

//shift + enterの設定
$(document).on('keyup', '.js-todo_list-Form', function (e) {
        console.log('じじ');
    if(e.keyCode === 13 && e.shiftKey === true) {
        console.log('unti');
        //書き換えてshowするinputを非表示にしてspanに反映
        //２回以上使うのでキャッシュ
        var $this = $(this); 
        $this.hide().siblings('.js-todo_list-text').text($this.val()).show()
             .closest('.js-todo_list').attr('data-text', $this.val());
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
            console.log('マッチしてます');
            return true;
        } else {
            console.log('マッチしてません');
        }
        $(elm).hide();
    });
});