/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FC } from 'react';
import { Answer } from './Answer';
import { AnswerData } from './QuestionsData';
import { gray5 } from '../Styles';

interface Props {
  data: AnswerData[];
}

export const AnswersList: FC<Props> = ({ data }) => {
  return (
    <ul
      css={css`
        list-style: none;
        margin: 10px 0 0 0;
        padding: 0;
      `}
    >
      {data.map((answer) => (
        <li
          key={answer.answerId}
          css={css`
            border-top: 1px solid ${gray5};
          `}
        >
          <Answer data={answer} />
        </li>
      ))}
    </ul>
  );
};
