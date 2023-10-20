'use client';
import React from 'react';
import { API } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useEffect  } from 'react';

export default function Page(){
    const [englishAnswer,setEnglishAnswer]= useState("");
    const [loading,setLoading]= useState(false);

    const router = useRouter();

    const submitAnswer =  useMutation(
      (answers: { answers: string }) => API.englishtest.submit(answers),
      {
        onSuccess: (data) => {
          console.log("sucessd data = ", data);
          setLoading(false);
          localStorage.setItem('englishtest', JSON.stringify(data));
          console.log("english test = ", localStorage.getItem('englishtest'))
          router.push('/result');
        },
        onError: (error) => {
          setLoading(false);
          alert(error);
        },
      }
    );
  
    useEffect(() => {
      if (localStorage.getItem('englishtest')) {
        router.push('/result');
      }
    }, [router]);

    return(
        <div className='p-4 flex flex-col items-center h-screen'>
            <h5 className='text-3xl font-bold p-2'>English Assesment</h5>
            <p>Note: Kindly don't use any assistance for this assessment. This assessment is only to test your English vocabulary and wont impact your career choice by any means!</p>
            <h1 className='pt-2 text-xl font-bold mb-1 mt-2'>Write an essay of your choice around 150 words</h1>
            <div className='flex flex-col items-center'>
                <textarea className='w-[60rem] h-[30rem] p-2 m-1 border-4 rounded-md' onChange={(e)=>setEnglishAnswer(e.target.value)}></textarea>
                <button onClick={() => {
                    console.log("hello world")
                    console.log(englishAnswer)
                    setLoading(true);
                    
                    submitAnswer.mutate({englishAnswer});
                }
                } className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block"></div>
              ) : (
                'Submit'
              )}
            </button>
            </div>
        </div>
    
    );
}
