angular.module('grnk')

.factory('RemoteFile', function ($q, audioContext)
{
    var loadOne = function (url)
    {
        var defer = $q.defer()
        
        var req = new XMLHttpRequest()
        req.open('GET', url, true)
        req.responseType = 'arraybuffer'
        
        req.onerror = function ()
        {
            defer.reject()
        }
        
        req.onprogress = function (e)
        {
            if (e.lengthComputable)
            {
                defer.notify(e.loaded / e.total)
            }
        }
        
        req.onload = function ()
        {
            if (req.status == 200)
            {
                audioContext.decodeAudioData(req.response, function (buffer)
                {
                    defer.resolve(buffer)
                })
            }
            else
            {
                defer.reject()
            }
        }
        
        req.send()
        
        return defer.promise
    }
    
    var loadMany = function (urls)
    {
        var defer = $q.defer(),
            states = {},
            total = urls.length,
            numCompleted = 0
        
        var oneDown = function ()
        {
            numCompleted++
            
            if (numCompleted == total)
            {
                defer.resolve(states)
            }
            else
            {
                defer.notify(states)
            }
        }
        
        urls.forEach(function (url)
        {
            states[url] = {
                url: url,
                buffer: null,
                progress: 0
            }
            
            loadOne(url).then(
                function (buffer)
                {
                    states[url].buffer = buffer
                    states[url].complete = true
                    oneDown()
                },
                function ()
                {
                    states[url].complete = true
                    oneDown()
                },
                function (progress)
                {
                    states[url].progress = progress
                    defer.notify(states)
                }
            )
        })
        
        return defer.promise
    }
    
    return {
        load: function (arg)
        {
            if (arg instanceof Array)
            {
                return loadMany(arg)
            }
            else
            {
                return loadOne(arg)
            }
        }
    }
})