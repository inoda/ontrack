import React from 'react';
import ReactDOM from 'react-dom';
import UploadPreview from '../components/expenses/UploadPreview';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <UploadPreview {...window.InitialProps} />,
    document.getElementById('upload_preview'),
  );
});
