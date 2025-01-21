import { useState } from 'react';
import CharacterCard from './components/CharacterCard';
import Menu from './components/CharacterSelectionMenu';
import { GenshinCharacter } from './util/CardTypes';
import {motion, AnimatePresence} from "framer-motion"
import bg from './assets/images/overlay.jpg'
import paimon from "./util/justPaimon"
import enka from "./assets/images/enkaicon.png"


function App() {
  const [charToShow, setCharToShow] = useState<GenshinCharacter | null>(null);
  return (
    <div className='h-svh font-genshin relative no-scrollbar overflow-y-auto'>
      <Menu setCharToShow={setCharToShow}/>
      <div className="mx-auto text-center h-full">
        <AnimatePresence mode="wait" initial={true}>
          {!charToShow &&
            <div className='h-full flex flex-col items-center justify-center mix-blend-normal'>
              <img src={bg} className='w-full h-full object-cover absolute mix-blend-overlay -z-10' />
              <div className="ml-20 flex flex-col gap-2">
                <motion.p className="text-white text-xl"
                  key="waiting"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                      ease: "linear",
                      duration: 1.5,
                      times: [0, 0.5, 1],
                      repeat: Infinity
                  }}>
                    Select a Character
                </motion.p>
                <img src={paimon.randomPaimon()} className="p-8"/>
                <div className="w-full flex justify-center mt-4">
                  <a href="https://enka.network/" target="_blank" rel="noopener noreferrer">
                    <img src={enka}/>
                  </a>
                </div>
              </div>
            </div>
          }
          {charToShow &&
            <CharacterCard charToShow={charToShow} />
          }
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App
