import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Joyride, { ACTIONS, EVENTS, ORIGIN, STATUS} from 'react-joyride';
import { styles } from '../styles/style';
import { useAuth } from '../context/authContext';

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;


const DemoWalkthrough = forwardRef((onChatUpdate, ref) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hideStartingStep, setHideStartingStep] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [removeStartingStep, setRemoveStartingStep] = useState(false);
  const { username } = useAuth();
  const addFriendsteps = [
  {
    target: '#dropdown',
    content: <h1>Here you can check your profile, add friends/groups, and logout.</h1>,
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '#friendModal',
    content: <h1>Here you can add friends, try to add "testuser1" as your friend.</h1>,
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: <div>
      <h1>Good job! This is how you add private chats between your friends.</h1>
      <h2>Come let's try to send a message!</h2>
      <button className={`${styles.button} mt-4`} onClick={() => setStep(sendMessageSteps)}>Next</button>
      </div>,
    placement: 'center',
    disableBeacon: true,
  }
];
const sendMessageSteps = [
  {
    target: '#chatList',
    content: <h1 className=''>Here is the chat list. Select the chat to start sending messages.</h1>,
    placement: 'auto',
    disableBeacon: true,
  },
];

  const [step, setStep] = useState(addFriendsteps);

  const advanceJoyrideStep = () => {
    setStepIndex(prev => prev + 1);
  };

  const resetDemo = async () => {
      await resetState();
      await resetDemoUI();
  };

  const resetState = async () => {
    await fetch(`${API}/demo/reset`, {
        method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      }});
  }
  const resetDemoUI = async () => {
    setRemoveStartingStep(false);
      setHideStartingStep(false);
      setShowSteps(false);
      setRun(false);
  }

  useImperativeHandle(ref, () => ({
    resetDemo,
    advanceJoyrideStep
  }));

  const handleJoyrideCallback = (data) => {

    const { action, index, origin, status, type } = data;

    if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
      // do something
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // You need to set our running state to false, so we can restart if we click start again.
      setRun(false);
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
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

  const handleSelectStep = async (index) => {
    if(index === 0) {
      await resetState();
      setStep(addFriendsteps);
    } else if(index === 1) {
      await fetch(`${API}/demo/seed?username=${username}&type=friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }});
        setStep(sendMessageSteps);
    }
    setStepIndex(0);
    setRun(true);
    setShowSteps(false);
  };

  return (
    (username === 'testuser2') ? (
      <div>
        <Joyride callback={handleJoyrideCallback} run={run} hideCloseButton disableOverlay stepIndex={stepIndex} steps={step} styles={
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
              Explore the website's features without creating an account.
            </p>
            <ul className="mb-5 text-zinc-300 text-left w-full list-disc pl-6 space-y-1">
              <li>Send and receive real-time messages</li>
              <li>Share images and files</li>
              <li>Experience the full chat workflow</li>
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
});

export default DemoWalkthrough;