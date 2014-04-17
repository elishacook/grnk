exports.config = 
{
    files:
    {
        javascripts:
        {
            joinTo:
            {
                "js/app.js": /^app/,
                "js/vendor.js": /^(vendor|bower_components)/
            }
        },
        
        stylesheets:
        {
            joinTo:
            {
                "css/common.css": /^app/
            }
        },
        
        templates:
        {
            joinTo: 
            {
                "js/templates.js": /^app/
            }
        }
    },
    
    modules:
    {
        wrapper: false,
        definition: false
    },
    
    plugins:
    {
        jshint:
        {
            pattern: /^app\/.*\.js/,
            options:
            {
                asi: true
            }
        }
    }
}