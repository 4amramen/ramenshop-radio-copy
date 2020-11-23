import React, { useState, useEffect, useRef, useContext } from 'react'
import playerContext from '../context/playerContext'
import NowPlaying from './graphics/NowPlaying'
import { useMediaQuery } from 'react-responsive'


function Controls() {

  // Global State
  const {
    currentSong,
    songs,
    nextSong,
    prevSong,
    repeat,
    random,
    playing,
    toggleRandom,
    toggleRepeat,
    togglePlaying,
    handleEnd,
    lastAmbienceVolume,
    currentAmbience,
    ambience,
    ambiencePlaying,
    toggleAmbiencePlaying,
    handleEndOfAmbience,
    clicked,
    SetClicked
  } = useContext(playerContext)

  const audio = useRef('audio_tag');
  const ambienceAudio = useRef('ambience_tag');
  const timeElapsed = document.querySelector(".time-elapsed")
  const volumeLevel = document.querySelector("#visible-volBar")


  // self State
  const [statevolum, setStateVolum] = useState(1)
  const [stateambiencevolum, setStateAmbienceVolum] = useState(.7)
  const [lastambiencevolum, setlastAmbienceVolum] = useState(1)

  const [dur, setDur] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const fmtMSS = (s) => { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + ~~(s) }

  const toggleAudio = () => audio.current.paused ? audio.current.play() : audio.current.pause();
  const toggleAmbienceAudio = () => ambienceAudio.current.paused ? ambienceAudio.current.play() : ambienceAudio.current.pause();


  const handleVolume = (q) => {
    setStateVolum(q);
    audio.current.volume = q;
  }

  
  const handleAmbienceVolume = (q) => {
    setStateAmbienceVolum(q);
    ambienceAudio.current.volume = q;
    volumeLevel.style.width = 'calc(60px * ' + q + ')'; 
  }


  const handleProgress = (e) => {
    
    let compute = (e.target.value * dur) / 100;
    setCurrentTime(compute);
    audio.current.currentTime = compute;
    // slider.style.background = 'linear-gradient(90deg, rgb(04, 214, 214) ' + e.target.value + '%, rgb(214, 214, 214) ' + e.target.value + '%)';
    // timeElapsed.style.width =  (dur ? (currentTime * 100) / dur : 0)  + '%';
    timeElapsed.style.width =  'calc((100% - 60px)*' + (dur ? (currentTime) / dur : 0)  + ')';

  }

  const updatePlayerTime = (e) => {
    setCurrentTime(e.target.currentTime);
    var width = (dur ? (currentTime) / dur : 0)
    if(timeElapsed){
      // slider.style.background = 'linear-gradient(90deg, rgb(04, 214, 214) ' + (dur ? (currentTime * 100) / dur : 0) + '%, rgb(214, 214, 214) ' + (dur ? (currentTime * 100) / dur : 0)  + '%)';
        timeElapsed.style.width =  width < .9995 ? 'calc((100% - 60px)*' + width  + ')' : '0%';
    }
  }

  useEffect(() => {
    audio.current.volume = statevolum;
    if (playing) { toggleAudio() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong])


  // hook for ambience
  useEffect(() => {
    ambienceAudio.current.volume = stateambiencevolum;
    if (ambiencePlaying) { toggleAmbienceAudio() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAmbience])

  return (
    
    <div className="controls">
  
      <audio
        onTimeUpdate={(e) => updatePlayerTime(e)}
        onCanPlay={(e) => setDur(e.target.duration)}
        onEnded={handleEnd}
        ref={audio}
        type="audio/mpeg"
        preload='true'
        src={songs[currentSong][1]} />

      <audio
        onEnded={handleEndOfAmbience}
        ref={ambienceAudio}
        type="audio/mpeg"
        preload='true'
        src={ambience[currentAmbience][1]} 
        />
      
      <div className="top-controls">

        <div className="left-controls">
          <span className="play" onClick={() => {
                if (!clicked)
                {
                  console.log("first click");
                  toggleAmbiencePlaying();
                  console.log("Playing when ambience play:  " + playing);
                  toggleAmbienceAudio();
                  SetClicked();
                }
                togglePlaying(); 
                toggleAudio();
                console.log("Playing?:  " + playing);

                }}>

              <img className= {!playing ? 'play_button' : 'play_button hide'} src="buttons/play_button.png"></img>
              <img className= {playing ?  'pause_button' : 'pause_button hide'} src="buttons/pause_button.png"></img>

            </span>

          < NowPlaying />
        </div>
        
        <span className="time">{fmtMSS(currentTime) + " / " + fmtMSS(dur)}</span>


        <div className="vlme">
            <span className="volum" onClick={() => {
              if(stateambiencevolum){
                setlastAmbienceVolum(stateambiencevolum);
                handleAmbienceVolume(0);
              } else {
                handleAmbienceVolume(lastambiencevolum);
              }
            }}>
              <img className="rain_button" src="buttons/rain_button.png"></img>
            </span>
            <div className="volBars">
              <input value={Math.round(stateambiencevolum * 100)} type="range" name="volBar" id="volBar" 
                onChange={(e) => handleAmbienceVolume(e.target.value / 100)} />
              <span id="visible-volBar"/>  
              <span id="visible-volBar-background"/>  
            </div>      

        </div>

       </div>

      <div className="bottom-controls">
        
        <div className="visible-progress">
              <div className="time-elapsed"/>
              <div className="total-progress"/>
        </div>

        <div className="progress">
          <input
            onChange={handleProgress}
            value={dur ? (currentTime * 100) / dur : 0} 
            type="range" name="progresBar" id="prgbar" />
        </div>
      </div>
     
      
      {/* {
      <div className="plsoptions">

        <span onClick={toggleRandom} className={"random " + (random ? 'active' : '')}>
          <i className="fas fa-random"></i>
        </span>
        <span onClick={toggleRepeat} className={"repeat " + (repeat ? 'active' : '')}>
          <i className="fas fa-redo-alt"></i>
        </span>
      </div>
      } */}
    </div>
  )
}

export default Controls
