import {React, useState} from "react";
import "./home.css"
import "./dashboard.css"
import AssistorBot from "./assistor-bot";
import "./Server.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import emailjs from '@emailjs/browser';
import { useNavigate } from "react-router-dom";


var email_ref = "";
var user_dat = undefined;
var complete = false;
var db_snap = undefined;

  
  const callback = function(data) {
    console.log(data["organic_results"]);
  };
  
  // Show result as JSON



const handlePaperRoute = (email , user_dat) =>
{

    var query = "";

    for( var key in user_dat )
    {
        if( user_dat[key] == 1 )
        {
            query += key + "%20";
        }
    }


    var url = "https://ieeexploreapi.ieee.org/api/v1/search/articles?&queryText="+query+"&apikey=eqaptr84qtan7n3smvtzyjrj";
    var url = "https://api.springernature.com/meta/v2/json?q="+query+"&api_key=d58bd47ac6328407a906ed67b0c97992"
    console.log(url)
    fetch( url ).then(
        async (response) => {

            var data = await response.json();
            data = data["records"]
            console.log("IEEE" + data);

            var send = "";

            for( var i = 0 ; i < 5 ; i++ )
            {
                send += data[i].title + "\n\n";
                send += data[i].abstract + "\n\n";
                send += data[i].url[0].value + "\n\n\n-----------------------\n\n\n";
            }

            var templateParams = {
                message : send,
                target: email,
                reply_to: "cenentury0941@gmail.com"
            };

            console.log(templateParams)
            
            emailjs.send("service_66e0nhm", "template_z75mucg", templateParams, "q7o0mCeuC9aUNq1Jq");            

        }
    )


}

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


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const db = getDatabase();
const users = ref(db, 'users/');
onValue(users, (snapshot) => {
        const data = snapshot.val();
        db_snap = data;
        user_dat = data[email_ref.replace(".","_")];
        console.log(user_dat);  
        complete = true;  
    });

set(ref(db, 'users/' + "NULL"), "Temp"+Math.random());

var tags = {"Application Development" : 0, "Robotics" : 0, "AI" : 0, "ML" : 0, "web3" : 0, "Electronics" : 0, "Electricals" : 0, "Communication" : 0, "Graphics" : 0, "NLP" : 0, "Data science" : 0, "Machine Learning" : 0, "Deep Learning" : 0, "Neural Networks" : 0, "Computer Vision" : 0, "Natural Language Processing" : 0, "Algorithm" : 0, "Software Development" : 0, "IoT" : 0, "Internet of Things" : 0, "Sensor Technology" : 0, "Circuit Design" : 0, "Control Systems" : 0, "Data Analysis" : 0, "Big Data" : 0, "Cloud Computing" : 0, "Augmented Reality" : 0, "Virtual Reality" : 0, "Cybersecurity" : 0, "Web Development" : 0, "Mobile Development" : 0, "Data Mining" : 0, "Artificial Neural Networks" : 0, "Speech Recognition" : 0, "Image Processing" : 0, "Robotics Engineering" : 0, "Embedded Systems" : 0, "Information Retrieval" : 0, "Computer Graphics" : 0, "Human-Computer Interaction" : 0, "Data Visualization" : 0, "Pattern Recognition" : 0};

