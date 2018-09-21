$(document).ready(function() {
    const fightSound = new Audio(".//assets/sounds/fight.mp3");
    const rightSound = new Audio(".//assets/sounds/right.mp3");
    const wrongSound = new Audio(".//assets/sounds/wrong.mp3");
    const winSound = new Audio(".//assets/sounds/applause.mp3");
    const loseSound = new Audio(".//assets/sounds/boo.mp3");
    $(".fight-section").click(e => fightSound.play());
    var charIcon = $("<div>")
    var charIconTitle = $("<p>")
    var charIconImg = $("<img>")
    var charIconStrength = $("<p>")
    // These variables build up the icon bundle
    var listOfTopIcon=[];
    var listOfEnemies=[];
    var listOfYourCharacter = [];
    var listOfDefender = [];
    // These list store characters for display and extract info
    var characterInfoOriginal = {
        name:["Darth Vader","Luke Skywalker","Jabba the Hutt", "Princess Leia"],
        health:[135,160,140,190],
        attackPower:[10,7,9,7],
        counterAtackPower: [25,15,20,15],
    }
    //data for characters
    var yourcharid = 0;
    var defenderid = 0;
    var indexList = [1,2,3,4];
    //ids for your character and defender, the rest in the indexlist go to "Available enemies"
    var inFight = false;
    // if there's one active defender, nothing happens if available enemies are clicked
    var characterInfo = $.extend(true, {}, characterInfoOriginal)
    // make a copy of the original data, the original data will help retrieve info when user resets the gave
    var originalPower = characterInfo.attackPower[yourcharid-1];
    // a temporary variable for attackpower, this variable value increases after every hit
    var win = false;
    var lose = false;
    var fightsound = $(".fightsound")[0];
    console.log(characterInfo)
    var createIcon = function(index,mode,position,list) {
        // the index points to the exact character, mode can be either friendmode with green halo CSS style or attackmode with orange halo css style, position and list denote where these icons go
         charIcon = $("<div>")
         charIconTitle = $("<p>")
         charIconImg = $("<img>")
         charIconStrength = $("<p>")
        charIcon.addClass("charicon")
        charIcon.addClass(mode)
        charIcon.addClass(position)
        charIconTitle.addClass("charicontitle")
        charIconTitle.text(characterInfo.name[index-1])
        console.log(characterInfo.name[index])
        charIconStrength.addClass("chariconstrength")
        charIconStrength.text(characterInfo.health[index-1])
        charIconImg.addClass("chariconimg")
        charIcon.attr("id","char"+index)
        charIconImg.attr("src","./assets/images/char"+index+".png")
        charIcon.append(charIconTitle)
        charIcon.append(charIconImg)
        charIcon.append(charIconStrength)
        list.push(charIcon)
    }
    //create icon and push it to the right list. Condition: all lists have to be cleared, to empty array before this step
    var initialCharList = function() {
        createIcon(1,"friendmode","toplist",listOfTopIcon)
        createIcon(2,"friendmode","toplist",listOfTopIcon)
        createIcon(3,"friendmode","toplist",listOfTopIcon)
        createIcon(4,"friendmode","toplist",listOfTopIcon)
        for (i=0;i<listOfTopIcon.length;i++){
            $(".char-list").append(listOfTopIcon[i])
        }
    }
    // create the intial list of character, store it in the listOfTopIcon
    
    var populateList = function(){
        $(".your-char").empty()
        $(".defender").empty()
        $(".available-enemies").empty()
        listOfYourCharacter = []
        listOfEnemies=[];
        listOfDefender = []   
        createIcon(yourcharid,"friendmode","youricon",listOfYourCharacter)        
        $(".your-char").append(listOfYourCharacter[0])
        for (i=0;i<indexList.length;i++){
            createIcon(indexList[i],"attackmode","enemyicon",listOfEnemies)}        
        for (i=0;i<listOfEnemies.length;i++){
            $(".available-enemies").append(listOfEnemies[i])
        }
        createIcon(defenderid,"attackmode","defendericon",listOfDefender)
        $(".defender").append(listOfDefender[0])

    }
    // populate all lists by emptying all lists and then create icons that go into those list.
    initialCharList();

    $(".char-list").on("click", ".toplist",function(){
    // What happens when the initial characters are clicked
        var charid = $(this).attr("id");
        yourcharid = Number(charid.charAt(charid.length-1));
        // get your character id through an attribute of element that user has clicked on
        indexList.splice(yourcharid-1,1)
        // remove this number from the indexlist, which contains all numbers
        console.log(indexList)
        createIcon(yourcharid,"friendmode","youricon",listOfYourCharacter)
        $(".your-char").append(listOfYourCharacter[0])
        // create the icon for your character and push it to the the <div class = your-chad>
        for (i=0;i<indexList.length;i++){
            createIcon(indexList[i],"attackmode","enemyicon",listOfEnemies)}
        $(".char-list").empty()
        for (i=0;i<listOfEnemies.length;i++){
            $(".available-enemies").append(listOfEnemies[i])
        // for what left in the index list, loop through it to push the characters into the <div class = available-enemies>
        }
    })
    $(".available-enemies").on("click", ".enemyicon", function(){
    // What happens when available enemies are clicked
        if (!inFight) {
            // this boolean makes sure the codes below only work when there's no active defender
            var charid = $(this).attr("id");
            defenderid = Number(charid.charAt(charid.length-1));
            indexList.splice(indexList.indexOf(defenderid),1)
            createIcon(defenderid,"attackmode","defendericon",listOfDefender)
            $(".defender").append(listOfDefender[0])
            listOfEnemies=[];    
            for (i=0;i<indexList.length;i++){
                createIcon(indexList[i],"attackmode","enemyicon",listOfEnemies)}
            $(".char-list").empty()
            inFight = true;
            // when user clicks the defender, inFight turns true
            populateList()
            console.log("Check this enemy left "+indexList)
            console.log("check the defender "+defenderid)
            win = false;
            $(".announcement").empty();
            }
    })

    $(".fight-section").on("click", function(){
        if (!win&indexList.length<3){
            // these conditions make sure users can only click when he's in a fight
            console.log("yourid "+ yourcharid+" enemyid "+ defenderid)
            characterInfo.health[yourcharid-1] = characterInfo.health[yourcharid-1]-characterInfo.counterAtackPower[defenderid-1]
            characterInfo.health[defenderid-1] = characterInfo.health[defenderid-1] - characterInfo.attackPower[yourcharid-1]
            characterInfo.attackPower[yourcharid-1] = characterInfo.attackPower[yourcharid-1]*1.5
            populateList()
            // every time the strength and attackpower are modified, we have to populate the list again. There should be a more efficient way.
            var announcementtext = $("<p>")
            var click = $("<p>")
            click.addClass("click")
            click.text("Click!")
            announcementtext.addClass("annoucement-text")
            // for the announcement
            if (characterInfo.health[yourcharid-1]<0){
            // if your character's strength goes negative
                lose = true;
                inFight = false;
                loseSound.play();
                announcementtext.text("You Lost! Click to play again!")
                $(".announcement").append(announcementtext)
                $(".announcement").append(click)
            } else if (characterInfo.health[defenderid-1]<0){
            // if defender's strength goes negative, user has to pick another defender, inFight boolean variable turns false to allow users to click
                if(indexList.length == 0){
            // check if no enemy left
                    announcementtext.text("You Won! Click to play again")
                    $(".announcement").append(announcementtext)
                    $(".announcement").append(click)
                    win = true;
                    winSound.play();
                    inFight = false;                  
                } else{
                rightSound.play()
                win = true;
                inFight = false;
                listOfDefender = [];
                announcementtext.text("You defeated "+ characterInfo.name[defenderid-1]+". Pick the next enemy!")
                $(".announcement").append(announcementtext)}
            } else {

            }
        }
    })
    $(".announcement").on("click", ".click", function(){
    // click to reset the game by emptying all html tag, turn all variable to the intial stage, and intialCharList()
        indexList = [1,2,3,4]
        $(".your-char").empty()
        $(".defender").empty()
        $(".available-enemies").empty()
        listOfTopIcon=[]
        listOfYourCharacter = []
        listOfEnemies=[];
        listOfDefender = [];
        defenderid=0;
        yourcharid=0;
        characterInfo = $.extend(true, {}, characterInfoOriginal);
        $(".announcement").empty()
        initialCharList();
    })




})