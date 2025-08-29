'use client';
import React, { useContext, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useChat } from '../../context/chatContext';
import { styles } from '../../styles/style';
import { getImageUrl } from '../../config/imageUrl';

const ChatPage = () => {
  const {chatBoxes} = useChat();
  const params = useParams();
  const { chatId } = params;
  const router = useRouter();
  const chat = chatBoxes.get(parseInt(chatId));

  console.log('ChatBoxes in ChatPage:', chat);
  return (
    <div className="flex h-screen">
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
                          <button className='ml-3 font-bold text-xl md:text-3xl text-red-600 hover:text-red-800'>&#215;</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className={`${styles.button} mt-4 pt-1 pb-1 pr-4 pl-4 text-xl`}>Add Member</button>
                  <button className={`${styles.button} mt-4 ml-4 pt-1 pb-1 pr-4 pl-4 text-xl bg-red-600 hover:bg-red-800`}>Leave Chat</button>
                </div>
            </div>
             : <p>Chat not found</p>}
    </div>
  );
}

export default ChatPage;