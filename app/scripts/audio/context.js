angular.module('grnk')
.service('context', function ()
{
    var AudioContext = window.AudioContext || window.webkitAudioContext
    return new AudioContext()
})