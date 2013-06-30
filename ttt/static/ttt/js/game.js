function moveExit(elementID) {
    if(winner){
        window.alert("There is already a winner!");
        return true;
    }
    else if(tie){
        window.alert("It's a tie!");
        return true;
    }
    else if (isSquareUsed(elementID)){
        window.alert("This square has already been taken!");
        return true;
    }
}

function userMove(elementID){
    //Logic to determine whether or not move is executed
    if(moveExit(elementID)){
        return;
    }
    //update square to reflect move
    document.getElementById(elementID).style.color = 'black';
    document.getElementById(elementID).innerHTML = playerMove;
    movesMade.push(elementID);
    movesRemain.splice(movesRemain.indexOf(elementID),1);
    //determine if player has won or there is a tie
    var answer = isWon(playerMove);
    if(answer[0]){
        for(var i=1;i<4;i++){
            document.getElementById(answer[i]).style.backgroundColor = 'red';
        }
        winner = playerMove;
        window.alert(playerMove + " has won the game!");
        var numWins = parseInt(localStorage.getItem(winner))
        if(isNaN(numWins)){
            numWins = 1;
        }
        numWins = numWins + 1;
        localStorage.setItem(winner,numWins);
        document.getElementById(winner+"_WIN").innerHTML = winner+": "+numWins;
    }
    else{
        if(movesMade.length == 9){
            tie = true;
            window.alert("It's a tie!");
            winner = "T";
            numWins = parseInt(localStorage.getItem(winner));
            if(isNaN(numWins)){
                numWins = 1
            }
            numWins = numWins + 1;
            localStorage.setItem(winner,numWins);
            document.getElementById(winner+"_WIN").innerHTML = winner + ": "+numWins;
        }
    }
    //switch player move
    if(playerMove=="X") {
        playerMove="O";
    }
    else {
        playerMove="X";
    }
    //update innerhtml for hover affect
    resetClickers(playerMove);
}

//determine if a move has already been made
function isSquareUsed(squareID){
    if(movesMade.indexOf(squareID) > -1){
        return true;
    }
    else{
        return false;
    }
}

function isWinningSet(elementID1,elementID2,elementID3,letter){
    if( document.getElementById(elementID1).innerHTML == letter &&
        document.getElementById(elementID2).innerHTML == letter &&
        document.getElementById(elementID3).innerHTML == letter &&
        movesMade.indexOf(elementID1) > -1 &&
        movesMade.indexOf(elementID2) > -1 &&
        movesMade.indexOf(elementID3) > -1
            ){
        return [true,elementID1,elementID2,elementID3];
    }
    else{
        return [false];
    }
}

function isWon(letter){
    var winningCheckList = Array(Array("TR","TL","TC"),
                              Array("MR","ML","MC"),
                              Array("BR","BL","BC"),
                              Array("TL","ML","BL"),
                              Array("TR","MR","BR"),
                              Array("TC","MC","BC"),
                              Array("TL","MC","BR"),
                              Array("TR","MC","BL"))
    for (var i = 0; i < 8; i++){
        var answer = isWinningSet(winningCheckList[i][0],
                        winningCheckList[i][1],
                        winningCheckList[i][2],
                        letter)
        if(answer[0]){
            return [true,winningCheckList[i][0],winningCheckList[i][1],winningCheckList[i][2]];
        }
    }
    return [false];
}

function loadClickers(){
    function setClicker(elementID){
        document.getElementById(elementID).onclick = function(){userMove(elementID);}
    }
    for (var i = 0; i < 9; i++){
        setClicker(posList[i])
    }
}

function resetClickers(letter,userBtnPress){
    function resetClicker(elementID){
        document.getElementById(elementID).innerHTML = letter;
        if(winner || tie || userBtnPress){
            document.getElementById(elementID).style.color = 'white';
            document.getElementById(elementID).style.backgroundColor = 'white';
        }
    }
    for (var i = 0; i < movesRemain.length; i++){
        resetClicker(movesRemain[i]);
    }
}

function isPlayAgain(){
    var answer = window.confirm("Play again?");
    if(answer){
        movesRemain = ["TR","TL","TC","MR","ML","MC","BR","BL","BC"];
        resetClickers("X",answer);
        winner = null;
        tie = null;
        //reset movesMade array for next game
        movesMade = [];
        playerMove = "X";
    }
}

//Setting up reset scoreboard button functionality
document.getElementById("ResetButton").onclick = function(){
    var letList = ["X","O","T"];
    for (var i=0; i<3; i++){
        localStorage.setItem(letList[i],0);
        document.getElementById(letList[i]+"_WIN").innerHTML = letList[i]+": "+0;
    }
}

//Filling scoreboard upon start
function fillScoreboard(){
    var letList = Array("X","O","T")
    for (var i=0; i<3; i++){
        var numWins = parseInt(localStorage.getItem(letList[i]))
        if(isNaN(numWins)){
            numWins = 0
        }
        document.getElementById(letList[i]+"_WIN").innerHTML = letList[i]+": "+numWins;
    }
}

//declare global variables
var winner = null;
var tie = null;
var movesMade = [];
var movesRemain = ["TR","TL","TC","MR","ML","MC","BR","BL","BC"];
var playerMove = 'X';
var posList = ["TR","TL","TC","MR","ML","MC","BR","BL","BC"];

//Setting up reset button
document.getElementById("PlayAgainButton").onclick = isPlayAgain

fillScoreboard();
loadClickers();