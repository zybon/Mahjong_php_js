var timeoutId;
var isGameStarted;  
var clickCounter; 
var timeInSec;   
var undoStack;   
var undoCounter;  
var selectedTiles;
var moveAbleTiles;
var moveableTilesWithPairsCounter;
var moveableTilesWithPairsClassNames;
var hintedTilesPair;

window.onload = function(){startGame();};

function startGame() {
    document.getElementById("menuButton").disabled = true;
    resetDatas();
//    if (Math.random() < 0.5){
//        buildGamePerTowers();
//    }
//    else {
//        buildGamePerLayers();
//    }
    let spanList = document.getElementsByTagName('span');
    let spanCount = spanList.length;
    for(let i = 0; i < spanCount; i++)
    {
        spanList[i].style.display = "";;
    }  
    checkGameState();
}

function resetDatas(){
    document.gameForm.reset();
    document.getElementById('time').value = "00:00";
    isGameStarted = 0;  
    clickCounter = 0; 
    timeInSec = 0;   
    undoStack = new Array();   
    undoCounter = 0;            
    selectedTiles = new Array();  
    hintedTilesPair = new Array();    
}


function buildGamePerLayers(){
    let spanList = document.getElementsByTagName('span');
    let spanCount = spanList.length;  
    LAYERS = new Array();
    for(let i=1;i<10;i++){
        LAYERS[i] = new Array();
    }
    for(let i = 0; i < spanCount; i++)
    {
        var layerIndex = spanList[i].id.substr(0, 1);
        LAYERS[layerIndex].push(spanList[i]);
    }    
    
    buildLayers(1);
}

function buildLayers(layerIndex) {
    if (layerIndex === LAYERS.length || LAYERS[layerIndex].length === 0) {
        checkGameState();
    } else {
        buildLayer(layerIndex, 0);
    }
}

function buildLayer(layerIndex, tileIndexInLayer) {
    LayerIndex = layerIndex;
    TileIndexInLayer = tileIndexInLayer;
    if (TileIndexInLayer === LAYERS[layerIndex].length) {
        buildLayers(layerIndex+1);
    } else {
        LAYERS[LayerIndex][TileIndexInLayer].style.display = "";
        TileIndexInLayer++;
        setTimeout('buildLayer(LayerIndex,TileIndexInLayer)', 10);
    }
}

function buildGamePerTowers(){
    let spanList = document.getElementsByTagName('span');
    let spanCount = spanList.length;
    var tower = new Array();
    for(let i = 2020; i < 3650; i++)
    {
        tower[i] = new Array();
    }
    
    for(let i = 0; i < spanCount; i++)
    {
        let index = spanList[i].id.substr(1);
        tower[index].push(spanList[i]);
    }
    TOWERS = new Array();
    var h = 0;
    for(let i = 2020; i < 3650; i++)
    {
        if (tower[i].length === 0) {
            continue;
        } else {
            TOWERS[h] = tower[i];
            h++;
        }
    }
    buildTowers();    
}

function buildTowers() {
    needToBuildTower = new Array();
    unbuildedTower = -1;
    for(let i = 0; i < TOWERS.length; i++)
    {
        if (TOWERS[i][0].style.display === "none") {
            unbuildedTower++;
            needToBuildTower[unbuildedTower] = TOWERS[i];
        }
    }
    if (unbuildedTower === -1) {
        checkGameState();
    } else {
        nextBuildIndex = Math.floor(Math.random() * (unbuildedTower + 1));
        buildTower(needToBuildTower[nextBuildIndex], 0);
    }
}

function buildTower(tower, tileIndexInTower) {
    let Tower = tower;
    let TileIndexInTower = tileIndexInTower;
    if (TileIndexInTower === Tower.length) {
        buildTowers();
    } else {
        Tower[TileIndexInTower].style.display = "";
        TileIndexInTower++;
        setTimeout(buildTower, 10, Tower, TileIndexInTower);
    }
}

