// Import Modules
import { CangTrevActor } from "./actor/actor.js";
import { CangTrevJogadorSheet } from "./actor/jogadorSheet.js";
import { CangTrevNPCSheet } from "./actor/npcSheet.js";
import { CangTrevItem } from "./item/item.js";
import { CangTrevItemSheet } from "./item/item-sheet.js";
import { Narrativa } from "./tokens.js";

Hooks.once('init', async function() {

	console.log("setting cangtrev");
  game.cangtrev = {
    CangTrevActor,
    CangTrevItem,
	CangTrevJogadorSheet,
	CangTrevNPCSheet,
    rollItemMacro
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  
	console.log("define custom entity classes");
  // Define custom Entity classes
  CONFIG.Actor.entityClass = CangTrevActor;
  CONFIG.Item.entityClass = CangTrevItem;
  CONFIG.Actor.documentClass = CangTrevActor;
  CONFIG.Item.documentClass = CangTrevItem;
  
  CONFIG.Dice.terms['n'] = Narrativa;

	console.log("Register Sheets");
  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  
	console.log("Register Jogador Sheet");
  Actors.registerSheet("cangtrev", CangTrevJogadorSheet, {
    types: ["jogador"],
    makeDefault: true,
    label: "Jogador"
  });
  
	console.log("Register NPC Sheet");
  Actors.registerSheet("cangtrev", CangTrevNPCSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "NPC"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cangtrev", CangTrevItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
  
  Handlebars.registerHelper('isPickable', function(str) {
	 return (str != "Linhas Iniciais" && str != "Movimento Especial" && str != "Movimento Bônus"); 
  });
  
  Handlebars.registerHelper('eqs', function(s1, s2) {
	 return (s1 == s2); 
  });
  
  Handlebars.registerHelper('concatenate', function(s1, s2) {
	 return (s1 + s2); 
  });
  
  Handlebars.registerHelper('minus', function(s1, s2) {
	 return Number(s1) - Number(s2);
  });
  
  Handlebars.registerHelper('plus', function(s1, s2) {
	 return Number(s1) + Number(s2);
  });
  
  Handlebars.registerHelper("times", function(n, content) {
		let result = "";
		for (let i = 0; i < n; ++i)
		{
			result += content.fn(i);
		}

		return result;
  });
});

Hooks.on("diceSoNiceRollComplete", (chatMessageID) => {});

Hooks.once("diceSoNiceReady", (dice3d) => {
    dice3d.addColorset({
        name: "black",
        description: "Black",
        category: "Colors",
        foreground: "#000000",
        background: "#000000",
        outline: "#000000",
        texture: "none",
    });

    dice3d.addSystem({ id: "cangtrev", name: "Ficha de Narrativa" }, true);
    dice3d.addDicePreset({
        type: "dn",
        labels: [
            "systems/cangtrev/img/ficha-front.png",
            "systems/cangtrev/img/ficha-bump.png"
        ],
        colorset: "black",
        system: "cangtrev",
		
    },
	"d2");
    
});

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createcangtrevMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createPrincessWorldMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.cangtrev.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "cangtrev.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}