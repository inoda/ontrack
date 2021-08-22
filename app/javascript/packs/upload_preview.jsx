import React from 'react'
import ReactDOM from 'react-dom'
import HistoryMain from '../components/expenses/UploadPreview'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <HistoryMain {...window.InitialProps} />,
    document.getElementById("upload_preview"),
  )
})
