import Head from "next/head";
import Image from 'next/image'
import { useState, FormEvent } from "react";

export default function Home() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [processing, setProcessing] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProcessing(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
    } catch(error) {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Cheer Up by ChatGPT</title>
        <meta
          name="description"
          content="This is ChatGPT application to cheer up you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-10 p-5 max-w-screen-md m-auto text-gray-700">
        <form onSubmit={onSubmit}>
          <label htmlFor="text" className="block mb-2 font-medium">
            What did you do today?
          </label>
          <div className="flex justify-between">
            <input
              id="text"
              type="text"
              name="message"
              className={'flex-auto bg-gray-50 border border-r-0 rounded-l-md focus:ring-sky-500 focus:border-sky-500 block w-full px-3 py-2' + (processing ? ' cursor-not-allowed' : '')}
              placeholder="e.g. I ate sushi 🍣"
              maxLength={100}
              required
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={processing}
            />
            <button
              type="submit"
              className={'flex-none w-24 text-white transition-colors focus:ring-2 focus:outline-none font-medium rounded-r-md text-sm text-center ' + (processing ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-300')}
              disabled={processing}
            >
            {result ? (
              <span className="text-xl">🎉</span>
            ) : processing ? (
              <svg className="animate-spin h-5 w-5 m-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="py-2">Cheer Up!</span>
            )}
            </button>
          </div>
          <div className="mt-5">
            <Image
              src="/cheer-leader.jpg"
              alt="Cheer leader"
              width={100}
              height={100}
              className="rounded-full border-4 border-red-50"
              priority
            />
            <div className="mt-3 p-4 bg-red-50 relative rounded-lg before:content-[''] before:absolute before:-top-4 before:left-10 before:border-8 before:border-transparent before:border-b-8 before:border-b-red-50">
              {result || 'Pleas tell me what did you do today.'}
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
