//= require jquery
//= require ./call

$('#call').click(RTC.call);

RTC.localVideoTag = $('.local video').get(0);
RTC.remoteVideoTag = $('.remote video').get(0);

RTC.afterGetUserMediaSuccess = function () {
  $('#call').removeAttr('disabled');
};

navigator.webkitGetUserMedia({ video: true, audio: true }, RTC.onGetUserMediaSuccess);
