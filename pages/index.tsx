import Head from "next/head";
import { useState, FormEvent } from "react";

export default function Home() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('Pleas tell me what did you do today.');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
              className="flex-auto bg-gray-50 border border-r-0 rounded-l-md focus:ring-sky-500 focus:border-sky-500 block w-full px-3 py-2"
              placeholder="e.g. I ate sushi 🍣"
              maxLength={100}
              required
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="flex-none text-white bg-sky-500 transition-colors hover:bg-sky-600 focus:ring-2 focus:outline-none focus:ring-sky-300 font-medium rounded-r-md text-sm sm:w-auto px-3 py-2 text-center"
            >
              Cheer Up!
            </button>
          </div>
          <div className="mt-10 p-4 bg-red-50 rounded-lg">{result}</div>
        </form>
      </main>
    </>
  );
}
