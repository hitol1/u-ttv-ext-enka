const paim1 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%201.png";
const paim2 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%202.png";
const paim3 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%203.png";
const paim4 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%204.png";
const paim5 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%205.png";
const paim6 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%206.png";
const paim7 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%207.png";
const paim8 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%208.png";
const paim9 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%209.png";
const paim10 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%2010.png";
const paim11 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%2011.png";
const paim12 = "https://hitol1.github.io/u-ttv-ext-enka/stickers/Paimon%2012.png";

function randomPaimon() {
    switch(Math.floor(Math.random() * 12)) {
        case 0:
            return paim1;
        case 1:
            return paim2;
        case 2:
            return paim3;
        case 3:
            return paim4;
        case 4:
            return paim5;
        case 5:
            return paim6;
        case 6:
            return paim7;
        case 7:
            return paim8;
        case 8:
            return paim9;
        case 9:
            return paim10;
        case 10:
            return paim11;
        case 11:
            return paim12;
        default:
            throw new Error("Invalid case number");
    }
}


const paimon = {
    randomPaimon
}

export default paimon;