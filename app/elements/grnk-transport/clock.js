depin.define('GrnkClock', function (grnkAudioContext)
{
    'use strict';
    
    // Workaround so that the clock starts even
    // if no audio nodes have been created
    grnkAudioContext.createGainNode()
    
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
        _beatsPerMinute: 125,
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
        
        // Called when the elapsed time changes
        onelapse: function (clock) {},
        
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
                this.time = grnkAudioContext.currentTime
                var offset = this.time - oldtime
                this.tickTime += offset
                this.offset += offset
            }
            else
            {
                this.time = this.startTime = this.tickTime = grnkAudioContext.currentTime
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
        
        get beatsPerMinute()
        {
            return this._beatsPerMinute
        },
        
        set beatsPerMinute(value)
        {
            if (this.running)
            {
                if (this.timeout)
                {
                    clearTimeout(this.timeout)
                }
                
                this._previousTick()
                this._beatsPerMinute = value
                this._nextTick()
                this._schedule()
            }
            else
            {
                this._beatsPerMinute = value
            }
        },
        
        _schedule: function ()
        {
            if (!this.running)
            {
                return
            }
            
            this.time = grnkAudioContext.currentTime
            this.elapsed = this.time - this.startTime - this.offset
            this.onelapse(this)
            
            while (this.tickTime < this.time + this.lookahead)
            {
                this.ontick(this)
                this._nextTick()
            }
            
            var nextScheduleTime = this.time + this.interval,
                interval = nextScheduleTime - grnkAudioContext.currentTime
            this.timeout = setTimeout(this._bound_schedule, interval * 1000)
        },
        
        _nextTick: function ()
        {
            this.tickDuration = 60.0 / this._beatsPerMinute / this.ticksPerBeat
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
        },
        
        _previousTick: function ()
        {
            this.tickTime = this.tickTime - this.tickDuration
            
            if (this.tickNumber == 0)
            {
                this.tickNumber = this.ticksPerBeat - 1
                
                if (this.beatNumber == 0)
                {
                    this.beatNumber = this.beatsPerBar - 1
                    this.barNumber--
                }
                else
                {
                    this.beatNumber--
                }
            }
            else
            {
                this.tickNumber--
            }
        }
    }
    
    return Clock
})