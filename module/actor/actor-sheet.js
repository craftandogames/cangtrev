/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export default class CangTrevActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
		console.log(this)
  }

  /* -------------------------------------------- */

  async getData(options) {
    const data = await super.getData(options);
    data.notas = await TextEditor.enrichHTML(this.object.system.notas, {async: true});
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
	
    html.find(".change-attribute").click(this._updateStat.bind(this));
	
    html.find('.roll-attr').click(this._rolandoAtributo.bind(this));
    html.find('.roll-terceiros').click(this._rolandoTerceiros.bind(this));
	
	// Items
	html.find('.item-create').click(this._onItemCreate.bind(this));
	html.find('.item-edit').click(this._onItemEdit.bind(this));
	html.find('.item-delete').click(this._onItemDelete.bind(this));
  }
  
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _rolandoAtributo(event) {
    event.preventDefault();
	const element = event.currentTarget;
	const dataset = element.dataset;
	let attr = element.getAttribute("attr");
	let attrSet = element.getAttribute("attrSet");
	let adv = 2;
	let formContent = "<form>" +
		"<div>" +
			"<div>" +
				"<label>Atributo Secundario:</label>" +
				"<select name=\"secundario\">";
				
	let attrSecSet = this.actor.system.atributos[attrSet]["secundarios"];
	
	for (let a in attrSecSet){
		formContent = formContent +
					"<option value=\"@atributos." + attrSet + ".secundarios." + a + "\">" + game.i18n.localize("l10n.atributos." + attrSet + ".secundarios." + a) + "</option>";					
	}
	
	formContent = formContent +
				"</select>" +
			"</div>" +
			"<div>" +
				"<label>Perícia:</label>" +
				"<select name=\"pericia\">";
				
	let skillSet = this.actor.system.pericias;
	
	for (let s in skillSet){
		formContent = formContent +
					"<option value=\"@pericias." + s + "\">" + game.i18n.localize("l10n.pericias." + s) + "</option>";					
	}
	
	formContent = formContent +
				"</select>" +
			"</div>" +
			"<div>" +
				"<label>Bônus/Ônus (Ex: +1, -2, ...)</label>" +
				"<input type=\"text\" name=\"bonus\"/>" +
			"</div>" +
		"</div>" +
	"</form>";

	new Dialog({
		title: "Rola aí",
		content: formContent,
		buttons: {
			normal : {
				icon: '<i class="fas fa-check"></i>',
				label: "Normal",
				callback: () => adv = 0
			},
			cancelar : {
				icon: '<i class="fas fa-times"></i>',
				label: "Cancelar",
				callback: () => adv = -1
			}
		},
		default: "Cancel",
		close: html => {
			if(adv == 0){
				let secundario = html.find('[name=secundario]')[0].value;
				let pericia = html.find('[name=pericia]')[0].value;
				let bonus = html.find('[name=bonus]')[0].value;
				let dices = "2d6 + " + attr + " + " + secundario + " + " + pericia;
				if(bonus != ""){
					dices = dices + " + " + bonus;
				}
				
				console.log(html.find('[name=maior]')[0]);
				
				let formulae = dices;
				console.log(formulae);
				let label = "Rolando " + formulae;
				var roll = new Roll(formulae, this.actor.data.data);
				roll.roll({"async": false});
				console.log(roll);
				
				roll.toMessage({
					speaker: ChatMessage.getSpeaker({ actor: this.actor }),
					flavor: label
				});
			}
		}
	}).render(true);
  }
  
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _rolandoTerceiros(event) {
    event.preventDefault();
	const element = event.currentTarget;
	const dataset = element.dataset;
	let attr = element.getAttribute("attr");
	let adv = 2;
	let formContent = "<form>" +
		"<div>" +
			"<div>" +
				"<label>Perícia:</label>" +
				"<select name=\"pericia\">";
				
	
	let skillSet = this.actor.system.pericias;
	console.log(skillSet);
	
	for (let s in skillSet){
		formContent = formContent +
					"<option value=\"@pericias." + s + "\">" + game.i18n.localize("l10n.pericias." + s) + "</option>";					
	}
	
	formContent = formContent +
				"</select>" +
			"</div>" +
			"<div>" +
				"<label>Bônus/Ônus (Ex: +1, -2, ...)</label>" +
				"<input type=\"text\" name=\"bonus\"/>" +
			"</div>" +
		"</div>" +
	"</form>";

	new Dialog({
		title: "Rola aí",
		content: formContent,
		buttons: {
			normal : {
				icon: '<i class="fas fa-check"></i>',
				label: "Normal",
				callback: () => adv = 0
			},
			cancelar : {
				icon: '<i class="fas fa-times"></i>',
				label: "Cancelar",
				callback: () => adv = -1
			}
		},
		default: "Cancel",
		close: html => {
			if(adv == 0){
				let pericia = html.find('[name=pericia]')[0].value;
				let bonus = html.find('[name=bonus]')[0].value;
				let dices = "2d6 + " + attr + " + " + pericia;
				if(bonus != ""){
					dices = dices + " + " + bonus;
				}
				
				console.log(html.find('[name=maior]')[0]);
				
				let formulae = dices;
				console.log(formulae);
				let label = "Rolando " + formulae;
				var roll = new Roll(formulae, this.actor.data.data);
				roll.roll({"async": false});
				console.log(roll);
				
				roll.toMessage({
					speaker: ChatMessage.getSpeaker({ actor: this.actor }),
					flavor: label
				});
			}
		}
	}).render(true);
  }
  
	/**
	* Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
	* @param {Event} event   The originating click event
	* @private
	*/
	_onItemCreate(event) {
		//event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		let type = element.getAttribute("type");
		
		const itemData = {
			"name": type,
			"type": type
		};
		Item.create(itemData, {parent: this.actor});
	}
	
	_onItemEdit(event) {
		//event.preventDefault();
		const item_id = event.currentTarget.getAttribute("data-item-id");
		const item = this.actor.items.get(item_id);
		item.sheet.render(true);
	}	
	
	_onItemDelete(event) {
		//event.preventDefault();
		const item_id = event.currentTarget.getAttribute("data-item-id");
		const item = this.actor.items.get(item_id);
		item.delete();
	}
	
	
	/** @override */
	async _onDropItemCreate(itemData) {
		//Characters can have only a single of these
		if(itemData.type == "playbook"){
			//Make sure only the last one added remains
			for (let e of this.actor.items.keys()){
				let item = this.actor.items.get(e);
				let itemData = item.data;
				
				if(item.type == "playbook"){
					item.delete()
				}
			}
				
			this.actor.update({
				"data.playbook": itemData.name
			});
				
			//this.actor.createOwnedItem(itemData);
		}

		// Create the owned item as normal
		return super._onDropItemCreate(itemData);
	}
	
	_updateStat(event){	
		event.preventDefault();
		const element = event.currentTarget;
		const fieldString = element.getAttribute("field");
		const path = fieldString.split('.');
		const value = element.getAttribute("value");
		
		let jVar = {};
		let jPath = jVar;
		
		let i = 0;
		while(i < path.length - 1){
			jPath[path[i]] = {};
			jPath = jPath[path[i]];
			i++;
		}
		
		jPath[path[i]] = Number(value);
		
		return this.actor.update(jVar);
	}
}
