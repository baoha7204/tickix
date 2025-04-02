const ErrorWrapper = ({ errors }) => {
  return (
    <div className="alert alert-danger">
      <ul className="my-0">
        {errors.map((error) => (
          <li key={error.message}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorWrapper;
