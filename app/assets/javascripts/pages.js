//= require jquery

// MediaStream
var localStream;

function onGetUserMediaSuccess(stream) {
  localStream = stream;
  $('.local video').get(0).src = URL.createObjectURL(stream);
  $('#call').removeAttr('disabled');

  pc = new webkitRTCPeerConnection(null);
  pc.onicecandidate = onIceCandidateCreated;
  pc.onaddstream = onRemoteStreamAdded;
  pc.addStream(localStream);

  fetchSignals();
}

// PeerConnection
var pc, localDescription, iceCandidate, 
    caller = false;

function call() {
  $('#call').attr('disabled', true);
  console.log('Calling...');
  pc.createOffer(onOfferCreated);
}

function answer() {
  $('#answer').attr('disabled', true);
  console.log('Answering call...');
  pc.createAnswer(onAnswerCreated);
}

function onRemoteStreamAdded(event) {
  console.log('Received remote stream', event);
  $('.remote video').get(0).src = URL.createObjectURL(event.stream);
}

function onOfferCreated(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  signalSendOffer(sessionDescription);
}

function onOfferReceived(offer) {
  $('#answer').removeAttr('disabled');
  $('#call').attr('disabled', true);
  pc.setRemoteDescription(offer);
  pc.createAnswer(onAnswerCreated);
}

function onAnswerCreated(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  signalSendAnswer(sessionDescription);
}

function onAnswerReceived(answer) {
  pc.setRemoteDescription(answer);
}

function onIceCandidateCreated(event) {
  if (event.candidate) {
    console.log('Sending candidate...');
    signalSendCandidate(event.candidate);
  }
}

function onIceCandidateReceived(candidate) {
  pc.addIceCandidate(candidate);
}

function onAddStream(event) {
  $('.remote video').get(0).src = URL.createObjectURL(event.stream);
  console.log('Got remote stream');
}

/******************************************/
var randid = Math.round(Math.random() * 100000);

navigator.webkitGetUserMedia(
  { audio: true, video: true },
  onGetUserMediaSuccess
);

$('#call').click(call);
$('#answer').click(answer);

// Signaling
function fetchSignals() {
  $.ajax({
    url: '/client_signals.json',
    type: 'get',
    data: { client_id: randid },
    dataType: 'json',
    success: onFetchedSignals
  });
}

function onFetchedSignals(signals) {
  $.each(signals, function (i, obj) {
    switch (obj.type) {
      case 'candidate':
        var data = JSON.parse(obj.data);
        var candidate = new RTCIceCandidate(data);
        console.log('Received RTCIceCandidate: ');
        onIceCandidateReceived(candidate);
        break;
      case 'offer':
        var data = JSON.parse(obj.data);
        var offer = new RTCSessionDescription(data);
        console.log('Received offer: ');
        onOfferReceived(offer);
        break;
      case 'answer':
        var data = JSON.parse(obj.data);
        var answer = new RTCSessionDescription(data);
        console.log('Received answer: ');
        onAnswerReceived(answer);
        break;
    }
  });
  setTimeout(fetchSignals, 5000);
}

function signalSendCandidate(candidate) {
  signalSend({
    type: 'candidate',
    data: JSON.stringify(candidate)
  });
}

function signalSendOffer(sessionDescription) {
  console.log('Sending offer...');
  signalSend({
    type: 'offer',
    data: JSON.stringify(sessionDescription)
  });
}

function signalSendAnswer(sessionDescription) {
  console.log('Sending answer...');
  signalSend({
    type: 'answer',
    data: JSON.stringify(sessionDescription)
  });
}

function signalSend(signal) {
  $.ajax({
    url: '/client_signals.json',
    type: 'post',
    data: {
      type: signal.type,
      data: signal.data,
      client_id: randid
    },
    success: onSignalSent
  });
}

function onSignalSent(response) {
  console.log('Signal sent successfully.');
}
