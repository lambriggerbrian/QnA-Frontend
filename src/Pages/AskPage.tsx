/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FC, useEffect } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  postQuestionActionCreator,
  AppState,
  clearPostedQuestionActionCreator,
} from '../Store';
import { Page } from './Page';
import {
  Form,
  required,
  minLength,
  Values,
  SubmitResult,
} from '../Components/Form';
import { Field } from '../Components/Field';
import { PostQuestionData, QuestionData } from '../Components/QuestionsData';
import { useAuth } from '../Auth';

interface Props {
  postQuestion: (question: PostQuestionData) => Promise<void>;
  postedQuestionResult?: QuestionData;
  clearPostedQuestion: () => void;
}

export const AskPage: FC<Props> = ({
  postQuestion,
  postedQuestionResult,
  clearPostedQuestion,
}) => {
  useEffect(() => {
    return function cleanUp() {
      clearPostedQuestion();
    };
  }, [clearPostedQuestion]);
  const { user } = useAuth();
  const handleSubmit = (values: Values) => {
    postQuestion({
      title: values.title,
      content: values.content,
      userName: user!.name,
      created: new Date(),
    });
  };
  let submitResult: SubmitResult | undefined;
  if (postedQuestionResult) {
    submitResult = { success: postedQuestionResult !== undefined };
  }
  return (
    <Page title="Ask a Question">
      <Form
        submitCaption="Submit Your Question"
        validationRules={{
          title: [{ validator: required }, { validator: minLength, arg: 10 }],
          content: [{ validator: required }, { validator: minLength, arg: 50 }],
        }}
        onSubmit={handleSubmit}
        submitResult={submitResult}
        failureMessage="There was a problem with your question"
        successMessage="Your question was successfully submitted"
      >
        <Field name="title" label="Title" />
        <Field name="content" label="Content" type="TextArea" />
      </Form>
    </Page>
  );
};

const mapStateToProps = (store: AppState) => {
  return {
    postedQuestionResult: store.questions.postedResult,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    postQuestion: (question: PostQuestionData) =>
      dispatch(postQuestionActionCreator(question)),
    clearPostedQuestion: () => dispatch(clearPostedQuestionActionCreator()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AskPage);
