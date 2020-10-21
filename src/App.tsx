/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { SignInPage } from './Pages/SignInPage';
import { QuestionPage } from './Pages/QuestionPage';
import { SearchPage } from './Pages/SearchPage';
import { HeaderWithRouter as Header } from './Components/Header';
import { HomePage } from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { fontFamily, fontSize, gray2 } from './Styles';
const AskPage = lazy(() => import('./Pages/AskPage'));

function App() {
  return (
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
          <Route path="/sign-in" component={SignInPage} />
          <Route path="/questions/:questionId" component={QuestionPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
