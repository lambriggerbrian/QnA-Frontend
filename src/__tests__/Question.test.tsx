import React from 'react';
import { create } from 'react-test-renderer';
import { QuestionData } from '../Components/QuestionsData';
import { Question } from '../Components/Question';
import { BrowserRouter } from 'react-router-dom';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);
test('When the Question component is rendered, it should contain the correct data', () => {
  const question: QuestionData = {
    questionId: 1,
    title: 'Title test',
    content: 'Content test',
    userName: 'TestUser',
    created: new Date(2020, 1, 1),
    answers: [],
  };
  const component = create(
    <BrowserRouter>
      <Question data={question}></Question>
    </BrowserRouter>,
  ).root;
  const renderedQuestion = component.findByType(Question);
  const data = renderedQuestion.props.data;
  expect(data['title']).toBe('Title test');
  expect(data['content']).toBe('Content test');
  expect(data['userName']).toBe('TestUser');
  expect(data['created']).not.toBeNull();
  expect(data['answers']).not.toBeNull();
});
