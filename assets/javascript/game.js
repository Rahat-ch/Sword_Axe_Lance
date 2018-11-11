// Initialize Firebase
var config = {
  apiKey: "AIzaSyCIkl8ardS6g4tZWApGsXq287kj37up6E4",
  authDomain: "sword-axe-lance.firebaseapp.com",
  databaseURL: "https://sword-axe-lance.firebaseio.com",
  projectId: "sword-axe-lance",
  storageBucket: "",
  messagingSenderId: "604315326722"
};
firebase.initializeApp(config);

var database = firebase.database();

//create firebase folders to track info for the players
var ref = database.ref();
var playerTurn = database.ref("/turn");
var players = database.ref("/players");
var player1 = database.ref("/players/player1");
var player2 = database.ref("/players/player2");
var playerConnection = database.ref("/playerConnection");
var isConnected = database.ref(".info/connected");
var playerChat = database.ref("/chat");

//my global variables
var weapons = ["Sword", "Axe", "Lance"];
var playernumber = 0;
var p1 = null;
var p2 = null;
var p1name;
var p2name;
var p1arr = [];
var p2arr = [];
var playerOneWinCount = 0;
var playerOneLossCount = 0;
var playerTwoWinCount = 0;
var playerTwoLossCount = 0;
var p1Weapon = null;
var p2Weapon = null;


//player connection-stops if disconnected

isConnected.on("value", function(snap) {

	if(snap.val()) {
		var playerConnect = playerConnection.push(true);
		playerConnect.onDisconnect().remove;

	}


});

// convert firebase object to array for easy access adapted from here: https://ilikekillnerds.com/2017/05/convert-firebase-database-snapshotcollection-array-javascript/
function p1SnapshotToArray(snapshot) {

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        p1arr.push(item);
    });

    return p1arr;
};

function p2SnapshotToArray(snapshot) {

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        p2arr.push(item);
    });

    return p2arr;
};

//check if player1 exists - for persistance on other pages
player1.on("value", function(snapshot) {

  if (snapshot.child("/name").exists() === true){
      p1SnapshotToArray(snapshot)
      console.log(p1arr);
      $(".player1Name").html(p1arr[1]);
      p1 = p1arr[1];
      $("#p1Wins").html(p1arr[2]);
      $("#p1loss").html(p1arr[0]);
    } else {
      $("#messageText").text("Enter your name above to join the Fight!")
    }
      player1.onDisconnect().remove();
    });

//check if player2 exists - for persistance on other pages
    player2.on("value", function(snapshot) {

      if (snapshot.child("/name").exists() === true){
          p2SnapshotToArray(snapshot)
          console.log(p2arr);
          $(".player2Name").html(p2arr[1]);
          p1 = p2arr[1];
          $("#p2Wins").html(p2arr[2]);
          $("#p2loss").html(p2arr[0]);
          noMorePlayers();
          $("#messageText").text("Select your Weapons!");
          }
          player2.onDisconnect().remove();
        });

//function to prevent a third player from joining

function noMorePlayers(){
  database.ref().once("value", function(snapshot) {

    if (snapshot.child("/players/player1").exists() === true && snapshot.child("/players/player2").exists() === true){
        $("#playerRegister").remove();
        return;
          }
  })
};

//on click function for joinFight button
$("#joinFight").on("click",function(event){
  event.preventDefault();
  //store name of the player in a variable
  var playerName = $("#inputName").val().trim();
  p1name = $("#inputName").val().trim();
  //if p1 does not exist then save this player to the database
  if (p1 == null) {
    p1 = playerName;
    player1.set({
      name: playerName,
      wins: playerOneWinCount,
      loss: playerOneLossCount,
      zweapon: p1Weapon
    });
    sessionStorage.setItem("player number", "1");
    $(".player1Name").html(playerName);
    $("#messageText").text("Waiting for an opponent!");
    $("#playerRegister").remove();
    noMorePlayers()
    player1.onDisconnect().remove();
  } else if (p2 == null) {
    p2name = $("#inputName").val().trim();
    p2 = playerName
    player2.set({
      name: playerName,
      wins: playerTwoWinCount,
      loss: playerTwoLossCount,
      zweapon: p2Weapon
    });
    sessionStorage.setItem("player number", "2");
    $(".player2Name").html(playerName);
    noMorePlayers();
    player2.onDisconnect().remove();
  }



});

