'use client';

import { useState } from 'react';
import { Inspector } from 'react-dev-inspector';
import Modal from './modal';

interface InspectorInfo {
  componentName: string;
  filePath: string;
  lineNumber?: number;
  columnNumber?: number;
  lineContent?: string;
  componentText?: string;
}

export default function DevInspector() {
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inspectorInfo, setInspectorInfo] = useState<InspectorInfo | null>(null);
  const [aiQuery, setAiQuery] = useState('');

  const handleInspect = (info: any) => {
    // Add detailed logging
    console.log('Full inspector info:', info);
    
    const inspectorData: InspectorInfo = {
      componentName: info.codeInfo?.componentName || info.element.localName,
      componentText: info.element.innerText,
      filePath: info.codeInfo?.absolutePath || info.codeInfo?.relativePath || 'Unknown file path',
      lineNumber: info.codeInfo?.lineNumber,
      columnNumber: info.codeInfo?.columnNumber,
      lineContent: info.codeInfo?.lineContent
    };
    
    console.log('Final inspector data:', inspectorData);
    
    setInspectorInfo(inspectorData);
    setShowModal(true);
    setActive(false);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectorInfo || !aiQuery.trim()) {
      console.log('Inspector info or AI query is missing.');
      return;
    }

    const componentJsonInfo = JSON.stringify(inspectorInfo, null, 2);
    const userMessage = aiQuery;

    // Enhanced message for the AI
    const preamble = 
`You are an AI assistant helping a developer modify a React component file.
Based on the following context and user request, please provide the necessary code modifications.

--- COMPONENT CONTEXT ---
File Path: ${inspectorInfo.filePath}
Component Name: ${inspectorInfo.componentName}
Inspected At: Line ${inspectorInfo.lineNumber}, Column ${inspectorInfo.columnNumber}
Content of Inspected Line: ${inspectorInfo.lineContent || 'N/A'}
Displayed Text of Element: ${inspectorInfo.componentText || 'N/A'}

Additional details (full inspector data):
${componentJsonInfo}
--- END COMPONENT CONTEXT ---

--- USER MODIFICATION REQUEST ---
${userMessage}
--- END USER MODIFICATION REQUEST ---`;

    const combinedMessage = preamble;

    // Construct the dynamic URL
    const { protocol, hostname: rawHostname, port } = window.location;
    const hostname = rawHostname.replace('-preview', '');
    const agentChatUrl = `${protocol}//${hostname}${port ? ':' + port : ''}/agent/chat`;

    console.log('Sending to:', agentChatUrl, 'with message:', { message: combinedMessage });

    try {
      const response = await fetch(agentChatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: combinedMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Assuming the agent responds with JSON
      console.log('Response from /agent/chat:', result);
      // Here you might want to display the agent's response to the user

    } catch (error) {
      console.error('Error sending message to /agent/chat:', error);
      // Optionally, display an error message to the user
    }

    setAiQuery(''); // Clear the input field after sending
    setShowModal(false); // Close the modal
  };

  return (
    <>
      <Inspector 
        active={active} 
        onActiveChange={setActive}
        onClickElement={handleInspect}
      >
        <button
          onClick={() => setActive(true)}
          style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex: 10000,
            padding: '8px',
            backgroundColor: '#2D3748',
            color: 'white',
            borderRadius: '50%',
            border: '1px solid #4A5568',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
          }}
          title="Inspect Elements (DevTool)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 16.5L4 20M4 20L7.5 12.5M4 20H10.5M16.5 7.5L20 4M20 4L12.5 7.5M20 4V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </Inspector>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: 'black' }}>Ask AI</h3>
            <form onSubmit={handleAskAI} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask AI about this component..."
                className="placeholder-gray-500"
                style={{ 
                  color: 'black', 
                  padding: '12px 16px', 
                  border: '1px solid #D1D5DB', 
                  borderRadius: '12px', 
                  width: '100%', 
                  boxSizing: 'border-box',
                  fontSize: '1rem'
                }}
              />
              <button
                type="submit"
                style={{ 
                  backgroundColor: '#2563EB', 
                  color: 'white', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontWeight: '500', 
                  width: '100%', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.2s ease-in-out',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '1rem'
                }}
              >
                Ask AI
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}