// YOUR CODE HERE:
//create app object
var app = {
  //create init method
  init: function(currentRoom = '4chan') {
    app.currentRoom = currentRoom;
    $('#roomSelect').val(currentRoom);
    app.fetch();
    app.fetchCurrentRooms();
  },
  
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
  
  fetch: function() {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        let messageData = data.results;
        //console.log(data.results);
        var messages = messageData.filter(function(obj) {
          return obj.roomname === app.currentRoom;
        });
        _.each(messages, function(message) {
          message.text = app.messageFilter(message.text);
          app.renderMessage(message);
        });
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
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        //map roomnames to some array
        //use -,unique to find only the unique ones and store them
        let messageData = data.results;
        var allRooms = messageData.map(obj => obj.roomname);
        var uniqueRooms = _.uniq(allRooms);
        
        _.each(uniqueRooms, function(room) {
          if (room === app.currentRoom) {
            $('#roomSelect').append(`<option selected="selected" value=${room}>${room}</option>`);
          } else {
            app.renderRoom(room);
          }
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
    $('#chats').prepend($(`<div class="chat"><span class="username">${message.username}:</span><p>${message.text}</p></div>`));
  },
  
  renderRoom: function(room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
    //GET message data from server
    //parse through message data and generate list of rooms
    //convert rooms to nodes and append to chats
  },
  
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
  
  currentRoom: $('#roomSelect').val(),
  
  messageFilter: function(text) {
    return text.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\$/g, '&#36;');
  },
  
  selectRoom: function(roomName) {
    //clear chats div
    //update room name
    //call fetch to append messages to DOM
  },
  
  handleSubmit: function() {
    console.log('sdcsdc')
    let $message = $('.userInput').val();
    var userData = {
      username: window.location.search.slice(10),
      text: $message,
      roomname: app.currentName
    };
    app.send(userData);
    app.renderMessage(userData);
  }
};



$(document).ready(function() {
  app.init();
  $('.submit').on('click', app.handleSubmit);
  
  $('#roomSelect').on('change', function() {
    app.currentRoom = $('#roomSelect').val();
    app.clearMessages();
    app.fetch();
  });
  
  // $('username')
});
