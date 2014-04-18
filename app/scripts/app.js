var app = angular.module("grnk", ["ngRoute", "templates"]);

app.controller("AppCtrl", function ($scope, $timeout, audioContext, Clock, RemoteFile)
{
    // Workaround so that the clock starts
    audioContext.createGainNode()
    
    $scope.disabled = true
    $scope.clock = new Clock()
    
    var wavs = {}
    $scope.clock.ontick = function ()
    {
        var kick, snare, hihat, hiss
        
        if (this.tickNumber === 0)
        {
            kick = audioContext.createBufferSource()
            kick.buffer = wavs.kick
            kick.connect(audioContext.destination)
            kick.start(this.tickTime)
        }
        
        if (this.tickNumber == 2)
        {
            hihat = audioContext.createBufferSource()
            hihat.buffer = wavs.hihat
            hihat.connect(audioContext.destination)
            hihat.start(this.tickTime)
        }
        
        if ((this.beatNumber === 1 || this.beatNumber == 3) && this.tickNumber === 0)
        {
            snare = audioContext.createBufferSource()
            snare.buffer = wavs.snare
            snare.connect(audioContext.destination)
            snare.start(this.tickTime)
        }
        
        if (this.beatNumber == 2 && this.tickNumber == 2)
        {
            hiss = audioContext.createBufferSource()
            hiss.buffer = wavs.hiss
            hiss.connect(audioContext.destination)
            hiss.start(this.tickTime)
        }
        
        $timeout(function () {})
    }
    
    RemoteFile.load([
            "/wav/kick.wav", 
            "/wav/snare.wav", 
            "/wav/hihat.wav", 
            "/wav/hiss.wav"
        ])
        .then(function (files)
        {
            Object.keys(files).forEach(function (url)
            {
                var file = files[url]
                if (!file.buffer)
                {
                    console.error('Couldn\'t load ' + url)
                }
                else
                {
                    var name = url.replace(/^\/wav\/([^\.]+)\.wav$/i, '$1')
                    wavs[name] = file.buffer
                }
            })
            
            $timeout(function ()
            {
                $scope.disabled = false
            })
        })
})

app.filter('songTime', function ()
{
    return function (value)
    {
        var hours = Math.floor(value / 3600),
            minutes = Math.floor(value / 60) % 60,
            seconds = (value - hours * 3600 - minutes * 60).toFixed(2)
            
        return '' + (hours < 10 ? '0' : '') + hours + ':' +
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds
    }
})