/* eslint-disable @typescript-eslint/no-explicit-any */
import {motion} from "framer-motion"
import elements from '../util/elements';
import "../css/dropshadow.css"

export default function Portrait({ person }: any, { activeIcon }: any) {
    const icon = {
        initial: { opacity: 0 },
        hover: {
            opacity: [0.1, 0.3, 0.75, 0.75, 0.1],
            scale: [1, 1.1, 1.2, 1.2, 1],
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.05, 0.15, 0.5, 1],
                repeat: Infinity
        }
        },
        tap: {
            opacity: [1, 1, 1],
            scale: [1.2, 1.5, 1.2],
            transition: {
                duration: 0.25,
                ease: "easeInOut",
                times: [0, 0.1, 1]
        }
        },
        active: { 
            opacity: 1,
            x: 15,
            y: 15,
            scale: 0.65
        }
    }

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
        <motion.div className='w-20 h-20 relative'>
            <motion.img 
                className={`absolute inset-0 w-full h-full px-3 pt-6 z-50 drop-shadow-img`}
                src={elements.elementIconAlt(person.element)} 
                alt='character icon element' 
                variants={icon}
            />
            <motion.img
                src={'https://enka.network/ui/' + person.url + '.png'}
                alt={person.name}
                className='absolute inset-0 object-cover z-20'
                variants={image}
            />
            {person.name === activeIcon ? (
                <motion.div 
                    className={`absolute bottom-0 inset-x-2 w-3/4 h-3/4 bg-gradient-to-tl from-gray-500/25 ${elements.iconGradients(person.element)} rounded-full border-4 ${elements.borderColors(person.element)}`}
                    variants={image}
                />
            ) : (
                <motion.div 
                    className={`absolute bottom-0 inset-x-2 w-3/4 h-3/4 bg-gray-700 rounded-full border-4 ${elements.borderColors(person.element)}`}
                    variants={image}
                />
            )}
        </motion.div>
    )
}

