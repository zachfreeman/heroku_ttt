var winner = null
var tie = null

function changeBase(elementID){
    if(winner){
        window.alert("There is already a winner!");
        isPlayAgain()
        return;
    }
    else if(tie){
        window.alert("It's a tie!");
        isPlayAgain()
        return;
    }
    if (isSquareUsed(elementID)){
        window.alert("This square has already been taken!");
        return;
    }
    var letter = detLetter();
    document.getElementById(elementID).style.color = 'black';
    document.getElementById(elementID).innerHTML = letter;
    var answer = isWon(letter);
    if(answer[0]){
        for(var i=1;i<4;i++){
//            document.getElementById(answer[i]).style.fontWeight = 'bold';
            document.getElementById(answer[i]).style.backgroundColor = 'red';
        }
        winner = letter;
        window.alert(letter + " has won the game!");
        var numWins = parseInt(localStorage.getItem(winner));
        if(isNaN(numWins)){
            numWins = 1
        }
        numWins = numWins + 1;
        localStorage.setItem(winner,numWins);
        document.getElementById("X_WIN").innerHTML = numWins;
        isPlayAgain();
    }
    else{
        if(countLetter("X") + countLetter("O") == 9){
            tie = true;
            window.alert("It's a tie!");
            isPlayAgain()
        }
    }
}

//determine if a move has already been made
function isSquareUsed(squareID){
    if(document.getElementById(squareID).innerHTML == "X" || document.getElementById(squareID).innerHTML == "O"){
        return true;
    }
    else{
        return false;
    }
}

//count the "X" or "O" values
function countLetter(letter){
    var letterCount = 0
    var posList = Array("TR","TL","TC","MR","ML","MC","BR","BL","BC")
    for (var i = 0; i < 9; i++){
        if(document.getElementById(posList[i]).innerHTML == letter){
            letterCount += 1
        }
    }
    return letterCount;
}

//determine if the
function detLetter(){
    if (countLetter("X") > countLetter("O")){
        return "O"
    }
    else{
        return "X"
    }
}

function isWinningSet(elementID1,elementID2,elementID3,letter){
    if( document.getElementById(elementID1).innerHTML == letter &&
        document.getElementById(elementID2).innerHTML == letter &&
        document.getElementById(elementID3).innerHTML == letter
        ){
        return Array(true,elementID1,elementID2,elementID3)
    }
    else{
        return Array(false)
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
            return Array(true,winningCheckList[i][0],winningCheckList[i][1],winningCheckList[i][2])
        }
    }
    return Array(false)
}

function loadClickers(){
    function setClicker(elementID){
        document.getElementById(elementID).onclick = function(){changeBase(elementID);}
    }
    var posList = Array("TR","TL","TC","MR","ML","MC","BR","BL","BC")
    for (var i = 0; i < 9; i++){
        setClicker(posList[i])
    }
}

function resetClickers(){
    function resetClicker(elementID){
        document.getElementById(elementID).style.color = 'white';
        document.getElementById(elementID).innerHTML = elementID;
        document.getElementById(elementID).style.fontWeight = 'normal';
        document.getElementById(elementID).style.backgroundColor = 'white';
    }
    var posList = Array("TR","TL","TC","MR","ML","MC","BR","BL","BC")
    for (var i = 0; i < 9; i++){
        resetClicker(posList[i]);
    }
}

function isPlayAgain(){
    var answer = window.confirm("Play again?");
    if(answer){
        resetClickers()
        winner = null
        tie = null
    }
}

loadClickers();