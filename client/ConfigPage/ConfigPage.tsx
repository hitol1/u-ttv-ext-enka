import { useState } from 'react'
import UIDInput from '../src/components/UIDInput';
import "../src/index.css"
import { GenshinCharacter } from '../src/util/CardTypes';
import StaticPortrait from '../src/components/StaticPortrait';
import {motion, AnimatePresence, spring} from "framer-motion"

export default function ConfigPage(){
  const [configChars, setConfigChars] = useState<GenshinCharacter[]>([])

  const item = {
    initial: { y: 25, opacity: 0},
    animate: { y: 0, opacity: 1}
  }

  return (
    <div className='w-full md:w-3/4 lg:w-1/2 h-full mx-auto px-8 pb-8 grid grid-rows-8 content-center'>
      <div></div>
      <UIDInput setPeople={setConfigChars}/>
      <AnimatePresence mode="wait" initial={false}>
        {configChars.length != 0 
          ? 
          <motion.div 
            className='row-span-6 text-white shadow-black text-shadow w-full h-full bg-gray-300/60 p-4 rounded-md'
          >
              <div className='flex flex-col'>
                <h1 className ='text-2xl text-center text-white shadow-black text-shadow'> Now Showing on Extension: </h1>  
                <motion.div 
                  className='mt-2 grid grid-cols-4 grid-rows-3 justify-items-center'
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 2, 
                    type: spring,
                    delayChildren: 0.4,
                    staggerChildren: 0.05
                  }}
                >
                  {configChars.map(char => 
                    <motion.div key={char.name} variants={item}>
                      <StaticPortrait person={char}/>
                    </motion.div>
                  )}
                </motion.div>
              </div>
          </motion.div>
          : ""
        }
      </AnimatePresence>
      
    </div>
  );
}


