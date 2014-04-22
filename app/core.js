depin
    .define("grnkAudioContext", function ()
    {
        var AudioContext = AudioContext || webkitAudioContext
        
        if (!AudioContext)
        {
            throw new Error("The Web Audio API is not supported by this browser.")
        }
        
        return new AudioContext()
    })