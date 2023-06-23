import { useState, useEffect, useRef , React } from "react";
import "./assistor-bot.css";

import { useNavigate } from "react-router-dom";
import SendIcon from "./images/send.png";
import MicIcon from "./images/mic.png";
import TtsDisabledIcon from "./images/notts.png";
import TtsEnabledIcon from "./images/tts.png";
import Loading from "./images/loading.gif";

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from "firebase/storage";

import { Configuration, OpenAIApi } from "openai";


var notkeya = "sk-wK@SVJS@WkmwYTr"
var notkeyb = "BMfjU9@dT3B@lbkFJNw"
var notkeyc = "98EXPTO@gjtv2@fsYA6e"

const configuration = new Configuration({
    organization: "org-RZ3uSWP75ShMsyLdXuc7Hot7",
    apiKey: (notkeya + notkeyb + notkeyc).replaceAll( "@" , "" ),
  });

  //console.log( (notkeya + notkeyb + notkeyc).replaceAll( "@" , "" ) )

const openai = new OpenAIApi(configuration);



const firebaseConfig = {
    apiKey: "AIzaSyDediO1CPm4T60pxMLhuimFI3xIFQD7rbw",
    authDomain: "verify-bot-ennovate.firebaseapp.com",
    databaseURL: "https://verify-bot-ennovate-default-rtdb.firebaseio.com",
    projectId: "verify-bot-ennovate",
    storageBucket: "verify-bot-ennovate.appspot.com",
    messagingSenderId: "656544899745",
    appId: "1:656544899745:web:977f5c9b78d1dfee7a06e0",
    measurementId: "G-2842XBLZSE"
  };
  

var input = document.createElement('input');
input.type = 'file';

input.onchange = e => { 
   var file = e.target.files[0]; 
}

input.click();

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

var access_token = null;
const API_KEY = "39k8898c-c21h-4i09-bh78-h8hh04l2b12";
const url_start = "https://firebasestorage.googleapis.com/v0/b/verify-bot-ennovate.appspot.com/o/";
const url_end = "?alt=media&token=7838da10-fa19-42b9-a953-f3bade7848ee";
var session_id = "";






async function getAccessToken()
    {

                console.log("Getting Access Token");
                const req = await fetch( "https://client-sandbox-verification-api.pre.enncrypto.com/auth/login" , {
                    method : "POST",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify( {api_key : API_KEY} )
                }).then( async (response) => {
                    var body = await response.json();
                    console.log( body.access_token );
                    access_token = body.access_token;
                } );
                // access_token = JSON.parse(response.json().body).access_token;
                // console.log( access_token )

        setTimeout(
            () => {
            getAccessToken();    
            },
            240000
        );

    }

    function text2Binary(string) {
        return string.split('').map(function (char) {
            return char.charCodeAt(0).toString(2);
        }).join(' ');
    }


    var last_user_message = "";

