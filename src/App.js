import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaUndo, FaArrowDown, FaArrowUp } from "react-icons/fa";

const audioSrc = "https://www.pacdv.com/sounds/interface_sound_effects/sound107.wav";

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState({
    time: defaultSessionTime,
    timeType: "Session",
    timerRunning: false,
  });

  useEffect(() => {
    let timerID;
    if (!displayState.timerRunning) return;

    if (displayState.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerID);
    };
  }, [displayState.timerRunning]);

  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById("beep");
      if (audio) {
        audio.currentTime = 2;
        audio.play().catch((err) => console.log(err));
      }
      setDisplayState((prev) => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime,
      }));
    }
  }, [displayState, breakTime, sessionTime]);

  const reset = () => {
    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timerRunning: false,
    });
    const audio = document.getElementById("beep");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning,
    }));
  };

  const changeBreakTime = (time) => {
    if (displayState.timerRunning) return;
    setBreakTime(time);
  };

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  };

  const changeSessionTime = (time) => {
    if (displayState.timerRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false,
    });
  };

  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Break Length</h4>
          <div>
            <button
              onClick={() =>
                changeBreakTime(breakTime > min ? breakTime - interval : min)
              }
              id="break-decrement"
            >
              <FaArrowDown />
            </button>
            <span id="break-length">{breakTime / interval}</span>
            <button
              onClick={() =>
                changeBreakTime(breakTime < max ? breakTime + interval : max)
              }
              id="break-increment"
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
        <div className="session">
          <h4 id="session-label">Session Length</h4>
          <div>
            <button
              onClick={() =>
                changeSessionTime(
                  sessionTime > min ? sessionTime - interval : min
                )
              }
              id="session-decrement"
            >
              <FaArrowDown />
            </button>
            <span id="session-length">{sessionTime / interval}</span>
            <button
              onClick={() =>
                changeSessionTime(
                  sessionTime < max ? sessionTime + interval : max
                )
              }
              id="session-increment"
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
      <div className="display">
        <h4 id="timer-label">{displayState.timeType}</h4>
        <span
          id="time-left"
          style={{ color: `${displayState.timerRunning ? "red" : "black"}` }}
        >
          {`${Math.floor(displayState.time / 60)
            .toString()
            .padStart(2, "0")}:${(displayState.time % 60)
            .toString()
            .padStart(2, "0")}`}
        </span>
        <div>
          <button id="start_stop" onClick={startStop}>
            {displayState.timerRunning ? <FaPause /> : <FaPlay />}
          </button>
          <button id="reset" onClick={reset}>
            <FaUndo />
          </button>
        </div>
      </div>
      <audio id="beep" src={audioSrc} />
    </div>
  );
}

export default App;
