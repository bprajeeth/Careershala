'use client';
import { API } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const questionsList = [
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
];

export default function Page() {
  const [questions, setQuestions] = useState(questionsList);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleAnswerChange = (i: number, value: number) => {
    setQuestions((questions) => {
      const newQuestions = [...questions];
      newQuestions[i - 1].answer = value;
      return newQuestions;
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
        router.push('/result');
      },
      onError: (error) => {
        setLoading(false);
        alert(error);
      },
    }
  );

  useEffect(() => {
    if (localStorage.getItem('career')) {
      router.push('/result');
    }
  }, [router]);

  return (
    <div className="h-screen p-10">
      <h1 className="text-3xl font-bold">Career Choice Assessment</h1>
      <p>
        Complete the test below. Be yourself and answer honestly to find out
        perfect career options based on your personality type.
      </p>
      <div className="mt-10 flex flex-col gap-8">
        {questions.slice(page, page + 5).map((question, i) => {
          return (
            <div key={i}>
              <h2 className="text-2xl font-medium mb-4">{question.question}</h2>
              <div className="flex gap-6 items-center">
                <h3 className="font-bold">Agree</h3>
                <button
                  className={`${
                    question.answer === 3 ? 'bg-green-500' : 'bg-white'
                  }  border-green-500 border-2 w-16 h-16 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 3);
                  }}
                />
                <button
                  className={`${
                    question.answer === 2 ? 'bg-green-500' : 'bg-white'
                  }  border-green-500 border-2 w-[52px] h-[52px] rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 2);
                  }}
                />
                <button
                  className={`${
                    question.answer === 1 ? 'bg-green-500' : 'bg-white'
                  }  border-green-500 border-2 w-10 h-10 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 1);
                  }}
                />
                <button
                  className={`${
                    question.answer === 0 ? 'bg-gray-500' : 'bg-white'
                  }  border-gray-500 border-2 w-8 h-8 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, 0);
                  }}
                />
                <button
                  className={`${
                    question.answer === -1 ? 'bg-red-500' : 'bg-white'
                  }  border-red-500 border-2 w-10 h-10 rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, -1);
                  }}
                />
                <button
                  className={`${
                    question.answer === -2 ? 'bg-red-500' : 'bg-white'
                  }  border-red-500 border-2 w-[52px] h-[52px] rounded-full`}
                  onClick={() => {
                    handleAnswerChange(question.id, -2);
                  }}
                />
                <button
                  className={`${
                    question.answer === -3 ? 'bg-red-500' : 'bg-white'
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
                const answers = questions.map((question) => question.answer);
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
    </div>
  );
}
