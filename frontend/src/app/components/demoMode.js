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
    (username === 'testuser2') ? (
      <div>
        <Joyride callback={handleJoyrideCallback} run={run} hideCloseButton hideBackButton disableOverlay stepIndex={stepIndex} steps={step} styles={
          {
            options: {
              backgroundColor: '#1e293b',
              overlayColor: 'rgba(0, 0, 0, 0.5)',
              primaryColor: '#facc15',
              textColor: '#facc15',
              zIndex: 1000
            }
          }
        }/>
        {!removeStartingStep && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className={`flex flex-col items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 
          rounded-2xl border-4 border-yellow-400 shadow-2xl p-8 w-full max-w-md mx-4 
          relative transition-all duration-500 ease-out ${hideStartingStep ? 'translate-x-100 opacity-0 z-0' : ''}`}
          onTransitionEnd={handleTransitionEnd}>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-300 text-zinc-900 px-6 py-2 rounded-full shadow-lg font-bold text-lg border-2 border-yellow-400">
              🚀 Demo Mode
            </div>
            <h2 className="text-2xl font-extrabold mb-3 text-yellow-300 mt-8 text-center drop-shadow-lg">Welcome to Demo Mode!</h2>
            <p className="mb-3 text-zinc-200 text-center">
              Explore the website's features without creating an account.<br/>
              <span className="text-yellow-200 text-center italic mb-6">Be sure to check the other tab!</span>
            </p>
            <ul className="mb-5 text-zinc-300 text-left w-full list-disc pl-6 space-y-1">
              <li>Send and receive real-time messages!</li>
              <li>Share images!</li>
            </ul>
            <div className="flex-1 flex items-center justify-center w-full">
              <p className="text-yellow-200 text-center italic mb-6">
                Click <span className="font-semibold text-yellow-300">Start</span> to begin the guided walkthrough!
              </p>
            </div>
            <button
              className={`${styles.button} w-full py-3 text-lg shadow-md transition`}
              onClick={handleClickStart}
            >
              Start Walkthrough
            </button>
          </div>
        </div>
        )}
        {showSteps && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-49">
            <div className="flex flex-col items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 
          rounded-2xl border-4 border-yellow-400 shadow-2xl p-8 w-full max-w-md mx-4 
          relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-300 text-zinc-900 px-6 py-2 rounded-full shadow-lg font-bold text-lg border-2 border-yellow-400">
              🚀 Choose
            </div>
            <button
              className={`${styles.button} px-6 py-3 text-lg shadow-md transition`}
              onClick={() => handleSelectStep(0)}
            > Add a Friend
            </button>
            <button
              className={`${styles.button} px-6 py-3 text-lg shadow-md transition`}
              onClick={() => handleSelectStep(1)}
            > Send a Text or Image
            </button>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div>
        {!removeStartingStep && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div className={`flex flex-col items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 
            rounded-2xl border-4 border-yellow-400 shadow-2xl p-8 w-full max-w-md mx-4 
            relative transition-all duration-500 ease-out ${hideStartingStep ? 'translate-x-100 opacity-0 z-0' : ''}`}
            onTransitionEnd={handleTransitionEnd}>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-300 text-zinc-900 px-6 py-2 rounded-full shadow-lg font-bold text-lg border-2 border-yellow-400">
                🚀 Demo Mode
              </div>
              <h2 className="text-2xl font-extrabold mb-3 text-yellow-300 mt-8 text-center drop-shadow-lg">Welcome to Demo Mode!</h2>
              <p className="mb-3 text-zinc-200 text-center">
                Explore the website's features without creating an account.
              </p>
              <p className='mb-3 text-zinc-200 text-center'>
                This is the second account, so you can test sending messages to yourself.
              </p>
              <div className="flex-1 flex items-center justify-center w-full">
                <p className="text-yellow-200 text-center italic mb-6">
                  Click <span className="font-semibold text-yellow-300">Start</span> to begin!
                </p>
              </div>
              <button
                className={`${styles.button} w-full py-3 text-lg shadow-md transition`}
                onClick={handleClickStart}
              >
                Let's Begin!
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default DemoWalkthrough;