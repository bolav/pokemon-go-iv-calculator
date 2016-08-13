
var chai = require('chai');

var assert = chai.assert;
var calc = require('../index.js');

describe('calculator', function () {
  describe('evaluate', function () {
    const result = calc.evaluate('Ivysaur', 608, 59, 1600);
  	it('should return F', function () {
      assert.equal(result.grade.averageGrade.letter, 'F', 'Gives F');
	  }),
    it('should have 3 alternatives', function () {
      assert.equal(result.ivs.length, 3, '3 alternatives');
    });
  });

  const atk1 = {
    name: 'Lapras',
    fast: 'Frost Breath',
    special: 'Blizzard',
    cp: '1636',
    hp: '161',
    star_dust: '2500',
    staminaIV: '11',
    attackIV: '11',
    defenseIV: '10'
  }
  const atk2 = {
    name: 'Dragonite',
    fast: 'Steel Wing',
    special: 'Hyper Beam',
    cp: '1945',
    hp: '111',
    star_dust: '2500',
    staminaIV: '2',
    attackIV: '15',
    defenseIV: '7'
  }

  const def = {
    name: 'Snorlax',
    fast: 'Sleep',
    special: 'Now',
    cp: '1797',
    trainer_level: '22',
    assume_ivs: '5'
  }

  describe('TDO_Cur', function () {}),
  describe('TDO_Def', function () {}),
  describe('Winner_HP_pct', function () {}),
  describe('NO_Fast_Attacks', function () {}),
  describe('TDO_Cur', function () {}),
  describe('TDO_Cur', function () {}),
  describe('TTK_atk', function () {}),
  describe('TTK_def', function () {}),
  describe('DPS_atk', function () {}),
  describe('DPS_def', function () {}),
  describe('pokemonLevel', function () {
    it('should return correct level', function () {
      assert.equal(calc.pokemonLevel(atk1).level, 20, 'level is 20');
      assert.equal(calc.pokemonLevel(atk2).level, 20.5, 'level is 20.5');
    });
  }),
  describe('pokemonAtk', function () {
    it('should return correct attack', function () {
      assert.equal(calc.pokemonAtk(atk1), 117.7, 'atk is 117.7');
      assert.equal(calc.pokemonAtk(atk2), 160.3, 'atk is 160.3');
    });
  }),
  describe('fastDPS', function () {
    it('should return correct fastDPS', function () {
      assert.equal(calc.fastDPS(atk1), 7.41, 'Fast_DPS is 7.41');
      assert.equal(calc.fastDPS(atk2), 7.52, 'Fast_DPS is 7.52');
    });
  });
  describe('Spec_DPS', function () {}),
  describe('Combo_DPS', function () {}),
  describe('Fast_pct', function () {});

});
