/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { configureStore } from './Store';
import { SignInPage } from './Pages/SignInPage';
import { SignOutPage } from './Pages/SignOutPage';
import { SearchPage } from './Pages/SearchPage';
import { HeaderWithRouter as Header } from './Components/Header';
import HomePage from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { fontFamily, fontSize, gray2 } from './Styles';
import { AuthProviderWithRouter as AuthProvider } from './Auth';
import AskPage from './Pages/AskPage';
import QuestionPage from './Pages/QuestionPage';
import { AuthorizedPage } from './Pages/AuthorizedPage';

const store = configureStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <div
            css={css`
              font-family: ${fontFamily};
              font-size: ${fontSize};
              color: ${gray2};
            `}
          >
            <Header />
            <Switch>
              <Redirect from="/Home" to="/" />
              <Route exact path="/" component={HomePage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/ask">
                <AuthorizedPage>
                  <AskPage />
                </AuthorizedPage>
              </Route>
              <Route
                path="/signin"
                render={() => <SignInPage action="signin" />}
              />
              <Route
                path="/signin-callback"
                render={() => <SignInPage action="signin-callback" />}
              />
              <Route
                path="/signout"
                render={() => <SignOutPage action="signout" />}
              />
              <Route
                path="/signout-callback"
                render={() => <SignOutPage action="signout-callback" />}
              />
              <Route path="/questions/:questionId" component={QuestionPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
