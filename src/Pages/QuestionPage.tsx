/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FC, useState, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  HubConnectionBuilder,
  HubConnectionState,
  HubConnection,
} from '@aspnet/signalr';
import { Page } from './Page';
import {
  QuestionData,
  getQuestion,
  mapQuestionFromServer,
  QuestionDataFromServer,
  PostAnswerData,
  AnswerData,
} from '../Components/QuestionsData';
import {
  Form,
  required,
  minLength,
  Values,
  SubmitResult,
} from '../Components/Form';
import { AnswersList } from '../Components/AnswersList';
import { gray3, gray6 } from '../Styles';
import { Field } from '../Components/Field';
import { useAuth } from '../Auth';
import {
  AppState,
  clearPostedQuestionActionCreator,
  postAnswerActionCreator,
} from '../Store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface RouteParams {
  questionId: string;
}

interface Props {
  postAnswer: (answer: PostAnswerData) => Promise<void>;
  postedAnswerResult?: AnswerData;
  clearPostedAnswer: () => void;
}

export const QuestionPage: FC<RouteComponentProps<RouteParams> & Props> = ({
  match,
  postAnswer,
  postedAnswerResult,
  clearPostedAnswer,
}) => {
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const setUpSignalRConnection = async (questionId: number) => {
    const connection = new HubConnectionBuilder()
      .withUrl('https://localhost:44348/questionshub')
      .withAutomaticReconnect()
      .build();
    connection.on('Message', (message: string) => {
      console.log('Message', message);
    });
    connection.on('ReceiveQuestion', (question: QuestionDataFromServer) => {
      console.log('ReceiveQuestion', question);
      setQuestion(mapQuestionFromServer(question));
    });
    try {
      await connection.start();
    } catch (err) {
      console.log(err);
    }
    if (connection.state === HubConnectionState.Connected) {
      connection.invoke('SubscribeQuestion', questionId).catch((err: Error) => {
        return console.error(err.toString());
      });
    }
    return connection;
  };
  const cleanUpSignalRConnection = async (
    questionId: number,
    connection: HubConnection,
  ) => {
    if (!connection) return;
    if (connection.state === HubConnectionState.Connected) {
      try {
        await connection.invoke('UnsubscribeQuestion', questionId);
      } catch (err) {
        return console.error(err.toString());
      }
      connection.off('Message');
      connection.off('ReceiveQuestion');
      connection.stop();
    } else {
      connection.off('Message');
      connection.off('ReceiveQuestion');
      connection.stop();
    }
  };
  useEffect(() => {
    let isMounted = true;
    const doGetQuestion = async (questionId: number) => {
      const foundQuestion = await getQuestion(questionId);
      if (isMounted) setQuestion(foundQuestion);
    };
    let connection: HubConnection;
    if (match.params.questionId) {
      const questionId = Number(match.params.questionId);
      doGetQuestion(questionId);
      setUpSignalRConnection(questionId).then((con) => {
        connection = con;
      });
    }
    return function cleanUp() {
      isMounted = false;
      clearPostedAnswer();
      if (match.params.questionId) {
        const questionId = Number(match.params.questionId);
        cleanUpSignalRConnection(questionId, connection);
      }
    };
  }, [clearPostedAnswer, match.params.questionId]);
  const handleSubmit = (values: Values) => {
    postAnswer({
      questionId: question!.questionId,
      content: values.content,
      userName: 'Fred',
      created: new Date(),
    });
  };
  let submitResult: SubmitResult | undefined;
  if (postedAnswerResult) {
    submitResult = { success: postedAnswerResult !== undefined };
  }
  const { isAuthenticated } = useAuth();
  return (
    <Page title={`Question #${match.params.questionId}`}>
      <div
        css={css`
          background-color: white;
          padding: 15px 20px 20px 20px;
          border-radius: 4px;
          border: 1px solid ${gray6};
          box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
        `}
      >
        <div
          css={css`
            font-size: 19px;
            font-weight: bold;
            margin: 10px 0px 5px;
          `}
        >
          {question === null ? 'Loading...' : question.title}
        </div>
        {question !== null && (
          <Fragment>
            <p
              css={css`
                margin-top: 0px;
                background-color: white;
              `}
            >
              {question.content}
            </p>
            <div
              css={css`
                font-size: 12px;
                font-style: italic;
                color: ${gray3};
              `}
            >
              {`Asked by ${question.userName} on 
              ${question.created.toLocaleDateString()} 
              ${question.created.toLocaleTimeString()}`}
            </div>
            {isAuthenticated && (
              <Form
                submitCaption="Submit Your Answer"
                validationRules={{
                  content: [
                    { validator: required },
                    { validator: minLength, arg: 50 },
                  ],
                }}
                onSubmit={handleSubmit}
                submitResult={submitResult}
                failureMessage="There was a problem with your answer"
                successMessage="Your answer was successfully submitted"
              >
                <Field name="content" label="Content" type="TextArea"></Field>
              </Form>
            )}
            <AnswersList data={question.answers} />
          </Fragment>
        )}
      </div>
    </Page>
  );
};

const mapStateToProps = (store: AppState) => {
  return {
    postedAnswerResult: store.answers.postedResult,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    postAnswer: (answer: PostAnswerData) =>
      dispatch(postAnswerActionCreator(answer)),
    clearPostedAnswer: () => dispatch(clearPostedQuestionActionCreator()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
