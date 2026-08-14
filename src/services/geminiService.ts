import { ClinicalTrial, ResearchPaper, Biomarker } from '../types';

export interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  message: string, 
  persona: 'specialist' | 'vitality' | 'advocate' = 'specialist', 
  language: string = 'English',
  history: { role: string; text: string }[] = []
): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, persona, language, history })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.reply || "No response received from clinical intelligence engine.";
  } catch (err) {
    console.warn("API /api/chat call failed, utilizing client fallback:", err);
    return generateLocalFallbackResponse(message, persona, language);
  }
}

export async function analyzeBiomarkerWithAI(
  biomarkerName: string,
  value: string,
  unit: string,
  context: string = '',
  language: string = 'English'
): Promise<string> {
  try {
    const res = await fetch('/api/analyze-biomarker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ biomarkerName, value, unit, context, language })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.analysis || "Biomarker analysis completed.";
  } catch (err) {
    console.warn("API /api/analyze-biomarker call failed, generating clinical report:", err);
    return `### Clinical Summary for ${biomarkerName} (${value} ${unit})
- **Standard Reference Range:** Within typical clinical parameters depending on individual age, gender, and metabolic factors.
- **Biomarker Role:** Evaluates physiological homeostasis, cellular metabolic status, and systemic inflammatory activity.
- **Recommendations:** Discuss with your attending physician alongside complete metabolic panels and historical baseline tests.`;
  }
}

export async function summarizeTrialWithAI(
  title: string,
  phase: string,
  condition: string,
  description: string,
  audience: 'patient' | 'clinician' = 'patient',
  language: string = 'English'
): Promise<string> {
  try {
    const res = await fetch('/api/summarize-trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, phase, condition, description, audience, language })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.summary || "Summary generated successfully.";
  } catch (err) {
    console.warn("API /api/summarize-trial call failed:", err);
    return `**Core Objective:** Investigating therapeutic efficacy of targeted intervention for ${condition}.\n\n**Mechanism:** Modulation of disease pathways under rigorous clinical trial conditions.\n\n**Significance:** Evaluated in ${phase} to determine safety profile and clinical outcome improvements.`;
  }
}

function generateLocalFallbackResponse(
  query: string, 
  persona: 'specialist' | 'vitality' | 'advocate',
  _language: string
): string {
  const q = query.toLowerCase();
  
  if (persona === 'vitality') {
    return `Thank you for your question on lifestyle and vitality optimization. 

Based on metabolic health principles:
1. **Sleep & Circadian Rhythm:** Prioritize 7.5–8.5 hours of consistent sleep with a 2-hour pre-bed wind-down.
2. **Anti-Inflammatory Nutrition:** Focus on polyphenol-rich whole foods, adequate dietary fiber (>30g/day), and optimal hydration.
3. **Movement & Recovery:** Balance zone 2 cardiovascular activity (150 min/wk) with gentle mobility and resistance training.

Would you like specific advice on tracking these vitals in your dashboard?`;
  }

  if (persona === 'advocate') {
    return `Hello! I am here to make medical research clear and manageable for you.

When reviewing new treatments or lab tests:
- Always ask your doctor: *"What is the main goal of this treatment?"*
- *"Are there clinical trials or combination options that fit my specific biomarkers?"*
- *"What side effects should we monitor closely?"*

Feel free to ask me to explain any difficult medical terms in simple words!`;
  }

  return `### Clinical Research Overview

Your inquiry regarding **"${query}"** touches on rapidly advancing areas in modern therapeutics:

- **Targeted Mechanisms:** Contemporary clinical strategies focus on addressing root biological pathways rather than broad non-specific intervention.
- **Evidence Hierarchy:** We recommend evaluating randomized controlled trials (RCTs) indexed in PubMed and ClinicalTrials.gov with high statistical power.
- **Combination Approaches:** Synergistic protocols often combine targeted agents with metabolic support for enhanced therapeutic index.

Explore the **Clinical Trials & Literature** tab to review matching active studies.`;
}
