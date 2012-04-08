$(function(){
  ws = new WebSocket("ws://localhost:8080");
  
  ws.onmessage = function(evt) {
    if ($('#chat tbody tr:first').length > 0){
      $('#chat tbody tr:first').before('<tr><td>' + evt.data + '</td></tr>');  
    } else {
      $('#chat tbody').append('<tr><td>' + evt.data + '</td></tr>');  
    }
  };
  
  ws.onclose = function() { 
    ws.send("Leaves the chat");
  };
  
  ws.onopen = function() {
    ws.send("Join the chat");
  };
  
  
  $("form").submit(function(e) {
    if($("#msg").val().length > 0){
      ws.send($("#msg").val());
      $("#msg").val("");
    }
    return false;
  });
  
  $("#clear").click( function() {
    $('#chat tbody tr').remove();
  });
  
});