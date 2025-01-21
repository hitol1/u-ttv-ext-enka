import { useEffect, useState } from 'react';
import { GenshinCharacter } from '../util/CardTypes';
import { parseResponse } from './UIDInput';
import twitchApi from '../twitchApi';
import {motion} from "framer-motion"
import Portrait from "../components/Portrait"

export default function Menu({ setCharToShow }: any) {
  const [people, setPeople] = useState<GenshinCharacter[]>([])
  const [activeIcon, setActiveIcon] = useState("")
  twitchApi.client?.onAuthorized(() => {});
  // setup a listen on the channel pubsub topic
  useEffect(()=>{
    twitchApi.client?.listen('broadcast', function (topic, contentType, message) {
      let messageInfo : {
        event: string,
        payloadContent?: {
          genshin: string
        }
      }
      try {
          messageInfo = JSON.parse(message);
      } catch (e) {
          // this accounts for JSON parse errors
          // just in case
          return;
      }
      // check that it's the expected event
      if (messageInfo.event == 'configure') {
          if (messageInfo?.payloadContent) {
            setPeople(parseResponse(messageInfo?.payloadContent.genshin).chars);
            setCharToShow(null);
          }
      }
    });
  
    twitchApi.client?.configuration.onChanged(() => {
      const config = twitchApi.getConfigurationSegment();
      if (config?.genshin) {
        setPeople(parseResponse(config.genshin).chars)
      }
    });
  }, [setCharToShow])
  
  function changeCard(char: GenshinCharacter) {
    setCharToShow(char)
  }


  const listItems = people.map(person =>
    <motion.button
      key={person.id} 
      onClick={() => {
        changeCard(person)
        setActiveIcon(person.name)
      }}
      initial="initial"
      animate={person.name === activeIcon ? "active" : "initial"} 
      whileHover={person.name === activeIcon ? "active" : "hover"} 
      whileTap={person.name === activeIcon ? "active" : "tap"} 
    >
      <Portrait person={ person } acticeIcon={ activeIcon }/>
    </motion.button>
  )

  return (
    <>
      <div className='h-full w-20 fixed z-10 top-0 left-0 bg-black/50 overflow-x-hidden flex flex-col no-scrollbar overflow-y-auto'>
        {listItems}
      </div>
    </>
  );
}