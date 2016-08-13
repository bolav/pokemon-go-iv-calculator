
const _ = require('underscore');
const pokedex = require('./support/pokedex');
const levelUpData = require('./support/levelUpData');
const grader = require('./support/grader');
const fastMoves = require('./support/fastMovesData');
const specialMoves = require('./support/specialMovesData');
const multipliers = require('./support/multipliers');

function testHP(hp, iv, levelData, pokemon) {
	return hp == parseInt(Math.floor((pokemon.stamina + iv) * levelData.cpScalar), 10);
}

function testCP(cp, attackIV, defenseIV, staminaIV, levelData, pokemon) {
	const attackFactor = pokemon.attack + attackIV;
	const defenseFactor = Math.pow(pokemon.defense + defenseIV, 0.5)
	const staminaFactor = Math.pow((pokemon.stamina + staminaIV), 0.5);
	const scalarFactor = Math.pow(levelData.cpScalar, 2);
	return cp == parseInt(attackFactor * defenseFactor * staminaFactor * scalarFactor / 10, 10);
}

function determinePerfection(ivs) {
	const perfection = (ivs.attackIV + ivs.defenseIV + ivs.staminaIV) / 45
	return Math.floor(perfection * 100) / 100;
}

function getPokemon (pokemonQuery) {
	const pokemon = pokedex.pokemonByName(pokemonQuery) || pokedex.pokemonById(pokemonQuery);
	if (!pokemon) {
		return {error : `Could not find pokemon: ${pokemonQuery}`};
	}
	return pokemon;
}

function calcCP(attackIV, defenseIV, staminaIV, levelData, pokemon) {
	const attackFactor = pokemon.attack + attackIV;
	const defenseFactor = Math.pow(pokemon.defense + defenseIV, 0.5)
	const staminaFactor = Math.pow((pokemon.stamina + staminaIV), 0.5);
	const scalarFactor = Math.pow(levelData.cpScalar, 2);
	return parseInt(attackFactor * defenseFactor * staminaFactor * scalarFactor / 10, 10);
}


function levelFromCP (pokemonQuery, cp) {
	const pokemon = pokedex.pokemonByName(pokemonQuery) || pokedex.pokemonById(pokemonQuery);
	if (!pokemon) {
		return {error : `Could not find pokemon: ${pokemonQuery}`};
	}
	var lvl = levelUpData.allLevels();
	var potentialIVs = [];

	var lvlSum = 0;
	var n = 0;
	var m = 0;

	for (levelIndex = 0; levelIndex < lvl.length; levelIndex++) {
		if (calcCP(0, 0, 0, lvl[levelIndex], pokemon) > cp) {
			continue;
		}
		if (calcCP(15, 15, 15, lvl[levelIndex], pokemon) < cp) {
			continue;
		}
		for (staminaIV = 0; staminaIV <= 15; staminaIV++) {
			for (attackIV = 0; attackIV <= 15; attackIV++) {
				for (defenseIV = 0; defenseIV <= 15; defenseIV++) {

					m = m + 1;
					if (testCP(cp, attackIV, defenseIV, staminaIV, lvl[levelIndex], pokemon)) {
						lvlSum = lvlSum + lvl[levelIndex].level;
						n = n + 1;
						potentialIVs.push({
							attackIV, defenseIV, staminaIV,
							level : lvl[levelIndex].level
						})
					}
				}
			}
		}
	}

console.log(m);
	return lvl[Math.round(lvlSum / n) - 2];
}

/**
 * Evaluate a given pokemon
 * @param {string|number} Pokemon Query (e.g. "2" or "Ivysaur")
 * @param {number} CP
 * @param {number} HP
 * @param {number} dustCost Dust cost of upgrading pokemon
 * @param {bool} neverUpgraded If you've never powered it up, fewer potential levels
 */
