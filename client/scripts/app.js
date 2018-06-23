var app = {

  /* ----initializes chatterbox------ */
  init: function(currentRoom = 'hello') {
    app.currentRoom = currentRoom;
    $('#roomSelect').val(currentRoom);
    app.fetch();
    app.fetchCurrentRooms();
  },
  
  /* ------AJAX request methods----- */

  //handles sending messages to server
  send: function(message) {  
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.clearMessages();
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },
  
  //gets new message data from server
  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        let messageData = data.results;
        //filters messages without matching roomName
        var messages = messageData.filter(function(obj) {
          return obj.roomname === app.currentRoom;
        });
        //mounts each message to DOM
        _.each(messages, function(message) {
          message.text = app.messageFilter(message.text);
          app.renderMessage(message);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  
  //gets list of current rooms from server and mount to #roomSelect
  fetchCurrentRooms: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        let messageData = data.results;
        // pulls roomNames from list of raw message data
        var allRooms = messageData.map(obj => obj.roomname);
        //filters unique roomnames
        var uniqueRooms = _.uniq(allRooms);
        
        //mounts each roomName to #roomSelect div
        _.each(uniqueRooms, function(room) {
          //checks if room is currently selected room
          if (room === app.currentRoom) {
            $('#roomSelect').append(`<option selected="selected" value=${room}>${room}</option>`);
          } else {
            //renders non selected rooms to #roomSelect
            app.renderRoom(room);
          }
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },
  
  //handles submission of user input message
  handleSubmit: function() {
    //retrieves message text from input field
    let $message = $('.submit').val();
    //parses text into userData object
    var messageData = {
      username: window.location.search.slice(10),
      text: $message,
      roomname: app.currentName
    };
    //sends userData object to server
    app.send(messageData);
    // renders message to DOM
    app.renderMessage(messageData);
  },
  
  //clears chats from DOM
  clearMessages: function() {
    $('#chats').empty();
  },
  
  //mounts individual message to DOM
  renderMessage: function(message) {
    $('#chats').prepend($(`<div class="chat"><span class="username">${message.username}:</span><p>${message.text}</p></div>`));
  },
  
  //mounts roomname to DOM
  renderRoom: function(room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
  },
  
  //escapes potentially malicious characters
  messageFilter: function(text) {
    return text.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\$/g, '&#36;');
  },
  
  //handles roomname selection
  selectRoom: function(roomName) {
  },

  /* ------Properties----- */
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
  
  currentRoom: $('#roomSelect').val(),
 
};






$(document).ready(function() {
  app.init();
  $('.userInputSubmit').on('click', app.handleSubmit);
  
  $('#roomSelect').on('change', function() {
    app.currentRoom = $('#roomSelect').val();
    app.clearMessages();
    app.fetch();
  });
});
