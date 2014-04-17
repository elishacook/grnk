var app = angular.module("grnk", ["ngRoute", "templates"]);

app.controller("AppCtrl", function ($scope, context, RemoteFile)
{
    RemoteFile.load(["/wav/kick.wav", "/wav/snare.wav", "/wav/hihat.wav"])
        .then(function (files)
        {
            var offset = 0.14,
                t = 0
                
            Object.keys(files).forEach(function (url)
            {
                var file = files[url]
                if (!file.buffer)
                {
                    console.error('Couldn\'t load ' + url)
                }
                else
                {
                    var src = context.createBufferSource()
                    src.buffer = file.buffer
                    src.connect(context.destination)
                    src.start(t)
                    t += offset
                }
            })
        }, function ()
        {
            console.error("Couldn't load wav file")
        }, function (progress)
        {
            console.log(progress)
        })
})