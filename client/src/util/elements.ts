import pyro from "../assets/images/FIGHT_PROP_FIRE_ADD_HURT.svg"
import cryo from "../assets/images/FIGHT_PROP_ICE_ADD_HURT.svg"
import dendro from "../assets/images/FIGHT_PROP_GRASS_ADD_HURT.svg"
import electro from "../assets/images/FIGHT_PROP_ELEC_ADD_HURT.svg"
import anemo from "../assets/images/FIGHT_PROP_WIND_ADD_HURT.svg"
import geo from "../assets/images/FIGHT_PROP_ROCK_ADD_HURT.svg"
import hydro from "../assets/images/FIGHT_PROP_WATER_ADD_HURT.svg"
import physical from "../assets/images/FIGHT_PROP_PHYSICAL_ADD_HURT.svg"

function bgGradientColors(element: string|undefined) {
  switch (element) {
    case 'C':
      // WIP
        return 'bg-gradient-to-br from-cryo via-cryo to-white-700';
    case 'E':
      // WIP
        return 'bg-gradient-to-br from-electro via-electro to-white-700';
    case 'A':
        return 'bg-gradient-to-br from-anemo via-anemo via-60% to-anemo/25';
    case 'G':
        return 'bg-gradient-to-br from-geo/75 via-geo/75 via-30% to-geo/25';
    case 'H':
        return 'bg-gradient-to-br from-hydro/75 via-hydro/65 via-30% to-hydro/25';
    case 'D':
        return 'bg-gradient-to-br from-dendro via-dendro via-70% to-dendro/50';
    case 'P':
        return 'bg-gradient-to-br from-pyro/75 via-pyro/75 via-30% to-pyro/25';
  }
}

function borderColors(element: string|undefined) {
  switch (element) {
    case 'C':
        return 'border-cryo';
    case 'E':
        return 'border-electro';
    case 'A':
        return 'border-anemo';
    case 'G':
        return 'border-geo';
    case 'H':
        return 'border-hydro';
    case 'D':
        return 'border-dendro';
    case 'P':
        return 'border-pyro';
  }
}

function iconGradients(element: string|undefined) {
  switch (element) {
    case 'C':
        return 'via-cryo/75 via-60% to-cryo';
    case 'E':
        return 'via-electro/75 via-60% to-electro';
    case 'A':
        return 'via-anemo/75 via-60% to-anemo';
    case 'G':
        return 'via-geo/75 via-60% to-geo';
    case 'H':
        return 'via-hydro/75 via-60% to-hydro';
    case 'D':
        return 'via-dendro/75 via-60% to-dendro';
    case 'P':
        return 'via-pyro/75 via-60% to-pyro';
  }
}


function elementIcon(element: string|undefined) {
  switch (element) {
    case 'Ph':
      return physical;
    case 'C':
      return cryo;
    case 'E':
      return electro;
    case 'A':
      return anemo;
    case 'G':
      return geo;
    case 'H':
      return hydro;
    case 'D':
      return dendro;
    case 'Py':
      return pyro;
  }
}

function elementIconAlt(element: string|undefined) {
  switch (element) {
    case 'C':
      return cryo;
    case 'E':
      return electro;
    case 'A':
      return anemo;
    case 'G':
      return geo;
    case 'H':
      return hydro;
    case 'D':
      return dendro;
    case 'P':
      return pyro;
  }
}

function textColors(element: string|undefined) {
  switch (element) {
    case 'C':
        return 'text-cryo';
    case 'E':
        return 'text-electro';
    case 'A':
        return 'text-anemo';
    case 'G':
        return 'text-geo';
    case 'H':
        return 'text-hydro';
    case 'D':
        return 'text-dendro';
    case 'P':
        return 'text-pyro';
  }
}

const elements = {
    bgGradientColors,
    borderColors,
    iconGradients,
    elementIcon,
    textColors,
    elementIconAlt
}

export default elements;