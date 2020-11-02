/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Page } from './Page';
import { QuestionData, searchQuestions } from '../Components/QuestionsData';
import { QuestionsList } from '../Components/QuestionsList';

export const SearchPage: FC<RouteComponentProps> = ({ location }) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get('criteria') || '';
  useEffect(() => {
    let isMounted = true;
    const doSearch = async (criteria: string) => {
      const results = await searchQuestions(criteria);
      if (isMounted) setQuestions(results);
    };
    doSearch(search);
    return () => {
      isMounted = false;
    };
  }, [search]);
  return (
    <Page title="Search Results">
      {search && (
        <p
          css={css`
            font-size: 16px;
            font-style: italic;
            margin-top: 0px;
          `}
        >
          for "{search}"
        </p>
      )}
      <QuestionsList data={questions} />
    </Page>
  );
};
