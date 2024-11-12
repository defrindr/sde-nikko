import Form from './components/Form';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-center text-lg font-bold">SDE NIKKO</h1>
      <p className="text-center">Sensitive Data Exposure di aplikasi NIKKO MOOD</p>
      <Form />
    </div>
  );
}
