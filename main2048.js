var top = 240;
var score = 0;
var board = new Array();
var added = new Array();
$(document).ready(function(e){
    newgame();
})

function newgame(){
    //初始化棋盘
    init();
    gNum();
    gNum();
}

function init(){
    score = 0;
    document.getElementById("score").innerHTML = score;
    $("#gameover").css('display','none');
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridcell = $("#grid-cell-"+i+"-"+j);
            gridcell.css("left",getPosLeft(i,j));
            gridcell.css("top",getPosTop(i,j))

        }
    }

    for(var i=0;i<4;i++){
        board[i] = new Array();
        for(var j=0;j<4;j++){
            board[i][j] = 0;
        }
    }
    for(var i = 0; i<4;i++){//初始化判定合并的数组
        added[i] = new Array();
        for(var j = 0;j<4;j++){
            added[i][j] = 0;
        }
    }
    view();
}

function view(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('hegiht','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                //NumberCell覆盖
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));//返回背景色
                theNumberCell.css('color',getNumberFrontColor(board[i][j]));//返回前景色
                theNumberCell.text(board[i][j]);
            }
        }
    }

}
function gNum(){
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy]==0)
            break;
            var randx = parseInt(Math.floor(Math.random()*4));
            var randy = parseInt(Math.floor(Math.random()*4));
    }
    var ranNum = Math.random()<0.5?2:4;
    board[randx][randy] = ranNum;
    showNumberWithAnimation(randx,randy,ranNum);
    return true;
}
function addedArray(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            added[i][j]=0;
        }
    }
}
//move
function couldleft(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j] != 0 && j != 0)
                if(board[i][j-1] == board[i][j] || board[i][j-1] == 0)
                    return true;
        }
    }
    return false;
}
function couldright(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0&&j!=3)
                if(board[i][j+1]==board[i][j]||board[i][j+1]==0)
                    return true;
        }
    }
    return false;
}
function couldup(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0&&i!=0)
                if(board[i][j]==board[i-1][j]||board[i-1][j]==0)
                    return true;
        }
    }
    return false;
}
function coulddown(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0&&i!=3)
                if(board[i][j]==board[i+1][j]||board[i+1][j]==0)
                    return true;
        }
    }
    return false;
}

function moveleft(){
    if( !couldleft(board))
        return false;   
    addedArray();
    for(var i = 0;i<4;i++)
        for(var j = 1;j<4;j++){
            if(board[i][j] !=0){
                for(var k = 0;k<j;k++){
                    //落脚点的是否为空 && 中间没有阻隔
                    if(board[i][k] == 0 && noBlockHang(i , k, j, board)){
                        //move  
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //数字相等 中间没有阻隔
                    else if(board[i][k] == board[i][j] && noBlockHang(i , k, j, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        if(added[i][k]!=0){//落脚点是否完成过合并
                        		board[i][k+1] = board[i][j];
                        		board[i][j] = 0;
                        }
                        else{
                        	board[i][k] += board[i][j];
                        	board[i][j] = 0;
                        	added[i][k] = 1;
                        	score += board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("view()",200);
    return true;
}

function moveright(){
    if(!couldright(board))
        return false;
    
    addedArray();
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k] == 0 && noBlockHang(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }

                    else if(board[i][k] == board[i][j] && noBlockHang(i,j,k,board)){
                        showMoveAnimation(i,j,i,k)

                        if(added[i][k]!=0){
                            board[i][k-1] = board[i][j];
                            board[i][j] = 0;
                        }
                        else{
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score += board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("view()",200);
    return true;
    
}

function moveup(){
    if(!couldup(board))
        return false;
    addedArray();
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j] == 0 && noBlockLie(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockLie(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        if(added[k][j]!=0){
                            board[k+1][j] = board[i][j];
                            board[i][j] = 0;
                        }
                        else{
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            added[k][j] = 1;
                            score += board[k][j];
                        }
                        continue
                    }
                }
            }
        }
    }
    setTimeout("view()",200);
    return true;
}

function movedown(){
    if(!coulddown(board))
        return false;
    addedArray();
    for(var i=2;i>=0;i--){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j] == 0 && noBlockLie(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockLie(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        if(added[k][j]!=0){
                            board[k-1][j] = board[i][j];
                            board[i][j] = 0;
                        }
                        else{
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            added[k][j] = 1;
                            score += board[k][j];
                        }
                        continue
                    }
                }
            }
        }
    }
    setTimeout("view()",200);
    return true;    
}


$(document).keydown(function(event){
    switch (event.keyCode) {
        case 37:
            if(moveleft()){
                geiscore();
                gNum();
                setTimeout("isOver()",300);
            }
            break;
        case 38:
            if(moveup()){
                geiscore();
                gNum();
                setTimeout("isOver()",300);
            }
            break;
        case 39:
            if(moveright()){
                geiscore();
                gNum();
                setTimeout("isOver()",300);
            }
            break;
        case 40:
            if(movedown()){
                geiscore();
                gNum();
                setTimeout("isOver()",300);
            }
            break;
    }
});

function geiscore(){
    document.getElementById("score").innerHTML = score;
}
function isOver(){
    if(nospace(board)&&nomove(board))//
        gameover();

}
function gameover(){
    $("#gameover").css('display','block');
}
function nospace(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0)
                return false;
        }
    }
    return true;
}
function nomove(board){
    //
    if(coulddown(board)|| couldleft(board)||couldright(board)||couldup(board))
        return false;
    return true;
}
function getPosTop(i, j) {
    return 20 + i * 120;
}
 
function getPosLeft(i, j) {
    return 20 + j * 120;
}
function noBlockHang(row,col1,col2,board){
    for(var i=col1+1;i<col2;i++){
        if(board[row][i]!=0)
            return false;
    }
    return true;
}
function noBlockLie(col,row1,row2,board){
    for(var i=row1+1;i<row2;i++){
        if(board[col][i]!=0)
            return false;
    }
    return true;
}
function showNumberWithAnimation(i, j, randNumber) {//实现随机数字的样式变动
 
    var numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
    numberCell.css("color", getNumberFrontColor(board[i][j]));
    numberCell.text(randNumber);
    
    numberCell.animate({
        width : "100px",
        height : "100px",
        top : getPosTop(i, j),
        left : getPosLeft(i, j)
    }, 50);
}
function showMoveAnimation(fromx, fromy, tox, toy){//实现移动格子的样式变动
    
    var numberCell = $('#number-cell-'+fromx +'-'+fromy);
    numberCell.animate({top:getPosTop(tox,toy),
    left:getPosLeft(tox,toy)},200);

    }
    //方块颜色
    function getNumberBackgroundColor(number) {
        switch (number) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#eee4da";
            break;
        case 8:
            return "#f26179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e36";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#3365a5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6bc";
            break;
        case 8192:
            return "#93c";
            break;
        }
        return "black";
    }
    function getNumberFrontColor(number){
        if(number<=4){
            return "#776e65";
        }
        
            return "white";
        
    }