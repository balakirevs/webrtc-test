//= require jquery

// MediaStream
var localStream;

function onGetUserMediaSuccess(stream) {
  localStream = stream;
  $('.local video').get(0).src = URL.createObjectURL(stream);
  $('#call').removeAttr('disabled');
}

// PeerConnection
var pc;
function call() {
  if (!!localStream) {
    pc = new webkitRTCPeerConnection(null);
    pc.onicecandidate = onIceCandidate;
    pc.onaddstream = onAddStream;
    pc.addStream(localStream);
  }
}

function answer() {
}

function onIceCandidate(event) {
}

function onAddStream(event) {
  $('.remote video').get(0).src = URL.createObjectURL(event.stream);
  console.log('Got remote stream');
}

navigator.webkitGetUserMedia(
  { audio: true, video: true },
  onGetUserMediaSuccess
);

$('#call').click(call);
$('#answer').click(answer);

// Signaling
