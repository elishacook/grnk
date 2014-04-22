(function ()
{ 'use strict';

var KEY_BACKSPACE = 8
var KEY_TAB = 9
var KEY_ENTER = 13
var KEY_ESC = 27
var KEY_0 = 48
var KEY_9 = 57
var KEY_DOT = 190

Polymer('grnk-number',
{
    publish:
    {
        value: 120,
        min: 1,
        max: 300,
        step: 1
    },
    
    ready: function ()
    {
        this.$.input.value = this.value
    },
    
    observe:
    {
        value: function (oldVal, newVal)
        {
            this.$.input.value = newVal
            this.$.display.innerHTML = newVal
        },
        
        min: 'adjustRange',
        max: 'adjustRange'
    },
    
    adjustRange: function ()
    {
        this.size = Math.max((''+this.min).length, (''+this.max).length)
        this.value = this.clamp(this.value)
    },
    
    clamp: function (value)
    {
        if (value < this.min)
        {
            return this.min
        }
        else if (this.max < value)
        {
            return this.max
        }
        else
        {
            return value
        }
    },
    
    doubleClickDisplay: function (e)
    {
        e.preventDefault()
        this.showInput()
    },
    
    showInput: function ()
    {
        this.$.input.style.display = 'block'
        this.$.input.focus()
        this.$.input.select()
    },
    
    hideInput: function ()
    {
        this.$.input.style.display = 'none'
    },
    
    cancelInput: function ()
    {
        this.hideInput()
        this.$.input.value = this.value  
    },
    
    confirmInput: function ()
    {
        this.value = this.clamp(this.$.input.value)
        this.hideInput()
    },
    
    inputKeyDown: function (e)
    {
        switch(e.which)
        {
            case KEY_ENTER:
                this.confirmInput()
                break
            case KEY_ESC:
                this.cancelInput()
                break
            case KEY_TAB:
            case KEY_BACKSPACE:
                break
            default:
                if ((e.which > KEY_9 || e.which < KEY_0) &&
                    (e.which != KEY_DOT || -1 < this.$.input.value.indexOf('.')))
                {
                    e.preventDefault()
                }
        }
    },
    
    inputBlur: function (e)
    {
        this.confirmInput()
    },
    
    dragStart: function (e)
    {
        
    },
    
    dragMove: function (e)
    {
        
    },
    
    dragEnd: function (e)
    {
        
    }
})

})()