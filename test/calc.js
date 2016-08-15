
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

  const atk1 = new calc.Pokemon({
    name: 'Lapras',
    fast: 'Frost Breath',
    special: 'Blizzard',
    cp: '1636',
    hp: '161',
    star_dust: '2500',
    staminaIV: '11',
    attackIV: '11',
    defenseIV: '10'
  });
  const atk2 = new calc.Pokemon({
    name: 'Dragonite',
    fast: 'Steel Wing',
    special: 'Hyper Beam',
    cp: '1945',
    hp: '111',
    star_dust: '2500',
    staminaIV: '2',
    attackIV: '15',
    defenseIV: '7'
  });
  const atk3 = new calc.Pokemon({
    name: 'Rhydon',
    fast: 'Rock Smash',
    special: 'Megahorn',
    cp: '430',
    hp: '76',
    star_dust: '800',
    staminaIV: '9',
    attackIV: '15',
    defenseIV: '14'
  });
  const def = new calc.Pokemon({
    name: 'Snorlax',
    fast: 'Lick',
    special: 'Hyper Beam',
    cp: '1797',
    trainer_level: '22',
    assume_ivs: '5'
  });

  describe('Pokemon class', function () {
    it('should return an object', function () {
      assert.typeOf(atk1, 'object');
    }),
    it('should be a function', function () {
      assert.typeOf(atk1.getHp, 'function');
    }),
    it('should return correct stam', function () {
      assert.approximately(atk1.getStam(), 161.9, 0.1, 'attack stamina');
      assert.approximately(def.getStam(), 178.6, 0.1, 'defense stamina');
    }),
    it('should return correct hp', function () {
      assert.equal(atk1.getHp(), 161);
      assert.equal(def.getHp(), 357);
    });

  }),
  describe('Winner_HP_pct', function () {}),
  describe('TTK', function () {
    it('should return correct TTK_atk', function () {
      assert.approximately(atk1.TTK_atk(def), 36.1, 0.1, 'TTK_atk is 36.1');
      assert.approximately(atk2.TTK_atk(def), 34.3, 0.1, 'TTK_atk is 34.3');
    }),
    it('should return correct TTK_def', function () {
      assert.approximately(atk1.TTK_def(def), 30.6, 0.1, 'TTK_def is 30.6');
      assert.approximately(atk2.TTK_def(def), 23.0, 0.1, 'TTK_def is 23.0');
    });
  }),
  describe('moveSet', function () {
    it('should return correct power', function () {
      assert.equal(atk1.moveSet().fastPower, 9, 'Correct power is 9');
      assert.equal(atk2.moveSet().fastPower, 15, 'Correct power is 15');
    })
  }),
  describe('getLevel', function () {
    it('should return correct level', function () {
      assert.equal(atk1.getLevel().lvl, 20, 'level is 20');
      assert.equal(atk2.getLevel().lvl, 20.5, 'level is 20.5');
      assert.equal(def.getLevel().lvl, 22, 'level is 22');
    });
  }),
  describe('getAtk', function () {
    it('should return correct attack', function () {
      assert.approximately(atk1.getAtk(), 117.7, 0.1, 'atk is 117.7');
      assert.approximately(atk2.getAtk(), 160.3, 0.1, 'atk is 160.3');
      assert.approximately(def.getAtk(), 121.82, 0.1, 'atk is 121.82');
    });
  }),
  describe('getDef', function () {
    it('should return correct defense', function () {
      assert.approximately(atk1.getDef(), 119.5, 0.1, 'def is 119.5');
      assert.approximately(atk2.getDef(), 132.5, 0.1, 'def is 132.5');
      assert.approximately(def.getDef(), 121.82, 0.1, 'def is 121.82');
    });
  }),
  describe('fastDPS', function () {
    it('should return correct fastDPS', function () {
      assert.approximately(atk1.fastDPS(def), 7.41, 0.01, 'Fast_DPS is 7.41');
      assert.approximately(atk2.fastDPS(def), 7.52, 0.01, 'Fast_DPS is 7.52');
      assert.approximately(atk3.fastDPS(def), 3.55, 0.01, 'Fast_DPS is 3.55');
      assert.approximately(def.fastDPS(), 1.07, 0.01, 'Fast_DPS is 3.55');
    });
  }),
  describe('fastPct', function () {
    it('should return correct fastPct', function () {
      assert.approximately(def.fastPct(atk1), 0.51, 0.01, 'fastPct is 0.51');
    });
  }),
  describe('EHP', function () {
    it('should return correct EHP', function () {
      assert.approximately(atk1.EHP(def), 148.1, 0.1, 'Correct EHP is 148.1');
      assert.approximately(atk2.EHP(def), 112.5, 0.1, 'Correct EHP is 112.5');
    });
  }),
  describe('h_xy', function () {
    it('should return correct h_xy', function () {
      assert.approximately(atk1.h_xy(), 20.0, 0.1, 'Correct h_xy is 20.0');
      assert.approximately(atk2.h_xy(), 15.2, 0.1, 'Correct h_xy is 15.2');
    });
  }),
  describe('DPS_def', function () {
    it('should return correct DPS_def', function () {
      assert.approximately(atk1.DPS_def(def), 5.26, 0.01, 'Correct DPS_def is 5.26');
      assert.approximately(atk2.DPS_def(def), 4.82, 0.01, 'Correct DPS_def is 4.82');
      assert.approximately(atk3.DPS_def(def), 10.37, 0.01, 'Correct DPS_def is 10.37');
    });
  }),
  describe('ereq', function () {
    it('should return correct ereq', function () {
      assert.approximately(atk1.ereq1(def), 75.15, 0.01, 'Correct ereq is 75.15');
      assert.approximately(atk1.ereq2(def), 70.93, 0.01, 'Correct ereq is 70.93');
      assert.approximately(atk1.ereq3(def), 71.82, 0.01, 'Correct ereq is 71.82');
      assert.approximately(atk2.ereq1(def), 83.43, 0.02, 'Correct ereq is 83.43');
      assert.approximately(atk2.ereq2(def), 70.89, 0.01, 'Correct ereq is 71.83');
      assert.approximately(atk2.ereq3(def), 73.18, 0.02, 'Correct ereq is 73.98');
    });
  }),
  describe('specialDPS', function () {
    it('should return correct specialDPS', function () {
      assert.approximately(atk1.specialDPS(def), 15.50, 0.02, 'specialDPS is 15.50');
      assert.approximately(atk2.specialDPS(def), 15.88, 0.02, 'specialDPS is 15.88');
      assert.approximately(atk3.specialDPS(def), 6.67, 0.02, 'specialDPS is 6.67');
    });
  });
  describe('comboDPS', function () {
    it('should return correct comboDPS', function () {
      assert.approximately(atk1.comboDPS(def), 9.89, 0.02, 'comboDPS is 9.89');
      assert.approximately(atk2.comboDPS(def), 10.43, 0.02, 'comboDPS is 10.43');
      assert.approximately(atk3.comboDPS(def), 5.14, 0.02, 'comboDPS is 5.14');
    });
  });

});