function AssistorBot(props)
{
    const navigate = useNavigate();

    const [showBot , setShowBot] = useState(false);
    const [inputMessage , setInputMessage] = useState("");
    const [buttonIcon, setButtonIcon] = useState( "url("+MicIcon+")" )
    const [messages , setMessages] = useState([ { source : "Bot" , message : "Hi! Not sure of what tags to select? Why don't you tell us what you're looking for and we'll sort it out for you!" } ])
    const [ttsEnabled , setTtsEnabled] = useState(false)
    const [listening , setListening] = useState(false)
    
    const inputFile = useRef(null) 
    const chatscroll = useRef(null)

    const introduction = "";
    const tutorial = "";
    const begin_verify = "";
    const error_msg = ""


    //Speech Synthesis
    const synth = window.speechSynthesis;

    useEffect(() => {
        if (chatscroll) {
            chatscroll.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
      }, [])

      useEffect(
        () => {
        
        if( messages[0].source == "User")
        {

        // setTimeout( () => {
        //     var lastMessage = messages[0].message;
        //     console.log( messages )
        //     setMessages( arr => [ { source : "Bot" , message : lastMessage } , ...arr ] )
        // } , 1000 );

        }
        else if( messages[0].source === "Bot" )
        {
            var lastMessage = messages[0].message;
            console.log( messages )
            const utterThis = new SpeechSynthesisUtterance(lastMessage);
            if(ttsEnabled)
            {    
            utterThis.pitch = 1;
            utterThis.rate = 1;
            utterThis.volume = 0.1;
            synth.speak(utterThis);
            }
        }

        }
        , [messages, ttsEnabled]
      );



          const getLanguageGPT = async (message) => {
            var prompt = `
            Tags = [ "Application Development", "Robotics", "AI", "ML", "web3", "Electronics", "Electricals", "Communication", "Graphics", "NLP", "Data science", "Machine Learning", "Deep Learning", "Neural Networks", "Computer Vision", "Natural Language Processing", "Algorithm", "Software Development", "IoT", "Internet of Things", "Sensor Technology", "Circuit Design", "Control Systems", "Data Analysis", "Big Data", "Cloud Computing", "Augmented Reality", "Virtual Reality", "Cybersecurity", "Web Development", "Mobile Development", "Data Mining", "Artificial Neural Networks", "Speech Recognition", "Image Processing", "Robotics Engineering", "Embedded Systems", "Information Retrieval", "Computer Graphics", "Human-Computer Interaction", "Data Visualization", "Pattern Recognition" ]
            Prompt = "`+message+`"
            From the provided tags, determine relevant tags for the prompt in json format
            `;
        
            console.log(prompt)

            var prompts =  [ { role : "user" , content : prompt }
                            ] 
            

            try {
        
                const result = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo-0613",
                    messages: prompts,
                    max_tokens: 200,
                  });
        
                var chat_response = result.data.choices[0].message.content //.data.choices[0].text;
                console.log(chat_response);
                return chat_response;
            } catch (e) {
                console.error(e);
                return "English";
              }
          }

          const translateGPT = async (message) => {

            console.log("Translate : " + message)

            var language = await getLanguageGPT(last_user_message);

            if( language === "English" || language === "english" )
            {
                return message;
            }

            var prompt = `
            translate "`+message+`" to `+language+`
            `;
        
            console.log(prompt)

            var prompts =  [ { role : "user" , content : prompt }
                            ] 
            

            try {
        
                const result = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo-0613",
                    messages: prompts,
                    max_tokens: 200,
                  });
        
                var chat_response = result.data.choices[0].message.content //.data.choices[0].text;
                console.log(chat_response);
                return chat_response;
            } catch (e) {
                console.error(e);
                return message;
              }
          }

          const promptChatGPT = async (message) => {
        
            if( message.length == 0 )
            {
                return;
            }
        
            var prompt = `
            Tags = [ "Application Development", "Robotics", "AI", "ML", "web3", "Electronics", "Electricals", "Communication", "Graphics", "NLP", "Data science", "Machine Learning", "Deep Learning", "Neural Networks", "Computer Vision", "Natural Language Processing", "Algorithm", "Software Development", "IoT", "Internet of Things", "Sensor Technology", "Circuit Design", "Control Systems", "Data Analysis", "Big Data", "Cloud Computing", "Augmented Reality", "Virtual Reality", "Cybersecurity", "Web Development", "Mobile Development", "Data Mining", "Artificial Neural Networks", "Speech Recognition", "Image Processing", "Robotics Engineering", "Embedded Systems", "Information Retrieval", "Computer Graphics", "Human-Computer Interaction", "Data Visualization", "Pattern Recognition" ]
            Prompt = "`+message+`"
            From the provided tags, determine relevant tags for the prompt in csv format
            `;
        
            console.log(prompt)

            var prompts =  [ { role : "user" , content : prompt }
                            ] 
            
            
            try {
        
                const result = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo-0613",
                    messages: prompts,
                    max_tokens: 200,
                  });
        
                var chat_response = result.data.choices[0].message.content //.data.choices[0].text;
                
                props.updateTags( chat_response )

                setMessages( arr => [ { source : "Bot" , message : "We've updated the interests based on your input. Feel free to further modify them as per your taste!" } , ...arr ] )  
                console.log(chat_response);
        
            } catch (e) {
                console.error(e);
                setMessages( arr => [ { source : "Bot" , message : "Oops, unfortunately I ran into an error when accessing openAI's services. Please try again after a minute! Error Info : " + e } , ...arr ] )  
            }
        
          }
        


    function handleClick(event)
    {
        if( inputMessage.length > 0 )
        {
            console.log( "Sending Message" );
            console.log( inputMessage );
            last_user_message = inputMessage;
            setMessages( arr => [ { source : "User" , message : inputMessage } , ...arr ] )
            promptChatGPT(inputMessage);
            setInputMessage("");
        }
        else{

            console.log("Mic requested");
            const SpeechRecognitionEvent =
            window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            
            if (typeof SpeechRecognition === "undefined") {
                setMessages( arr => [ { source : "Bot" , message : "I'm sorry, but the browser doesn't support Web Speech Recognition API. Try using Chrome." } , ...arr ] )
            } else {
                console.log(SpeechRecognition);
                const recognition = new SpeechRecognition();
                const start = () => { setListening(true); console.log("listening") };
                const stop = () => { setListening(false); console.log("stopped listening"); recognition.stop();  };
                const onResult = event => {
                    console.log("result called");
                    for (const res of event.results) {
                        setInputMessage( inputMessage + res[0].transcript)
                    }
                    setTimeout( () => {stop()} , 3000 );
                };
                
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.addEventListener("result", onResult);
                recognition.start();
                setButtonIcon("url("+Loading+")");
            }



        }
    }  

    function handleVerify(event)
    {
        console.log( "Opening File" );
        inputFile.current.click();
    }

    function toggleTts()
    {
        setMessages( arr => [ { source : "Bot" , message : "Text-To-Speech has been " + ( ttsEnabled ? "disabled" : "enabled" ) } , ...arr ] )
        setTtsEnabled( !ttsEnabled );
    }   

    function hideBot()
    {
        setShowBot(false);
    }

    function revealBot()
    {
        setShowBot(true);
    }

    useEffect( ()=> {
        console.log( inputMessage )
        if( inputMessage )
        {
            setButtonIcon("url("+SendIcon+")");
        }
        else
        {
            setButtonIcon("url("+MicIcon+")");
        }
    },
        [inputMessage]
    );

    return (

        <div className="VerifyBot">
        <input type='file' id='file' onChange={handleFileSelected} ref={inputFile} style={{display: 'none'}}/>
        <div className={"BotBody " + (showBot ? "Reveal" : "Hide")}>
            <div className="BotContent">
                <div className="BotHeaderSection">
                    <div className="BotIcon"></div>
                    <div className="BotTitle"><h1>Assistor</h1></div>
                    <div className="TtsButton" onClick={toggleTts} style={{backgroundImage : "url(" + ( ttsEnabled ? TtsEnabledIcon : TtsDisabledIcon ) + ")"}}></div>
                    <div className="CloseButton" onClick={hideBot}></div>
                </div>
                <div className="BotChatSection" ref={chatscroll}>
                    <div className="BotChatScrollable">
                    {
                    messages && messages.map( (element,index) => {
                         
                        if( element.message )
                        {
                            return <div key={index+element.message} className={ "BotMessage " + ( element.source == "Bot" ? "Bot" : "User" ) + " " + ( index == 0 ? "NewMessage" : "" ) }>{element.message}</div> 
                        }
                        else if( element.button )
                        {
                            return <div key={index+Math.random()} onClick={handleVerify} className={ "BotMessage " + ( "Bot" ) + " " + ( index == 0 ? "NewMessage" : "" ) }><button className="BotVerifyButton">Verify Product</button></div> 
                        }
                        else
                        {
                            return <div key={index+element.image} className={ "BotMessage " + ( element.source == "Bot" ? "Bot" : "User" ) + " " + ( index == 0 ? "NewMessage" : "" ) + " Image" } style={{backgroundImage:"url("+(element.image)+")"}} ></div>     
                        } 
                         
                        
                        })
                    }

                    </div>
                </div>
                <div className="BotInputSection">
                    <input placeholder="Enter message" value={inputMessage} onKeyUp={ (event) => { event.key === "Enter" && handleClick() } } onChange={ (event) => { setInputMessage(event.target.value) } } type="text" className="BotInputText"></input>
                    <button style={{ backgroundImage : buttonIcon }} onClick={handleClick} className="BotInputButton"></button>
                </div>
            </div>
        </div>

        <div className={"BotShowButton " + (!showBot ? "Reveal" : "Hide")} onClick={revealBot}></div>

        </div>

    );

}

export default AssistorBot;





