//p1 wins function
function p1Win(){
  playerOneWinCount ++;
  $("#p1Wins").html(playerOneWinCount);
  $("#messageText").html("Player 1 Wins!");
}

//p1 wins function
function p1loss(){
  playerOneLossCount ++;
  $("#p1loss").html(playerOneLossCount);
  $("#messageText").html("Player 2 Wins!");
}

//p2 wins function
function p2Win(){
  playerTwoWinCount ++;
  $("#p2Wins").html(playerTwoWinCount);
  $("#messageText").html("Player 2 Wins!");

}

//p2 loss function
function p2loss(){
  playerTwoLossCount ++;
  $("#p2loss").html(playerTwoLossCount);
  $("#messageText").html("Player 1 Wins!");
}

//tied game function
function tie(){
  $("#messageText").html("This round is a tie");
}


//weapon clicks
$(document).on("click", "#sword1", function(){
    p1Weapon = "Sword";
    player1.set({
        Name: p1name,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        zweapon: p1Weapon
    });
    $("#messageText").html("Waiting for Player 2!");
    weaponClash ();

});

$(document).on("click", "#axe1", function(){
    p1Weapon = "Axe";
    player1.set({
        Name: p1name,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        zweapon: p1Weapon
    });
    $("#messageText").html("Waiting for Player 2!");
    weaponClash ();

});

$(document).on("click", "#lance1", function(){
    p1Weapon = "Lance";
    player1.set({
        Name: p1name,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        zweapon: p1Weapon
    });
    $("#messageText").html("Waiting for Player 2!");
    weaponClash ();

});

$(document).on("click", "#sword2", function(){
    p2Weapon = "Sword";
    player2.set({
        Name: p2name,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        zweapon: p2Weapon
    });
    $("#messageText").html("Waiting for Player 1!");
    weaponClash ();


});

$(document).on("click", "#axe2", function(){
    p2Weapon = "Axe";
    player2.set({
        Name: p2name,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        zweapon: p2Weapon
    });
    $("#messageText").html("Waiting for Player 1!");
    weaponClash ();

});

$(document).on("click", "#lance2", function(){
    p2Weapon = "Lance";
    player2.set({
        Name: p2name,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        zweapon: p2Weapon
    });
    $("#messageText").html("Waiting for Player 1!");
    weaponClash ();

});

//lots of if statements to check winner
function weaponClash (){
  if (p1Weapon === "Sword" && p2Weapon === "Sword") {
          tie();

      }

      else if (p1Weapon === "Sword" && p2Weapon === "Axe") {
          p1Win();
          p2loss();
      }

      else if (p1Weapon === "Sword" && p2Weapon === "Lance") {
          p2Win();
          p1loss();
      }

      else if (p1Weapon === "Axe" && p2Weapon === "Axe") {
          tie();
      }

      else if (p1Weapon === "Axe" && p2Weapon === "Lance") {
        p1Win();
        p2loss();

      }

      else if (p1Weapon === "Axe" && p2Weapon === "Sword") {
        p2Win();
        p1loss();
      }

       else if (p1Weapon === "Lance" && p2Weapon === "Lance") {
          tie();
      }

      else if (p1Weapon === "Lance" && p2Weapon === "Sword") {
        p1Win();
        p2loss();
      }

      else if (p1Weapon === "Lance" && p2Weapon === "Axe") {
        p2Win();
        p1loss();
      }
};

//once i figure out how to get p2 running need to make this for p2 as well
playerChat.on("child_added", function(childSnapshot){

            console.log("message sent");
            var latestMessage = $("<p>");
            latestMessage.addClass("chat-text");
            latestMessage.text(childSnapshot.val().message);
            $("#messageDisplay").append(latestMessage);
        }, function(errorObject){
            alert("firebase encountered an error");
        });

        $(document).on("click","#chatSubmit", function(){

           var newMessage = (p1name + ": " + $("#chatMessage").val().trim());

            //post the chat to the database
            playerChat.push({
                message: newMessage,
            });
            $("#chatMessage").val("");
            return false;
        });