function checkGameState() {
    if (document.getElementsByTagName('span').length === 0) {
        gameSuccessfulEnd();
    } else {
        var topsInTowers = getTopTilesInTowers();
        var sideMoveableTiles = getSideMoveableTiles(topsInTowers);
        moveAbleTiles = getUpMoveableTiles(sideMoveableTiles);
        for (let i = 0; i < moveAbleTiles.length; i++)
        {
            let tileSpanElement = moveAbleTiles[i];
            tileSpanElement.onmouseover = function () {
                mouseOverMoveableTile(this);
            };
            tileSpanElement.onmouseout = function () {
                mouseOutMoveableTile(this);
            };
            tileSpanElement.onclick = function () {
                mouseClickMoveableTile(this);
            };
        }
        
        searchMoveablePairs();
        if (moveableTilesWithPairsCounter === 0) {
            alert("Nincs több levehető pár!");
            document.getElementById("moveablePairCounter").value = 0;
            clearTimeout(timeoutId);
            return;
        }

        document.getElementById("tileCounter").value = document.getElementsByTagName('span').length;
        document.getElementById("moveablePairCounter").value = (Math.ceil(moveableTilesWithPairsCounter / 2));
        document.getElementById("menuButton").disabled = false;
        
        document.getElementById("cover").style.display = "none";
        /*  tower=h;                                         //megmutatja az összes levehetõ követ aminek látszik a párja
         for (J=0;J<tower;J++)
         {
         CN=""+moveableTilesWithPairsClassNames[J]
         Hspk=classEll(CN);
         for (h=0;h<Hspk.length;h++)
         {
         if (Hspk[h].onclick!="") {
         Hpic=Hspk[h].lastChild.src;
         kepszam=Hpic.substr(pic.length-6)          //képszám.png
         Hspk[h].lastChild.src="./res/tiles/tileS_"+kepszam;
         }
         }
         }  */
    }
}

function gameSuccessfulEnd() {
    document.getElementById("tileCounter").value = 0;
    document.getElementById("moveablePairCounter").value = 0;
    clearTimeout(timeoutId);
    alert("Gratulálok!");
}

function getTopTilesInTowers(){
    let spanList = document.getElementsByTagName('span');
    let spanCount = spanList.length;
    //towers based on id (id=level+row+column)
    let towers = new Array();
    for(let i = 2020; i < 3650; i++)
    {
        towers[i] = "";
    }

    for(let i = 0; i < spanCount; i++)
    {
        spanList[i].onclick = "";
        spanList[i].onmouseover = "";
        spanList[i].onmouseout = "";
        var indexInTable = spanList[i].id.substr(1);
        towers[indexInTable] = spanList[i];
    }
    
    let topsInTowers = new Array();
    let h = 0;
    for(let i = 2020; i < 3650; i++)
    {
        if (towers[i] === "") {
            continue;
        } else {
            topsInTowers[h] = towers[i];
            h++;
        }
    }    
    return topsInTowers;
}

function getSideMoveableTiles(topsInTowers){
    let sideMoveableTiles = new Array();
    let v = 0;
    for(let i = 0; i < topsInTowers.length; i++)
    {
        let tileSpanElement = topsInTowers[i];
        let level = parseFloat(tileSpanElement.id.substr(0, 1));
        let row = parseFloat(tileSpanElement.id.substr(1, 2));
        let column = parseFloat(tileSpanElement.id.substr(3));
        let spanLeftHalfUp = document.getElementById("" + level + (row - 1) + (column - 2));
        let spanLeft = document.getElementById("" + level + (row) + (column - 2));
        let spanLeftHalfDown = document.getElementById("" + level + (row + 1) + (column - 2));
        let spanRightHalfUp = document.getElementById("" + level + (row - 1) + (column + 2));
        let spanRight = document.getElementById("" + level + (row) + (column + 2));
        let spanRightHalfDown = document.getElementById("" + level + (row + 1) + (column + 2));
        if ((!spanLeftHalfUp && !spanLeft && !spanLeftHalfDown) || (!spanRightHalfUp && !spanRight && !spanRightHalfDown)) {
            sideMoveableTiles[v] = tileSpanElement;
            v++;
        }
    }   
    return sideMoveableTiles;
}

