'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from "next/link";
import { StepIcon, LucideGradDefs } from "@/components/ui/icons";

const devices = [
  {
    id: 'firestick',
    name: 'Fire TV Stick',
    image: '/devices/install/firestick-install.png',
    youtubeId: '38oLnI5vj5g',
    badge: 'Most Popular',
    features: [
      { label: 'Easy & Fast', sub: '5-Minute Setup' },
      { label: 'Step by Step', sub: 'Detailed Guide' },
      { label: '100% Safe', sub: 'Secure & Tested' },
    ],
    videoTitle: 'HOW TO SET UP\nAMAZON FIRE STICK',
    titleHighlight: 'FIRE STICK',
    duration: '5:34',
    color: '#ff7a00',
    steps: [
      { icon: 'settings',    title: 'Enable Developer Options',  desc: 'On your Fire TV, go to Settings → My Fire TV → Developer Options and turn ON "Apps from Unknown Sources".' },
      { icon: 'download',    title: 'Install Downloader App',    desc: 'Search "Downloader" in the Amazon App Store and install it. This is the app you\'ll use to sideload IPTV players.' },
      { icon: 'link',        title: 'Download IPTV Player',      desc: 'Open Downloader, enter the URL provided by STREAMB4 support (e.g. TiviMate or IPTV Smarters) and press Go to download.' },
      { icon: 'package',     title: 'Install the APK',           desc: 'Once downloaded, tap Install. After installation select "Done" — do not open yet.' },
      { icon: 'key',         title: 'Enter Your Credentials',    desc: 'Open the IPTV player, choose "Add Playlist via URL" or "Xtream Codes", then enter the M3U URL / login details sent by STREAMB4.' },
      { icon: 'check',       title: 'Start Streaming',           desc: 'Your channels will load automatically. Enjoy 50,000+ live channels in crystal-clear 4K!' },
    ],
  },
  {
    id: 'smarttv',
    name: 'Smart TV',
    image: '/devices/install/smart-tv-install.png',
    youtubeId: 'aULqYIQjYd0',
    badge: 'Samsung · LG · Sony',
    features: [
      { label: 'Universal', sub: 'All Smart TVs' },
      { label: 'Step by Step', sub: 'Detailed Guide' },
      { label: '100% Safe', sub: 'Secure & Tested' },
    ],
    videoTitle: 'HOW TO SET UP\nSMART TV',
    titleHighlight: 'SMART TV',
    duration: '4:20',
    color: '#ff7a00',
    steps: [
      { icon: 'store',       title: 'Open the Smart TV App Store',  desc: 'On your Samsung, LG or Sony Smart TV, open the built-in App Store (Smart Hub / LG Content Store / Google Play).' },
      { icon: 'search',      title: 'Search for an IPTV App',       desc: 'Search for "Smart IPTV", "SS IPTV" (Samsung/LG) or "IPTV Smarters" (Android-based Smart TVs) and install it.' },
      { icon: 'radio',       title: 'Note Your MAC Address',         desc: 'Open the app and note the MAC address shown on screen. You\'ll need to send this to STREAMB4 support to activate.' },
      { icon: 'message',     title: 'Contact STREAMB4 Support',      desc: 'Send your MAC address to our 24/7 live chat. We\'ll load your playlist to your TV within minutes.' },
      { icon: 'rotate',      title: 'Reload the App',                desc: 'Once STREAMB4 confirms activation, close and reopen the IPTV app. Your channels will appear automatically.' },
      { icon: 'check',       title: 'Start Streaming',               desc: 'Browse 50,000+ live channels directly on your big screen in Full HD & 4K quality!' },
    ],
  },
  {
    id: 'androidtv',
    name: 'Android TV / Box',
    image: '/devices/install/android-tv-install.png',
    youtubeId: 'W7gWwzsiv_I',
    badge: 'Android TV',
    features: [
      { label: 'Easy Setup', sub: 'Quick Install' },
      { label: 'Step by Step', sub: 'Detailed Guide' },
      { label: '100% Safe', sub: 'Secure & Tested' },
    ],
    videoTitle: 'HOW TO SET UP\nANDROID TV BOX',
    titleHighlight: 'ANDROID TV BOX',
    duration: '6:12',
    color: '#ff7a00',
    steps: [
      { icon: 'settings',    title: 'Allow Unknown Sources',             desc: 'Go to Settings → Security (or Device Preferences) and enable "Unknown Sources" or "Install Unknown Apps".' },
      { icon: 'globe',       title: 'Open a Browser or File Manager',    desc: 'Use the built-in browser (or install "File Commander") to navigate to the APK download link provided by STREAMB4.' },
      { icon: 'download',    title: 'Download IPTV Smarters / TiviMate', desc: 'Download the recommended IPTV player APK directly to your Android TV Box. Tap the file to begin installation.' },
      { icon: 'package',     title: 'Install the App',                   desc: 'Follow the on-screen prompts to install. Once done, open the app from your home screen.' },
      { icon: 'key',         title: 'Add Your STREAMB4 Account',         desc: 'Select "Xtream Codes API" or "M3U URL", then enter the server URL, username and password sent to your email by STREAMB4.' },
      { icon: 'check',       title: 'Start Streaming',                   desc: 'Your full channel list loads instantly. Enjoy sports, movies and live TV in 4K Ultra HD!' },
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile Phone',
    image: '/devices/install/mobile-install.png',
    youtubeId: 'hqhnlS2B9pQ',
    badge: 'iOS & Android',
    features: [
      { label: 'Easy & Fast', sub: '3-Minute Setup' },
      { label: 'Step by Step', sub: 'Detailed Guide' },
      { label: '100% Safe', sub: 'Secure & Tested' },
    ],
    videoTitle: 'HOW TO SET UP\nMOBILE PHONE',
    titleHighlight: 'MOBILE PHONE',
    duration: '3:45',
    color: '#ff7a00',
    steps: [
      { icon: 'smartphone',  title: 'Download the App',           desc: 'On iPhone open the App Store, on Android open Google Play. Search for "IPTV Smarters Pro" or "GSE Smart IPTV" and install.' },
      { icon: 'play',        title: 'Open the App',               desc: 'Launch the installed IPTV player. Tap "Add New User" or "Add Playlist" to begin setup.' },
      { icon: 'key',         title: 'Enter Your Login',           desc: 'Choose "Login with Xtream Codes" and enter the Server URL, Username and Password from your STREAMB4 welcome email.' },
      { icon: 'clock',       title: 'Wait for Channels to Load',  desc: 'The app will fetch your full playlist. This usually takes 10–30 seconds depending on your connection speed.' },
      { icon: 'tv',          title: 'Browse & Watch',             desc: 'Navigate Live TV, Movies or Series. Tap any channel or title to start streaming instantly.' },
      { icon: 'earth',       title: 'Enjoy Anywhere',             desc: 'No IP lock — stream at home, at work or while travelling worldwide. No VPN needed!' },
    ],
  },
]

export default function InstallClient() {
  const [activeDevice, setActiveDevice] = useState(0)
  const [playing, setPlaying] = useState(false)
  const active = devices[activeDevice]

  return (
    <div className="min-h-screen bg-[#050505] pt-24 text-white overflow-hidden relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2
          w-[800px] h-[600px] opacity-[0.08]"
          style={{
            background:'radial-gradient(ellipse,#ff7a00,transparent 70%)',
            filter:'blur(80px)'
          }}/>
        <div className="absolute inset-0"
          style={{
            backgroundImage:`
              linear-gradient(rgba(255,122,0,0.03) 1px,transparent 1px),
              linear-gradient(90deg,rgba(255,122,0,0.03) 1px,transparent 1px)
            `,
            backgroundSize:'60px 60px'
          }}/>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 py-16">

        {/* ═══ HEADER ═══ */}
        <motion.div
          initial={{opacity:0, y:30}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.6}}
          className="text-center mb-16">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2
            px-4 py-2 rounded-full mb-8"
            style={{
              background:'rgba(255,122,0,0.08)',
              border:'1px solid rgba(255,122,0,0.2)'
            }}>
            {/* Wrench SVG icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff7a00"/>
                  <stop offset="100%" stopColor="#ffb300"/>
                </linearGradient>
              </defs>
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
                stroke="url(#wg)" strokeWidth="1.5"
                strokeLinecap="round"/>
            </svg>
            <span className="text-orange-500 text-xs font-black
              tracking-[0.2em] uppercase">
              INSTALL GUIDE
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-anton uppercase leading-[0.9] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: "clamp(2.5rem, 9vw, 6rem)",
            }}
          >
            <span className="text-white">SET UP IN </span>
            <span style={{
              background:'linear-gradient(135deg,#ff7a00,#ffb300)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              filter:'drop-shadow(0 0 30px rgba(255,122,0,0.4))'
            }}>MINUTES.</span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Follow our simple step-by-step video tutorials to get 
            STREAMB4 running on any device.
          </p>
        </motion.div>

        {/* ═══ PREMIUM DEVICE SELECTOR CARDS ═══ */}
        <motion.div
          variants={{
            hidden:{},
            visible:{transition:{staggerChildren:0.08}}
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">

          {devices.map((device, i) => (
            <motion.div
              key={device.id}
              variants={{
                hidden:{opacity:0, y:20},
                visible:{opacity:1, y:0, transition:{duration:0.5}}
              }}
              onClick={() => {
                setActiveDevice(i)
                setPlaying(false)
              }}
              whileHover={{
                y: -6,
                transition:{duration:0.2}
              }}
              className="relative group cursor-pointer
                rounded-[20px] overflow-hidden p-5
                flex flex-col items-center gap-4
                transition-all duration-300"
              style={{
                background: activeDevice === i
                  ? 'linear-gradient(145deg,rgba(255,122,0,0.12),rgba(5,5,5,0.98))'
                  : 'rgba(15,15,15,0.95)',
                border: activeDevice === i
                  ? '1px solid rgba(255,122,0,0.5)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: activeDevice === i
                  ? '0 0 40px rgba(255,122,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>

              {/* Top orange line when active */}
              {activeDevice === i && (
                <motion.div
                  layoutId="activeTopLine"
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    background:'linear-gradient(90deg,transparent,#ff7a00,#ffb300,transparent)'
                  }}/>
              )}

              {/* Corner glow when active */}
              {activeDevice === i && (
                <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                  style={{
                    background:'radial-gradient(circle at top right,rgba(255,122,0,0.15),transparent 60%)'
                  }}/>
              )}

              {/* Device image */}
              <div className="relative w-full h-[100px] flex items-center justify-center">
                
                {/* Ambient glow behind image */}
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300
                  ${activeDevice === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                  style={{
                    background:'radial-gradient(ellipse,rgba(255,122,0,0.15),transparent 70%)',
                    filter:'blur(15px)'
                  }}/>

                <motion.div
                  animate={activeDevice === i 
                    ? {y:[0,-4,0]} 
                    : {y:0}}
                  transition={{
                    duration:3,
                    repeat:activeDevice === i ? Infinity : 0,
                    ease:'easeInOut'
                  }}
                  className="relative z-10">
                  <Image
                    src={device.image}
                    alt={device.name}
                    width={120}
                    height={90}
                    className="object-contain transition-transform duration-300
                      group-hover:scale-105"
                    style={{
                      filter: activeDevice === i
                        ? 'drop-shadow(0 8px 20px rgba(255,122,0,0.3))'
                        : 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
                    }}
                  />
                </motion.div>

                {/* Bottom glow under device */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2
                  w-16 h-2 rounded-full transition-opacity duration-300
                  ${activeDevice === i ? 'opacity-70' : 'opacity-0 group-hover:opacity-40'}`}
                  style={{
                    background:'radial-gradient(ellipse,#ff7a00,transparent)',
                    filter:'blur(6px)'
                  }}/>
              </div>

              {/* Device name */}
              <div className="text-center">
                <p className={`font-black text-sm transition-colors duration-200
                  ${activeDevice === i ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {device.name}
                </p>

                {/* Active indicator dots */}
                <div className="flex justify-center mt-2">
                  <div className={`h-1 rounded-full transition-all duration-300
                    ${activeDevice === i 
                      ? 'w-8 bg-gradient-to-r from-orange-500 to-orange-300'
                      : 'w-3 bg-white/10'}`}/>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ VIDEO SECTION — matches reference image ═══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDevice}
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            exit={{opacity:0, y:-20}}
            transition={{duration:0.4}}
            className="rounded-[28px] overflow-hidden"
            style={{
              background:'linear-gradient(145deg,rgba(20,10,0,0.98),rgba(5,5,5,1))',
              border:'1px solid rgba(255,122,0,0.2)',
              boxShadow:'0 0 60px rgba(255,122,0,0.08)'
            }}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

              {/* LEFT — Info */}
              <div className="p-8 md:p-10 flex flex-col justify-between">

                {/* Video Tutorial badge */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    {/* Play triangle */}
                    <div className="w-0 h-0"
                      style={{
                        borderLeft:'8px solid #ff7a00',
                        borderTop:'5px solid transparent',
                        borderBottom:'5px solid transparent'
                      }}/>
                    <span className="text-orange-500 text-xs font-black
                      tracking-[0.2em] uppercase">
                      VIDEO TUTORIAL
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-anton text-white uppercase leading-tight mb-8"
                    style={{
                      fontFamily: "var(--font-anton), Anton, sans-serif",
                      fontSize: "clamp(1.75rem, 5vw, 3rem)",
                    }}
                  >
                    {active.videoTitle.split('\n').map((line, i) => (
                      <span key={i} className="block">
                        {i === 1 ? (
                          <span style={{
                            background:'linear-gradient(135deg,#ff7a00,#ffb300)',
                            WebkitBackgroundClip:'text',
                            WebkitTextFillColor:'transparent'
                          }}>
                            {line}
                          </span>
                        ) : line}
                      </span>
                    ))}
                  </h2>

                  {/* Feature badges */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
                    {active.features.map((feat, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        {/* Icon badge */}
                        <div className="w-12 h-12 rounded-[14px]
                          flex items-center justify-center"
                          style={{
                            background:'linear-gradient(135deg,rgba(255,122,0,0.15),rgba(255,179,0,0.08))',
                            border:'1px solid rgba(255,122,0,0.25)'
                          }}>
                          {/* Custom SVG icons */}
                          {i === 0 && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <defs>
                                <linearGradient id={`fg${i}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#ff7a00"/>
                                  <stop offset="100%" stopColor="#ffb300"/>
                                </linearGradient>
                              </defs>
                              <path d="M20 6L9 17l-5-5"
                                stroke={`url(#fg${i})`} strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {i === 1 && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <defs>
                                <linearGradient id={`fg${i}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#ff7a00"/>
                                  <stop offset="100%" stopColor="#ffb300"/>
                                </linearGradient>
                              </defs>
                              <path d="M16 18l2 2 4-4"
                                stroke={`url(#fg${i})`} strokeWidth="1.5"
                                strokeLinecap="round"/>
                              <path d="M3 6h13M3 12h9M3 18h7"
                                stroke={`url(#fg${i})`} strokeWidth="1.5"
                                strokeLinecap="round" opacity="0.6"/>
                            </svg>
                          )}
                          {i === 2 && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <defs>
                                <linearGradient id={`fg${i}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#ff7a00"/>
                                  <stop offset="100%" stopColor="#ffb300"/>
                                </linearGradient>
                              </defs>
                              <path d="M12 2L4 6v6c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V6L12 2z"
                                stroke={`url(#fg${i})`} strokeWidth="1.5"
                                fill={`url(#fg${i})`} fillOpacity="0.15"/>
                              <path d="M9 12l2 2 4-4"
                                stroke={`url(#fg${i})`} strokeWidth="1.5"
                                strokeLinecap="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-white text-xs font-bold">{feat.label}</p>
                          <p className="text-gray-600 text-[10px]">{feat.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => setPlaying(true)}
                    whileHover={{scale:1.03, y:-2}}
                    whileTap={{scale:0.97}}
                    className="flex items-center justify-center gap-2.5
                      px-6 py-3 rounded-[14px]
                      font-black text-black text-sm uppercase cursor-pointer"
                    style={{
                      background:'linear-gradient(135deg,#ff7a00,#ffb300)',
                      boxShadow:'0 0 25px rgba(255,122,0,0.35)'
                    }}>
                    {/* Play icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="black">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Full Tutorial
                  </motion.button>

                  <div className="flex items-center justify-center gap-2
                    px-4 py-3 rounded-[14px] text-gray-500 text-sm"
                    style={{
                      background:'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(255,255,255,0.08)'
                    }}>
                    {/* Clock icon */}
                    <svg className="w-4 h-4 text-orange-500/60" 
                      viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9"/>
                      <path d="M12 7v5l3 3" strokeLinecap="round"/>
                    </svg>
                    Duration: {active.duration}
                  </div>
                </div>
              </div>

              {/* RIGHT — Video/Image */}
              <div className="relative flex items-center justify-center
                min-h-[300px] md:min-h-[400px] overflow-hidden"
                style={{
                  background:'linear-gradient(135deg,rgba(255,122,0,0.05),rgba(0,0,0,0.8))'
                }}>

                {!playing ? (
                  <>
                    {/* Device image large */}
                    <div className="relative z-10 flex items-center justify-center w-full h-full p-8">
                      
                      {/* Orange ambient behind */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 rounded-full opacity-20"
                          style={{
                            background:'radial-gradient(circle,#ff7a00,transparent 70%)',
                            filter:'blur(40px)'
                          }}/>
                      </div>

                      <motion.div
                        animate={{y:[0,-10,0]}}
                        transition={{
                          duration:4,
                          repeat:Infinity,
                          ease:'easeInOut'
                        }}
                        className="relative z-10">
                        <Image
                          src={active.image}
                          alt={active.name}
                          width={300}
                          height={250}
                          className="object-contain"
                          style={{
                            filter:'drop-shadow(0 20px 40px rgba(255,122,0,0.25)) drop-shadow(0 0 60px rgba(255,122,0,0.1))'
                          }}
                        />
                      </motion.div>

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          onClick={() => setPlaying(true)}
                          whileHover={{scale:1.1}}
                          whileTap={{scale:0.95}}
                          className="w-16 h-16 rounded-full
                            flex items-center justify-center
                            backdrop-blur-sm cursor-pointer"
                          style={{
                            background:'rgba(255,122,0,0.2)',
                            border:'2px solid rgba(255,122,0,0.5)',
                            boxShadow:'0 0 30px rgba(255,122,0,0.3)'
                          }}>
                          <svg className="w-6 h-6 ml-1"
                            viewBox="0 0 24 24" fill="none">
                            <defs>
                              <linearGradient id="plg" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ff7a00"/>
                                <stop offset="100%" stopColor="#ffb300"/>
                              </linearGradient>
                            </defs>
                            <path d="M8 5v14l11-7z" fill="url(#plg)"/>
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* YouTube embed */
                  <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={active.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ═══ INSTALLATION STEPS ═══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`steps-${activeDevice}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
            className="mt-10"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-[12px]"
                style={{
                  background: 'linear-gradient(135deg,rgba(255,122,0,0.18),rgba(255,179,0,0.08))',
                  border: '1px solid rgba(255,122,0,0.3)'
                }}>
                {/* Numbered list icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="slg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ff7a00"/>
                      <stop offset="100%" stopColor="#ffb300"/>
                    </linearGradient>
                  </defs>
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    stroke="url(#slg)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-black tracking-[0.18em] uppercase text-orange-500">Step-by-Step Guide</p>
                <h2 className="font-anton text-2xl text-white uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
                >
                  How to Install on {active.name}
                </h2>
              </div>
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.steps.map((step: { icon: string; title: string; desc: string }, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="relative rounded-[20px] p-6 flex flex-col gap-4"
                  style={{
                    background: 'linear-gradient(145deg,rgba(20,10,0,0.97),rgba(5,5,5,1))',
                    border: '1px solid rgba(255,122,0,0.12)',
                  }}
                >
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full
                    flex items-center justify-center text-xs font-black text-black z-10"
                    style={{
                      background: 'linear-gradient(135deg,#ff7a00,#ffb300)',
                      boxShadow: '0 0 14px rgba(255,122,0,0.4)'
                    }}>
                    {i + 1}
                  </div>

                  {/* Premium Lucide icon */}
                  <StepIcon name={step.icon} />

                  {/* Title */}
                  <h3 className="font-black text-white text-sm leading-tight">{step.title}</h3>

                  {/* Description */}
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>

                  {/* Connector arrow */}
                  {i < active.steps.length - 1 && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden lg:block"
                      style={{ zIndex: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8h8M8 4l4 4-4 4"
                          stroke="rgba(255,122,0,0.35)" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Quick CTA under steps */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <span>Need help with a step?</span>
              <Link
                href="/contact"
                className="text-orange-500 font-black hover:text-orange-400 transition-colors underline underline-offset-4"
              >
                Chat with support →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ═══ BOTTOM CTA ═══ */}
        <motion.div
          initial={{opacity:0, y:20}}
          whileInView={{opacity:1, y:0}}
          viewport={{once:true}}
          transition={{duration:0.5, delay:0.3}}
          className="text-center mt-16 p-6 sm:p-10 rounded-[28px]"
          style={{
            background:'linear-gradient(145deg,rgba(255,122,0,0.08),rgba(5,5,5,0.98))',
            border:'1px solid rgba(255,122,0,0.15)'
          }}>
          <h3 className="font-anton text-white uppercase mb-3"
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
            }}
          >
            NEED HELP WITH INSTALLATION?
          </h3>
          <p className="text-gray-500 mb-8">
            Our support team is available 24/7 to help you get started.
          </p>
          <Link href="/contact">
            <motion.div
              whileHover={{scale:1.03, y:-2}}
              whileTap={{scale:0.97}}
              className="inline-block px-10 py-4 rounded-full font-black
                text-black text-sm uppercase tracking-wide cursor-pointer"
              style={{
                background:'linear-gradient(135deg,#ff7a00,#ffb300)',
                boxShadow:'0 0 30px rgba(255,122,0,0.35)'
              }}>
              Chat With Support
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
