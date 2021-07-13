import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Register from "./components/Register";
import LogIn from "./components/LogIn";
import AuthenticatedComponent from "./components/AuthenticatedComponent";
import Recruiter from "./components/Recruiter";
import RecruiterAdd from "./components/RecruiterAdd";
import RecruiterView from "./components/RecruiterView";
import RecruiterSelected from "./components/RecruiterSelected";
import RecruiterProfile from "./components/Recruiterprofile";
import Applicant from "./components/Applicant";
import ApplicantSearch from "./components/ApplicantSearch";
import ApplicantView from "./components/ApplicantView";
import ApplicantProfile from "./components/Applicantprofile";
import RecruiterApplicants from "./components/RecruiterApplicants";

function App(props){
  return (
    <Router>
      <Switch>
        <Route exact path="/Auth" component={AuthenticatedComponent} />
        <Route exact path="/" component={LogIn} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/recruiter" component={Recruiter} />
        <Route exact path="/recruiter/add" component={RecruiterAdd} />
        <Route exact path="/recruiter/view" component={RecruiterView} />
        <Route exact path="/recruiter/selected" component={RecruiterSelected} />
        <Route exact path="/recruiter/profile" component={RecruiterProfile} />
        <Route exact path="/applicant" component={Applicant} />
        <Route exact path="/applicant/search" component={ApplicantSearch} />
        <Route exact path="/applicant/view" component={ApplicantView} />
        <Route exact path="/applicant/profile" component={ApplicantProfile} />
        <Route exact path="/recruiter/:sid" component={RecruiterApplicants} />
        <Route
          component={() => (
            <div style={{ marginTop: 150 }}>
              <b>
                <center>
                  <h1>404 Not found</h1>
                </center>
              </b>{" "}
            </div>
          )}
        />
      </Switch>
    </Router>
  );
  
}

export default App;
