export class Narrativa extends DiceTerm {
    constructor(termData) {
        termData.faces = 2;
        super(termData);
    }

    /** @override */
    static getResultLabel(result) {
        return {
            1: '<img src="systems/cangtrev/img/ficha-front.png" />',
            2: '<img src="systems/cangtrev/img/ficha-bump.png" />'
        }[result];
    }
}
/** @override */
Narrativa.DENOMINATION = 'n';
