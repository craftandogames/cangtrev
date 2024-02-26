/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class CangTrevActor extends Actor {

	/**
	* Augment the basic actor data with additional dynamic data.
	*/
	prepareData() {
		super.prepareData();

		const actorData = this.system;
		const flags = actorData.flags;

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		
		console.log(this)
		
		this.computeDerivedData(actorData);
	}
	
	computeDerivedData(actorData){
		let attr = actorData.atributos
		attr.parrudez.terceiros.carrera = attr.parrudez.secundarios.saude + attr.destreza.secundarios.ligeireza;
		attr.destreza.terceiros.iniciativa = attr.destreza.secundarios.ligeireza; + attr.esperteza.secundarios.percepcao;
		attr.esperteza.terceiros.leriado = attr.esperteza.secundarios.inteligencia + attr.presenca.secundarios.simpatia;
		attr.presenca.terceiros.cabrerisse = attr.esperteza.secundarios.percepcao + attr.presenca.secundarios.valentia;
	}
	
	usarFichas(number){
		const actorData = this.system;
		const data = actorData;
		const flags = actorData.flags;
		
		this.update({"system.fichas": data.fichas - number});
	}
 async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    const abilities = [];
    let create_ability;
    
      this.updateSource({
        items: abilities,
        img: "systems/cangtrev/img/logobco.png"
      });
    }
  }