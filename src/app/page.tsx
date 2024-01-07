import path from "path";
import { PdfReader } from "pdfreader";

const filePath = path.join(process.cwd(), "src/pdfs/UNEC_1.pdf");

function readPdf(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const rows: string[] = [];

    const pdfReader = new PdfReader({});

    pdfReader.parseFileItems(filePath, (err, item) => {
      if (err) {
        reject(err);
        return;
      }

      if (!item) {
        // End of file
        // Process the extracted rows here
        resolve(rows);
        return;
      }

      if (item.text) {
        // Store the extracted text rows
        rows.push(item.text);
      }
    });
  });
}

export const getQuestions = async (): Promise<Question[]> => {
  const lines: string[] = await readPdf();
  const regex = /\d+\./;
  const questions: Question[] = [];
  let currentQuestion: Question | null = null;
  let c = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(regex);
    if (match) {
      currentQuestion = {
        id: parseInt(match[0]),
        correctAnswer: "",
        incorrectAnswers: [],
        question: "",
      };

      if (match?.index === 0) {
        currentQuestion.question = lines[i + 1];
        const isQuestion = match[0] === match.input;
        c=true;

        if (isQuestion) {
          questions.push(currentQuestion);
        } else {
          currentQuestion = questions[questions.length - 1];
        }
      } else {
        c=false;
        questions[questions.length - 1].question += lines[i + 1];
      }
    } else if (currentQuestion) {
      if (line.includes("√")) {
        c=false;
        currentQuestion.correctAnswer = lines[i + 1];
      } else if (line.includes("•")) {
        c=false;
        currentQuestion.incorrectAnswers.push(lines[i + 1]);
      }else if(c) {
        currentQuestion.question += lines[i];
      }
    }
  }
  console.log('rendered');
  return questions;
};

export default async function Home() {
  const questions = await getQuestions();
  return questions.map((question) => {
    return <div style={{ border: "1px solid black" }}>{question.id 
    + ". " + question.question}</div>;
  });
}

export interface Question {
  id: number;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
}
