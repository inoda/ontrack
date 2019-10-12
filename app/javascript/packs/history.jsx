import React from 'react'
import ReactDOM from 'react-dom'
import HistoryMain from '../components/history/Main'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <HistoryMain {...window.InitialProps} />,
    document.getElementById("history"),
  )
})
