/* eslint-disable @typescript-eslint/no-explicit-any */
import {motion} from "framer-motion"
import elements from '../util/elements';
import "../css/dropshadow.css"


export default function StaticPortrait({ person }: any) {
    const image = {
      tap: {
        scale: 0.9,
        opacity:0.75
      },
      active: { 
        scale: 1.2
      }
    }
  
    return (
      <motion.div className='h-24 w-24 md:w-28 md:h-28 lg:w-32 lg:h-32 relative'>
        <motion.img 
          className={`absolute bottom-0 right-0 w-3/5 h-3/5 px-3 pt-6 z-50 drop-shadow-img`}
          src={elements.elementIconAlt(person.element)} 
          alt='character icon element' 
        />
        <motion.img
          src={'https://enka.network/ui/' + person.url + '.png'}
          alt={person.name}
          className='absolute object-cover z-20'
          variants={image}
        />
        <motion.div 
          className={`absolute bottom-0 inset-x-2 w-3/4 h-3/4 bg-gradient-to-tl from-gray-500/25 ${elements.iconGradients(person.element)} rounded-full border-4 ${elements.borderColors(person.element)}`}
          variants={image}
        />
      </motion.div>
    )
}