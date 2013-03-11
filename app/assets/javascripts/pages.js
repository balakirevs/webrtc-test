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
    console.log('Calling...');
    pc = new webkitRTCPeerConnection(null);
    pc.onicecandidate = onIceCandidate;
    pc.onaddstream = onAddStream;
    pc.addStream(localStream);
    pc.createOffer(onOffer);
  }
}

function answer() {
}

function onOffer(sessionDescription) {
  pc.setLocalDescription(localDescription);
  signalSendOffer(sessionDescription);
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
    url: '/client_signals',
    type: 'get',
    dataType: 'json',
    success: onFetchedSignal
  });
}

function onFetchedSignal(signal) {
  fetchSignal();
}

function signalSendCandidate(candidate) {
  signalSend({
    type: 'candidate',
    data: JSON.stringify(candidate)
  });
}

function signalSendOffer(sessionDescription) {
  signalSend({
    type: 'offer',
    data: JSON.stringify(sessionDescription)
  });
}

function signalSend(signal) {
  $.ajax({
    url: '/client_signals',
    type: 'post',
    data: {
      type: signal.type,
      data: signal.data
    },
    success: onSignalSent
  });
}

function onSignalSent(response) {
  console.log('Signal sent successfully.');
}

fetchSignal();
