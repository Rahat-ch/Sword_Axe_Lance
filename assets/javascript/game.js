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
var p1arr = [];
var p2arr = [];


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
      }
    });

//check if player2 exists - for persistance on other pages
    player2.on("value", function(snapshot) {

      if (snapshot.child("/name").exists() === true){
          p2SnapshotToArray(snapshot)
          console.log(p2arr);
          $(".player2Name").html(p2arr[1]);
          p1 = p2arr[1];
          noMorePlayers();
          }
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
      wins: 0,
      loss: 0,
    });
    sessionStorage.setItem("player number", "1");
    $(".player1Name").html(playerName);
    noMorePlayers()
  } else if (p2 == null) {
    p2 = playerName
    player2.set({
      name: playerName,
      wins: 0,
      loss: 0,
    });
    sessionStorage.setItem("player number", "2");
    $(".player2Name").html(playerName);
    noMorePlayers()
  }



});


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
