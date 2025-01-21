import hp from "../assets/images/FIGHT_PROP_HP.svg"
import attack from "../assets/images/FIGHT_PROP_ATTACK.svg"
import def from "../assets/images/FIGHT_PROP_DEFENSE.svg"
import em from "../assets/images/FIGHT_PROP_ELEMENT_MASTERY.svg"
import cr from "../assets/images/FIGHT_PROP_CRITICAL.svg"
import cd from "../assets/images/FIGHT_PROP_CRITICAL_HURT.svg"
import er from "../assets/images/FIGHT_PROP_CHARGE_EFFICIENCY.svg"
import bg from '../assets/images/overlay.jpg'
import artifact from "../assets/images/artifact.png"

import { MdStars, MdOutlineStars  } from "react-icons/md";
import { PiMouseLeftClickFill } from "react-icons/pi";
import { GiDiamonds } from "react-icons/gi";

import { GenshinCharacter } from '../util/CardTypes';
import elements from '../util/elements';
import paimon from "../util/justPaimon"
import enka from "../assets/images/enkaicon.png"

import "../css/gradients.css"
import "../css/dropshadow.css"

import {motion} from "framer-motion"

interface GenshinCharProp {
  charToShow: GenshinCharacter | null
}

export default function CharacterCard({ charToShow }: GenshinCharProp) {
  if (charToShow == null) {
    return (
      <div className='h-full flex flex-col items-center justify-center mix-blend-normal'>
        <img src={bg} className='w-full h-full object-cover absolute mix-blend-overlay -z-10' />
        <div className="ml-20 flex flex-col gap-2">
          <p className="text-white">Select a character</p>
          <img src={paimon.randomPaimon()} className="p-8"/>
        </div>
      </div>
    )
  }

  // Cons
  const consList = [];
  for (let i = 0; i < Number(charToShow.constellations); i++) {
    consList.push({
      cons: <MdStars className={`text-3xl ${elements.textColors(charToShow.element)} svg-drop-shadow-black-sm`} key={`${i}cons${charToShow.name}`} />
    })
  }
  for (let i = Number(charToShow.constellations); i < 6; i++) {
    consList.push({
      cons: <MdOutlineStars className='text-3xl svg-drop-shadow-black-sm' key={`${i}cons${charToShow.name}`} />
    })
  }

  // Character Name adjust
  let nameSize = ""
  if (charToShow.name.length > 12) {
    nameSize = "text-xl"
  } else {
    nameSize = "text-3xl"
  }

  const itemVariants = {
      initial: { opacity: 0, x: -15 },
      animate: { opacity: 1, x: 0 }
  }

  return (
    <div className={`flex flex-col gap-2 items-center justify-center py-4 px-2 mix-blend-normal ${elements.bgGradientColors(charToShow.element)} relative`}>
      
      <img src={bg} className='w-full h-full object-cover absolute mix-blend-overlay' />
      <motion.div 
          key={charToShow.name}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.25, ease: "easeOut", staggerChildren: 0.05}}
      >
        {/* Name And Cons*/}
        <motion.div 
          className='flex flex-col items-center justity-center w-full gap-2 py-2 pl-20 text-white text-xl'
          variants={itemVariants}
        >
          <div className='w-full h-[65px] flex flex-col justify-center'>
            <p className={`${nameSize} shadow-black/50 text-shadow`}>{" " + charToShow.name}</p>
            <p className="shadow-black/50 text-shadow">Lv {charToShow.level}</p>
          </div>
          <div className='flex'>
            {consList.map(item => (
              item.cons
            ))}
          </div>

          {/* Skill */}
          <div className='w-full flex items-center justify-center gap-4'>
            <div className='rounded-full w-11 h-10 skillbg text-white relative flex-center border-x border-white/50'>
              <PiMouseLeftClickFill className="svg-drop-shadow-white-sm text-xl"/>
              <GiDiamonds className="absolute inset-y-0 -left-2 h-full rotate-90 text-sm text-gray-300"/>
              <GiDiamonds className="absolute inset-y-0 -right-2 h-full rotate-90 text-sm text-gray-300"/>
              <p className="absolute -bottom-4 text-sm bg-black/35 rounded-full px-2 shadow-amber-300/70 text-shadow-sm text-amber-300">
                {charToShow.talents?.at(0)}
              </p>
            </div>
            <div className='rounded-full w-11 h-10 skillbg text-white relative flex-center border-x border-white/50'>
              <p className="shadow-white/50 text-shadow-sm text-xl">E</p>
              <GiDiamonds className="absolute inset-y-0 -left-2 h-full rotate-90 text-sm text-gray-300"/>
              <GiDiamonds className="absolute inset-y-0 -right-2 h-full rotate-90 text-sm text-gray-300"/>
              <p className="absolute -bottom-4 text-sm bg-black/35 rounded-full px-2 shadow-amber-300/70 text-shadow-sm text-amber-300">
                {charToShow.talents?.at(1)}
              </p>
            </div>
            <div className='rounded-full w-11 h-10 skillbg text-white relative flex-center border-x border-white/50'>
              <p className="shadow-white/50 text-shadow-sm text-xl">Q</p>
              <GiDiamonds className="absolute inset-y-0 -left-2 h-full rotate-90 text-sm text-gray-300"/>
              <GiDiamonds className="absolute inset-y-0 -right-2 h-full rotate-90 text-sm text-gray-300"/>
              <p className="absolute -bottom-4 text-sm bg-black/35 rounded-full px-2 shadow-amber-300/70 text-shadow-sm text-amber-300">
                {charToShow.talents?.at(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weapon */}
        <motion.div 
          className='h-[120px] flex items-center gap-2 justify-center rounded-lg text-sm mb-2 mt-4 ml-20 py-2 bg-black/20'
          variants={itemVariants}
        >
          <div className='w-2/5'>
            <img className="drop-shadow-img" src={'https://enka.network/ui/' + charToShow.weapon?.url + '.png'} alt={charToShow.weapon?.name} />
          </div>
          <div className='w-3/5 h-full flex flex-col justify-center items-center gap-1 text-white'>
            <p className="shadow-black/50 text-shadow-sm">{charToShow.weapon?.name}</p>
            <p className='shadow-black/50 text-shadow-sm'>Lv. {charToShow.weapon?.level}/{charToShow.weapon?.maxLevel}</p>
            <p className='bg-gray-300/50 text-sm w-1/3 rounded-md shadow-amber-200/70 text-shadow-sm text-amber-200'>
              R{charToShow.weapon?.refines}
            </p>
          </div>
        </motion.div>
        
        {/* Artifacts */}
        <motion.div 
          className='h-full flex flex-col items-center gap-2 justify-center rounded-lg text-xs mb-2 mt-4 ml-20 py-2 bg-black/30 text-white'
          variants={itemVariants}
        >
          <div className="flex items-center text-lg">
            <p>Artifacts</p>
            <img src={artifact} className="w-8 h-8"/>  
          </div>
          <div className='w-full h-full flex flex-col justify-center items-center gap-1'>
            {charToShow.artifactSets?.map(set => 
              <p className="shadow-black/50 text-shadow-sm" key={set+charToShow.name}>
                {set.split(":")[0]} : <span className="bg-gray-300/50 text-sm px-2 py-0.5 rounded-md shadow-amber-200/70 text-shadow-sm text-amber-200">{set.split(":")[1]}</span>
              </p>)}
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          className='grid grid-cols-1 grid-rows-8 grid-flow-col gap-1 text-white text-lg w-full pl-20'
          transition={{ duration: 0.1, ease: "easeOut", staggerChildren: 0.01}}
        >
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/20' variants={itemVariants}>
            <div className='w-1/2 flex gap-2 justify-left items-center ml-4'>
              <img className="w-5 h-5 invert" src={hp} alt='attack icon' />
              <p >HP</p>
            </div>
            <p className='w-1/2'> {charToShow.hp}</p>
          </motion.div>
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/30' variants={itemVariants}>
            <div className='w-1/2 flex gap-2 justify-left items-center ml-4'>
              <img className="w-5 h-5 invert" src={attack} alt='attack icon' />
              <p >ATK</p>
            </div>
            <p className='w-1/2'> {charToShow.atk}</p>
          </motion.div>
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/20' variants={itemVariants}>
            <div className='w-1/2 flex gap-2 justify-left items-center ml-4'>
              <img className="w-5 h-5 invert" src={def} alt='def icon' />
              <p >DEF</p>
            </div>
            <p className='w-1/2'> {charToShow.def}</p>
          </motion.div>
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/30' variants={itemVariants}>
            <div className='w-1/2 flex gap-2 justify-left items-center ml-4'>
              <img className="w-5 h-5 invert" src={em} alt='em icon' />
              <p >EM</p>
            </div>
            <p className='w-1/2'> {charToShow.em}</p>
          </motion.div>
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/20' variants={itemVariants}>
            <div className='w-1/2 flex gap-2 justify-left items-center ml-4'>
              <img className="w-5 h-5 invert" src={cr} alt='cr icon' />
              <p >CR</p>
            </div>
            <p className='w-1/2'> {(Number(charToShow.critRate) * 100).toFixed(2)}%</p>
          </motion.div>
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/30' variants={itemVariants}>
            <div className='w-1/2 flex gap-2 justify-left items-center ml-4'>
              <img className="w-5 h-5 invert" src={cd} alt='cd icon' />
              <p >CD</p>
            </div>
            <p className='w-1/2'> {(Number(charToShow.critDamage) * 100).toFixed(2)}%</p>
          </motion.div>
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/20' variants={itemVariants}>
            <div className='w-1/2 flex gap-2 justify-left items-center ml-4'>
              <img className="w-5 h-5 invert" src={er} alt='er icon' />
              <p >ER</p>
            </div>
            <p className='w-1/2'> {(Number(charToShow.er) * 100).toFixed(2)}%</p>
          </motion.div>
          <motion.div className='w-full h-full rounded-md py-2 flex bg-black/30' variants={itemVariants}>
            <div className='w-1/2 flex gap-1 justify-left items-center ml-4'>
              <img className="w-6 h-6 " src={elements.elementIcon(charToShow.highestElement)} alt='dmg % icon' />
              <p >DMG %</p>
            </div>
            <p className='w-1/2'> {(Number(charToShow.damageBonus) * 100).toFixed(2)}%</p>
          </motion.div>
        </motion.div>

        {/* Logo */}
        <div className="w-full flex justify-end mt-4">
            <div className="w-1/2">
              <img src={enka}/>
            </div>
        </div>

      </motion.div>
    </div>
  );
}