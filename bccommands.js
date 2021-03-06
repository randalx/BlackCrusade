 var ControlLight = ControlLight || (function() {
     
     const getPlayerTokens = function () {
         
         var playerTokens = new Array();
         var characters = findObjs({_type: 'character'});
         var tokenss = findObjs(
         {
            _type: 'graphic', 
            _subtype:'token',
            _pageid: Campaign().get("playerpageid"),
         });
         
         tokenss.forEach(function(tok) {
            
                if (tok.get("represents")) {
                
                    characters.forEach(function(chr) {
                        if (tok.get("represents") === chr.get("_id")) {
                            var controlledBy = chr.get("controlledby");
                            var control = controlledBy.split(",");
                            if (control.length > 1) {
                                playerTokens.push(tok);
                            }
                        }
                });
            }  
            
         });
        
         return playerTokens;
     }
     
     const setLights = function (token, radius, dim) {
         token.set({
            light_radius: radius,
            light_dimradius: dim
        });
        log(`${token.get('name')} ${radius} ${dim}`)
     };
     
     const handleChatInput = function(msg) {
         if (msg.type !== 'api' || !playerIsGM(msg.playerid) ) return;
         
         const args = msg.content.split(/\s/);
         
         //if(msg.content.indexOf("!sil") !== -1) {
         if(args[0] !== '!sil') { return; }
         
         //set the lights strength
         var radius = 10;
         var dim = 1;
         switch (args[1]) {
            case 'lon' : {
                radius = 10;  dim = 1;
            } break;
            case 'long' : {
                radius = 20;  dim = 1;
            } break;
            case 'loff' : {
                radius = 0;  dim = 0;
            } break;
            case 'lself' : {
                radius = 0.1;  dim = 0.1;
            } break;
            default : {
                buttonCommands = `[Lights On](!sil lon) [Lights Off](!sil loff) [Lights Long](!sil long) [Lights Self](!sil lself)`;
                sendChat('',`/w ${msg.who} ${buttonCommands}`);
                return;
            }
         }
         
         var playerTokens = getPlayerTokens();
         playerTokens.forEach( token => setLights(token, radius, dim) );
     };
     
     const registerEventHandlers = () => {
         on("chat:message", handleChatInput);
     };
     
     return {
         RegisterEventHandlers: registerEventHandlers
     }
     
 }());
 
 on('ready', () => {
     "use strict";
     log("-=> Black Crusade Commands");
     ControlLight.RegisterEventHandlers();
 })
 
 