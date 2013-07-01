//ADDITIONAL IDEAS - SERVER SIDE LOGIC - FOR TOTAL WINS RECORDED, BY X VS O, ETC., BY GEOGRAPHY

//At beginning of page load, bind squares to userMove functions
function loadClickers(posList){
    function setClicker(elementID){
        document.getElementById(elementID).onclick = function(){userMove(elementID);}
    }
    for (var i = 0; i < 9; i++){
        setClicker(posList[i]);
    }
}

//RELATED TO PLAYER MOVES

//determine if a move has already been made in that square
function isSquareUsed(squareID){
    if(movesMade.indexOf(squareID) > -1){
        return true;
    }
    else{
        return false;
    }
}

//determine if a move can be mode (win, tie, already moved in that square)
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

//update the square once a move has been made
function updateSquare(elementID) {
    document.getElementById(elementID).style.color = 'black';
    document.getElementById(elementID).innerHTML = playerMove;
    movesMade.push(elementID);
    movesRemain.splice(movesRemain.indexOf(elementID),1);
}

//control the actions on user move
function userMove(elementID){
    //Logic to determine whether or not move is executed
    if(moveExit(elementID)){
        return;
    }
    //update square to reflect move
    updateSquare(elementID);
    //determine if player has won or there is a tie
    var answer = isWon(playerMove,elementID);
    if(answer[0]){
        for(var i=1;i<4;i++){
            document.getElementById(answer[i]).style.backgroundColor = 'red';
        }
        winner = playerMove;
        window.alert(playerMove + " has won the game!");
        updateScoreboard();
    }
    else{
        if(movesMade.length == posList.length){
            tie = true;
            window.alert("It's a tie!");
            winner = "T";
            updateScoreboard();
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
    findWinningMove();
}

//RELATED TO DETERMINING IF THERE IS A WINNER
function createWinAssocArray() {

    var winningCheckList = [["TR","TL","TC"],
                              ["MR","ML","MC"],
                              ["BR","BL","BC"],
                              ["TL","ML","BL"],
                              ["TR","MR","BR"],
                              ["TC","MC","BC"],
                              ["TL","MC","BR"],
                              ["TR","MC","BL"]
                            ]

    function getWinnerCombos(elementID,checkList) {
        var winArray = [];
        for(var i=0;i<checkList.length;i++) {
            if(checkList[i].indexOf(elementID) > -1) {
                winArray.push(checkList[i]);
            }
        }
        return winArray;
    }

    function setWinnerCombos(elementID,winArray,checkList){
        winArray[elementID] = getWinnerCombos(elementID,checkList);
    }

    var winAssocArray = {};
    for (var i = 0; i < posList.length; i++){
        setWinnerCombos(posList[i],winAssocArray,winningCheckList);
        //alert(winAssocArray[posList[i]].join('\n'));
    }

    return winAssocArray;
}

//determines whether or not a given set of 3 squares on the board is a winner for a certain player
function isWinningSet(elementID1,elementID2,elementID3,player){
    if( document.getElementById(elementID1).innerHTML == player &&
        document.getElementById(elementID2).innerHTML == player &&
        document.getElementById(elementID3).innerHTML == player &&
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

//determines whether or not a given player has won
function isWon(player,elementID){
    //winning check list associative array
    //for each potential move, list the combinations that need to be checked - this will facilitate computer movement
    for (var i = 0; i < winAssocArray[elementID].length; i++){
        var answer = isWinningSet(winAssocArray[elementID][i][0],
                        winAssocArray[elementID][i][1],
                        winAssocArray[elementID][i][2],
                        player)
        if(answer[0]){
            return [true,winAssocArray[elementID][i][0],winAssocArray[elementID][i][1],winAssocArray[elementID][i][2]];
        }
    }
    return [false];
}

//RESET THE BOARD
//used for setting up the hover effect, and for resetting the board for a new game
function resetClickers(letter,userBtnPress){
    function resetClicker(elementID){
        document.getElementById(elementID).innerHTML = letter;
        //if reset clicker is called without a winner/tie or a user call, this call is just meant to reset the html
            //for the hover functionality
        if(winner || tie || userBtnPress){
            document.getElementById(elementID).style.color = 'white';
            document.getElementById(elementID).style.backgroundColor = 'white';
        }
    }
    for (var i = 0; i < movesRemain.length; i++){
        resetClicker(movesRemain[i]);
    }
}

//the trigger from the button for a human v human game
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

//SCOREBOARD RELATED

//Setting up reset scoreboard button functionality
document.getElementById("ResetButton").onclick = function(){
    var letList = ["X","O","T"];
    for (var i=0; i<3; i++){
        localStorage.setItem(letList[i],0);
        document.getElementById(letList[i]+"_WIN").innerHTML = letList[i]+": "+0;
    }
}

// After game, update scoreboard
function updateScoreboard() {
    var numWins = parseInt(localStorage.getItem(winner))
    if(isNaN(numWins)){
        numWins = 1;
    }
    numWins = numWins + 1;
    localStorage.setItem(winner,numWins);
    document.getElementById(winner+"_WIN").innerHTML = winner+": "+numWins;
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

//RELATED TO COMPUTER OPPONENT
//computer algorithm
//a winning move from the remaining move set on the board
    //iterate through the remaining moves array
    //for each remaining move, swap the
//a move preventing a win for the other player
//a corner move
var findWinningMove = function() {
    for(var i=0;i<movesRemain.length;i++) {
        movesMade.push(movesRemain[i]);
        var ans = isWon(playerMove,movesRemain[i]);
        alert('checking move ' + movesRemain[i] +':' + ans);
        movesMade.pop();
        if(ans[0]) {
            alert('move '+movesRemain[i]+' is the one!');
            return;
        }
    }
}


//declare global variables
var winner = null;
var tie = null;
var movesMade = [];
var movesRemain = ["TR","TL","TC","MR","ML","MC","BR","BL","BC"];
var playerMove = 'X';
var posList = ["TR","TL","TC","MR","ML","MC","BR","BL","BC"];
    //setting up winning lists to check
    //for each value of posList, winAssocArray contains an n-tuple of 3-move tuples, which are the possible winners
        //after playing postList in a game
var winAssocArray = createWinAssocArray();

//Setting up reset button
document.getElementById("PlayAgainButton").onclick = isPlayAgain;

fillScoreboard();
loadClickers(posList);

//TO DO
//CONTINUE WORK ON findWinningMove so that it returns the move the computer should make, or to get a hint