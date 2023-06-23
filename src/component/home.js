import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home()
{
    const navigate = useNavigate();

    return (
        <div className="Scroller">
            <div className="Container Start AlignCenterRight">
                <div className="emailIcon"/>
                <h1>PaperRoute</h1>
                <h2>Your one stop destination for a weekly dose<br></br> of curated content delivered right to you!</h2>
            
                <div className="Button" onClick={() => { navigate("/paper-route/dashboard") }}><h1>Go To Dashboard</h1></div>
                <div className="Button" onClick={() => { window.location.replace("https://github.com/cenentury0941/paper-route") }}><h1>Go To Repo</h1></div>
            
            </div>
            <div className="Container About"></div>
            <div className="Container BotBG"></div>
            <div className="Container HLD"></div>
            
        </div>
    );
}

export default Home