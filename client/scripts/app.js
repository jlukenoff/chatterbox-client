var app = {

  /* ----initializes chatterbox------ */
  init: function() {
    app.fetch();
  },
  
  /* ------AJAX request methods----- */
  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // debugger;
        app.clearMessages();

        let messageData = data.results;
        
        var allRooms = messageData.map(obj => obj.roomname);

        // if (app.currentRoom !== undefined) {
        //   app.currentRooms.push(app.currentRoom);
        // }
        
        var uniqueRooms = _.uniq(allRooms);
        

        $('#roomSelect').empty();
        
        _.each(uniqueRooms, function(room) {
          room = app.messageFilter(room);                   
          app.currentRooms.push(room);
          app.renderRoom(room);
        });
        app.renderRoom('New Room...');
        app.currentRoom = app.currentRoom || app.currentRooms[0];
        console.log(app.currentRoom);
        $('#roomSelect').val(app.currentRoom);

        var messages = messageData.filter(function(obj) {
          return obj.roomname === app.currentRoom;
        });
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
  },

  send: function(message) {  
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },
  
  handleSubmit: function() {
    let $message = $('.submit').val();
    $('.submit').val('');
    var messageData = {
      username: window.location.search.slice(10),
      text: $message,
      roomname: app.currentRoom
    };
    $('#chats').prepend($(`<div class="chat"><span class="username">${messageData.username}:</span><p>${messageData.text}</p></div>`));
    app.send(messageData);
  },

  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    var $node = $(`<div class="chat"><span class="username">${message.username}:</span><p>${message.text}</p></div>`);
    if (app.friends[message.username]) {
      $node.css('background-color', '#99ccff');
    }
    $('#chats').append($node);
  },
  
  renderRoom: function(room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
  },
  
  messageFilter: function(text) {
    return !text ? 'undefined' : text.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\$/g, '&#36;');
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
      var messageData = {
        username: window.location.search.slice(10),
        text: 'Welcome to ' + app.currentRoom,
        roomname: app.currentRoom
      };
      app.send(messageData);
      app.fetch();
      
    });
  },

  /* ------Properties----- */
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
  
  friends: {},

  currentRooms: [], 
 
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
