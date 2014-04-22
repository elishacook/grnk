depin.run(function (GrnkClock)
{
    'use strict';
    
    Polymer('grnk-transport',
    {
        isPlaying: false,
        isPaused: false,
        isRecordArmed: false,
        
        ready: function ()
        {
            this.clock = new GrnkClock()
            this.clock.ontick = this.clockTick.bind(this)
            this.clock.onelapse = this.clockElapse.bind(this)
            this.setPosition(0)
        },
        
        clockTick: function (clock)
        {
            if (clock.tickNumber === 0)
            {
                this.$.metronome.className = 'on'
            }
            else
            {
                this.$.metronome.className = ''
            }
        },
        
        clockElapse: function (clock)
        {
            this.setPosition(clock.elapsed)
        },
        
        togglePlay: function ()
        {
            if (this.isPlaying)
            {
                this.pause()
            }
            else
            {
                this.play()
            }
        },
        
        play: function ()
        {
            if (this.isPlaying)
            {
                return
            }
            
            this.isPlaying = true
            this.isPaused = false
            this.$.play.className = 'active'
            this.$.play.title = 'Pause'
            this.clock.play()
            this.fire('play')
        },
        
        pause: function ()
        {
            if (this.isPaused)
            {
                this.play()
                return
            }
            
            this.isPlaying = false
            this.isPaused = true
            this.$.play.className = 'paused'
            this.$.play.title = 'Paused'
            this.$.metronome.className = ''
            this.clock.pause()
            this.fire('pause')
        },
        
        stop: function ()
        {
            if (!this.isPlaying && !this.isPaused)
            {
                return
            }
            
            this.isPlaying = false
            this.isPaused = false
            this.$.play.className = ''
            this.$.play.title = 'Play'
            this.$.metronome.className = ''
            this.clock.stop()
            this.setPosition(0)
            this.fire('stop')
        },
        
        toggleRecord: function ()
        {
            if (this.isRecordArmed)
            {
                this.isRecordArmed = false
                this.$.record.className = ''
                this.fire('disarmRecord')
            }
            else
            {
                this.isRecordArmed = true
                this.$.record.className = 'active'
                this.fire('armRecord')
            }
        },
        
        setPosition: function (seconds)
        {
            var hours = Math.floor(seconds / 3600),
                minutes = Math.floor(seconds / 60) % 60,
                seconds = (seconds - hours * 3600 - minutes * 60).toFixed(1),
                formatted = '' + (hours < 10 ? '0' : '') + hours + ':' +
                            (minutes < 10 ? '0' : '') + minutes + ':' +
                            (seconds < 10 ? '0' : '') + seconds
            this.$.position.innerHTML = formatted
        }
    })
})