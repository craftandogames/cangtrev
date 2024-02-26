/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {CangTrevActorSheet}
 */
import CangTrevActorSheet from "./actor-sheet.js"
 
export class CangTrevNPCSheet extends CangTrevActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cangtrev", "sheet", "actor", "npc"],
      template: "systems/cangtrev/templates/actor/npc-sheet.html"
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
	
	
  }
}
