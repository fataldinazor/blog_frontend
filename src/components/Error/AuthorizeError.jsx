const NotAuthorized = () => {
  return (
    <div className="flexx flex-col my-44 place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">403</h1>

        <p className="text-2xl font-bold tracking-tight text-black sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">You&apos;re not Authorized to access this page.</p>

        <a
          href='/articles'
          className="mt-6 inline-block rounded bg-black px-5 py-3 text-sm font-medium text-white hover:text-black hover:bg-white border border-black focus:outline-none focus:ring"
        >
          Go Back to Articles
        </a>
      </div>
    </div>
  );
};
export default NotAuthorized;
