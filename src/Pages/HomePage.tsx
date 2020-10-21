/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState, FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PrimaryButton } from '../Styles';
import { QuestionsList } from '../Components/QuestionsList';
import {
  getUnansweredQuestions,
  QuestionData,
} from '../Components/QuestionsData';
import { Page } from './Page';
import { PageTitle } from './PageTitle';

export const HomePage: FC<RouteComponentProps> = ({ history }) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  useEffect(() => {
    const doGetUnansweredQuestions = async () => {
      const unansweredQuestions = await getUnansweredQuestions();
      setQuestions(unansweredQuestions);
      setQuestionsLoading(false);
    };
    doGetUnansweredQuestions();
  }, []);
  const handleAskQuestionClick = () => {
    history.push('/ask');
  };
  return (
    <Page>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <PageTitle>Unanswered Questions</PageTitle>
        <PrimaryButton onClick={handleAskQuestionClick}>
          Ask a Question
        </PrimaryButton>
      </div>
      {questionsLoading ? (
        <div
          css={css`
            font-size: 16px;
            font-style: italic;
          `}
        >
          Loading...
        </div>
      ) : (
        <QuestionsList data={questions || []}></QuestionsList>
      )}
    </Page>
  );
};
