/**	
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class CangTrevItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
  }
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    const abilities = [];
    let create_ability;
    
      this.updateSource({
        items: abilities,
        img: "systems/cangtrev/img/item.png"
      });
    }
  
}
