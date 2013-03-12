var RTC = (function () {

  // TODO: Refactor this shit

  // This'll be the objects interface.
  var o = {};

  o.afterGetUserMediaSuccess = function () {};
  o.afterRemoteStreamAdded = function () {};

  // MediaStream
  var localStream;

  o.onGetUserMediaSuccess = function(stream) {
    localStream = stream;
    o.localVideoTag.src = URL.createObjectURL(stream);

    pc = new webkitRTCPeerConnection(null);
    pc.onicecandidate = onIceCandidateCreated;
    pc.onaddstream = onRemoteStreamAdded;
    pc.addStream(localStream);

    o.afterGetUserMediaSuccess(); 
  }

  function onRemoteStreamAdded(event) {
    console.log('Received remote stream!');
    o.remoteVideoTag.src = URL.createObjectURL(event.stream);
    o.afterRemoteStreamAdded();
  }

  // PeerConnection
  var pc, callWaiting;

  o.call = function() {
    pc.createOffer(onOfferCreated);
  }

  function onOfferCreated(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    signalSendOffer(sessionDescription);
  }

  function onOfferReceived(offer) {
    pc.setRemoteDescription(offer);
    callWaiting = true;
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

  // Signaling: Long-polling
  function fetchSignals() {
    $.ajax({
      url: '/client_signals.json',
      type: 'get',
      data: { 
        client_id: o.client_id,
        call_id: o.call_id
      },
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
    setTimeout(fetchSignals, 2000);
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
        client_id: o.client_id,
        call_id: o.call_id
      }
    });
  }

  fetchSignals();

  return o;

}());
