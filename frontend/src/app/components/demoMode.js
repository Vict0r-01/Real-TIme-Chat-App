import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, ORIGIN, STATUS} from 'react-joyride';
import { styles } from '../styles/style';
import { useAuth } from '../context/authContext';
import { useDemo } from '../context/demoContext';


const DemoWalkthrough = () => {
  const { username } = useAuth();
  const [hideStartingStep, setHideStartingStep] = useState(false);
  const [removeStartingStep, setRemoveStartingStep] = useState(false);
 
  const { stepIndex, resetDemoUI: onResetDemoUi, handleSelectStep, step, setRun, run, setShowSteps, showSteps, setResetDemoUI } = useDemo();


  useEffect(() => {
    if(onResetDemoUi){
        setRun(false);
        setShowSteps(false);
        setRemoveStartingStep(false);
        setHideStartingStep(false);
        setResetDemoUI(false);
    }
  }, [onResetDemoUi]);
 
  const handleJoyrideCallback = (data) => {

    const { action, origin, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // You need to set our running state to false, so we can restart if we click start again.
      setRun(false);
    }

    console.groupCollapsed(type);
    console.groupEnd();
  };

  const handleClickStart = () => {
    setHideStartingStep(true);
    if(username === 'testuser2') 
      setShowSteps(true);
  };

  const handleTransitionEnd = () => {
    if (hideStartingStep) setRemoveStartingStep(true);
  };

 

  return (
    <div>
      <Joyride callback={handleJoyrideCallback} run={run} hideCloseButton hideBackButton disableOverlay stepIndex={stepIndex} steps={step} styles={{ options: { overlayColor: 'rgba(0, 0, 0, 0.5)', primaryColor: 'var(--accent)', textColor: 'rgb(0, 0, 0)', zIndex: 1000 }}} />

      {!removeStartingStep && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className={`w-full max-w-md mx-4 card p-6 relative transition-all duration-500 ease-out ${hideStartingStep ? 'translate-x-8 opacity-0 z-0' : ''}`} onTransitionEnd={handleTransitionEnd}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-black px-5 py-2 rounded-full shadow-lg font-bold text-lg">
              🚀 Demo Mode
            </div>
            <h2 className="text-2xl font-extrabold mt-3 mb-3 text-accent text-center">Welcome to Demo Mode!</h2>
            <p className="mb-3 text-muted text-center">Explore the website's features without creating an account.</p>
            <ul className="mb-5 text-muted text-left w-full list-disc pl-6 space-y-1">
              <li>Send and receive real-time messages!</li>
              <li>Share images!</li>
            </ul>
            <p className="text-secondary text-center italic mb-4">Click <span className="font-semibold text-accent">Start</span> to begin the guided walkthrough!</p>
            <button className={`${styles.button} w-full py-3 text-lg`} onClick={handleClickStart}>Start Walkthrough</button>
          </div>
        </div>
      )}

      {showSteps && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-full max-w-md mx-4 card p-6 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-black px-5 py-2 rounded-full shadow-lg font-bold text-lg">🚀 Choose</div>
            <div className="flex flex-col gap-3 mt-6">
              <button className={`${styles.button} px-6 py-3 text-lg`} onClick={() => handleSelectStep(0)}>Add a Friend</button>
              <button className={`${styles.button} px-6 py-3 text-lg`} onClick={() => handleSelectStep(1)}>Send a Text or Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoWalkthrough;