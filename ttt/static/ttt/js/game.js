//ADDITIONAL IDEAS - SERVER SIDE LOGIC - FOR TOTAL WINS RECORDED, BY X VS O, ETC., BY GEOGRAPHY

//At beginning of page load, bind squares to userMove functions
function loadClickers(posList){
    function setClicker(elementID){
        document.getElementById(elementID).onclick = function(){userMove(elementID);}
    }
    for (var i = 0; i < posList.length; i++){
        setClicker(posList[i]);
    }
}

//RELATED TO PLAYER MOVES
function computerMove() {
    var cornerList = ['TR','TL','BL','BR'];
    //alert('Computer thoughts:\nDo I have the first move?');
    if(movesMade.length==0) {
        //randomly pick a corner
        var ans = cornerList[Math.floor(Math.random()*5)];
        //alert('move '+ans+' is the one!');
        userMove(ans);
        return;
    }
    //alert('Computer thoughts:\nCan I win with the next move?');
    ans = findWinningMove(playerMove);
    if(ans[0]) {
        //alert('move '+ans[1]+' is the one!');
        userMove(ans[1]);
        return;
    }
    //alert('Computer thoughts:\nCan the opponent win with the next move?');
    ans = findWinningMove(otherPlayer(playerMove));
    if(ans[0]) {
        //alert('move '+ans[1]+' is the one!');
        userMove(ans[1]);
        return;
    }
    //alert('Computer thoughts:\nIs the center free?');
    if(!(isSquareUsed('MC'))) {
        //alert('move MC is the one!');
        userMove('MC');
        return;
    }
    //alert('Computer thoughts:\nIs there a corner free?');
    for(var i=0;i<4;i++) {
        var goHere = !(isSquareUsed(cornerList[i]));
        if(goHere) {
            //alert('showme');
            //alert('move ' + cornerList[i] + ' is the one!');
            userMove(cornerList[i]);
            return;
        }
    }
    //alert('Computer thoughts:\nTake whatever is left.');
    //alert('move ' + movesRemain[0] + ' is the one!');
    userMove(movesRemain[0]);
}


function otherPlayer(player) {
    if(player=="X") {
        return "O";
    }
    else {
        return "X";
    }
}

//set up a shadow board drives the win/hint/computer logic, in parallel with the viewable board
function createShadowBoard() {
    var shadowBoardArray = {};
    for (var i = 0; i < posList.length; i++){
        shadowBoardArray[posList[i]] = "";
    }
    return shadowBoardArray;
}

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
    else if (elementID && isSquareUsed(elementID)){
        window.alert("This square has already been taken!");
        return true;
    }
}

//update the square once a move has been made
function updateVisibleSquare(elementID) {
    document.getElementById(elementID).style.color = 'black';
    document.getElementById(elementID).innerHTML = playerMove;
}

function updateShadowLogic(elementID) {
    movesMade.push(elementID);
    movesRemain.splice(movesRemain.indexOf(elementID),1);
    shadowBoardArray[elementID] = playerMove;
}

//control the actions on user move
function userMove(elementID){
    //Logic to determine whether or not move is executed
    if(moveExit(elementID)){
        return;
    }
    //update square to reflect move
    updateVisibleSquare(elementID);
    updateShadowLogic(elementID);
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
    playerMove = otherPlayer(playerMove);

    //update innerhtml for hover affect
    resetClickers(playerMove);

    //
    if(computer && !(winner || tie)) {
        alert('entering');
        if(CvH && playerMove=="X") {
            computerMove();
        }
        else if(!CvH && playerMove=="O") {
            computerMove();
        }
    }
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
    if( shadowBoardArray[elementID1] == player &&
        shadowBoardArray[elementID2] == player &&
        shadowBoardArray[elementID3] == player
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
        shadowBoardArray = createShadowBoard();
        if(CvH) {
            computerMove();
        }
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
//a middle move
//a side-middle move
var findWinningMove = function(player) {
    //alert('entering findWinningMove');
    for(var i=0;i<movesRemain.length;i++) {
        shadowBoardArray[movesRemain[i]] = player;
        var ans = isWon(player,movesRemain[i]);
        //alert('checking move ' + movesRemain[i] +':' + ans);
        shadowBoardArray[movesRemain[i]] = '';
        if(ans[0]) {
            return [true,movesRemain[i]];
        }
    }
    return [false];
}

//declare global variables
var winner = null;
var tie = null;
var movesMade = [];
var movesRemain = ["TR","TL","TC","MR","ML","MC","BR","BL","BC"];
var playerMove = 'X';
var posList = ["TR","TL","TC","MR","ML","MC","BR","BL","BC"];
var computer = true;
var CvH = false;
    //setting up winning lists to check
    //for each value of posList, winAssocArray contains an n-tuple of 3-move tuples, which are the possible winners
        //after playing postList in a game

var winAssocArray = createWinAssocArray();
var shadowBoardArray = createShadowBoard();

//Setting up reset button
document.getElementById("PlayAgainButton").onclick = isPlayAgain;

fillScoreboard();
loadClickers(posList);

//TO DO
//CONTINUE WORK ON findWinningMove so that it returns the move the computer should make, or to get a hint
//CREATE BUTTONS FOR HvH, CvH, and HvC
//CREATE BUTTON FOR hint