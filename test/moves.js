
var chai = require('chai');

var assert = chai.assert;
var moves = require('../support/fastMovesData.js');

describe('fastMovesData', function () {
  describe('allMoves', function () {
  	it('should be an array', function () {
      assert.typeOf(moves.allMoves(), 'array');
	  });
  }),
  describe('moveByName', function () {
    it('should return the correct value', function () {
      var move = moves.moveByName('Frost Breath');
      assert.equal(move.name, 'Frost Breath', 'correct name');
      assert.equal(move.power, 9, 'correct power');
    });
  }),
  describe('moveById', function () {
    it('should return the correct value', function () {
      var move = moves.moveById('218');
      assert.equal(move.name, 'Frost Breath', 'correct name');
      assert.equal(move.power, 9, 'correct power');
    })
  });

});
