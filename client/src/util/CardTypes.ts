export type GenshinCharacter = {
    id?: number,
    name: string,
    level: number,
    hp: number,
    atk? : number,
    def? : number,
    em? : string,
    er? : string,
    critRate? : string,
    critDamage? : string,
    damageBonus? : string,
    highestElement? : string,
    constellations? : string, // Shorter than 4 digits
    talents? : string[], 
    element? : string,
    weapon? : GenshinWeapon,
    url? : string,
    artifactSets? : string[],
}

export type GenshinWeapon = {
    name? : string,
    url? : string,
    level? : number,
    maxLevel? :number,
    refines? : number
}