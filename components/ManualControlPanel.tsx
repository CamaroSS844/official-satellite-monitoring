import React, { useState, useRef, MouseEvent } from 'react';
import Card, { CardHeader, CardTitle } from './common/Card';

interface ManualControlPanelProps {
    onMove: (dx: number, dy: number) => void;
    onCommand: (command: string) => void;
}

const ManualControlPanel: React.FC<ManualControlPanelProps> = ({ onMove, onCommand }) => {
  const [command, setCommand] = useState('');
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleJoystickMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !joystickRef.current || !knobRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const size = rect.width;
    const halfSize = size / 2;
    
    let x = e.clientX - rect.left - halfSize;
    let y = e.clientY - rect.top - halfSize;
    
    const distance = Math.sqrt(x*x + y*y);
    const maxDistance = halfSize - knobRef.current.offsetWidth / 2;

    if (distance > maxDistance) {
        x = (x / distance) * maxDistance;
        y = (y / distance) * maxDistance;
    }

    knobRef.current.style.transform = `translate(${x}px, ${y}px)`;

    const dx = (x / maxDistance) * 0.5; // Scale down for fine control
    const dy = (-y / maxDistance) * 0.5; // Invert Y-axis
    onMove(dx, dy);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    if (knobRef.current) {
        knobRef.current.style.transform = 'translate(0px, 0px)';
    }
    window.removeEventListener('mousemove', handleJoystickMove as any);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    window.addEventListener('mousemove', handleJoystickMove as any);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
        onCommand(command);
        setCommand('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Override</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">Directional Control</h3>
          <div className="flex justify-center items-center py-4">
            <div 
              ref={joystickRef}
              className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center relative select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleJoystickMove}
            >
              <div ref={knobRef} style={{transition: !isDragging ? 'transform 0.1s ease-out' : 'none'}} className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-blue rounded-full cursor-grab active:cursor-grabbing shadow-lg"></div>
            </div>
          </div>
        </div>
        <div>
           <h3 className="font-semibold mb-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">Command Terminal</h3>
           <form onSubmit={handleCommandSubmit} className="flex space-x-2">
                <input 
                    type="text" 
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="e.g., diag --run all"
                    className="flex-grow bg-gray-100 dark:bg-gray-900 text-sm p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-blue focus:outline-none"
                />
                <button type="submit" className="bg-accent-blue text-white font-bold px-4 rounded hover:bg-blue-700 transition-colors text-sm">Send</button>
           </form>
        </div>
      </div>
    </Card>
  );
};

export default ManualControlPanel;