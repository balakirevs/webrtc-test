//= require jquery

// MediaStream
var localStream;

function onGetUserMediaSuccess(stream) {
  localStream = stream;
  $('.local video').get(0).src = URL.createObjectURL(stream);
  $('#call').removeAttr('disabled');
  fetchSignals();
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
    pc.createOffer(onOfferCreated);
  }
}

function answer() {
  alert('answer')
}

function onOfferCreated(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  signalSendOffer(sessionDescription);
}

function onOfferReceived() {
  $('#answer').removeAttr('disabled');
  $('#call').attr('disabled', true);
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
    data: { client: randid },
    dataType: 'json',
    success: onFetchedSignals
  });
}

function onFetchedSignals(signals) {
  $.each(signals, function (i, obj) {
    switch (obj.type) {
      case 'candidate':
        var candidate = JSON.parse(obj.data);
        pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('Added RTCIceCandidate: ', obj.data);
        break;
      case 'offer':
        var offer = JSON.parse(obj.data);
        pc.setRemoteDescription(offer);
        onOfferReceived();
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
