angular.module('grnk')
.service('audioContext', function ()
{
    var AudioContext = window.AudioContext || window.webkitAudioContext
    return new AudioContext()
})