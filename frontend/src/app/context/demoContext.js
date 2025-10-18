'use client';
import React from "react";
import { useContext, createContext, useState } from "react";
import {styles} from '../styles/style';
const DemoContext = createContext();

export function DemoProvider({ children }) {

    
    const [stepIndex, setStepIndex] = useState(0);
    const [resetDemoUI, setResetDemoUI] = useState(false);
    const [API] = useState(process.env.NEXT_PUBLIC_BACKEND_API_URL);
    const [run, setRun] = useState(false);
    const [showSteps, setShowSteps] = useState(false);

    const addFriendsteps = [
  {
    target: '#dropdown',
    content: <h1>Here you can check your profile, add friends/groups, and logout.</h1>,
    placement: 'auto',
    disableBeacon: true,
    hideFooter: true
  },
  {
    target: '#friendModal',
    content: <h1>Here you can add friends, try to add "testuser1" as your friend.</h1>,
    placement: 'auto',
    disableBeacon: true,
    hideFooter: true
  },
  {
    target: 'body',
    content: <div>
      <h1>Good job! This is how you add private chats between your friends.</h1>
      <h2>Come let's try to send a message!</h2>
      <button className={`${styles.button} mt-4`}
        onClick={() => {
            setRun(false);
            setStepIndex(0);
            setStep(sendMessageSteps)
            setRun(true);
        }}> Continue </button>
      </div>,
    placement: 'center',
    disableBeacon: true,
    hideFooter: true

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
        console.log("Demo UI has been reset.");
        await resetState();
        setResetDemoUI(true);
    };

    const resetState = async () => {
        await fetch(`${API}/demo/reset`, {
            method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }});
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
        <DemoContext.Provider value={{ stepIndex, advanceJoyrideStep, resetDemo, setResetDemoUI, resetDemoUI, handleSelectStep, step, setStep, run, setRun, showSteps, setShowSteps }}>
            {children}
        </DemoContext.Provider>
    );
}

export const useDemo = () => useContext(DemoContext);