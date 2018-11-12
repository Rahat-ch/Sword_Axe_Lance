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

        p1arr.unshift(item);
    });

    return p1arr;
};

function p2SnapshotToArray(snapshot) {

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        p2arr.unshift(item);
    });

    return p2arr;
};

//check if player1 exists - for persistance on other pages
player1.on("value", function(snapshot) {

  if (snapshot.child("/name").exists() === true){
      p1SnapshotToArray(snapshot)
      console.log(p1arr);
      $(".player1Name").html(p1arr[2]);
      p1 = p1arr[2];
      $("#p1Wins").html(p1arr[1]);
      $("#p1loss").html(p1arr[3]);
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
          $(".player2Name").html(p2arr[2]);
          p2 = p2arr[2];
          $("#p2Wins").html(p2arr[1]);
          $("#p2loss").html(p2arr[3]);
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
      zweapon: "none"

    });
    sessionStorage.setItem("player name", playerName);
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
      zweapon: "none"

    });
    sessionStorage.setItem("player name", playerName);
    $(".player2Name").html(playerName);
    noMorePlayers();
    player2.onDisconnect().remove();
  }



});

//p1 wins function
function p1Win(){
  playerOneWinCount ++;
  $("#p1Wins").html(playerOneWinCount);
  alert(p1arr[2] + " wins! Choose more weapons to play again!")
}

//p1 wins function
function p1loss(){
  playerOneLossCount ++;
  $("#p1loss").html(playerOneLossCount);
  alert(p2arr[2] + " wins! Choose more weapons to play again!")
}

//p2 wins function
function p2Win(){
  playerTwoWinCount ++;
  $("#p2Wins").html(playerTwoWinCount);
  alert(p2arr[2] + " wins! Choose more weapons to play again!")

}

//p2 loss function
function p2loss(){
  playerTwoLossCount ++;
  $("#p2loss").html(playerTwoLossCount);
  alert(p1arr[2] + " wins! Choose more weapons to play again!")
}

//tied game function
function tie(){
  $("#messageText").html("This round is a tie");
  alert("This game is a tie! Choose more weapons to play again!")
}


//lots of if statements to check winner funciont
function weaponClash (){
  if (p1arr[0] === "Sword" && p2arr[0] === "Sword") {
          tie();

      }

      else if (p1arr[0] === "Sword" && p2arr[0] === "Axe") {
          p1Win();
          p2loss();
      }

      else if (p1arr[0] === "Sword" && p2arr[0] === "Lance") {
          p2Win();
          p1loss();
      }

      else if (p1arr[0] === "Axe" && p2arr[0]  === "Axe") {
          tie();
      }

      else if (p1arr[0] === "Axe" && p2arr[0] === "Lance") {
        p1Win();
        p2loss();

      }

      else if (p1arr[0] === "Axe" && p2arr[0] === "Sword") {
        p2Win();
        p1loss();
      }

       else if (p1arr[0] === "Lance" && p2arr[0] === "Lance") {
          tie();
      }

      else if (p1arr[0] === "Lance" && p2arr[0] === "Sword") {
        p1Win();
        p2loss();
      }

      else if (p1arr[0] === "Lance" && p2arr[0] === "Axe") {
        p2Win();
        p1loss();
      }
};


//weapon clicks for p1

player1.on("value", function(snapshot) {

  $(document).on("click", "#sword1", function(){
      player1.update({
          zweapon: "Sword"
      });
      p1SnapshotToArray(snapshot);
      $("#messageText").html("Waiting for Player 2!");
      weaponClash ();

  });

  $(document).on("click", "#axe1", function(){
    player1.update({
        zweapon: "Axe"
      });
      p1SnapshotToArray(snapshot);
      $("#messageText").html("Waiting for Player 2!");
      weaponClash ();

  });

  $(document).on("click", "#lance1", function(){
    player1.update({
        zweapon: "Lance"
      });
      p1SnapshotToArray(snapshot);
      $("#messageText").html("Waiting for Player 2!");
      weaponClash ();

  });

    });

//weapon clicks for p2

player2.on("value", function(snapshot) {

  $(document).on("click", "#sword2", function(){
    player2.update({
        zweapon: "Sword"
    });
      p2SnapshotToArray(snapshot)
      $("#messageText").html("Waiting for Player 1!");
      weaponClash ();
      console.log("This is P1 Array: " + p1arr);
  });

  $(document).on("click", "#axe2", function(){
    player2.update({
        zweapon: "Axe"
    });
      p2SnapshotToArray(snapshot)
      $("#messageText").html("Waiting for Player 1!");
      weaponClash ();

  });

  $(document).on("click", "#lance2", function(){
    player2.update({
        zweapon: "Lance"
    });
      p2SnapshotToArray(snapshot)
      $("#messageText").html("Waiting for Player 1!");
      weaponClash ();

  });

    });




//once i figure out how to get p2 running need to make this for p2 as well
playerChat.on("child_added", function(childSnapshot){

            var latestMessage = $("<p>");
            latestMessage.addClass("chat-text");
            latestMessage.text(childSnapshot.val().message);
            $("#messageDisplay").append(latestMessage);
        }, function(errorObject){
            alert("firebase encountered an error");
        });

        $(document).on("click","#chatSubmit", function(){

           var newMessage = (sessionStorage.getItem("player name") + ": " + $("#chatMessage").val().trim());

            //post the chat to the database
            playerChat.push({
                message: newMessage,
            });
            //unable to get div to auto scroll this is what i tried
            var objDiv = $("#messageDisplay");
            objDiv.scrollTop = objDiv.scrollHeight;
            $("#chatMessage").val("");
            return false;
        });
