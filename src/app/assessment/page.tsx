'use client';
import React from 'react';
import { API } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { log } from 'console';

const allQuestions={
  "English":[
  { question: 'You have a lot of friends 1', answer: 1, id: 1 },
  { question: 'You have a lot of friends 2', answer: 1, id: 2 },
  { question: 'You have a lot of friends 3', answer: 0, id: 3 },
  { question: 'You have a lot of friends 4', answer: 0, id: 4 },
  { question: 'You have a lot of friends 5', answer: -1, id: 5 },
  { question: 'You have a lot of friends 6', answer: -1, id: 6 },
  { question: 'You have a lot of friends 7', answer: 0, id: 7 },
  { question: 'You have a lot of friends 8', answer: 1, id: 8 },
  { question: 'You have a lot of friends 9', answer: 3, id: 9 },
  { question: 'You have a lot of friends 10', answer: -3, id: 10 },
  { question: 'You have a lot of friends 11', answer: 1, id: 11 },
  { question: 'You have a lot of friends 12', answer: 1, id: 12 },
],
"Tamil":[
  { question: 'உங்களுக்கு நிறைய நண்பர்கள் உள்ளனர் 1', answer: 1, id: 1 },
  { question: 'உங்களுக்கு நிறைய நண்பர்கள் உள்ளனர் 2', answer: 1, id: 2 },
  { question: 'உங்களுக்கு நிறைய நண்பர்கள் உள்ளனர் 3', answer: 0, id: 3 },
  { question: 'உங்களுக்கு நிறைய நண்பர்கள் உள்ளனர் 4', answer: 0, id: 4 },
  { question: 'உங்களுக்கு நிறைய நண்பர்கள் உள்ளனர் 5', answer: -1, id: 5 },
  { question: 'You have a lot of friends 6', answer: -1, id: 6 },
  { question: 'You have a lot of friends 7', answer: 0, id: 7 },
  { question: 'You have a lot of friends 8', answer: 1, id: 8 },
  { question: 'You have a lot of friends 9', answer: 3, id: 9 },
  { question: 'You have a lot of friends 10', answer: -3, id: 10 },
  { question: 'You have a lot of friends 11', answer: 1, id: 11 },
  { question: 'You have a lot of friends 12', answer: 1, id: 12 },
],

"Hindi":[
  { question: 'आपके बहुत से मित्र हैं 1', answer: 1, id: 1 },
  { question: 'आपके बहुत से मित्र हैं 2', answer: 1, id: 2 },
  { question: 'आपके बहुत से मित्र हैं 3', answer: 0, id: 3 },
  { question: 'आपके बहुत से मित्र हैं 4', answer: 0, id: 4 },
  { question: 'आपके बहुत से मित्र हैं 5', answer: -1, id: 5 },
  { question: 'You have a lot of friends 6', answer: -1, id: 6 },
  { question: 'You have a lot of friends 7', answer: 0, id: 7 },
  { question: 'You have a lot of friends 8', answer: 1, id: 8 },
  { question: 'You have a lot of friends 9', answer: 3, id: 9 },
  { question: 'You have a lot of friends 10', answer: -3, id: 10 },
  { question: 'You have a lot of friends 11', answer: 1, id: 11 },
  { question: 'You have a lot of friends 12', answer: 1, id: 12 },
]};

const answersList=[1,1,0,0,-1,-1,0,1,3,-3,1,1]


const langContext = React.createContext('English');

const LanguageProvider = ({children}) => {
  const [lang, setLang] = useState("English");

  const handleLanguageChange = (event: any) => {
    const language = event.target.value;
    setLang(language);  
    console.log(" lang = ", language)
  }

  return (
    <langContext.Provider value={lang}>
      <div className="h-screen p-10 w-screen flex flex-col">
      <h1 className="text-3xl font-bold">Career Choice Assessment</h1>
      <p>
        Complete the test below. Be yourself and answer honestly to find out
        perfect career options based on your personality type.
      </p>

      <div className="flex gap-2 items-center">
        <h3 className="font-bold my-10 text-lg">Medium of Assessment:</h3>
        <select value={lang} className="p-[5px] w-[10rem] text-lg border-solid border-gray-400 hover:shadow-lg bg-slate-200 rounded-md text-center" onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Tamil">Tamil</option>
          <option value="Hindi">Hindi</option>
        </select>
        <p className="text-sm">Note: You can change the medium of assessment any time during the Assessment</p>
      </div>

      {children}
    </div>  
    </langContext.Provider>
  );
};




