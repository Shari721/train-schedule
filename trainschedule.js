$(document).ready(function() {

  var config = {
    apiKey: "AIzaSyCJMSXvaf0S5UlGfzx2q2iwpKQDD7HaZvs",
    authDomain: "train-schedule-78ca1.firebaseapp.com",
    databaseURL: "https://train-schedule-78ca1.firebaseio.com",
    projectId: "train-schedule-78ca1",
    storageBucket: "",
    messagingSenderId: "120582644878"
  };
  firebase.initializeApp(config);


var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  console.log("#add-train-btn");

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  // var firstTrain = moment($("#first-train-input".val().trim()).format ("HH:mm"));
  var freq = $("#frequency-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainname: trainName,
    destination: destination,
    train: firstTrain,
    freq: freq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);
  

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainname;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().train;
  var freq = childSnapshot.val().freq;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
    var displayTime = moment(nextTrain).format("hh:mm");
    console.log(displayTime)

  // // Calculate distance from next train
  // var distance = moment().diff(firstTrain, "minutes");
  // console.log(distance);

  // var timeLeft = distance % freq;

  // var minAway = freq - distance;
  // var arrival = moment().add(minAway, "minutes");
  // var nextTrain = moment(arrival).format("hh:mm a");
 

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  freq + "</td><td>" + displayTime + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});
});


