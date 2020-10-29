import { http } from '../Http';

export interface QuestionData {
  questionId: number;
  title: string;
  content: string;
  userName: string;
  created: Date;
  answers: AnswerData[];
}

export interface AnswerData {
  answerId: number;
  content: string;
  userName: string;
  created: Date;
}

export interface PostQuestionData {
  title: string;
  content: string;
  userName: string;
  created: Date;
}

export interface PostAnswerData {
  questionId: number;
  content: string;
  userName: string;
  created: Date;
}

export interface QuestionDataFromServer {
  questionId: number;
  title: string;
  content: string;
  userName: string;
  created: string;
  answers: AnswerDataFromServer[];
}

export interface AnswerDataFromServer {
  answerId: number;
  content: string;
  userName: string;
  created: string;
}

export const mapQuestionFromServer = (
  question: QuestionDataFromServer,
): QuestionData => ({
  ...question,
  created: new Date(question.created.substr(0, 19)),
  answers: !question.answers
    ? []
    : question.answers.map((answer) => ({
        ...answer,
        created: new Date(answer.created.substr(0, 19)),
      })),
});

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getUnansweredQuestions = async (): Promise<QuestionData[]> => {
  try {
    const result = await http<undefined, QuestionDataFromServer[]>({
      path: '/questions/unanswered',
    });
    if (result.parsedBody) return result.parsedBody.map(mapQuestionFromServer);
    else return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getQuestion = async (
  questionId: number,
): Promise<QuestionData | null> => {
  try {
    const result = await http<undefined, QuestionDataFromServer>({
      path: `/questions/${questionId}`,
    });
    if (result.ok && result.parsedBody)
      return mapQuestionFromServer(result.parsedBody);
    else return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const searchQuestions = async (
  criteria: string,
): Promise<QuestionData[]> => {
  try {
    const result = await http<undefined, QuestionDataFromServer[]>({
      path: `/questions?search=${criteria}`,
    });
    if (result.ok && result.parsedBody)
      return result.parsedBody.map(mapQuestionFromServer);
    else return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const postQuestion = async (
  question: PostQuestionData,
): Promise<QuestionData | undefined> => {
  await wait(500);
  const questionId = Math.max(...questions.map((q) => q.questionId)) + 1;
  const newQuestion: QuestionData = {
    ...question,
    questionId,
    answers: [],
  };
  questions.push(newQuestion);
  return newQuestion;
};

export const postAnswer = async (
  answer: PostAnswerData,
): Promise<AnswerData | undefined> => {
  await wait(500);
  const question = questions.filter(
    (q) => q.questionId === answer.questionId,
  )[0];
  const answerInQuestion: AnswerData = {
    answerId: 99,
    ...answer,
  };
  question.answers.push(answerInQuestion);
  return answerInQuestion;
};

const questions: QuestionData[] = [
  {
    questionId: 1,
    title: 'Why Should I Learn TypeScript?',
    content:
      'Typescript seems to be getting popular so I wondered whether it is worth my time learning it? What benefits does it give over JavaScript?',
    userName: 'Bob',
    created: new Date(),
    answers: [
      {
        answerId: 1,
        content: 'To catch problems at build and speed up development',
        userName: 'Jane',
        created: new Date(),
      },
      {
        answerId: 2,
        content: 'So that you can use the JS features of tomorrow, today!',
        userName: 'John',
        created: new Date(),
      },
    ],
  },
  {
    questionId: 2,
    title: 'WTF Is Happening',
    content: 'Title says it all',
    userName: 'Steve',
    created: new Date(),
    answers: [],
  },
];
