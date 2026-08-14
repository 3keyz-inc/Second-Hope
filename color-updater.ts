import fs from 'fs';
import path from 'path';

const filesToProcess = [
  'src/App.tsx',
  'src/components/ActionCenter.tsx',
  'src/components/ChrysalisProtocolVault.tsx',
  'src/components/DevStudio.tsx',
  'src/components/AutomatedResearchSystem.tsx',
  'src/components/SnowSquirrelTour.tsx',
  'src/components/TrinityNetwork.tsx',
  'src/components/BallisticArchives.tsx',
  'src/components/ClinicalTrialsTerminal.tsx',
];

function updateTheme(content: string): string {
  let result = content;
  
  // Make primary text darker blue
  result = result.replace(/text-slate-900/g, 'text-blue-950');
  result = result.replace(/text-slate-800/g, 'text-blue-900');
  result = result.replace(/text-slate-700/g, 'text-blue-800');
  result = result.replace(/text-slate-500/g, 'text-blue-700');
  result = result.replace(/text-slate-400/g, 'text-blue-600');
  
  // Make indigo darker for better contrast on light backgrounds
  result = result.replace(/text-indigo-500/g, 'text-indigo-800');
  result = result.replace(/text-indigo-400/g, 'text-indigo-700');
  result = result.replace(/text-indigo-300/g, 'text-indigo-600');
  
  return result;
}

filesToProcess.forEach(file => {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const newContent = updateTheme(content);
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
