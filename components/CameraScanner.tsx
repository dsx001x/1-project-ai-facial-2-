
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { recognizeFace } from '../services/geminiService';
import { Student, RecognitionResult, AttendanceRecord } from '../types';
import { MOCK_STUDENTS, APP_CONFIG } from '../constants';

interface CameraScannerProps {
  onMarkAttendance: (record: AttendanceRecord) => void;
  lastMarked: Record<string, number>;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onMarkAttendance, lastMarked }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Initializing camera...");
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [latestResult, setLatestResult] = useState<RecognitionResult | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatusMessage("Camera ready. Scanning faces...");
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setStatusMessage("Failed to access camera. Please check permissions.");
    }
  };

  const captureAndRecognize = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isCapturing || recognitionActive) return;

    setRecognitionActive(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);

      setStatusMessage("AI is analyzing image...");
      const result = await recognizeFace(base64Image, MOCK_STUDENTS);
      setLatestResult(result);

      if (result.studentId) {
        const student = MOCK_STUDENTS.find(s => s.id === result.studentId);
        const lastMarkedTime = lastMarked[result.studentId] || 0;
        const now = Date.now();

        if (student && (now - lastMarkedTime > APP_CONFIG.RECOGNITION_COOLDOWN_MS)) {
          const newRecord: AttendanceRecord = {
            id: Math.random().toString(36).substr(2, 9),
            studentId: student.id,
            studentName: student.name,
            timestamp: new Date(),
            status: 'Present',
            confidence: result.confidence
          };
          onMarkAttendance(newRecord);
          setStatusMessage(`Welcome back, ${student.name}!`);
        } else if (student) {
          setStatusMessage(`${student.name} already marked recently.`);
        }
      } else {
        setStatusMessage("No student match found.");
      }
    }
    setRecognitionActive(false);
  }, [isCapturing, recognitionActive, lastMarked, onMarkAttendance]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (isCapturing) {
      interval = window.setInterval(captureAndRecognize, APP_CONFIG.CAPTURE_INTERVAL_MS);
    }
    return () => clearInterval(interval);
  }, [isCapturing, captureAndRecognize]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video max-w-4xl mx-auto border-4 border-slate-800">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Face Recognition Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-blue-400/50 rounded-lg border-dashed animate-pulse"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white min-w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${recognitionActive ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {recognitionActive ? 'AI Analyzing...' : 'System Active'}
                </p>
              </div>
              <p className="text-lg font-medium">{statusMessage}</p>
            </div>

            {latestResult?.studentId && (
               <div className="bg-blue-600 p-4 rounded-xl shadow-lg border border-blue-400 animate-bounce text-white">
                  <p className="text-xs font-bold uppercase mb-1">Detected Match</p>
                  <p className="text-sm font-semibold">
                    Confidence: {(latestResult.confidence * 100).toFixed(1)}%
                  </p>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Auto-Scanner</p>
          <p className="text-sm">Interval: {APP_CONFIG.CAPTURE_INTERVAL_MS / 1000}s</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Cooldown</p>
          <p className="text-sm">Prevention: {APP_CONFIG.RECOGNITION_COOLDOWN_MS / 1000}s</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Model</p>
          <p className="text-sm">Gemini 3 Flash</p>
        </div>
      </div>
    </div>
  );
};

export default CameraScanner;
