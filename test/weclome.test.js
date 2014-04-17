(function () { 'use strict';

describe('WelcomeCtrl', function ()
{
    var scope;
    beforeEach(angular.mock.module('grnk'));
    beforeEach(angular.mock.inject(function ($rootScope, $controller)
    {
        scope = $rootScope.$new()
        $controller('WelcomeCtrl', { $scope: scope })
    }));
    
    it("Should have a `foo` that says 'there'", function ()
    {
        expect(scope.foo).toBe('there')
    });
});

})()