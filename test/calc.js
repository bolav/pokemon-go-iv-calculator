
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
  const atk3 = {
    name: 'Rhydon',
    fast: 'Rock Smash',
    special: 'Megahorn',
    cp: '430',
    hp: '76',
    star_dust: '800',
    staminaIV: '9',
    attackIV: '15',
    defenseIV: '14'
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
  describe('moveSet', function () {
    it('should return correct power', function () {
      assert.equal(calc.moveSet(atk1).fastPower, 9, 'Correct power is 9');
      assert.equal(calc.moveSet(atk2).fastPower, 15, 'Correct power is 15');
    })
  }),
  describe('pokemonLevel', function () {
    it('should return correct level', function () {
      assert.equal(calc.pokemonLevel(atk1).lvl, 20, 'level is 20');
      assert.equal(calc.pokemonLevel(atk2).lvl, 20.5, 'level is 20.5');
      assert.equal(calc.pokemonLevel(def).lvl, 22, 'level is 22');
    });
  }),
  describe('pokemonAtk', function () {
    it('should return correct attack', function () {
      assert.approximately(calc.pokemonAtk(atk1), 117.7, 0.1, 'atk is 117.7');
      assert.approximately(calc.pokemonAtk(atk2), 160.3, 0.1, 'atk is 160.3');
    });
  }),
  describe('pokemonDef', function () {
    it('should return correct defense', function () {
      assert.approximately(calc.pokemonDef(def), 121.82, 0.1, 'def is 121.82');
    });
  }),
  describe('fastDPS', function () {
    it('should return correct fastDPS', function () {
      assert.approximately(calc.fastDPS(atk1, def), 7.41, 0.01, 'Fast_DPS is 7.41');
      assert.approximately(calc.fastDPS(atk2, def), 7.52, 0.01, 'Fast_DPS is 7.52');
      assert.approximately(calc.fastDPS(atk3, def), 3.55, 0.01, 'Fast_DPS is 3.55');
    });
  });
  describe('Spec_DPS', function () {}),
  describe('Combo_DPS', function () {}),
  describe('Fast_pct', function () {});

});