function evaluate (pokemonQuery, cp, hp, dustCost, neverUpgraded) {
	const pokemon = pokedex.pokemonByName(pokemonQuery) || pokedex.pokemonById(pokemonQuery);
	if (!pokemon) {
		return {error : `Could not find pokemon: ${pokemonQuery}`};
	}
	var potentialIVs = determinePossibleIVs(pokemon, cp, hp, dustCost, neverUpgraded);

	_.each(potentialIVs, function (possibility) {
		possibility.perfection = determinePerfection(possibility);
	});

	potentialIVs.sort(function (a, b) {
		if (a.perfection == b.perfection) {
			return 0;
		}
		return a.perfection > b.perfection ? 1 : -1;
	})

	var pokeSnapshot = {
		grade : grader.grade(_.map(potentialIVs, determinePerfection)),
		ivs : potentialIVs
	};

	return pokeSnapshot;
}

function determinePossibleIVs (pokemon, cp, hp, dust, neverUpgraded) {
	var potentialLevels = levelUpData.levelsByDust(dust);
	potentialLevels.sort(function (a, b) {
		return a.level > b.level ? 1 : -1;//no dupes
	});
	if (neverUpgraded) {
		potentialLevels = _.filter(potentialLevels, function (data) {
			return data.level % 2 === 0;
		});
	}

	var staminaIV, attackIV, defenseIV;
	var potentialHPIVs = [];

	var levelIndex;
	var levelData;
	for (levelIndex = 0; levelIndex < potentialLevels.length; levelIndex++) {
		levelData = potentialLevels[levelIndex];

		for (staminaIV = 0; staminaIV <= 15; staminaIV++) {
			if (testHP(hp, staminaIV, levelData, pokemon)) {
				potentialHPIVs.push({
					levelData,
					iv : staminaIV
				});
			}
		}

	}

	var hpIVIndex;
	var potentialIVs = [];
	for (hpIVIndex = 0; hpIVIndex < potentialHPIVs.length; hpIVIndex++) {
		staminaIV = potentialHPIVs[hpIVIndex].iv;
		levelData = potentialHPIVs[hpIVIndex].levelData;
		for (attackIV = 0; attackIV <= 15; attackIV++) {
			for (defenseIV = 0; defenseIV <= 15; defenseIV++) {
				if (testCP(cp, attackIV, defenseIV, staminaIV, levelData, pokemon)) {
					potentialIVs.push({
						attackIV, defenseIV, staminaIV,
						level : levelData.level
					})
				}
			}
		}
	}

	return potentialIVs;
}

/**
 * Determine possible IVs for a given pokemon
 * @param {string|number} Pokemon Query (e.g. "2" or "Ivysaur")
 * @param {number} CP
 * @param {number} HP
 * @param {number} dustCost Dust cost of upgrading pokemon
 * @param {bool} neverUpgraded If you've never powered it up, fewer potential levels
 */
function possibleIVs (pokemonQuery, cp, hp, dustCost, neverUpgraded) {
	const pokemon = pokedex.pokemonByName(pokemonQuery) || pokedex.pokemonById(pokemonQuery);
	if (!pokemon) {
		return {error:`Could not find pokemon: ${pokemonQuery}`};
	}
	const ivs = determinePossibleIVs(pokemon, cp, hp, dustCost, neverUpgraded);
	if (!ivs.length) {
		return {error: `Could not find any IVs matching given information`};
	}
	return {ivs};
}


// https://redd.it/4uffha

var damageMultiplier = 0.5;
var damageConstant = 0.5;

