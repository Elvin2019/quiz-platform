import { getQuestions } from "@/src/app/page";
import QuestionComponent from "./question";
const Questions = async () => {
   const questions = await getQuestions();
   return <QuestionComponent questions={questions}/>
} 

export default Questions