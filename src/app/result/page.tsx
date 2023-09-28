'use client';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { API } from '@/utils/api';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/interactive';

export default function Page() {
  const [result, setResult] = useState({
    personality: '',
    jobs: [],
    response: '',
  });

  const projectsQuery = useQuery(['projects'], () => API.projects.list());
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('career')) {
      router.push('/assessment');
      return;
    }
    const answers = JSON.parse(localStorage.getItem('career') || '');
    setResult(answers);
  }, []);
  return (
    <div className="h-screen p-10">
      <h1 className="text-3xl font-bold mb-4">Result</h1>
      <p>
        Your personality type is{' '}
        <span className="font-bold">{result.personality}</span>
      </p>
      <p>You should consider the following jobs:</p>
      <ul className="list-disc ml-10 mb-4">
        {result.jobs.map((job: string) => (
          <li key={job}>{job}</li>
        ))}
      </ul>
      <div className="prose">
        <ReactMarkdown>{result.response}</ReactMarkdown>
      </div>
      <Button
        className="mt-5"
        onClick={() => {
          const defaultProject = projectsQuery.data?.results?.find(
            (project: Project) => project.is_default
          );
          if (defaultProject)
            router.push(`/project/${defaultProject.external_id}`);
          else router.push(`/`);
        }}
      >
        Chat with Career Assistant AI bot -&gt;
      </Button>
    </div>
  );
}
