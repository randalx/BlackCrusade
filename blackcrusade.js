//var PlaySound = PlaySound || {};
      
       //if (msg.type == "api" && msg.content.indexOf("!InfoDump") !== -1 && msg.who.indexOf("(GM)") !== -1) {
      
      // LOAD POWERCARD FORMATS
      on("ready", function() {
          log("-=> Black Crusade Script");
          //log (Date.now().toString().substr(0, 10));
      });        
      
      // API COMMAND HANDLER
      on("chat:message", function(msg) {
          if (msg.type !== "api") return;
          
          if(msg.content.indexOf("!sil") !== -1) {
                log(msg);
                
                log("------------GM");
                var player_obj = getObj("player", msg.playerid);
                log(player_obj);
                //_id
                //var character = getObj("character", msg.playerid);
                //log(character);
                
                log("------------Players");
                var players = findObjs({_type: 'player'});
                players.forEach(function(playr) {
                    log(playr);
                });
                
                
                
                var characters = findObjs({_type: 'character'});
               log("------------Characters");
               //this get's all the characters. controlled by is the player ids
                characters.forEach(function(chr) {
                   
                    //log(chr.get("name") + " " + chr.get("_type") + " " +  chr.get("controlledby"));
                    log(chr);
                });
                
               log("------------Tokens"); 
               //this gets tht tokens. which represent characters
               
                var tokenss = findObjs(
                    {
                        _type: 'graphic', 
                        _subtype:'token',
                        _pageid: Campaign().get("playerpageid"),
                    });
               // log(characters);
                tokenss.forEach(function(tok) {
                   // tok.set({
                    //    light_radius: 9
                    //});
                    //log(tok.get("light_radius"));
                    //log(tok.get("name") + ", " + tok.get("_type") + ", " + tok.get("_subtype") + ", " +  tok.get("_pageid") + ", " +  tok.get("represents") );
                    log(`name:${tok.get("name")}, _type:${tok.get("_type")}, _subtype:${tok.get("_subtype")}, _pageid:${tok.get("_pageid")}, represents:${tok.get("represents")}`  );
            
                });
                
                //for each token on the board
                //check if represents a character
                //check if the character is controlled by a player other than the gm
                log("----------------------Player Controlled TOkens");
                tokenss.forEach(function(tok) {
                    if (tok.represents) {
                        characters.forEach(function(chr) {
                            if (tok.represents === chr._id) {
                                //log("chr.name");
                                if (chr.controlledby && (chr.controlledby.length > 0)) {
                                    log(tok);
                                }
                                
                            }
                        });
                    }  
                    
                });
                
                
 
          }
          //light_dimradius: 1
          
          if(msg.content.indexOf("!edy") !== -1) {
          
              log (msg);
              //var player_obj = getObj("player", msg.playerid);
              var blackCrusadeMessage = new BlackCrusadeMessage(new Message(msg));
              var viewFactory = new ViewFactory();
              var cardHtml = "";
              var action = blackCrusadeMessage.action();
              
              if (action == 'attack') {
                  SoundFX.PlayWeaponSoundEffect(blackCrusadeMessage); //Sound Effect
                  var model = ModelFactory.CreateAttackModel(blackCrusadeMessage);
                  cardHtml = viewFactory.CreateAttackView(model);
              }
              else if (action == 'damage') {
                  var model = ModelFactory.CreateDamageModel(blackCrusadeMessage);
                  cardHtml = viewFactory.CreateDamageView(model);
              }
              else if (action == 'psyattack') {
                  var model = ModelFactory.CreatePsyAttackModel(blackCrusadeMessage);
                  cardHtml = viewFactory.CreatePsyAttackView(model);
              }
              else if (action == 'psyPhenom') {
                  var model = ModelFactory.CreatePsychicPhenomenonModel(blackCrusadeMessage);
                  cardHtml = viewFactory.CreatePsychicPhenomenonView(model);
              }
              else if (action == 'psyPerils') {
                  var model = ModelFactory.CreatePerilsOfTheWarpModel(blackCrusadeMessage);
                  cardHtml = viewFactory.CreatePerilsOfTheWarpView(model);
              }
              else if (action == 'psyDamage') {
                  var model = ModelFactory.CreatePsyDamageModel(blackCrusadeMessage);
                  cardHtml = viewFactory.CreateDamageView(model);
              }
              else if (action == 'zealousCrit') {
                  var model = ModelFactory.CreateZealousCritModel(blackCrusadeMessage);
                  cardHtml = viewFactory.CreateZealousCritView(model);
              }
              else {
                   log("Unknown Action!");
              }
              
              sendChat("", '/desc ' + cardHtml);
          }
      });
      
      
      var SoundFX = {
          PlayWeaponSoundEffect : function(blackCrusadeMessage) {
              var weaponCat = blackCrusadeMessage.weaponCat(); 
              var soundEffect = this.GetSoundEffect(weaponCat);
              if (soundEffect.length > 0)
              {
                  this.PlaySound(soundEffect, 4000);
              }
          },
      
          //Private
          PlaySound : function (trackname, time) {
              var tracks = findObjs({type: 'jukeboxtrack', title: trackname});
              if (tracks.length <= 0) {
                  log("No track found");
              }
              var track = tracks[0];
              track.set('playing',false);
              track.set('softstop',false);
              track.set('volume', 100);
              track.set('playing',true);
              setTimeout(function() {track.set('playing',false);}, time);
          },
      
          GetSoundEffect : function (weaponType) {
              var lowerCaseWeaponType = weaponType.toLocaleLowerCase();
              if (lowerCaseWeaponType === "las") {
                  return 'Tiro (pistola laser) by mendefbi';
              }
              else if (lowerCaseWeaponType === "solid") {
                  return 'MachineGunBurst by KCRift';
              }
              else if (lowerCaseWeaponType === "bolt") {
                  return 'Lasgun by General Sturnn';
              }
              else if (lowerCaseWeaponType === "melta") {
                  return 'HELL Laser Shot 2 by RingofFive';
              }
              else if (lowerCaseWeaponType === "plasma") {
                  return 'Plasma Bolt Explosion 02 by Blargen';
              }
              else if (lowerCaseWeaponType === "flame") {
                  return 'Fire SFX - Roll20 by Spikkle';
              }
              else if (lowerCaseWeaponType === "launcher") {
                  return 'Grenade Launcher by savagecabbage';
              }
              else if (lowerCaseWeaponType === "chain") {
                  return 'Chainsword effect by Sinekyre';
              }
              else if (lowerCaseWeaponType === "power") {
                  return 'Force Lightning by Rpgneo';
              }
              else if (lowerCaseWeaponType === "force") {
                  return 'Force Push by RevanMJRoll20';
              }
              else if (lowerCaseWeaponType === "shock") {
                  return 'Electric Shock Zap by tarrasque';
              }
              else if (lowerCaseWeaponType === "primary") {
                  return 'Bastard Sword Strikes Wood Shield - Stuart Duffield';
              }
              else if (lowerCaseWeaponType === "exotic") {
                  return 'Mind Stun Psi - Daniele Galante';
              }
              else if (lowerCaseWeaponType === "spit") {
                  return 'Aln Spit Attack 05a by Blargen';
              }
              else {
                  return '';
              }
              
          }
      }
      
      
      function Message(message) {
        
          this.UnescapeMessage = function(message) {
              
              message = message.replace(/%%COL%%/g, ':');
              message = message.replace(/<br\/>\n/g, ' ').replace(/({{(.*?)}})/g, " $2 ");
              return message;
          }
        
          this.message = message; 
          //msg.type !== "api"
          //msg.content.indexOf("!edy"
          //var player_obj = getObj("player", msg.playerid);
          this.command = this.UnescapeMessage(message.content);//%%SEP%%
          //msg.who
               
          this.GetParamValue = function(key, defaultVal) {
              
              var paramString = this.command;
              defaultVal = (defaultVal === undefined) ? "" : defaultVal;
              var keyIndex = paramString.indexOf(key);
              if (keyIndex < 0) { return defaultVal; }
              var keyEnd = key.length + 1;
              var valStart = keyIndex + keyEnd;
              
              //now the closing
              var valEnd = paramString.indexOf("|", valStart);
              if (valEnd < 0) 
              { 
                  valEnd = paramString.indexOf("}", valStart);
                  if (valEnd < 0) {
                      return paramString.substring(valStart).trim(); //the last param wit no closing
                  }
              }
              
              return paramString.substring(valStart,  valEnd).trim();
          }
          
          this.HasParamFlag = function(key, flag) {
              var special = this.GetParamValue(key);
              
              //var paramString = this.command;
              return (special.toLowerCase().indexOf(flag.toLowerCase()) != -1); 
          }
          
          this.GetParamFlagValue = function(key, flag) {
              var special = this.GetParamValue(key);
              //var paramString = this.command;
              var paramString = special;
              var index = paramString.toLowerCase().indexOf(flag.toLowerCase());
              
              if (index < 0) { return ""; }
              
              var valStart = paramString.indexOf("(", index + flag.length) + 1;
              var valEnd = paramString.indexOf(")", index + flag.length);
              
              var paramValue = paramString.substring(valStart,  valEnd).trim();
              
              return paramValue;
          }
      
      };
      
      function BlackCrusadeMessage(message) {
      
          this.message = message;
      
          this.title              = function () { return this.message.GetParamValue("--title"); }
          this.subTitle           = function () { return this.message.GetParamValue("--subTitle"); }
          this.weaponType         = function () { return this.message.GetParamValue("--weaponType"); }
          this.weaponClass        = function () { return this.message.GetParamValue("--class"); }
          this.characterName      = function () { return this.message.GetParamValue("--characterName"); }//--characterName:@{character_name}|
          this.penetration        = function () { return this.message.GetParamValue("--pen"); }//--pen:@{pen}|
          this.action             = function () { return this.message.GetParamValue("--action"); }//Action [attack, damage, characteristic, skill]
          this.weaponCat          = function () { return this.message.GetParamValue("--weaponCat", "primary"); }
          this.weaponRange        = function () { return this.message.GetParamValue("--range", "0"); } 
          this.rofAttackType      = function () { return this.message.GetParamValue("--rof"); }
      
          this.isReliable         = function () { return this.message.HasParamFlag("--special", "reliable"); }
          this.isUnreliable       = function () { return this.message.HasParamFlag("--special", "unreliable"); }
      
          this.isTearing          = function () { return this.message.HasParamFlag("--special", "tearing"); }            
          this.isPrimitive        = function () { return this.message.HasParamFlag("--special", "primitive"); }
          this.primitiveMaxDamage = function () { return parseInt(this.message.GetParamFlagValue("--special", "primitive")); } 
          
          this.spellName          = function () { return this.message.GetParamValue("--spell"); }
          // var damageCategory = GetParamValue(command, "--damageCategory") ;
          this.psyRange           = function () { return this.message.GetParamValue("--range"); }
          this.psyFocusPower      = function () { return this.message.GetParamValue("--psyFocusPower"); }
          this.psyModifier        = function () { return this.message.GetParamValue("--psyModifier"); }
          this.psyRating          = function () { return this.message.GetParamValue("--psyRating"); }
          this.psyStrength        = function () { return this.message.GetParamValue("--psyStrength"); }
          this.psykerClass        = function () { return this.message.GetParamValue("--psykerClass"); }
          this.aditionalPsyModifier = function () { return this.message.GetParamValue("--aditionalPsyModifier"); }
      
          this.psyDamageType      = function () { return this.message.GetParamValue("--psyDamageType"); }
          this.range              = function () { return this.message.GetParamValue("--range"); }
      
          //var damage = GetParamValue(command, "--enteredDamage") ;
          this.enteredPenetration = function () { return this.message.GetParamValue("--enteredPenetration"); }
          
          this.who                = function () { return this.message.message.who;  }
          this.results            = function () { return this.message.message.inlinerolls[0].results; }
          this.expression         = function () { return this.message.message.inlinerolls[0].expression; }
          
      }
      
      
      var ModelFactory = {
          
          CreateAttackModel : function(blackCrusadeMessage) {
              
              var inlineRoll =  blackCrusadeMessage.results().total; 
              var inlineRollTip = blackCrusadeMessage.expression();
              
              if (blackCrusadeMessage.weaponClass() !== "Melee") { 
              
                  var rofAttackTypeModifier = this.CalculateRofAttackTypeModifier(blackCrusadeMessage.rofAttackType());
                  var rofAttackTypeModifierTip = (rofAttackTypeModifier >= 0) ? ` + ${rofAttackTypeModifier}` : ` - ${rofAttackTypeModifier}`; 
                  
                  //Inline Roll Expression
                  inlineRoll += rofAttackTypeModifier;
                  inlineRollTip += rofAttackTypeModifierTip;
              }
             
              //Calculated
              var roll = randomInteger(100); //between [1,100]
              var degrees = this.CalculateDegreesOfSuccess(inlineRoll, roll);
              var hitLocation = (degrees > 0) ? this.GetHitLocation(roll) : "";
              
              var isWeaponJam = this.IsWeaponJam(
                  roll, 
                  blackCrusadeMessage.weaponClass(), 
                  blackCrusadeMessage.isReliable(), 
                  blackCrusadeMessage.isUnreliable(), 
                  blackCrusadeMessage.rofAttackType());
             
              return {
                  "playerName" : this.GetPlayerName(blackCrusadeMessage), 
                  "headerText" : blackCrusadeMessage.title(), 
                  "headerSub1" : this.GetWeaponRangeLabel(blackCrusadeMessage), 
                  "headerSub2" : blackCrusadeMessage.weaponType(), 
                  "target" : inlineRoll, 
                  "targetTip" : inlineRollTip, 
                  "roll" : roll, 
                  "degrees" : degrees, 
                  "hitLocation" : hitLocation, 
                  "isWeaponJam" : isWeaponJam
              };
          },
         
          CreateDamageModel : function(blackCrusadeMessage){   
              
              var results =  blackCrusadeMessage.results(); 
              if (blackCrusadeMessage.isTearing()) {
                  this.ApplyTearingQualityToDamage(results); 
              }
          
              if (blackCrusadeMessage.isPrimitive()) {
                  var primitiveMaxDamage = blackCrusadeMessage.primitiveMaxDamage();
                  this.ApplyPrimitiveQualityToDamage(results, primitiveMaxDamage);
              }
              
              var totalDamage = results.total;
              var damageText =  this.GetDamageText(results.rolls);
              
              var isZealous = this.IsZealousHatred(results.rolls);
              
              return {
                  "playerName" : this.GetPlayerName(blackCrusadeMessage), 
                  "headerText" : blackCrusadeMessage.title(), 
                  "headerSub1" : this.GetWeaponRangeLabel(blackCrusadeMessage), 
                  "headerSub2" : blackCrusadeMessage.weaponType(), 
                  "damage" : totalDamage, 
                  "damageTip" : blackCrusadeMessage.expression(), 
                  "damageDies" : damageText, 
                  "penetration" : blackCrusadeMessage.penetration(), 
                  "isZealous" : isZealous,
                  "characterName" : blackCrusadeMessage.characterName(),
              };    
          },
          
          CreatePsyDamageModel : function(blackCrusadeMessage){   
              
              var results =  blackCrusadeMessage.results(); 
              var damageText =  this.GetDamageText(results.rolls);
              var isZealous = this.IsZealousHatred(results.rolls);
              
              return {
                  "playerName" : this.GetPlayerName(blackCrusadeMessage),  
                  "headerText" : blackCrusadeMessage.spellName(), 
                  "headerSub1" : blackCrusadeMessage.range(), 
                  "headerSub2" : blackCrusadeMessage.psyDamageType(), 
                  "damage" : results.total, 
                  "damageTip" : blackCrusadeMessage.expression(), 
                  "damageDies" : damageText, 
                  "penetration" : blackCrusadeMessage.enteredPenetration(), 
                  "isZealous" : isZealous,
                  "characterName" : blackCrusadeMessage.characterName(),
              };    
          },
          
          CreatePsyAttackModel : function(blackCrusadeMessage) {
      
            //Roll
            var roll = randomInteger(100); //between [1,100]
            //Calculated
            var modifiedPsyRatng = this.CalculateModifiedPsyRating(blackCrusadeMessage.psyRating(), blackCrusadeMessage.psyStrength());
            var psyStrengthMod = this.CalculatePsyStrengthMod(blackCrusadeMessage.psyRating(), blackCrusadeMessage.psyStrength());
            var psyStrengthText = this.GetPsyStrengthText(blackCrusadeMessage.psyStrength());
            var psyPowerValue = this.CalculatePsyPowerValue(blackCrusadeMessage);
            var target = psyPowerValue + parseInt(blackCrusadeMessage.psyModifier()) + psyStrengthMod + parseInt(blackCrusadeMessage.aditionalPsyModifier());
            var targetTip = this.CreatePsyTargetTip(psyPowerValue, blackCrusadeMessage.psyModifier(), blackCrusadeMessage.psyRating(), blackCrusadeMessage.psyStrength(), psyStrengthMod, blackCrusadeMessage.aditionalPsyModifier());
            var degrees = this.CalculateDegreesOfSuccess(target, roll);
            var hitLocation = ((degrees > 0) && (roll < 91)) ? this.GetHitLocation(roll) : "";
            
            var requiresPsyRoll = this.RequiresPsychicPhenomenaRoll(roll, psyStrengthText);
            //How about info on Perils table

              return {
                  "playerName" : this.GetPlayerName(blackCrusadeMessage), 
                  "characterName" : blackCrusadeMessage.characterName(), 
                  "spellName" : blackCrusadeMessage.spellName(), 
                  "psyRange" : blackCrusadeMessage.psyRange(), 
                  "damageCat" : "",
                  "target" : target, 
                  "targetTip" : targetTip, 
                  "roll" : roll, 
                  "degrees" : degrees,
                  "psyStrength" : blackCrusadeMessage.psyStrength(), 
                  "psyStrengthText" : psyStrengthText, 
                  "modifiedPsyRatng" : modifiedPsyRatng, 
                  "hitLocation" : hitLocation, 
                  "psykerClass" : blackCrusadeMessage.psykerClass(), 
                  "requiresPsyRoll" : requiresPsyRoll
              };  
          },
          
          CreatePerilsOfTheWarpModel : function(blackCrusadeMessage) {
              
              var roll = randomInteger(100); //between [1,100]
              var perils = this.GetPerilsOfTheWarp(roll);
              
              return {
                  "playerName" : this.GetPlayerName(blackCrusadeMessage), 
                  "roll" : roll, 
                  "perils" : perils
              };
          },
         
          CreatePsychicPhenomenonModel : function(blackCrusadeMessage) {
              
              var psyStrength = blackCrusadeMessage.psyStrength();
              var psykerClass = blackCrusadeMessage.psykerClass();
              
              var roll = randomInteger(100); //between [1,100]
              var psyRoll = this.CalculatePsychicPhenomenon(roll, psykerClass, psyStrength);
              var psyRollTip = this.CalculatePsychicPhenomenonTip(roll, psykerClass, psyStrength);
              
               //Now get the actual
              var psychicPhenom = this.GetPsychicPhenomenon(psyRoll);
              
              var requiresPsyRoll = this.RequiresPerilsOfTheWarpRoll(psyRoll);
              
              return {
                  "playerName" : this.GetPlayerName(blackCrusadeMessage), 
                  "characterName" : blackCrusadeMessage.characterName(), 
                  "psyRoll" : psyRoll, 
                  "psyRollTip" : psyRollTip, 
                  "psykerClass" : psykerClass,
                  "psyStrength" : psyStrength, 
                  "psychicPhenom" : psychicPhenom,
                  "requiresPsyRoll" : requiresPsyRoll
              };
          },
          
          CreateZealousCritModel : function(blackCrusadeMessage) {
              
              var roll = randomInteger(5); //between [1,5]
              return {
                  "playerName" : this.GetPlayerName(blackCrusadeMessage), 
                  "headerText" : "Zealous Hatred!",
                  "roll" : roll, 
                  "damageType" : blackCrusadeMessage.weaponType()
              };    
          },
          
          //Private
          
          CalculatePsyPowerValue : function(blackCrusadeMessage) {
            //we might be using a characteristic so use the number, or a skill so use the expression total  
            if (isNaN(blackCrusadeMessage.psyFocusPower())) {
                return parseInt(blackCrusadeMessage.results().total);
            }
            else {
                return parseInt(blackCrusadeMessage.psyFocusPower());
            }
          },
          
          CalculateRofAttackTypeModifier : function(rofAttackType) {
          
              if (rofAttackType === "std") {
                  return 10;
              }
              else if (rofAttackType === "semiauto") {
                  return 0;
              }
              else if (rofAttackType === "fullauto") {
                  return -10;
              }
              else if (rofAttackType === "calledshot") {
                  return -20;
              }
              else if (rofAttackType === "suppressing") {
                  return -20;
              }
              else {
                  log ("ERROR: Unknown rofAttackType");
              }
              
          },
          
          CalculateDegreesOfSuccess : function(target, roll) {
          
              var difference = target - roll;
              if (difference > 0) {
                  return (~~(difference/10) + 1);
              }
              else if (difference < 0) {
                  return (~~(difference/10) - 1);
              }
              else if (target == roll) {
                  return 1;   
              }
          },
          
          GetHitLocation : function(roll) {
              //we need to reverse the digits then do a lookup 1 - 100
              var reversedRoll;
              if (roll == 100) {
                  reveredRoll = 1;
              }
              else if (roll < 10)
              {
                  reversedRoll = roll * 10;
              }
              else
              {
                  var digitTens = ~~(roll/10);
                  var digit = roll % 10;
                  reversedRoll = digit * 10 + digitTens;
              }
              
              if (reversedRoll >= 1 && reversedRoll <= 10) {
                  return "Head";
              } else if (reversedRoll >= 11 && reversedRoll <= 20) {
                  return "Right Arm";
              } else if (reversedRoll >= 21 && reversedRoll <= 30) {
                  return "Left Arm";
              } else if (reversedRoll >= 31 && reversedRoll <= 70) {
                  return "Body";
              } else if (reversedRoll >= 71 && reversedRoll <= 85) {
                  return "Right Leg";
              } else if (reversedRoll >= 86 && reversedRoll <= 100) {
                  return "Left Leg";
              }
          },
      
          IsWeaponJam : function(roll, weaponClass, isReliable, isUnreliable, rofAttackType ) { 
          
              if (weaponClass === "Melee") { return false; }
              
              var targetJam;
              
              if (isUnreliable) {
                  targetJam = 91;
              }
              else if ((rofAttackType === "semiauto") || (rofAttackType === "fullauto") || (rofAttackType === "suppressing")) {
                   targetJam = 94;
              }
              else if (isReliable) {
                  targetJam = 100;
              }
              else {
                  targetJam = 96;
              }
              
              log (roll);
              
              return (roll >= targetJam);
          },
      
          ApplyTearingQualityToDamage : function(results) {
          
              //add one dice. remove lowest
              var dice = results.rolls[0];
              var originalDiceTotal = this.GetDiceTotal(results);
              
              var sides = parseInt(dice.sides);
              var extraRoll = randomInteger(sides); //between [1,sides]
            
              //get minimm
              var min = dice.results.reduce(function(prev, curr) {
                  return prev.v < curr.v ? prev : curr;
              });
              //replace minimum with tearing die
              min.v = extraRoll;
             
              var newDiceTotal = this.GetDiceTotal(results);
              results.total +=  (newDiceTotal - originalDiceTotal);
          },
      
          ApplyPrimitiveQualityToDamage : function(results, max) {
             
              var dice = results.rolls[0];
              var originalDiceTotal = this.GetDiceTotal(results);
             
              //apply max
              dice.results.map(x => { if (x.v > max) { x.v = max; } });
              
              var newDiceTotal = this.GetDiceTotal(results);;
              results.total +=  (newDiceTotal - originalDiceTotal);
          },
      
          GetDamageText : function (rolls) {
            
              var dice = rolls[0];
              
              var damageText = "[ ";
              
              var maxlen = dice.results.length;
              for (var i = 0; i < maxlen; i++) {
                  
                  damageText += dice.results[i].v;
                  if ( (i + 1) < maxlen) {
                      damageText += ", ";
                  }
              }
              
              damageText += " ] ";
              
              return damageText;
          },
          
          IsZealousHatred : function(rolls) {
          
              var dice = rolls[0];
             
              var maxlen = dice.results.length;
              for (var i = 0; i < maxlen; i++) {
                 if (dice.sides == 10)
                 {
                      if (dice.results[i].v == 10) { return true; }
                 }
                 else if (dice.sides == 5)
                 {
                     if (dice.results[i].v == 5)
                     {
                         var rollZ = randomInteger(2); //between [1,100]
                         if (rollZ == 1) { return true; }
                     }
                 }
              }
              return false;
              
              //If any of the die rolls are a 10
              //1-9,10,20,30,40
              //return ((degreesOfSuccess > 0) && ( (roll >= 1 && roll <= 9) || (roll % 10 == 0))); 
          },
          
          CalculateModifiedPsyRating : function(psyRating, psyStrength) {
              if (psyRating == "") { return 0; }
              
              var pr = parseInt(psyRating);
              if (psyStrength === "Fettered") {
                  return Math.ceil(pr/2);
              } else if (psyStrength === "Unfettered") {
                  return pr;
              } else {
                  return (pr + parseInt(psyStrength));
              }
          },
          
          CalculatePsyStrengthMod : function(psyRating, psyStrength){
             return this.CalculateModifiedPsyRating(psyRating, psyStrength) * 5;
          },
          
          GetPsyStrengthText : function(psyStrength) {
              if (psyStrength === "Fettered") {
                  return psyStrength;
              } else if (psyStrength === "Unfettered") {
                  return psyStrength;
              } else {
                  return "Push";
              }
              return "";
          },
      
          CreatePsyTargetTip : function(psyFocusPower, psyModifier, psyRating, psyStrength, psyStrengthMod, aditionalPsyModifier) {
              
              var strengthCalc = "";
              if (psyStrength === "Fettered") {
                  strengthCalc = `Fettered: Math.ceil(${psyRating}/2)*5`;
              } else if (psyStrength === "Unfettered") {
                  strengthCalc = `Unfettered: ${psyRating}*5`;
              } else {
                  strengthCalc = `Push: (${psyRating} + ${psyStrength}) * 5`;
              }
              
              var tip = `${psyFocusPower} + ${psyModifier} + ${aditionalPsyModifier} + ${psyStrengthMod} [${strengthCalc}]`;
              
              return tip;
          },
      
          RequiresPsychicPhenomenaRoll : function(roll, psyStrength) {
          
              if (psyStrength === "Fettered") {
                  return false;
              }
              else if (psyStrength === "Unfettered") {
                  return ((roll == 11) || (roll == 22) || (roll == 33) || (roll == 44) || (roll == 55) || (roll == 66) || (roll == 77) || (roll == 88) || (roll == 99));
              }
              else {
                  return true;
              }
          },
      
          CalculatePsychicPhenomenon : function (roll, psykerClass, psyStrength) {
              
              if (psykerClass === "Bound") {
                  if ((psyStrength !== "Fettered") && (psyStrength !== "Unfettered")) { //Bound: Push
                      return roll + 10;
                  }
              }
              else if (psykerClass === "Unbound") {
                  if (psyStrength === "Unfettered") {  //Unbound: Unfettered
                      return roll + 10;
                  }
                  else if (psyStrength !== "Fettered") { //Unbound: Push
                      return roll + (psyStrength * 5);
                  }
              }
              else if (psykerClass === "Daemonic") {
                  if (psyStrength === "Unfettered") {  //Daemonic: Unfettered
                      return roll + 10;
                  }
                  else if (psyStrength !== "Fettered") { //Daemonic: Push
                      return roll + (psyStrength * 10);
                  }
              }
              
              return roll;
          },
          
          CalculatePsychicPhenomenonTip : function(roll, psykerClass, psyStrength) {
              
              if (psykerClass === "Bound") {
                  if ((psyStrength !== "Fettered") && (psyStrength !== "Unfettered")) { //Bound: Push
                      return `${roll} + 10`;
                  }
              }
              else if (psykerClass === "Unbound") {
                  if (psyStrength === "Unfettered") {  //Unbound: Unfettered
                      return `${roll} + 10`;
                  }
                  else if (psyStrength !== "Fettered") { //Unbound: Push
                      return `${roll} + (${psyStrength} * 5)`;
                  }
              }
              else if (psykerClass === "Daemonic") {
                  if (psyStrength === "Unfettered") {  //Daemonic: Unfettered
                      return `${roll} + 10`;
                  }
                  else if (psyStrength !== "Fettered") { //Daemonic: Push
                      return `${roll} + (${psyStrength} * 10)`;
                  }
              }
              
              return roll;
          },
      
          RequiresPerilsOfTheWarpRoll : function(psyRoll) {
              return (psyRoll >= 75);
          },
          
          GetPsychicPhenomenon : function(roll) {
              
              if ((roll >=1) && (roll <= 3)) {
                  return ["Dark Foreboding", ""];
              }
              else if ((roll >=4) && (roll <= 5)) {
                  return ["Warp Echo", ""];
              }
              else if ((roll >=6) && (roll <= 8)) {
                  return ["Unholy Stench", ""];
              }
              else if ((roll >=9) && (roll <= 11)) {
                  return ["Mind Warp", ""];
              }
              else if ((roll >=12) && (roll <= 14)) {
                  return ["Hoarfrost", ""];
              }
              else if ((roll >=15) && (roll <= 17)) {
                  return ["Aura of Taint", ""];
              }
              else if ((roll >=18) && (roll <= 20)) {
                  return ["Memory Worm", ""];
              }
              else if ((roll >=21) && (roll <= 23)) {
                  return ["Spoilage", ""];
              }
              else if ((roll >=24) && (roll <= 26)) {
                  return ["Haunting Breeze", ""];
              }
               else if ((roll >=27) && (roll <= 29)) {
                  return ["Veil of Darkness", ""];
              }
               else if ((roll >=30) && (roll <= 32)) {
                  return ["Distorted Reflections", ""];
              }
               else if ((roll >=33) && (roll <= 35)) {
                  return ["Breath Leech", ""];
              }
               else if ((roll >=36) && (roll <= 38)) {
                  return ["Daemonic Mask", ""];
              }
               else if ((roll >=39) && (roll <= 41)) {
                  return ["Unnatural Decay", ""];
              }
              else if ((roll >=42) && (roll <= 44)) {
                  return ["Spectral Gale", ""];
              }
              else if ((roll >=45) && (roll <= 47)) {
                  return ["Bloody Tears", ""];
              }
              else if ((roll >=48) && (roll <= 50)) {
                  return ["The Earth Protests", ""];
              }
              else if ((roll >=51) && (roll <= 53)) {
                  return ["Actinic Discharge", ""];
              }
              else if ((roll >=54) && (roll <= 56)) {
                  return ["Warp Ghosts", ""];
              }
              else if ((roll >=57) && (roll <= 59)) {
                  return ["Falling Upwards", ""];
              }
              else if ((roll >=60) && (roll <= 62)) {
                  return ["Banshee Howl", ""];
              }
              else if ((roll >=63) && (roll <= 65)) {
                  return ["The Furies", ""];
              }
              else if ((roll >=66) && (roll <= 68)) {
                  return ["Shadow of the Warp", ""];
              }
              else if ((roll >=69) && (roll <= 71)) {
                  return ["Tech Scorn", ""];
              }
              else if ((roll >=72) && (roll <= 74)) {
                  return ["Warp Madness", ""];
              }
              else if (roll >=75) {
                  return ["Perils of the Warp", ""];
              }
              
              return "?";
              
          },
          
          GetPerilsOfTheWarp : function(roll) {
              if ((roll >=1) && (roll <= 5)) {
                  return ["The Gibbering", ""];
              }
              else if ((roll >=6) && (roll <= 9)) {
                  return ["Warp Burn", ""];
              }
              else if ((roll >=10) && (roll <= 13)) {
                  return ["Psychic Concussion", ""];
              }
              else if ((roll >=14) && (roll <= 18)) {
                  return ["Psy Blast", ""];
              }
              else if ((roll >=19) && (roll <= 24)) {
                  return ["Soul Sear", ""];
              }
              else if ((roll >=25) && (roll <= 30)) {
                  return ["Locked In", ""];
              }
              else if ((roll >=31) && (roll <= 38)) {
                  return ["Chronological Incontinence", ""];
              }
              else if ((roll >=39) && (roll <= 46)) {
                  return ["Psychic Mirror", ""];
              }
              else if ((roll >=47) && (roll <= 55)) {
                  return ["Warp Whispers", ""];
              }
              else if ((roll >=56) && (roll <= 58)) {
                  return ["Vice Versa", ""];
              }
              else if ((roll >=59) && (roll <= 67)) {
                  return ["Dark Summoning", ""];
              }
              else if ((roll >=68) && (roll <= 72)) {
                  return ["Rending the Veil", ""];
              }
              else if ((roll >=73) && (roll <= 78)) {
                  return ["Blood Rain", ""];
              }
              else if ((roll >=79) && (roll <= 82)) {
                  return ["Cataclysmic Blast", ""];
              }
              else if ((roll >=83) && (roll <= 86)) {
                  return ["Mass Possession", ""];
              }
              else if ((roll >=87) && (roll <= 90)) {
                  return ["Reality Quake", ""];
              }
              else if ((roll >=91) && (roll <= 99)) {
                  return ["Grand Possession", ""];
              }
              else if (roll == 100)  {
                  return ["Annihilation", ""];
              }
              return "";
          },
      
          GetDiceTotal : function(results) {
              var dice = results.rolls[0];
              var diceList = dice.results;
              var total = diceList.map(x => x.v).reduce((a, b) => a + b, 0);
              
              return total;
          },
          
          //maybe these should be functions in the model
          GetPlayerName : function(blackCrusadeMessage) { 
              return (blackCrusadeMessage.who() + " " + blackCrusadeMessage.characterName());
          },
          
          GetWeaponRangeLabel : function(blackCrusadeMessage) { 
              return `${blackCrusadeMessage.weaponRange()} Meters`; 
          }
          
      };
      
      //Take a Model and Create a View. Controllwe
      function ViewFactory() {
          
          this.CreateAttackView = function(model) {
          
              var view = new View();
              
              //Header
              view.AddHeader(model.headerText, "", model.headerSub1, model.headerSub2);
              //Target
              view.AddRow(RowObjectFactory.CreateRegularRow(false, 0, "Target", model.targetTip, model.target));
              
              if (!model.isWeaponJam) {
                  //Roll
                  view.AddRow(RowObjectFactory.CreateRegularRow(true, model.degrees, "Roll", "", model.roll));
                  //DoS
                  view.AddRow(RowObjectFactory.CreateRegularRow(false, model.degrees, (model.degrees > 0) ? "DoS" : "DoF", "", model.degrees));
                  //Location
                  if (model.degrees > 0) {
                      view.AddRow(RowObjectFactory.CreateRegularRow(false, 0, "Location", "", model.hitLocation));
                  }
              }
              else {
                  //Roll
                  view.AddRow(RowObjectFactory.CreateRegularRow(true, -1, "Roll", "", model.roll));
                  view.AddRow(RowObjectFactory.CreateCenteredRow("Weapon Jam!", ""));
              }
              
              return view.CreateCard(model.playerName, false);
          }
      
          this.CreateDamageView = function(model) {
          
              var view = new View();
              
              //TODO; I don't like the headerSub1, Sub2.  Should say what they are
              
              view.AddHeader(model.headerText, "", model.headerSub1, model.headerSub2);
              view.AddRow(RowObjectFactory.CreateCenteredRow(`${model.damage} Pen ${model.penetration}`, model.damageTip));
              view.AddRow(RowObjectFactory.CreateCenteredRow(model.damageDies, ""));
              
              //Zealous Hatred
              if (model.isZealous) {
          	    view.AddRow(RowObjectFactory.CreateCenteredRow("☠ ZEALOUS HATRED! ☠ ", ""));
              
                  //Add Zealous Roll Button
                  view.AddRow(RowObjectFactory.CreateHtmlRow( this.CreateZealousHatredButton(model.characterName, model.headerSub2)));
              
              }
              
              return view.CreateCard(model.playerName, true);
          }
          
          this.CreatePsyAttackView = function(model) {
              
              var view = new View();
               
              //Header
              view.AddHeader(model.spellName, "", model.psyRange, model.damageCat); 
              
              //PR
              view.AddRow(RowObjectFactory.CreateRegularRow(false, 0, model.psyStrengthText + " PR", "", model.modifiedPsyRatng));
              
               //Target
              view.AddRow(RowObjectFactory.CreateRegularRow(false, 0, "Target", model.targetTip, model.target));
              
              //Roll
              var success = (model.degrees > 0) && (model.roll < 91) ? 1 : -1; //i should change to a new ternary. i don't know
              var rollText = (model.roll < 91) ? model.roll : ` ${model.roll} : Fail `;
              view.AddRow(RowObjectFactory.CreateRegularRow(true, success, "Roll", "", rollText));
              
              //Dos
              view.AddRow(RowObjectFactory.CreateRegularRow(false, model.degrees, (model.degrees > 0) ? "DoS" : "DoF", "", model.degrees));
              
              //TODO don't show when not a damage spell. either damage cat or damage entry
              if (success > 0) {
                  view.AddRow(RowObjectFactory.CreateRegularRow(false, 0, "Location", "", model.hitLocation));
              }
              
              //Do I show PsychicPhenomena Button
              if (model.requiresPsyRoll) {
                  view.AddRow(RowObjectFactory.CreateHtmlRow(this.CreatePsychicPhenomenaButton(model.psyStrength, model.psykerClass, model.characterName)));
              }
              
               //Location?
               //Zealous Hatred?
               //figure out if hit or miss
               
              return view.CreateCard(model.playerName, false);
          }
      
          this.CreatePerilsOfTheWarpView = function(model) {
          
              var view = new View();
              
              //Header
              view.AddHeader("Perils of the Warp", "", "", ""); 
              
              //Roll
              view.AddRow(RowObjectFactory.CreateRegularRow(model.true, 1, "Roll", "", model.roll));
              
              //Pshychic
              view.AddRow(RowObjectFactory.CreateCenteredRow(model.perils[0], ""));
          
              return view.CreateCard(model.playerName, false);
          }
          
          this.CreatePsychicPhenomenonView = function(model) {
              var view = new View();
              
              //Header
              view.AddHeader("Psychic Phenomenon", "", model.psykerClass, model.psyStrength); 
              
              //Roll
              view.AddRow(RowObjectFactory.CreateRegularRow(true, 1, "Roll", model.psyRollTip, model.psyRoll));
              
              //Pshychic
              view.AddRow(RowObjectFactory.CreateCenteredRow(model.psychicPhenom[0], ""));
          
              //If roll is >= 75 Perils
              //Do I show PsychicPhenomena Button
              if (model.requiresPsyRoll) {
                  view.AddRow(RowObjectFactory.CreateHtmlRow( this.CreatePerilsOfTheWarpButton(model.characterName)));
              }
              
              return view.CreateCard(model.playerName, false);
          }
          
          this.CreateZealousCritView = function(model) {
              var view = new View();
              view.AddHeader(model.headerText, "", "", "");
              view.AddRow(RowObjectFactory.CreateCenteredRow("☠ " + model.roll + " ☠" ,""));
              view.AddRow(RowObjectFactory.CreateCenteredRow(model.damageType, ""));
              
              return view.CreateCard(model.playerName, true);
          }
          
          //how to make private?
          this.CreatePerilsOfTheWarpButton = function(characterName) {
              return `[Perils of the Warp](!edy{{--characterName%%COL%%${characterName}|--action%%COL%%psyPerils|}})`;
          }
          
          this.CreatePsychicPhenomenaButton = function(psyStrength, psykerClass, characterName) {
              return `[Psychic Phenomena](!edy{{--characterName%%COL%%${characterName}|--action%%COL%%psyPhenom|--psyStrength%%COL%%${psyStrength}|--psykerClass%%COL%%${psykerClass}}})`;
          }
          
          this.CreateZealousHatredButton = function(characterName, weaponType) {
              return `[Roll Critical Damage](!edy{{--characterName%%COL%%${characterName}|--action%%COL%%zealousCrit|--weaponType%%COL%%${weaponType}|}})`;
          }
      }
      
      // Row Factory for use in View
      var RowObjectFactory = {
          CreateRegularRow : function(includeBackground, success, title, tip, data) {
              return {
                  "includeBackground" : includeBackground,
                  "success" : success,
                  "title" : title, 
                  "tip" : tip, 
                  "data" : data,
                  "type" : "regular"
              };    
          },
          CreateCenteredRow : function(text, tip) {
              return {
                  "text" : text,
                  "tip" : tip, 
                  "type" : "centered"
              };  
          },
          CreateHtmlRow : function(html) {
              return {
                  "html" : html,
                  "type" : "html"
              };  
          }
      };
      
      // View
      function View() {
          
          this.rows = new Array();
          
          this.header = null;
          
          this.AddHeader = function(main, tip, left, right) {
              //purple #dd1ac3
              //black 0f0700
              //brown 261303
              const backHeaderColor = '#0f0700';  //Spectral SC //contrail one
              var headerStyle = `style="font-family: 'Spectral SC' ; font-size: 1.2em ; line-height: 1.2em ; font-weight: normal ; font-style: normal ; font-variant: normal ; letter-spacing: 2px ; text-align: center ; vertical-align: middle ; margin: 0px ; padding: 2px 0px 0px 0px ; border: 1px solid #000000 ; border-radius: 5px 5px 0px 0px ; color: #ffffff ; text-shadow: -1px -1px 0 #000000 , 1px -1px 0 #000000 , -1px 1px 0 #000000 , 1px 1px 0 #000000 ; background-color: ${backHeaderColor} ; background-image: linear-gradient( rgba( 255 , 255 , 255 , .3 ) , rgba( 255 , 255 , 255 , 0 ) )" `;
              var subHeaderStyle = `style="font-family: 'tahoma' ; font-size: 11px ; font-weight: normal ; font-style: normal ; font-variant: normal ; letter-spacing: 1px" `;
              
              var header = "";
              header += `<div ${headerStyle} title='${tip}' class="userscript-showtip userscript-tipsy"  >`;
              header += `${main}`;
              if ((left !== "") && (right !== "")) {
                  header += ` <br><span ${subHeaderStyle} >${left} ♦ ${right}</span>`;
              }
              header += `</div>`;
              
              this.header = header;
          };
          
          this.AddRow = function(row) {
             this.rows.push(row);
          };
          
          this.CreateCard = function(playerName, small) {
              
             var len = this.rows.length;
              var even = true;
              var cardContent =  this.header + 
                  this.rows
                  .map((row, index) => 
                      {
                          var last = index + 1 === len;
                          if (row.type === "regular") {
                              var result = this.GenerateRegularRow(row, last, even);
                              even = !even;
                              return result;
                          } else if (row.type === "centered") {
                              return this.GenerateCenteredRow(row, last);
                          } else {
                              return row.html;
                          }
                      })
                  .join('');
          
              //Player Name
              var display = `<div style='text-align:left' ><span >${playerName}</span></div><br/>`;
              
              //Card
              var padding = small ? 35 : 20;
              display += `<div style="clear: both ; margin-left: -7px ; border-radius: 5px; padding:0,${padding}px,0,${padding}px;">${cardContent}</div>`;
                      
              return display;
          };
          
          this.GenerateRegularRow = function(rowObject, isLastRow, even) {
             
              ////Spectral SC //contrail one
              //font-family: 'helvetica' ;
              var evenRowStyle = `color: #000000 ; background-color: #cec7b6 ; font-family: 'helvetica' ; line-height: 1.1em ; vertical-align: middle ; font-size: 14px ; font-weight: normal ; font-style: normal ; text-align: center ; padding: 4px 5px 2px 5px ; border-left: 1px solid #000000 ; border-right: 1px solid #000000;`;
              var oddRowStyle  = `color: #000000 ; background-color: #b6ab91 ; font-family: 'helvetica' ; line-height: 1.1em ; vertical-align: middle ; font-size: 14px ; font-weight: normal ; font-style: normal ; text-align: center ; padding: 4px 5px 2px 5px ; border-left: 1px solid #000000 ; border-right: 1px solid #000000;`;
              var bottomRowStyle = isLastRow ? `border-bottom: 1px solid #000000 ; border-radius: 0px 0px 5px 5px` : ``;
              
              var dataFontStyle;
              if (rowObject.success > 0) {
                  dataFontStyle = "color: #44A42C;"; //green
              }
              else if (rowObject.success < 0) {
                  dataFontStyle = "color: #E22323;"; //red
              }
              else {
                  dataFontStyle = "color: #000000;"; //black
              }
              
              //font-family: 'contrail one'
              var dataStyle = ``;
              if (rowObject.includeBackground) {
                  var backColour = 'background-color: #660000'; //yellow #fffea2 //reddish 660000 //black
                  dataStyle = `text-align: center ; font-size: 100% ; display: inline-block ; font-weight: bold ; height: 1em ; min-width: 1.75em ; margin-top: -1px ; margin-bottom: 1px ; padding: 0px 2px ; border: 1px solid ; border-radius: 13px ; ${backColour} ; border-color: #87850a ; ${dataFontStyle}`;    
              }
              else {
                  dataStyle = `text-align: center ; font-size: 100% ; display: inline-block ; font-weight: bold ; height: 1em ; min-width: 1.75em ; margin-top: -1px ; margin-bottom: 1px ; padding: 0px 2px ; ${dataFontStyle}`;    
              }
              
              var row = "";
              
              if (even) {
                  row += `<div style="${evenRowStyle} ${bottomRowStyle}" >`;
              }
              else {
                  row += `<div style="${oddRowStyle} ${bottomRowStyle}" >`;
              }
              row += `<b>${rowObject.title}:</b>`; 
              row += `<span style="${dataStyle}" class="userscript-inlinerollresult userscript-showtip userscript-tipsy" title='${rowObject.tip}' >${rowObject.data}</span></div>`;
              
             return row;
          };
          
          this.GenerateCenteredRow = function(rowObject, isLastRow) {
              
              var backColour = '#0f0700';//'#003366'
              var textColour = "#A81515";
              
              var rowStyle  = `color: #000000 ; background-color: ${backColour} ; line-height: 1.1em ; vertical-align: middle ; font-family: 'helvetica' ; font-size: 14px ; font-weight: normal ; font-style: normal ;  padding: 4px 5px 2px 5px ; border-left: 1px solid #000000 ; border-right: 1px solid #000000;`;
              var bottomRowStyle = isLastRow ? `border-bottom: 1px solid #000000 ; border-radius: 0px 0px 5px 5px` : ``;
              var dataStyle = `font-family: 'contrail one'; text-align: center ; font-size: 130% ; line-height: 26px; display: inline-block ; font-weight: bold ; height: 1em ; min-width: 1.75em ; margin-top: 3px ; margin-bottom: 1px ;  color: ${textColour}`;
              
              var row = "";
              row += `<div style="${rowStyle} ${bottomRowStyle}" >`;
              row += `<span style="${dataStyle}" class="userscript-inlinerollresult userscript-showtip userscript-tipsy" title='${rowObject.tip}' >${rowObject.text}</span></div>`;
              
              
              return row;
            
          };
      }
      
      
      function Human(fname, lname)  {
          this.firstName = fname;
          this.lastName = lname;
          this.fullName = function() {
             return this.firstName + " " + this.lastName;
          };
      };
      
      var Alien = {
          firstName: "Jon",
          lastName : "El",
          fullName : function() {
             return this.firstName + " " + this.lastName;
          }
      };
      