import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Post from './Post'
import './output.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
