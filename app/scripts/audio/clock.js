angular.module('grnk')

.factory('Clock', function (audioContext)
{
    var Clock = function ()
    {
        this._bound_schedule = this._schedule.bind(this)
    }
    Clock.prototype = 
    {
        // How far to schedule ahead
        lookahead: 0.1,
        
        // The time between scheduling events
        interval: 0.025,
        
        // Tempo and meter
        beatsPerMinute: 125,
        beatsPerBar: 4,
        ticksPerBeat: 4,
        
        // Position
        barNumber: 0,
        beatNumber: 0,
        tickNumber: 0,
        
        // Absolute time (seconds)
        tickDuration: 0,
        tickTime: 0,
        elapsed: 0,
        time: 0,
        offset: 0,
        startTime: 0,
        
        // Running
        running: false,
        paused: false,
        timeout: null,
        
        // Called when there is a tick
        ontick: function (clock) {},
        
        play: function ()
        {
            if (this.running)
            {
                return
            }
            
            if (this.timeout)
            {
                clearTimeout(this.timeout)
            }
            
            if (this.paused)
            {
                var oldtime = this.time
                this.time = audioContext.currentTime
                var offset = this.time - oldtime
                this.tickTime += offset
                this.offset += offset
            }
            else
            {
                this.time = audioContext.currentTime
                this.startTime = this.time
            }
            
            this.running = true
            this._schedule()
        },
        
        pause: function ()
        {
            this.running = false
            this.paused = true
            if (this.timeout)
            {
                clearTimeout(this.timeout)
            }
        },
        
        stop: function ()
        {
            this.paused = false
            this.pause()
            this.reset()
        },
        
        reset: function ()
        {
            this.barNumber = 0
            this.beatNumber = 0
            this.tickNumber = 0
            this.tickDuration = 0
            this.tickTime = 0
            this.elapsed = 0
            this.time = 0
            this.startTime = 0
            this.offset = 0
        },
        
        _schedule: function ()
        {
            if (!this.running)
            {
                return
            }
            
            this.time = audioContext.currentTime
            this.elapsed = this.time - this.startTime - this.offset
            
            while (this.tickTime < this.time + this.lookahead)
            {
                this.ontick.apply(this)
                this._updatePosition()
            }
            
            var nextScheduleTime = this.time + this.interval,
                interval = nextScheduleTime - audioContext.currentTime
            this.timeout = setTimeout(this._bound_schedule, interval * 1000)
        },
        
        _updatePosition: function ()
        {
            this.tickDuration = 60.0 / this.beatsPerMinute / this.ticksPerBeat
            this.tickTime = this.tickTime + this.tickDuration
            this.tickNumber = (this.tickNumber + 1) % this.ticksPerBeat
            
            if (this.tickNumber === 0)
            {
                this.beatNumber = (this.beatNumber + 1) % this.beatsPerBar
                
                if (this.beatNumber === 0)
                {
                    this.barNumber += 1
                }
            }
        }
    }
    
    return Clock
})