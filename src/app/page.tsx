export default async function Home() {
  return <></>
}

export interface Question {
  id: number;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
}
