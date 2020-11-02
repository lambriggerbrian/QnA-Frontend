import {
  Action,
  ActionCreator,
  Dispatch,
  Reducer,
  combineReducers,
  Store,
  createStore,
  applyMiddleware,
} from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import {
  QuestionData,
  getUnansweredQuestions,
  postQuestion,
  PostQuestionData,
  PostAnswerData,
  AnswerData,
  postAnswer,
} from './Components/QuestionsData';

interface QuestionsState {
  readonly loading: boolean;
  readonly unanswered: QuestionData[] | null;
  readonly postedResult?: QuestionData;
}

const initialQuestionsState: QuestionsState = {
  loading: false,
  unanswered: null,
};

export interface GettingUnansweredQuestionsAction
  extends Action<'GettingUnansweredQuestions'> {}

export interface GotUnansweredQuestionsAction
  extends Action<'GotUnansweredQuestions'> {
  questions: QuestionData[];
}

export interface PostedQuestionAction extends Action<'PostedQuestion'> {
  result: QuestionData | undefined;
}

type QuestionsActions =
  | GettingUnansweredQuestionsAction
  | GotUnansweredQuestionsAction
  | PostedQuestionAction;

export const getUnansweredQuestionsActionCreator: ActionCreator<ThunkAction<
  Promise<void>,
  QuestionData[],
  null,
  GotUnansweredQuestionsAction
>> = () => {
  return async (dispatch: Dispatch) => {
    const gettingUnansweredQuestionsAction: GettingUnansweredQuestionsAction = {
      type: 'GettingUnansweredQuestions',
    };
    dispatch(gettingUnansweredQuestionsAction);
    const questions = await getUnansweredQuestions();
    const gotUnansweredQuestionsAction: GotUnansweredQuestionsAction = {
      questions,
      type: 'GotUnansweredQuestions',
    };
    dispatch(gotUnansweredQuestionsAction);
  };
};

export const postQuestionActionCreator: ActionCreator<ThunkAction<
  Promise<void>,
  QuestionData,
  PostQuestionData,
  PostedQuestionAction
>> = (question: PostQuestionData) => {
  console.log(question);
  return async (dispatch: Dispatch) => {
    const result = await postQuestion(question);
    const postedQuestionAction: PostedQuestionAction = {
      type: 'PostedQuestion',
      result,
    };
    dispatch(postedQuestionAction);
  };
};

export const clearPostedQuestionActionCreator: ActionCreator<PostedQuestionAction> = () => {
  const postedQuestionAction: PostedQuestionAction = {
    type: 'PostedQuestion',
    result: undefined,
  };
  return postedQuestionAction;
};

const questionsReducer: Reducer<QuestionsState, QuestionsActions> = (
  state = initialQuestionsState,
  action,
) => {
  switch (action.type) {
    case 'GettingUnansweredQuestions': {
      return {
        ...state,
        unanswered: null,
        loading: true,
      };
    }
    case 'GotUnansweredQuestions': {
      return {
        ...state,
        unanswered: action.questions,
        loading: false,
      };
    }
    case 'PostedQuestion': {
      return {
        ...state,
        unanswered: action.result
          ? (state.unanswered || []).concat(action.result)
          : state.unanswered,
        postedResult: action.result,
      };
    }
    default:
      neverReached(action);
  }
  return state;
};

interface AnswersState {
  readonly loading: boolean;
  readonly postedResult?: AnswerData;
}

const initialAnswersState: AnswersState = {
  loading: false,
};

export interface PostedAnswerAction extends Action<'PostedAnswer'> {
  result: AnswerData | undefined;
}

type AnswersActions = PostedAnswerAction | never;

export const postAnswerActionCreator: ActionCreator<ThunkAction<
  Promise<void>,
  AnswerData,
  PostAnswerData,
  PostedAnswerAction
>> = (answer: PostAnswerData) => {
  console.log(answer);
  return async (dispatch: Dispatch) => {
    const result = await postAnswer(answer);
    const postedAnswerAction: PostedAnswerAction = {
      type: 'PostedAnswer',
      result,
    };
    dispatch(postedAnswerAction);
  };
};

export const clearPostedAnswerActionCreator: ActionCreator<PostedAnswerAction> = () => {
  const postedAnswerAction: PostedAnswerAction = {
    type: 'PostedAnswer',
    result: undefined,
  };
  return postedAnswerAction;
};

const answersReducer: Reducer<AnswersState, AnswersActions> = (
  state = initialAnswersState,
  action,
) => {
  return { ...state, postedResult: action.result };
};

const neverReached = (never: never) => {};

const rootReducer = combineReducers<AppState>({
  questions: questionsReducer,
  answers: answersReducer,
});

export interface AppState {
  readonly questions: QuestionsState;
  readonly answers: AnswersState;
}

export function configureStore(): Store<AppState> {
  const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
  return store;
}
