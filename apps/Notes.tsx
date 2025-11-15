import React, { useState, useEffect } from 'react';
import { Note } from '../types';

export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      timestamp: Date.now(),
    };
    setActiveNote(newNote);
  };

  const handleSaveNote = () => {
    if (!activeNote) return;
    const existing = notes.find(n => n.id === activeNote.id);
    let newNotes;
    if (existing) {
      newNotes = notes.map(n => n.id === activeNote.id ? activeNote : n);
    } else {
      newNotes = [...notes, activeNote];
    }
    saveNotes(newNotes.sort((a, b) => b.timestamp - a.timestamp));
    setActiveNote(null);
  };

  const handleDeleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    saveNotes(newNotes);
    if(activeNote?.id === id) {
      setActiveNote(null);
    }
  };

  if (activeNote) {
    return (
      <div className="flex flex-col h-full bg-yellow-50">
        <header className="p-2 flex items-center justify-between border-b">
          <button onClick={handleSaveNote} className="px-4 py-1 text-blue-600 font-semibold">Done</button>
        </header>
        <textarea
          value={activeNote.content}
          onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value, timestamp: Date.now() })}
          className="flex-grow w-full p-4 bg-transparent text-lg focus:outline-none resize-none"
          placeholder="Start writing..."
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="p-4 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold">Notes</h1>
        <button onClick={handleNewNote} className="text-blue-600">New</button>
      </header>
      <div className="flex-grow overflow-y-auto">
        {notes.length === 0 ? (
           <p className="text-center text-gray-500 p-8">No notes yet.</p>
        ) : (
          <ul>
            {notes.map(note => (
              <li key={note.id} className="border-b">
                <button onClick={() => setActiveNote(note)} className="w-full text-left p-4">
                  <p className="font-semibold truncate">{note.content.split('\n')[0] || 'New Note'}</p>
                  <p className="text-sm text-gray-500">{new Date(note.timestamp).toLocaleDateString()}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};