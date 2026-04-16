import { useState } from 'react';
import WordTestWorkflow from './WordTestWorkflow';
import TestConfiguration, { type MeaningSubType } from './TestConfiguration';

export default function WordTestTab() {
  const [testQty, setTestQty] = useState(30);
  const [testType, setTestType] = useState('Meaning to Word');
  const [meaningSub, setMeaningSub] = useState<MeaningSubType>('en');
  const [includeSynonyms, setIncludeSynonyms] = useState(true);
  const [isConfigEditing, setIsConfigEditing] = useState(false);

  return (
    <div className="grid grid-cols-13 gap-6">
      <div className="col-span-10">
        <WordTestWorkflow />
      </div>
      <div className="col-span-3">
        <TestConfiguration
          testQty={testQty}
          testType={testType}
          meaningSub={meaningSub}
          includeSynonyms={includeSynonyms}
          isEditing={isConfigEditing}
          onTestQtyChange={setTestQty}
          onTestTypeChange={setTestType}
          onMeaningSubChange={setMeaningSub}
          onIncludeSynonymsChange={setIncludeSynonyms}
          onEditingToggle={() => setIsConfigEditing((v) => !v)}
        />
      </div>
    </div>
  );
}
