'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useChat } from '../../context/chatContext';
import { styles } from '../../styles/style';
import { getImageUrl } from '../../config/imageUrl';
import ParticipantSelect from '../../components/participantSelect';
import Toast from '@/app/components/toast';
import { useAuth } from '@/app/context/authContext';

const ChatPage = () => {
  const {chatBoxes, removeParticipant, addParticipant} = useChat();
  const params = useParams();
  const { chatId } = params;
  const router = useRouter();
  const chat = chatBoxes.get(parseInt(chatId));
  const [isParticipantPanelOpen, setIsParticipantPanelOpen] = useState(false);
  const selectedParticipants = [];
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { username } = useAuth();

  const removeParticipants = async (participantName) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/${chatId}/removeParticipant?participantName=${participantName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        removeParticipant(chat.id, participantName);
        // Successfully removed participant
        console.log('Participant removed successfully');
      }
    } catch (error) {
      setToastMessage('Error removing participant');
      setShowToast(true);
      console.error('Error removing participant:', error);
    }
  };

  const addParticipants = async () => {
    try{
      console.log("Adding participants: ", selectedParticipants);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/${chatId}/addParticipants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantsName: selectedParticipants }),
    });
      if (response.ok) {
        const data = await response.json();
        console.log("Response data: ", data);
        data.map(participant => {
          const formattedParticipant = {
            name: participant.username,
            image: participant.profilePicture
          };
          addParticipant(chat.id, formattedParticipant);
        });
        setIsParticipantPanelOpen(false);
        // Successfully added participants
        console.log('Participants added successfully');
      }
  }catch (error) {
      setToastMessage('Error adding participants');
      setShowToast(true);
    }
  };

  return (
    <div className="flex h-screen">
      <Toast message={toastMessage} show={showToast} onHide={() => setShowToast(true)}/>
        <div className='fixed top-0 left-0 m-4 z-10'>
            <button
                className= {`${styles.button} pt-1 pb-1 pr-4 pl-4 text-xl`}
                onClick={() => router.back()}>
                &#x2190;
            </button>
        </div>
            {chat ?
            <div className="flex-col flex items-center w-full">
                <img src={getImageUrl(chat.image)} alt={`${chat.image}'s pfp`} className=" w-24 h-24 md:w-48 md:h-48 rounded-full object-cover m-1" />
                <label className={`text-auto font-bold text-2xl md:text-4xl`}>{chat.name}</label>
                <div className='mt-4 p-4 max-w-3xl w-auto border-1 rounded-lg border-yellow-300'>
                  <p className='text-lg md:text-xl font-bold mb-4'>Members <span>({chat.participants.length})</span>:</p>
                  <ul>
                    {chat.participants.map((participant, index) => (
                      <li key={index} className="mb-2">
                        <div className="flex items-center justify-center">
                          <img
                            src={getImageUrl(participant.image)}
                            alt={`${participant.name}'s pfp`}
                            className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover mr-2"
                          />
                          <span className="ml-3 text-lg md:text-xl">{participant.name}</span>
                          <button className='ml-3 font-bold text-xl md:text-3xl text-red-600 hover:text-red-800'
                            onClick={() => removeParticipants(participant.name)}
                          >&#215;</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {isParticipantPanelOpen &&
                    <div className='mt-4 p-4 max-w-3xl w-auto border-1 rounded-lg border-yellow-300'>
                      <ParticipantSelect
                      onSelectionChange={(currentSelectedParticipants)=> selectedParticipants.splice(0, selectedParticipants.length, ...currentSelectedParticipants)}
                      exclude={chat.participants}/>
                      <button className={`${styles.button} text-xl`}
                      onClick={() => addParticipants()}>Add</button>
                    </div>
                      }
                  <button className={`${styles.button} mt-4 pt-1 pb-1 pr-4 pl-4 text-xl`}
                  onClick={() => setIsParticipantPanelOpen(true)}>Add Member</button>
                  <button className={`${styles.button} mt-4 ml-4 pt-1 pb-1 pr-4 pl-4 text-xl bg-red-600 hover:bg-red-800`}
                  onClick={() => removeParticipants(username)}>Leave Chat</button>
                </div>
            </div>
             : <p>Chat not found</p>
             }
    </div>
  );
}

export default ChatPage;