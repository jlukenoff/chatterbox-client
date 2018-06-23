// YOUR CODE HERE:
//create app object
var app = {
  //create init method
  init: function() {
    //make a GET request
    //parse messages
    //mount to DOM
  },
  
  send: function(message) {  
  //create send method
    //receive a message object
    //pass to a POST request
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },
  
  fetch: function() {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        let messageData = data.results;
        console.log(messageData);
        //iterate through messageData
        var messages = messageData.filter(function(obj) {
          return obj.roomname === app.currentRoom;
        });
          //filter messages without current room
          // convert messages to nodes
          //append to DOM
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  
  fetchCurrentRooms: function() {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        //map roomnames to some array
        //use -,unique to find only the unique ones and store them
        let messageData = data.results;
        var allRooms = messageData.map(obj => obj.roomname);
        var uniqueRooms = _.uniq(allRooms);
        
        _.each(uniqueRooms, function(room) {
          app.renderRoom(room);
        });

      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },
  
  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    $('#chats').append($(`<p>${message.username}: ${message.text}</p>`));
    //fetch message data
    //filter out non-matching chatroom messages
    //convert to DOM nodes
    //append to #chats
  },
  
  renderRoom: function(room) {
    $('#roomSelect').append(`<option id="${room}Option">${room}</option>`);
    //GET message data from server
    //parse through message data and generate list of rooms
    //convert rooms to nodes and append to chats
  },
  
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  
  currentRoom: '',
  
  selectRoom: function(roomName) {
    //clear chats div
    //update room name
    //call fetch to append messages to DOM
  }
};