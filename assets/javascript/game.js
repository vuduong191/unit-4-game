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
    var listOfTopIcon=[];
    var listOfEnemies=[];
    var listOfYourCharacter = [];
    var listOfDefender = [];
    var characterInfoOriginal = {
        name:["Darth Vader","Luke Skywalker","Jabba the Hutt", "Princess Leia"],
        health:[130,120,140,150],
        attackPower:[10,6,9,5],
        counterAtackPower: [30,15,26,13],
    }
    var yourcharid = 0;
    var defenderid = 0;
    var indexList = [1,2,3,4];
    var inFight = false;
    var characterInfo = $.extend(true, {}, characterInfoOriginal)
    var originalPower = characterInfo.attackPower[yourcharid-1];
    var win = false;
    var lose = false;
    var fightsound = $(".fightsound")[0];
    console.log(characterInfo)
    var createIcon = function(index,mode,position,list) {
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
    var initialCharList = function() {
        createIcon(1,"friendmode","toplist",listOfTopIcon)
        createIcon(2,"friendmode","toplist",listOfTopIcon)
        createIcon(3,"friendmode","toplist",listOfTopIcon)
        createIcon(4,"friendmode","toplist",listOfTopIcon)
        for (i=0;i<listOfTopIcon.length;i++){
            $(".char-list").append(listOfTopIcon[i])
        }
    }    
    
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
    initialCharList();

    $(".char-list").on("click", ".toplist",function(){
        var charid = $(this).attr("id");
        yourcharid = Number(charid.charAt(charid.length-1));
        indexList.splice(yourcharid-1,1)
        console.log(indexList)
        createIcon(yourcharid,"friendmode","youricon",listOfYourCharacter)
        $(".your-char").append(listOfYourCharacter[0])
        for (i=0;i<indexList.length;i++){
            createIcon(indexList[i],"attackmode","enemyicon",listOfEnemies)}
        $(".char-list").empty()
        for (i=0;i<listOfEnemies.length;i++){
            $(".available-enemies").append(listOfEnemies[i])
        }
    })
    $(".available-enemies").on("click", ".enemyicon", function(){
        if (!inFight) {
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
            populateList()
            console.log("Check this enemy left "+indexList)
            console.log("check the defender "+defenderid)
            win = false;
            $(".announcement").empty();
            }
    })

    $(".fight-section").on("click", function(){
        if (!win&indexList.length<3){
            console.log("yourid "+ yourcharid+" enemyid "+ defenderid)
            characterInfo.health[yourcharid-1] = characterInfo.health[yourcharid-1]-characterInfo.counterAtackPower[defenderid-1]
            characterInfo.health[defenderid-1] = characterInfo.health[defenderid-1] - characterInfo.attackPower[yourcharid-1]
            characterInfo.attackPower[yourcharid-1] = characterInfo.attackPower[yourcharid-1]+ characterInfo.attackPower[yourcharid-1]
            populateList()
            var announcementtext = $("<p>")
            var click = $("<p>")
            click.addClass("click")
            click.text("Click!")
            announcementtext.addClass("annoucement-text")
            if (characterInfo.health[yourcharid-1]<0){
                lose = true;
                inFight = false;
                loseSound.play();
                announcementtext.text("You Lost! Click to play again!")
                $(".announcement").append(announcementtext)
                $(".announcement").append(click)
            } else if (characterInfo.health[defenderid-1]<0){
                if(indexList.length == 0){
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