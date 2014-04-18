angular.module('grnk')

.directive('grnkNumber', function ()
{
    return {
        restrict: 'E',
        template: '<input size="4" type="text" ng-model="amount">',
        replace: true,
        scope:
        {
            amount: '='
        },
        link: function (scope, elm, attr, controller)
        {
            var update = function ()
            {
                scope.$apply(function ()
                {
                    scope.value = parseInt(elm.val())
                })
            }
            
            elm
                .unbind('input')
                .bind('blur', update)
                .bind('keydown', function (e)
                {
                    if (e.which == 8 || e.which == 9)
                    {
                        return
                    }
                    else if (e.which == 13)
                    {
                        update()
                    }
                    else if (e.which < 48 || e.which > 57)
                    {
                        e.preventDefault()
                    }
                })
        }
    }
})