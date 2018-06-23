var app = {

  /* ----initializes chatterbox------ */
  init: function() {
    app.fetch();
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
        //app.clearMessages();
        //app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },
  
  
  
  //gets list of current rooms from server and mount to #roomSelect
  currentRooms: [], 
  
  //handles submission of user input message
  handleSubmit: function() {
    //retrieves message text from input field
    let $message = $('.submit').val();
    $('.submit').val('');
    //parses text into userData object
    var messageData = {
      username: window.location.search.slice(10),
      text: $message,
      roomname: app.currentRoom
    };
    // renders message to DOM
    $('#chats').prepend($(`<div class="chat"><span class="username">${messageData.username}:</span><p>${messageData.text}</p></div>`));
    //sends userData object to server
    app.send(messageData);
  },
  
  //clears chats from DOM
  clearMessages: function() {
    $('#chats').empty();
  },
  
  //mounts individual message to DOM
  renderMessage: function(message) {
    var $node = $(`<div class="chat"><span class="username">${message.username}:</span><p>${message.text}</p></div>`);
    if (app.friends[message.username]) {
      $node.css('background-color', '#99ccff');
    }
    $('#chats').append($node);
  },
  
  //mounts roomname to DOM
  renderRoom: function(room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
  },
  
  //escapes potentially malicious characters
  messageFilter: function(text) {
    return !text ? 'undefined' : text.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\$/g, '&#36;');
  },
  
  //handles roomname selection
  selectRoom: function(roomName) {
  },

  handleUsernameClick: function() {
    var nameWithColon = $(this).text();
    var name = nameWithColon.slice(0, nameWithColon.length - 1);
    if (app.friends[name]) {
      app.friends[name] = false;
    } else {
      app.friends[name] = true;
    }
    app.fetch();
  },

  handleNewRoom: function() {
    var $node = $('<div id="newRoomInputDiv"><input type="text" id="newRoomInput" placeholder="Create a room..."><button id="newRoomSubmit">Submit</button></div>');
    $node.insertAfter('#roomSelect');
    $('#newRoomSubmit').on('click', function() {
      var newRoom = $('#newRoomInput').val();
      app.currentRooms.push(newRoom);
      app.renderRoom(newRoom);
      app.currentRoom = newRoom;
      $('#roomSelect').val(newRoom);
      $('#newRoomInputDiv').remove();
      
    });
  },

  /* ------Properties----- */
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
  
  //currentRoom: null,

  friends: {},
  
  //gets new message data from server
  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('refreshed');

        app.clearMessages();

        let messageData = data.results;

        // pulls roomNames from list of raw message data
        
        var allRooms = messageData.map(obj => obj.roomname);

        if (app.currentRoom !== undefined) {
          app.currentRooms.push(app.currentRoom);
        }
        //filters unique roomnames
        var uniqueRooms = _.uniq(allRooms);
        
        // app.currentRooms = ['New Room...', app.currentRoom];

        $('#roomSelect').empty();
        // app.renderRoom('New Room...');
        
        //mounts each roomName to #roomSelect div
        _.each(uniqueRooms, function(room) {
          room = app.messageFilter(room);                   
          //checks if room is currently selected room
          app.currentRooms.push(room);
          app.renderRoom(room);
        });
        app.renderRoom('New Room...');
        app.currentRoom = app.currentRoom || app.currentRooms[0];
        console.log(app.currentRoom);
        $('#roomSelect').val(app.currentRoom);

        //filters messages without matching roomName
        var messages = messageData.filter(function(obj) {
          return obj.roomname === app.currentRoom;
        });
        //mounts each message to DOM
        _.each(messages, function(message) {
          message.text = app.messageFilter(message.text);
          message.username = app.messageFilter(message.username); 
          app.renderMessage(message);
        });
        $('span.username').on('click', app.handleUsernameClick);
        setTimeout(app.fetch, 15000);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
 
};






$(document).ready(function() {
  app.init();
  $('.userInputSubmit').on('click', app.handleSubmit);
  
  $('#roomSelect').on('change', function() {
    var room = $('#roomSelect').val();
    if (room === 'New Room...') {
      return app.handleNewRoom();
    }
    app.currentRoom = room;
    app.clearMessages();
    app.fetch();
  });

  

});
