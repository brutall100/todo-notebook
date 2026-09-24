import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="error-container">
      <div className="error-code">404</div>
      <div className="error-message">Page Not Found</div>
      <a href="/" className="home-link">
        Go Back to Home
      </a>
    </div>
  );
};

export default NotFoundPage;