function getUpMoveableTiles(sideMoveableTiles){
    let upMoveableTiles = new Array();
    let f = 0;
    for (let i = 0; i < sideMoveableTiles.length; i++)
    {
        let tileSpanElement = sideMoveableTiles[i];
        let level = parseFloat(tileSpanElement.id.substr(0, 1));
        let row = parseFloat(tileSpanElement.id.substr(1, 2));
        let column = parseFloat(tileSpanElement.id.substr(3));
        let spanTopHalfLeftHalfUp = document.getElementById("" + (level + 1) + (row - 1) + (column - 1));
        let spanTopHalfUp = document.getElementById("" + (level + 1) + (row - 1) + (column));
        let spanTopHalfRightHalfUp = document.getElementById("" + (level + 1) + (row - 1) + (column + 1));
        let spanTopHalfLeft = document.getElementById("" + (level + 1) + (row) + (column - 1));
        let spanTopHalfRight = document.getElementById("" + (level + 1) + (row) + (column + 1));
        let spanTopHalfLeftHalfDown = document.getElementById("" + (level + 1) + (row + 1) + (column - 1));
        let spanTopHalfDown = document.getElementById("" + (level + 1) + (row + 1) + (column));
        let spanTopHalfRightHalfDown = document.getElementById("" + (level + 1) + (row + 1) + (column + 1));
        if (!spanTopHalfLeftHalfUp && !spanTopHalfUp && !spanTopHalfRightHalfUp 
                && !spanTopHalfLeft && !spanTopHalfRight 
                && !spanTopHalfLeftHalfDown && !spanTopHalfDown && !spanTopHalfRightHalfDown) {
            upMoveableTiles[f] = tileSpanElement;
            f++;
        }
    } 
    return upMoveableTiles;
}

function searchMoveablePairs() {
    menuHide();
    //minden kép alapképpé
//    let spanList = document.getElementsByTagName('span');
//    let spanCount = spanList.length;
//    let imageNameEnd = "XX.png";
//    for(let i = 0; i < spanCount; i++)
//    {
//        let imageName = spanList[i].lastChild.src;
//        let imageNumber = imageName.substr(imageName.length - imageNameEnd.length);
//        spanList[i].lastChild.src = "./res/tiles/tile_" + imageNumber;
//    }
    
    let moveableTilesWithSameClassNameCounters = new Array();
    for (let classNameAsIndex = 100; classNameAsIndex < 702; classNameAsIndex++)
    {
        moveableTilesWithSameClassNameCounters[classNameAsIndex] = 0;
    }
    for(let i = 0; i < moveAbleTiles.length; i++)      
    {
        let classNameAsIndex = parseFloat(moveAbleTiles[i].className);
        moveableTilesWithSameClassNameCounters[classNameAsIndex]++;
    }
    
    moveableTilesWithPairsClassNames = new Array();
    let p = 0;
    moveableTilesWithPairsCounter = 0;
    for(let classNameAsIndex = 100; classNameAsIndex < 702; classNameAsIndex++)
    {
        if (moveableTilesWithSameClassNameCounters[classNameAsIndex] < 2) {
            continue;
        } else {
            moveableTilesWithPairsClassNames[p] = classNameAsIndex;      
            p++;
            moveableTilesWithPairsCounter += moveableTilesWithSameClassNameCounters[classNameAsIndex];   
        }
    }
}

function hint(){
    menuHide();
    timeInSec += 20;
    checkGameStarted();
    
    let spanList = document.getElementsByTagName('span');
    let spanCount = spanList.length;
    for(let i = 0; i < spanCount; i++)
    {
        tileToDeselected(spanList[i]);
    }    
    
    let possibleClassNamesCount = moveableTilesWithPairsClassNames.length;
    let pickClassNameIndex = Math.floor(Math.random() * (possibleClassNamesCount));   
    let pickedClassName = "" + moveableTilesWithPairsClassNames[pickClassNameIndex];
    let moveableTilesWithPairs = getMoveableTileWithThisClassName(pickedClassName);   
    let hintedTiles = getHintedTiles(moveableTilesWithPairs);

    hintedTilesPair[0] = moveableTilesWithPairs[hintedTiles[0]];
    tileToHinted(hintedTilesPair[0]);
    hintedTilesPair[1] = moveableTilesWithPairs[hintedTiles[1]];
    tileToHinted(hintedTilesPair[1]);
    
}

