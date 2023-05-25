import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <>
      <p>
        <Link to="/login">Back to Login</Link>
      </p>
      <p>
        <Link to="/">Back to Main</Link>
      </p>

      <p>
        <h1>Nothing to see here... </h1>
      </p>
    </>
  );
};
