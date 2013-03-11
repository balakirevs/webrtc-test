//= require jquery

// MediaStream
var localStream;

function onGetUserMediaSuccess(stream) {
  localStream = stream;
  $('.local video').get(0).src = URL.createObjectURL(stream);
  $('#call').removeAttr('disabled');
}

// PeerConnection
var pc, localDescription, iceCandidate;

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
  if (event.candidate) {
    signalSendCandidate(event.candidate);
  }
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
function fetchSignal() {
  $.ajax({
    url: '/signals',
    type: 'get',
    success: onFetchedSignal
  });
}

function onFetchedSignal() {
  fetchSignal();
}

function signalSendCandidate() {
  signalSendOffer();
}

function signalSendSessionDescription() {
  signalSendOffer();
}

function signalSend(signal) {
  $.ajax({
    url: '/signals',
    type: 'post',
    data: {
      type: signal.type,
      data: signal.data
    },
    success: onSignalSent
  });
}

function onSignalSent(response) {
}

fetchSignal();