function ModifyPaperRoute()
{

    
    const navigate = useNavigate();
    const [ stage , setStage ] = useState(0)
    const [ email , setEmail ] = useState("")
    const [ uiUpdate , setUiUpdate ] = useState(0)
    const [ loading , setLoading ] = useState(false)
    const [ success , setSuccess ] = useState(false)
    const [ showError , setShowError ] = useState(false)
    
    const writeUserData = (email, data) => {
    const db = getDatabase();
    set(ref(db, 'users/' + email), data);
    }


    const updateTags = (jsonData) => {
        //var tags_data = JSON.parse(jsonData)
        //console.log("Json Data : " + tags_data);
        // for( var param in tags_data )
        // {
        //     console.log( "PARAMETER : " + tags_data[param] );
        //     for( var tag of tags_data[param] )
        //     {
        //         if(tags[tag])
        //         {
        //             tags[tag] = 1;
        //             console.log( "SET : " + tag )
        //         }
        //     }
        // }

        for( var key in tags )
        {
            if( jsonData.includes(key) )
            {
                tags[key] = 1;
            }
        }

        setUiUpdate(uiUpdate+1);
    }


    const updateDBCheck = () => {
        if( !complete )
        {
            console.log("Waiting")
            setTimeout( updateDBCheck , 1000)
        }
        else
        {
            console.log("Done")
            setLoading(false);
            setSuccess( user_dat ? true : false );
            handlePaperRoute( email , user_dat );
        }
    }

    const updateValue = (key) => {
        console.log(key , tags[key])
        tags[key] += 1;
        setUiUpdate(uiUpdate+1);
        console.log(tags[key]);
    }

    const updateEmail = (event) => {
        setEmail( event.target.value );
        console.log(email);
    };

    const acceptEmail = (event) => {
        if( email.length == 0 )
        {
            return;
        }
        if( db_snap[ email.replace(".","_") ] )
        {
            setStage(1);
            tags = db_snap[ email.replace(".","_") ];
            setUiUpdate( uiUpdate+1 );
        }
        else
        {
            setShowError(true);
        }
    }
    
    const registerPaperRoute = (event) => {
        if( email.length == 0 )
        {
            return;
        }
        email_ref = email;
        setLoading(true);
        complete = false;
        writeUserData( email.replace("." , "_") , tags );
        set(ref(db, 'users/' + "NULL"), "Temp"+Math.random());
        setTimeout( updateDBCheck , 1000 );
        setStage(3);
    }

    const acceptPreferences = (event) => {
        if( email.length == 0 )
        {
            return;
        }
        setStage(2);
    }

    return (<div className="Container DashBoard HorizontalAlign">

    <div className="SidePane">
        
    <div className={"Button " + ( stage == 0 ? "Current" : "Done" )} ><h1>Access</h1></div>
    <div className={"Button " + ( stage == 0 ? "Inactive" : ( stage == 1 ? "Current" : "Done" ) )} ><h1>Modify</h1></div>
    <div className={"Button " + ( stage == 0 ? "Inactive" : ( stage == 1 ? "Inactive" : ( stage == 2 ? "Current" : "Done" ) ) )} ><h1>Update</h1></div>

    </div>
    <div className="MainBody">

    <div className="Scroller HideOverflow" style={{ transform : "translateY("+ ( stage == 0 ? "0%" : ( stage == 1 ? "-100%" : ( stage == 2 ? "-200%" : "-300%") ) ) +")" }}  >
            
            <div className="Container Blank AlignCenter" >
                
                <h3 className="SmallHeading Dark NoShadow NoMargin">Access your PaperRoute</h3>
                <h4 className="SubHeading Dark NoShadow">Specify the email id that you registered your PaperRoute on</h4>
                <input className="EmailInput" onChange={updateEmail} placeholder="example@email.com" />
                <div className="Button SmallButton UnsetPosition" onClick={ acceptEmail } ><h1>Use Email</h1></div>
                
            </div>


            <div className="Container Blank AlignCenter" >
                
                <h3 className="SmallHeading Dark NoShadow NoMargin">Modify your interests</h3>
                <h4 className="SubHeading Dark NoShadow">Modify your interests to suit your new interests. Feel free to query the bot for suggestions!</h4>
                <div className="TagsContainer">
                    {tags && Object.entries(tags).map( ([key , value]) => {
                        return (
                            <div key={key+value} className={ value%2 == 0 ? "Tag_Unset" : "Tag_Set" } onClick={ () => { updateValue(key) } }>{key}</div>)
                    } )}
                </div>
                <AssistorBot updateTags={updateTags} />
                <div className="Button SmallButton UnsetPosition" onClick={ acceptPreferences } ><h1>Confirm Interests</h1></div>
                
            </div>


            <div className="Container Blank AlignCenter" >
                
                <h3 className="SmallHeading Dark NoShadow NoMargin">Update Your PaperRoute</h3>
                <h4 className="SubHeading Dark NoShadow">Verify your details and proceed to update your PaperRoute!</h4>
                <input className="EmailInput" readOnly defaultValue={email} placeholder="example@email.com" />
                <div className="TagsContainer">
                    {tags && Object.entries(tags).map( ([key , value]) => {
                        return (
                            <div key={key+value} className={ value%2 == 0 ? "Tag_Unset_Light" : "Tag_Set" }>{key}</div>)
                    } )}
                </div>
                <div className="Button SmallButton UnsetPosition" onClick={ registerPaperRoute } ><h1>Register PaperRoute</h1></div>
                
            </div>


            <div className="Container Blank AlignCenter" >

                { loading ? (<h3 className="SmallHeading Dark NoShadow NoMargin">Loading...</h3>) : 
                (
                
                success ? (

                    <div>
                    <h3 className="SmallHeading Dark NoShadow NoMargin">Updated PaperRoute!</h3>
                    <h4 className="SubHeading Dark NoShadow">Check your inbox for the updated PaperRoute delivery! We'll send the next update in a week's time! Please check the spam folder too just in case!</h4>
                    </div>
                    
                ) : (

                    <div>
                    <h3 className="SmallHeading Dark NoShadow NoMargin">Unable to update PaperRoute</h3>
                    <h4 className="SubHeading Dark NoShadow">Unfortunately an error occured when updating your paper route. Please try again later.</h4>
                    </div>
                    
                )
                
                ) }

                <div className="Button SmallButton UnsetPosition" onClick={ () => { navigate("/paperroute/") } } ><h1>Back to Dashboard</h1></div>
                
                
            </div>
            
        </div>
    </div>

    <div className="ErrorBox" style={{ display : ( showError ? "flex" : "none" ) }}>
        <div className="ErrorMessage">
            
            <h3 className="SmallHeading Dark NoShadow NoMargin">Error!</h3>
            <h4 className="SubHeading Dark NoShadow">A PaperRoute hasn't been created for this email yet!</h4>
            <div className="Button SmallButton UnsetPosition" onClick={ () => { setShowError(false) } } ><h1>Close</h1></div>
            
            </div></div>    

</div>)

}

export default ModifyPaperRoute;