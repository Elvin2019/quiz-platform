"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { alphabeticNumeral } from "@/constants/index";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Question } from "../../api/questions/route";
import { ConfirmDialog } from "primereact/confirmdialog";

interface Props {
  questions: Question[];
}

const QuestionComponent = ({ questions }: Props) => {
  const { questionId = 0 } = useParams();
  const [curr, setCurr] = useState(+questionId - 1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | undefined>();
  const [toggle, setToggle] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const router = useRouter();
  const [score, setScore] = useState(0);

  const handleSelect = (i: string) => {
    if (selected === i && selected === questions[curr].correctAnswer)
      return "correct";
    else if (selected === i && selected !== questions[curr].correctAnswer)
      return "incorrect";
    else if (i === questions[curr].correctAnswer) return "correct";
  };

  const handleCheck = (answer: string) => {
    setSelected(answer);
    if (answer === questions[curr].correctAnswer) setScore(score + 1);
  };

  const handleNext = () => {
    setCurr((curr) => curr + 1);
    setSelected("");
    console.log(curr);
    // router.push(`/questions/${curr+2}`, {
    //   scroll: false,
    // });
    window.history.replaceState(null, "", `/questions/${curr + 2}`);
  };

  useEffect(() => {
    if (questions.length >= 5) {
      setAnswers(
        handleShuffle(
          questions[curr].correctAnswer,
          questions[curr].incorrectAnswers
        )
      );
      setProgressValue((100 / questions.length) * (curr + 1));
    }
    // setProgressValue((100 / limit) * (curr + 1));
  }, [curr, questions]);
  const handleShuffle = (element: string, array: string[]) => {
    const newArray = [...array, element];
    const shuffledArray = newArray.sort(() => Math.random() - 0.5);
    return shuffledArray;
  };

  const handleShowResult = async () => {
    // await setShowResultScreen(true);
    // router.push("/results");
  };
  const handleQuit = () => {
    router.push("/");
    setScore(0);
  };
  {
    // @ts-ignore
  }
  return (
    <>
      <div className="wrapper">
        <div className="bg-white px-4 shadow-md w-full md:w-[90%] rounded-md">
          <h1 className="heading">Quizy</h1>
          <ProgressBar
            value={progressValue}
            showValue={false}
            style={{ height: "10px" }}
            color={progressValue === 100 ? "green" : "blue"}
          />
          <div className="flex justify-between py-5 px-2 font-bold text-md">
            <p>Score: {score}</p>
          </div>
          <h2 className="text-2xl text-center font-medium">{`Q${questions[curr].id}. ${questions[curr].question}`}</h2>
          {answers?.map((answer, i) => (
            <div key={answer} className="my-4">
              <button
                className={`option ${selected && handleSelect(answer)}`}
                disabled={Boolean(selected)}
                onClick={() => handleCheck(answer)}
              >
                {alphabeticNumeral(i)}
                {answer}
              </button>
            </div>
          ))}
          <div className="flex m-10 md:justify-between md:flex-row flex-col gap-4 md:gap-0 mx-auto max-w-xs w-full">
            <Button
              label={
                questions.length - 1 != curr ? "Next Question" : "Show Results"
              }
              // disabled={!selected}
              onClick={() =>
                questions.length === curr + 1
                  ? handleShowResult()
                  : handleNext()
              }
            />
            <Button
              label="Quit Quiz"
              severity="danger"
              onClick={() => setToggle(true)}
            />
          </div>
        </div>
      </div>
      
      <ConfirmDialog
      content={undefined}
        visible={toggle}
        onHide={() => setToggle(false)}
        message="Your Progress will be lost, Are you Sure?"
        header="Confirmation"
        accept={handleQuit}
        reject={() => setToggle(false)}
      />
    </>
  );
};

export default QuestionComponent;