function getMoveableTileWithThisClassName(pickedClassName) {
    hf = new Array();
    j = 0;
    for (f = 0; f < moveAbleTiles.length; f++)
    {
        if (moveAbleTiles[f].className === pickedClassName) {
            hf[j] = moveAbleTiles[f];
            j++;
        }
    }
    return hf;
}

function getHintedTiles(moveableTilesWithPairs){
    Hely = new Array();
    if (moveableTilesWithPairs.length > 2) {   
        Mely = "";
        for (a = 0; a < moveableTilesWithPairs.length; a++)
        {
            Mely += a;
        }
        for (a = 0; a < 2; a++)
        {
            hossz = Mely.length;
            vel = Math.floor(Math.random() * (hossz));
            Hely[a] = Mely.substr(vel, 1);
            szamok1 = Mely.substr(0, vel);
            szamok2 = Mely.substr(vel + 1);
            Mely = szamok1 + szamok2;
        }
    } else {
        Hely[0] = 0;
        Hely[1] = 1;
    }   //ha csak két tile van akkor ezt mutatja
    return Hely;
}


function cancel(tileSpanElement) {
    tileCoverClear(tileSpanElement);
    tileToDeselected(tileSpanElement);
    clickCounter = 0;
    checkGameState();
}

function mouseOverMoveableTile(tileSpanElement) {
    tileCoverToHover(tileSpanElement);
}

function mouseOutMoveableTile(tileSpanElement) {
    tileCoverClear(tileSpanElement);
}

function mouseClickMoveableTile(tileSpanElement) {
    menuHide();
    checkGameStarted();
    if (hintedTilesPair.length === 2) {
        if (tileSpanElement === hintedTilesPair[0] || tileSpanElement === hintedTilesPair[1]) {     
            removeHintedTiles();
            return;
        }
        else {
            tileClearHinted(hintedTilesPair[0]);
            tileClearHinted(hintedTilesPair[1]);
        }
    }
    
    tileToSelected(tileSpanElement);
    tileSpanElement.onclick = function () {
        cancel(this);
    };
    selectedTiles[clickCounter] = tileSpanElement;
    clickCounter++;
    if (clickCounter === 2) {
        checkIsRemoveableTiles();
    } 
}

function removeHintedTiles() {
    document.getElementById("cover").style.display = "block";
    undoStack[undoCounter] = hintedTilesPair[0];
    undoCounter++;
    undoStack[undoCounter] = hintedTilesPair[1];
    undoCounter++;
    tileToSelected(hintedTilesPair[0]);
    tileToSelected(hintedTilesPair[1]);    
    tileCoverClear(hintedTilesPair[0]);
    tileCoverClear(hintedTilesPair[1]);     
    hintedTilesPair[0].parentNode.removeChild(hintedTilesPair[0]);
    hintedTilesPair[1].parentNode.removeChild(hintedTilesPair[1]);
    hintedTilesPair.pop();
    hintedTilesPair.pop();
    clickCounter = 0;
    checkGameState();    
}

function checkIsRemoveableTiles() {
    document.getElementById("cover").style.display = "block";
    let selectedTile1 = selectedTiles[0];
    let selectedTile2 = selectedTiles[1];
    if (selectedTile1.className === selectedTile2.className) {
        undoStack[undoCounter] = selectedTile1;
        undoCounter++;
        undoStack[undoCounter] = selectedTile2;
        undoCounter++;
        selectedTile1.parentNode.removeChild(selectedTile1);
        selectedTile2.parentNode.removeChild(selectedTile2);
        tileCoverClear(selectedTile1);
        tileCoverClear(selectedTile2);        
    } else {
        tileToDeselected(selectedTile1);
        tileToDeselected(selectedTile2);
    }
    clickCounter = 0;
    checkGameState();
}


