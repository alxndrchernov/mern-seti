import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {UploadPage} from "./pages/UploadPage";
import {MessagePage} from "./pages/MessagePage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/upload" exact>
                    <UploadPage />
                </Route>
                <Route path="/message" exact>
                    <MessagePage />
                </Route>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}