function pokemonLevel (pokemon) {
	if (pokemon.level) {
		return pokemon.level;
	}

	// MIN(MATCH($I2,$CpM_RAW.$C$2:$C$80,0)/2+2,
	// MAX(MATCH($I2,$CpM_RAW.$C$2:$C$80,0)/2+0.5,
	// MATCH(SQRT(G2*10/((INDEX($PokeDex_RAW.$C$2:$E$152,$Y2,1)+K2)^0.5*(INDEX($PokeDex_RAW.$C$2:$E$152,$Y2,2)+L2)*(INDEX($PokeDex_RAW.$C$2:$E$152,$Y2,3)+M2)^0.5))-0.0001,$CpM_RAW.$B$2:$B$80,1)/2+1))
	// Minste : 
	// level + 1
	// max
	// level + 0.5
	if (pokemon.star_dust) {
		var min = { level: 81 };
		var max = { level: 0 };
		var potentialLevels = levelUpData.levelsByDust(pokemon.star_dust);
		for (var i = 0; i < potentialLevels.length; i++) {
			if (max.level < potentialLevels[i].level) {
				max = potentialLevels[i];
			}
			if (min.level > potentialLevels[i].level) {
				min = potentialLevels[i];
			}
		}

		var lvl = max;
		var foundLvl = 0;

		var ivs = possibleIVs(pokemon.name, pokemon.cp, pokemon.hp, pokemon.star_dust)
		for (var i = 0; i < ivs.ivs.length; i++) {
			var cur_iv = ivs.ivs[i];
			if (
				( cur_iv.attackIV == pokemon.attackIV )
				&& (cur_iv.staminaIV == pokemon.staminaIV)
				&& (cur_iv.defenseIV == pokemon.defenseIV)
			) {
				foundLvl = cur_iv.level;
				break;
			}
		}

		if (foundLvl) {
			for (var i = 0; i < potentialLevels[i].level; i++) {
				if (potentialLevels[i].level == foundLvl) {
					lvl = potentialLevels[i];
					break;
				}
			}
		}

		lvl.lvl = lvl.level / 2;
		pokemon.level = lvl;
	}

	if (pokemon.trainer_level) {
		// =MIN(B5+1.5,MATCH(SQRT(B4*10/((INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,1)+$B$6)^0.5*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,2)+$B$6)*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,3)+$B$6)^0.5))-0.0001,$CpM_RAW.$B$2:$B$80,1)/2+0.5)
		// MIN(max_lvl, )
		// sqrt( cp * 10 / ((stam + iv)^2 * (atk + iv) * def + iv )^2)
		// stam, atk, def
		var max = levelUpData.levelByLevel((pokemon.trainer_level * 2) + 3);
		var pd  = getPokedex(pokemon);
		var ivs = getIVs(pokemon);
		var lvl = levelUpData.closestCPM( Math.sqrt( pokemon.cp * 10 / ( Math.pow(pd.stamina + ivs.stamina,0.5) * (pd.attack + ivs.attack) * Math.pow(pd.defense + ivs.defense,0.5)  )) )
		if (max.level < lvl.level) {
			lvl = max;
		}

		lvl.lvl = lvl.level / 2;
		pokemon.level = lvl;
	}
	return pokemon.level;
}


function getPokedex(pokemon) {
	if (pokemon.pokedex) {
		return pokemon.pokedex;
	}
	pokemon.pokedex = pokedex.pokemonByName(pokemon.name) || pokedex.pokemonById(pokemon.name);
	if (!pokemon.pokedex) {
		return {error : `Could not find pokemon: ${pokemonQuery}`};
	}
	return pokemon.pokedex;

}

function getIVs(pokemon) {
	if (pokemon.ivs) {
		return pokemon.ivs;
	}
	if (("attackIV" in pokemon) && ("defenseIV" in pokemon) && ("staminaIV" in pokemon)) {
		var iv = { 
			attack: +pokemon.attackIV,
			defense: +pokemon.defenseIV,
			stamina: +pokemon.staminaIV
		}
		pokemon.ivs = iv;
		return iv;
	}
	if (pokemon.assume_ivs) {
		var iv = { 
			attack: +pokemon.assume_ivs,
			defense: +pokemon.assume_ivs,
			stamina: +pokemon.assume_ivs
		}
		pokemon.ivs = iv;
		return iv;
	}
}

function pokemonAtk (pokemon) {
	// =INDEX($CpM_RAW.$B$2:$B$80,$AA2*2-1)*(INDEX($PokeDex_RAW.C$2:E$152,$Y2,2)+L2)

	var lvl = pokemonLevel(pokemon);
	var pd  = getPokedex(pokemon);
	var iv  = getIVs(pokemon);

	return Math.round(lvl.cpScalar * (pd.attack + iv.attack) * 10) / 10;
}

