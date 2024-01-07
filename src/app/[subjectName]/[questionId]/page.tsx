import QuestionComponent from "./question";
const Questions = async () => {
   const questions = await fetch(process.env.SITE_URL + '/api/questions', {method: 'GET', cache: 'force-cache'}).then((res) => res.json());
   return <QuestionComponent questions={questions}/>
} 

export default Questions
