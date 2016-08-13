
var chai = require('chai');

var assert = chai.assert;
var fastmoves = require('../support/fastMovesData.js');
var specmoves = require('../support/specialMovesData.js');

describe('fastMovesData', function () {
  describe('allMoves', function () {
  	it('should be an array', function () {
      assert.typeOf(fastmoves.allMoves(), 'array');
	  });
  }),
  describe('moveByName', function () {
    it('should return the correct value', function () {
      var move = fastmoves.moveByName('Frost Breath');
      assert.equal(move.name, 'Frost Breath', 'correct name');
      assert.equal(move.power, 9, 'correct power');
    });
  }),
  describe('moveById', function () {
    it('should return the correct value', function () {
      var move = fastmoves.moveById('218');
      assert.equal(move.name, 'Frost Breath', 'correct name');
      assert.equal(move.power, 9, 'correct power');
    })
  });

}),
describe('specialMovesData', function () {
  describe('allMoves', function () {
    it('should be an array', function () {
      assert.typeOf(specmoves.allMoves(), 'array');
    });
  }),
  describe('moveByName', function () {
    it('should return the correct value', function () {
      var move = specmoves.moveByName('Blizzard');
      assert.equal(move.name, 'Blizzard', 'correct name');
      assert.equal(move.pwr, 100, 'correct power');
    });
  });

});

