/* global describe, beforeEach, module, it, expect, inject, jasmine */

describe('ml-results', function () {
  'use strict';

  var elem, $scope, $compile, $rootScope, $templateCache;

  var results = [
    { uri: '/docs/doc1.xml' },
    { uri: '/docs/doc2.xml' },
    { uri: '/docs/doc3.xml' }
  ];

  beforeEach(module('ml.search'));
  beforeEach(module('ml.search.tpls'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');

    $scope = $rootScope.$new();
    $scope.results = results;

    elem = angular.element('<ml-results results="results"></ml-results>');

    $compile(elem)($scope);
    $scope.$digest();
  }));

  describe('#defaults', function () {

    beforeEach(function() {
      elem = angular.element('<ml-results results="results"></ml-results>');
      $compile(elem)($scope);
      $scope.$digest();
    });

    it('should repeat for each result', function() {
      expect( elem.find('> div').length ).toEqual( results.length );
    });

    it('should create a default link property', function() {
      _.each(results, function(result) {
        expect( result.link ).toBeDefined;
        expect( result.link ).toEqual( '/detail?uri=' + encodeURIComponent( result.uri ) );
      });
    });
  });

  describe('#link-function', function () {

    beforeEach(function() {
      $scope.linkTarget = jasmine.createSpy('linkTarget');

      elem = angular.element('<ml-results results="results" link="linkTarget(result)"></ml-results>');
      $compile(elem)($scope);
      $scope.$digest();
    });

    it('should call custom link function', function() {
      expect( $scope.linkTarget ).toHaveBeenCalled();
      expect( $scope.linkTarget.calls.count() ).toEqual( results.length );
    });
  });

  describe('#custom-template', function () {

    beforeEach(inject(function($injector) {
      $templateCache = $injector.get('$templateCache');
      $templateCache.put( '/my-template.html', '<div class="custom-results"></div>' );

      elem = angular.element( '<ml-results results="results" template="/my-template.html"></ml-results>' );
      $compile(elem)($scope);
      $scope.$digest();
    }));

    it('should contain template', function() {
      expect(elem.find('.custom-results').length).toEqual(1);
    });

  });

});
