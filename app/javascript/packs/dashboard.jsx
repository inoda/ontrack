import React from 'react'
import ReactDOM from 'react-dom'
import DashboardMain from '../components/dashboard/Main'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <DashboardMain {...window.InitialProps} />,
    document.getElementById("dashboard"),
  )
})