function undo() {
    menuHide();
    if (undoCounter === 0) {
        alert("Nincs több visszavonható művelet!");
        return;
    } else {
        document.getElementById("menuButton").disabled = true;
        let tilesSpanParent = document.getElementsByTagName("span")[0].parentNode;
        tilesSpanParent.appendChild(undoStack[undoCounter - 2]);
        tilesSpanParent.appendChild(undoStack[undoCounter - 1]);
        setTimeout(function () {
            tileToDeselected(undoStack[undoCounter - 2]);
            tileToDeselected(undoStack[undoCounter - 1]);
            clickCounter = 0;
            undoCounter -= 2;
            checkGameState();
        }, 300);
    }
}




function checkGameStarted(){
    if (isGameStarted === 0) {
        isGameStarted++;
        timeUpdate(timeInSec);
    }
}

function timeUpdate() {                                         //idomero
    let minute = Math.floor(timeInSec / 60);
    let secInMinute = timeInSec - 60 * minute;
    let hour = Math.floor(minute / 60);
    let minuteInHour = minute - 60 * hour;
    let timeString = (hour === 0 ? "" : hour + ':');
        timeString += (minuteInHour < 10 ? '0' + minuteInHour : minuteInHour);
        timeString += ':';
        timeString += (secInMinute < 10 ? '0' + secInMinute : secInMinute);
    document.getElementById('time').value = timeString;
    timeInSec++;
    timeoutId = setTimeout(timeUpdate, 1000);
}

function tileCoverClear(tileSpanElement){
    tileSpanElement.firstChild.style.backgroundImage = "";    
}

function tileCoverToHover(tileSpanElement){
    tileSpanElement.firstChild.style.backgroundImage = "url(./res/tiles/tile_hover.png)";    
}

function tileToHinted(tileSpanElement){
    tileSpanElement.firstChild.nextSibling.style.backgroundImage = "url(./res/tiles/tile_hinted.png)";    
}

function tileClearHinted(tileSpanElement){
    tileSpanElement.firstChild.nextSibling.style.backgroundImage = "";  
}

function tileToSelected(tileSpanElement){
    tileSpanElement.firstChild.nextSibling.style.backgroundImage = "url(./res/tiles/tile_selected.png)";    
}

function tileToDeselected(tileSpanElement){
    tileSpanElement.firstChild.nextSibling.style.backgroundImage = "";    
}

function newGameStart() {                         
    menuHide();
    window.open('mahjong.php', '_self');
}

function restartGame() {
    document.getElementById("menuButton").disabled = true;
    menuHide();
    clearTimeout(timeoutId);
    packTilesBack();
}

function packTilesBack() {
    if (undoCounter === 0) {
        resetDatas();
        checkGameState();
    } else {
        let tileSpanParent = document.getElementsByTagName("span")[0].parentNode;
        tileSpanParent.appendChild(undoStack[undoCounter - 2]);
        tileSpanParent.appendChild(undoStack[undoCounter - 1]);
        tileToDeselected(undoStack[undoCounter - 2]);
        tileToDeselected(undoStack[undoCounter - 1]);     

        undoCounter -= 2;
        setTimeout(packTilesBack, 100);
    }
}

function restartWithShuffle() {
    document.gameForm.submit();
}

function backToLayouts() {
    window.open('./mahjong.php','_self');
}

function menuShow() {
    document.getElementById("cover").style.display = "block";
    document.getElementById("cover").onclick = function () {
        menuHide();
    };
    document.getElementById('dropdownContent').style.display = "block";
    document.getElementById('menuButton').onclick = function () {
        menuHide();
    };
}

function menuHide() {
    document.getElementById("cover").style.display = "none";
    document.getElementById("cover").onclick = "";
    document.getElementById('dropdownContent').style.display = "none";
    document.getElementById('menuButton').onclick = function () {
        menuShow();
    };
}

/* - - - - - - - - - - - - - - - - - - - - - - -
 JavaScript
 2011. október 18. 17:47:14
 HAPedit 3.1.11.111
 - - - - - - - - - - - - - - - - - - - - - - - */