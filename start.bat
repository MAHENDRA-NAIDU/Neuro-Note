@echo off
echo Starting NeuroNote Backend Server...
start cmd /k "cd backend && node server.js"

echo Starting NeuroNote Frontend App...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting up! Please wait a moment, then open http://localhost:5173 in your browser.
