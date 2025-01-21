import { useState } from 'react';
import { GenshinCharacter, GenshinWeapon } from '../util/CardTypes';
import { fetchJSON } from '../util/FetchData';
import twitchApi from '../twitchApi';
import { FaChevronRight } from "react-icons/fa";

import {motion} from "framer-motion"

let charInformationList: { chars: GenshinCharacter[], weps: GenshinWeapon[] };

export function parseResponse(data: any): { chars: GenshinCharacter[], weps: GenshinWeapon[] } {
  const characters: GenshinCharacter[] = [];
  const weapons: GenshinWeapon[] = [];

  data.forEach((charStats: any) => {
    const talentLevels = charStats[1][2];
    const wep: GenshinWeapon = {
      name: charStats[1][4][0],
      level: charStats[1][4][1],
      maxLevel: charStats[1][4][2],
      refines: charStats[1][4][3],
      url: charStats[1][4][4]
    }
    weapons.push(wep);
    // Parse Damage Bonus
    let dB = charStats[1][0][8].split(":");
    characters.push({
      id: charStats[1][0][10],
      name: charStats[0],
      level: charStats[1][0][9],
      hp: charStats[1][0][0],
      atk: charStats[1][0][1],
      def: charStats[1][0][2],
      em: charStats[1][0][3],
      critDamage: charStats[1][0][4],
      critRate: charStats[1][0][5],
      er: charStats[1][0][6],
      // Healing Bonus is [1][0][7]
      highestElement: dB[0],
      damageBonus: dB[1],
      constellations: charStats[1][3],
      talents: talentLevels,
      weapon: wep,
      element: charStats[1][0][11],
      url: charStats[1][1],
      artifactSets: charStats[1][5],
    });
  });

  return { chars: characters, weps: weapons };
}

function UIDInput({ setPeople }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState("");

  const variants = {
    submitted: { opacity: 0, x: 50,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    },
    default: { opacity: 1, x: 0 },
  }

  async function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    let errorMsg = '';
    try {
      const response = await fetchJSON(formJson['UserID'].toString());
      if (response.status !== 200) {
        switch (response.status) {
          case 400:
            errorMsg = ("Something went wrong with the request. Try again later");
            break;
          case 424:
            errorMsg = "Request to enka.network failed because it is under maintenance.";
            break;
          case 429:
            errorMsg = "Rate Limit reached. You reached my network's rate limit. Please try again in 3 minutes.";
            break;
          case 404:
            errorMsg = `User with uid was not found. Please check whether the uid is correct. If you find the uid is correct, it may be a internal server error.`
            break;
          default:
            errorMsg = `Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}`;
            break;
        }
      }
      if (errorMsg) {
        if (setPeople) {
          setPeople([]);
        } 
        return errorMsg;
      } else {
        charInformationList = parseResponse(response.data)
        if (setPeople) {
          setPeople(charInformationList.chars);
        }
      }
    } catch(e) {
      errorMsg = 'The support server wasn\'t able to respond, try again in a couple minutes, and then find the support email';
      if (setPeople) {
        setPeople([]);
      }      
      return errorMsg;
    }
    return ""
  }

  return (
    <div className={`w-full flex-col flex-center drop-shadow-xl ${msg ? 'row-span-6' : ''}`}>
      {msg 
        ?
        <></>
        :
        <form
          className='w-3/4'
          method="get"
          onSubmit={(e) => { 
            handleSubmit(e).then(message => setMsg(message));
            setSubmitted(true)
          }}
        >
            <motion.div 
              className='flex items-center justify-between bg-gray-800 focus:bg-gray-900 px-6 py-3 rounded-md focus-within:bg-gray-900'
              initial="default"
              animate={submitted ? "submitted" : "default"}
            >

                <input
                  className='w-full bg-transparent text-2xl text-white text-center appearance-none  bg-opacity-90 border-none rounded-md leading-tight focus:outline-none'
                  type="text" placeholder="Enter UID" name="UserID" />


              <motion.button 
                className='text-2xl text-white'
                variants={variants}
                type="submit">
                  <FaChevronRight/>
              </motion.button> 
            </motion.div>
        </form>
      }
      <div className={`self-start mt-8 text-3xl text-center text-red-600 shadow-black text-shadow ${!msg ? "opacity-0" : "opacity-100"}`}>
        {msg}
      </div>
    </div>
  );
}
export default UIDInput;
