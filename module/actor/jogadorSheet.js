/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {CangTrevActorSheet}
 */
import CangTrevActorSheet from "./actor-sheet.js"
 
export class CangTrevJogadorSheet extends CangTrevActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cangtrev", "sheet", "actor", "jogador"],
      template: "systems/cangtrev/templates/actor/jogador-sheet.html"
    });
  }

  /* -------------------------------------------- */

  /** @override /
  getData() {
    const data = super.getData();

    return data;
  }
  //**/

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
	
    html.find(".usarFicha").click(this._usarFicha.bind(this));
  }
  
  
  
	/**
	* Handle clickable rolls.
	* @param {Event} event   The originating click event
	* @private
	*/
	async _usarFicha(event) {
		const element = event.currentTarget;
		const dataset = element.dataset;
		
		if(this.actor.system.fichas > 0){
			const message = await renderTemplate("systems/cangtrev/templates/usarFicha.html", {
				speaker: game.user,
			});
            const chatData = {
				content: message,
            };
            ChatMessage.create(chatData);
			if (!!game.dice3d) {
				game.dice3d.showForRoll(new Roll('1dn').evaluate({ async: false }), game.user, true, null, false);
			}
		
			this.actor.usarFichas(1);
		}
	}
}
