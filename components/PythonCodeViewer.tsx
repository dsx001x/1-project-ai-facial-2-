
import React, { useState } from 'react';

const pythonCode = `import cv2
import numpy as np
import face_recognition
import os
from datetime import datetime

# Path to the student images folder
path = 'Student_Images'
images = []
classNames = []
myList = os.listdir(path)

# Load training images
for cl in myList:
    curImg = cv2.imread(f'{path}/{cl}')
    images.append(curImg)
    classNames.append(os.path.splitext(cl)[0])

def findEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList

def markAttendance(name):
    with open('Attendance.csv', 'r+') as f:
        myDataList = f.readlines()
        nameList = []
        for line in myDataList:
            entry = line.split(',')
            nameList.append(entry[0])
        if name not in nameList:
            now = datetime.now()
            dtString = now.strftime('%H:%M:%S')
            f.writelines(f'\\n{name},{dtString}')

# Generate Encodings
print('Encoding Started...')
encodeListKnown = findEncodings(images)
print('Encoding Complete.')

# Initialize Webcam
cap = cv2.VideoCapture(0)

while True:
    success, img = cap.read()
    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    facesCurFrame = face_recognition.face_locations(imgS)
    encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

    for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            name = classNames[matchIndex].upper()
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2, x1 = y1*4, x2*4, y2*4, x1*4
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.rectangle(img, (x1, y2-35), (x2, y2), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, name, (x1+6, y2-6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            markAttendance(name)

    cv2.imshow('VisionTrack AI - Live Feed', img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()`;

const PythonCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Python Implementation</h2>
          <p className="text-slate-500">View and copy the source code for the local Python backend using OpenCV.</p>
        </div>
        <button 
          onClick={handleCopy}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <span>{copied ? '✅' : '📋'}</span>
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <span className="text-xs font-mono text-slate-500 ml-4">main.py</span>
        </div>
        <div className="p-6 overflow-x-auto max-h-[600px] font-mono text-sm leading-relaxed">
          <pre className="text-slate-300">
            {pythonCode.split('\n').map((line, i) => {
              // Very basic simulated syntax highlighting
              let styledLine = line;
              const keywords = ['import', 'from', 'def', 'return', 'if', 'while', 'True', 'False', 'in', 'with', 'as', 'for'];
              const strings = line.match(/'[^']*'|"[^"]*"/g);
              const comments = line.match(/#.*/);

              return (
                <div key={i} className="hover:bg-slate-800/50 transition-colors">
                  <span className="inline-block w-8 text-slate-700 select-none mr-4">{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ 
                    __html: line
                      .replace(/\b(import|from|def|return|if|while|True|False|in|with|as|for)\b/g, '<span class="text-pink-400">$1</span>')
                      .replace(/#.*/g, '<span class="text-slate-500">$&</span>')
                      .replace(/(['"])(.*?)\1/g, '<span class="text-amber-200">$&</span>')
                      .replace(/\b(print|cv2|face_recognition|np|datetime|open)\b/g, '<span class="text-blue-400">$1</span>')
                  }} />
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
        <div className="text-3xl">💡</div>
        <div>
          <h4 className="font-bold text-blue-900">Project Requirements</h4>
          <p className="text-sm text-blue-800 mt-1">To run this code locally, ensure you have Python 3.x installed along with the following libraries: <code>pip install opencv-python face_recognition numpy</code>. Create a folder named "Student_Images" and place JPEG files named after each student (e.g., "John_Doe.jpg").</p>
        </div>
      </div>
    </div>
  );
};

export default PythonCodeViewer;
