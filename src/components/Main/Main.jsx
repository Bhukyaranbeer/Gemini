import React, { useContext, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets'; 
import userIcon from '../../assets/user_icon.png';
import { Context } from '../../context/context';
import { FaPaperclip, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

  const [setUploadedFile] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      if (file.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          setInput(prev => prev + ` [Attached: ${file.name}] ${content.substring(0, 500)}...`);
        };
        reader.readAsText(file);
      } else if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setInput(prev => prev + ` [Image attached: ${file.name}]`);
        setTimeout(() => URL.revokeObjectURL(previewUrl), 10000);
      } else {
        setInput(prev => prev + ` [File attached: ${file.name}]`);
      }
    }
  };

  const toggleSpeechRecognition = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      } else {
        alert('Your browser does not support speech recognition. Try Chrome.');
      }
    }
  };

  React.useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  return (
    <div className="Main">
      <div className="nav">
        <p>Gemini</p>
        <img className="user-icon" src={userIcon} alt="User" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p><span>Hello, Ranbeer :)</span></p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="Compass" />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="Bulb" />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="Message" />
              </div>
              <div className="card">
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="Code" />
              </div>
            </div>
          </>
        ) : (
          <div className="result-container">
            <div className="result-header">
              <img src={assets.user_icon} alt="User" />
              <p><strong>Prompt:</strong> {recentPrompt}</p>
            </div>

            <div className="result-body">
              <img src={assets.gemini_icon} alt="Gemini" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="search-box-fixed">
        <div className="search-box">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Enter a prompt here"
          />
          <div className="search-icons">
            <label htmlFor="file-upload" className="icon-label">
              <FaPaperclip size={24} />
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.jpg,.png"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            <button onClick={toggleSpeechRecognition} className="icon-button" disabled={!browserSupportsSpeechRecognition}>
              {listening ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
            </button>

            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="Send" /> : null}
          </div>
        </div>

        <p className="bottom-info">
          Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
        </p>
      </div>
    </div>
  );
};

export default Main;
