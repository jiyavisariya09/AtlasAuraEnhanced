function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{statusCode ? `${statusCode} - Page Error` : 'An error occurred'}</h1>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
