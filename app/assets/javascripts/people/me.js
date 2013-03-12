//= require jquery
//= require ../call

RTC.localVideoTag = $('video#local_video').get(0);
RTC.remoteVideoTag = $('video#remote_video').get(0);

RTC.call_id = call_id;
RTC.client_id = client_id;

navigator.webkitGetUserMedia({ video: true, audio: true }, RTC.onGetUserMediaSuccess);