function pokemondCpM (pokemon) {
	// =((B4*10/((INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,1)+$B$6)^0.5*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,2)+$B$6)*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,3)+$B$6)^0.5))-(B4*10/((INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,1)+15)^0.5*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,2)+15)*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,3)+15)^0.5)))/INDEX($CpM_RAW.$B$2:$B$80,$B$15*2-1)

	// -(B4*10/((INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,1)+15)^0.5*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,2)+15)*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,3)+15)^0.5)))/INDEX($CpM_RAW.$B$2:$B$80,$B$15*2-1)

	var ivs = getIVs(pokemon);
	var pd  = getPokedex(pokemon);
	var lvl = pokemonLevel(pokemon);

	var a1 = pokemon.cp * 10 / (Math.pow(pd.stamina + ivs.stamina,0.5) * (pd.attack + ivs.attack) * Math.pow(pd.defense + ivs.defense,0.5));
	var a2 = pokemon.cp * 10 / (Math.pow(pd.stamina + 15,0.5) * (pd.attack + 15) * Math.pow(pd.defense + 15,0.5));

	var dCpM = (a1 - a2) / lvl.cpScalar;
	return dCpM;
}

function pokemonDef (pokemon) {
	// =INDEX($CpM_RAW.$B$2:$B$80,$B$15*2-1)*(INDEX($PokeDex_RAW.$C$2:$E$152,$B$3,3)+$B$6+(15-$B$6)*(1-$B$14))
	// cpm * def + iv.def + (15 - iv.def) * (1 - dCpm)
	var lvl = pokemonLevel(pokemon);
	var pd  = getPokedex(pokemon);
	var iv  = getIVs(pokemon);

	var dCpM = pokemondCpM(pokemon);

	return lvl.cpScalar * (pd.defense + iv.defense + (15 - iv.defense) * (1 - dCpM));

	// return Math.round(lvl.cpScalar * (pd.defense + iv.defense + (15 - iv.defense) * (1 - dCpM)) * 100) / 100;
}

function moveSet(pokemon) {
	if (pokemon.moveSet) {
		return pokemon.moveSet;
	}
	var fast = fastMoves.moveByName(pokemon.fast);
	var pd   = getPokedex(pokemon);
	var ms   = {};

	ms.fastType       = fast.type;
	ms.fastPower      = fast.power;
	ms.fastName       = fast.name;
	ms.fastDuration   = fast.duration / 1000;
	if (
		(fast.type.toLowerCase() === pd.type1.toLowerCase())
		|| (fast.type.toLowerCase() === pd.type2.toLowerCase())

	) {
		ms.fastMultiplier = 1.25;
	}
	else {
		ms.fastMultiplier = 1;
	}
	pokemon.moveSet = ms;
	return ms;
}

function getMultiplier(atkType, defType) {
	return multipliers[defType.toUpperCase().substring(0,3)][atkType];
}

function fastDPS (attacker, defender) {
	// My_Team.AL
	/* =ROUND((($Inputs.$B$30*$AC2*INDEX($Move_Sets.$O$3:$O$854,$Z2)/$B$18)*INDEX($Move_Sets.$R$3:$R$854,$Z2)*AQ2+$Inputs.$B$31),0)/INDEX($Move_Sets.$P$3:$P$854,$Z2) */
	//         (   dmgMult   * atk * moveSet.fastPower              / def_def )  * fastMultiplier * mod_fast + dmg_Constant / fastDuration 


	// =INDEX($Multipliers_RAW.$B$3:$T$21,INDEX($Move_Sets.$N$3:$N$854,$Z2),INDEX($Move_Sets.$E$3:$E$854,$My_Team.$B$24))*INDEX($Multipliers_RAW.$B$3:$T$21,INDEX($Move_Sets.$N$3:$N$854,$Z2),INDEX($Move_Sets.$F$3:$F$854,$My_Team.$B$24))
	//                                         fast_type                              defender_type                      *  fast_type  def_type2

	var ms       = moveSet(attacker);
	var def      = getPokedex(defender);
	var modifier = getMultiplier(ms.fastType, def.type1) * getMultiplier(ms.fastType, def.type2);

	var a1 = damageMultiplier * pokemonAtk(attacker) * ms.fastPower / pokemonDef(defender);
	var a2 = Math.round(a1 * ms.fastMultiplier * modifier + damageConstant);
	return a2 / ms.fastDuration;


}

module.exports = {
	evaluate,
	possibleIVs,
	levelFromCP,
	getPokemon,

	fastDPS,
	pokemonAtk,
	pokemonDef,
	pokemonLevel,
	moveSet
};

