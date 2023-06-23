import React from "react";
import "./home.css";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

function DashBoard()
{
    const navigate = useNavigate();

    return (<div className="Container DashBoard">

        <div className="emailIconSmall"/>
        <h3 className="Heading">PaperRoute</h3>
        <h4 className="SubHeading">Welcome to PaperRoute!<br/> Sign up now to receive regular updates on scholarly papers <br/> from around the world tuned to your specific preferences.</h4>

        <div className="HorizontalSpan">
        <div className="SpanContainer">
        <h3 className="SmallHeading">New User?</h3>
        <h4 className="SubHeading">Click the button below to create a new PaperRoute for your email ID to receive regular curated uppdates from us!</h4>
        <div className="DashButton" onClick={()=>{navigate("/paper-route/create")}}><h1>Create PaperRoute</h1></div>
        </div>
        <div className="SpanContainer">
        <h3 className="SmallHeading">Returning User?</h3>
        <h4 className="SubHeading">Click the button below to modify your PaperRoute with new preferences and we'll change what we send to you!</h4>
        <div className="DashButton" onClick={()=>{navigate("/paper-route/modify")}}><h1>Modify PaperRoute</h1></div>
        </div>
        </div>        

    </div>)
}

export default DashBoard;
