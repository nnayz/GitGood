import React from "react";
import { startGithubAuth } from "../../services/auth/github";

const GithubLoginButton: React.FC = () => {
    return (
        <button onClick={startGithubAuth}>Github Login</button>
    )
}

export default GithubLoginButton;