import React, { useEffect, useState } from 'react'

const Chat = ({socket, username, room}) => {
    const [message, SetMessage] = useState('')
    const [messageList, SetMessageList] = useState([])
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      // Bileşen unmount olunca interval'i temizle
      return () => clearInterval(timer);
    }, []);


    useEffect(() =>{
        socket.on('messageReturn', (data) => {
            SetMessageList((prev) => [...prev, data])
        })
    },[socket])

    const sendMessage = async() => {
        const messageContent = {
            username: username,
            message: message,
            room: room,
            date: time.toLocaleTimeString()
        }
        await socket.emit('message', messageContent)
        SetMessageList((prev) => [...prev, messageContent])
        SetMessage('')
    }

    console.log("message list", messageList);

    return (
        <div className='flex items-center justify-center h-full'>
          <div className='w-1/3 h-[600px] bg-rose-300 relative'>
            <div className='w-full h-16 bg-gray-700 flex items-center p-2'>
                <div className='w-12 h-12 bg-white rounded-full'></div>
            </div>
            <div className='w-full h-[400px] overflow-y-auto'>

                {
                    messageList && messageList.map((msg, i) => (
                    <div className={`${username === msg.username ? ' flex justify-end' : ''}`}>
                        <div className={`${username ===msg.username 
                            ? 'w-2/3 h-12 p-2 bg-green-600 text-white m-2 rounded-xl rounded-br-none' 
                            : 'w-2/3 h-12 p-2 bg-blue-600 text-white m-2 rounded-xl rounded-br-none'}'`}>
                          <div>{msg.message}</div>
                          <div className='w-full flex justify-end text-xs'>{msg.username} {msg.date}</div>
                        </div>
                    </div>

                    
                    ))
                }



            </div>
            <div className='absolute bottom-0 left-0 w-full'>
                <input value={message} onChange={e => SetMessage(e.target.value)} className='w-3/4 h-12 border p-3 outline-none' type="text" placeholder='message send'/>
                <button onClick={sendMessage} className='w-1/4 bg-indigo-600 text-white h-12 hover:opacity-70'>SEND</button>
            </div>
          </div>
        </div>
    )
}

export default Chat