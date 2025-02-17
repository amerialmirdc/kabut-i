'use client'
import { useEffect, useState } from "react"
import SettingsIcon from '@mui/icons-material/Settings';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import { useRouter } from 'next/navigation'

export default function NavBar() {

  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  let defaultMobileWidth = 450;

  useEffect(() => {
    if(window.screen.width <= defaultMobileWidth){
      setIsMobile(true)
    }else{
      setIsMobile(false)
    }

    let windowListener = window.addEventListener('resize', (e) => {
      if(window.screen.width <= defaultMobileWidth){
        setIsMobile(true)
      }else{
        setIsMobile(false)
      }
    });

    return () => {
      removeEventListener('resize', windowListener)
    };
  
  }, [])

  const routeTo = (link) => {
    console.log('current route')
    if(link=='settings'){ router.push('/settings'); return; }
    console.log('route to: ', link)
    router.push(`/dashboard/${link}`)
  }

    return (
      <>
        {
          isMobile && 
          <div>
            <div className="bg-sky-500 h-16 fixed z-10 bottom-0 left-0 right-0 flex items-center justify-evenly">
              <div onClick={()=>{routeTo('fogger')}} className="text-center px-2 h-full flex items-center flex-col justify-center text-white">
                <WaterDamageIcon className="" style={{fontSize: '32px'}}></WaterDamageIcon>
                <p className="text-sm">fogger</p>
              </div>
              <div onClick={()=>{routeTo('sprinkler')}} className="text-center px-2 h-full flex items-center flex-col justify-center text-white">
                <WaterDamageIcon style={{fontSize: '32px'}}></WaterDamageIcon>
                <p className="text-sm">sprinkler</p>
              </div>
              {/* <div onClick={()=>{routeTo('settings')}} className="text-center px-2 h-full flex items-center flex-col justify-center text-white">
                <SettingsIcon style={{fontSize: '32px'}}></SettingsIcon>
                <p className="text-sm">settings</p>
              </div> */}
            </div>
          </div>
        }
        {
          !isMobile && 
          <div>
            <div className="bg-sky-500 w-16 fixed z-10 bottom-0 left-0 top-0"></div>
          </div>
        }
      </>
    );
  }
  