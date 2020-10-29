/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { configureStore } from './Store';
import { SignInPage } from './Pages/SignInPage';
import { SignOutPage } from './Pages/SignOutPage';
import { QuestionPage } from './Pages/QuestionPage';
import { SearchPage } from './Pages/SearchPage';
import { HeaderWithRouter as Header } from './Components/Header';
import HomePage from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { fontFamily, fontSize, gray2 } from './Styles';
import { AuthProvider } from './Auth';
const AskPage = lazy(() => import('./Pages/AskPage'));

const store = configureStore();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
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
                <Suspense
                  fallback={
                    <div
                      css={css`
                        margin-top: 100px;
                        text-align: center;
                      `}
                    >
                      Loading...
                    </div>
                  }
                >
                  <AskPage />
                </Suspense>
              </Route>
              <Route
                path="/signin"
                render={() => <SignInPage action="signin" />}
              />
              <Route path="/signin-callback" component={HomePage} />
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
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
};

export default App;
