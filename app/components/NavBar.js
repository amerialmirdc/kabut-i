'use client'
import { useEffect, useState } from "react"

export default function NavBar() {

  const [isMobile, setIsMobile] = useState(false)

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

    return (
      <>
        {
          isMobile && 
          <div>
            <div className="bg-sky-500 h-16 fixed z-10 bottom-0 left-0 right-0"></div>
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
  