const useLanguage = () => {
  return useContext(langContext);
};


export default function Page(){
  return (
    <LanguageProvider>
      <QuestionsComponent/>
    </LanguageProvider>
  );

}


const QuestionsComponent = () => {
  const [lang, setLang] = useState("English");

  var selectedLanguage = useLanguage();
  console.log("selectged lang = ", selectedLanguage)
  const [questions, setQuestions] = useState(allQuestions[selectedLanguage]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState(answersList);

  const handleAnswerChange = (i: number, value: number) => {
    setAnswers((answersList) => {
      const newAnswers = [...answersList];
      newAnswers[i - 1] = value;
      console.log(newAnswers);
      
      return newAnswers;
    });
  };

  const router = useRouter();

  const questionsSubmitMutation = useMutation(
    (answers: { answers: number[] }) => API.career.submit(answers),
    {
      onSuccess: (data) => {
        console.log(data);
        setLoading(false);
        localStorage.setItem('career', JSON.stringify(data));
        router.push('/englishtest');
      },
      onError: (error) => {
        setLoading(false);
        alert(error);
      },
    }
  );

  useEffect(() => {
    if (localStorage.getItem('career')) {
      router.push('/englishtest');
    }
  }, [router]);

  return (

      <div className="mt-10 flex flex-col justify-center gap-8">
        {allQuestions[selectedLanguage].slice(page, page + 5).map((question, i) => {
          return (
            
            <div key={i}>
              <h2 className="text-2xl font-medium mb-4">{question.question}</h2>
              <div className="flex gap-6 items-center">
                <h3 className="font-bold">Agree</h3>
                <button
                  className={`${
                    answers[question.id - 1] === 3 ? 'bg-green-500' : 'bg-white'
                  }  border-green-500 border-2 w-16 h-16 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 3);
                  }}
                />
                <button
                  className={`${
                    answers[question.id - 1] === 2 ? 'bg-green-500' : 'bg-white'
                  }  border-green-500 border-2 w-[52px] h-[52px] rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 2);
                  }}
                />
                <button
                  className={`${
                    answers[question.id - 1] === 1 ? 'bg-green-500' : 'bg-white'
                  }  border-green-500 border-2 w-10 h-10 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 1);
                  }}
                />
                <button
                  className={`${
                    answers[question.id - 1] === 0 ? 'bg-gray-500' : 'bg-white'
                  }  border-gray-500 border-2 w-8 h-8 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 0);
                  }}
                />
                <button
                  className={`${
                    answers[question.id - 1] === -1 ? 'bg-red-500' : 'bg-white'
                  }  border-red-500 border-2 w-10 h-10 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, -1);
                  }}
                />
                <button
                  className={`${
                    answers[question.id - 1] === -2 ? 'bg-red-500' : 'bg-white'
                  }  border-red-500 border-2 w-[52px] h-[52px] rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, -2);
                  }}
                />
                <button
                  className={`${
                    answers[question.id - 1] === -3 ? 'bg-red-500' : 'bg-white'
                  }  border-red-500 border-2 w-16 h-16 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, -3);
                  }}
                />
                <h3 className="font-bold">Disagree</h3>
              </div>
            </div>
          );
        })}

        <div className="flex gap-5 items-center">
          <h5 className="text-gray-600 font-medium">
            Page : {page / 5 + 1} / {Math.ceil(questions.length / 5)}
          </h5>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              if (page <= 0) return;
              setPage(page - 5);
            }}
          >
            Previous
          </button>
          {page / 5 + 1 === Math.ceil(questions.length / 5) ? (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                setLoading(true);
                // check if all questions are answered
                if (
                  questions.filter((question) => question.answer === 7).length >
                  0
                ) {
                  setLoading(false);
                  alert('Please answer all questions!');
                  return;
                }
                // const answers = questions.map((question) => question.answer);
                questionsSubmitMutation.mutate({ answers });
              }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block"></div>
              ) : (
                'Submit'
              )}
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                console.log(page, questions.length - 5);
                if (page >= questions.length - 5) return;
                setPage(page + 5);
              }}
            >
              Next
            </button>
          )}

          <h5 className="text-gray-600 font-medium">
            Answered :{' '}
            {questions.filter((question) => question.answer != 7).length} /{' '}
            {questions.length}
          </h5>
        </div>
      </div>
  );
}
