export interface MissionFallback {
  number: number;
  title: string;
  summary: string;
  steps: string[];
  privacy: string;
}

export const missionFallbacks = {
  spotLie: {
    number: 1,
    title: 'Spot the Lie',
    summary: 'Find two pieces of misinformation and document how you checked each claim using trustworthy sources, context, and evidence.',
    steps: [
      'Choose two public claims, images, quotes, or videos that may be misleading.',
      'Check the original source, date, context, and at least one trustworthy independent source.',
      'Prepare screenshots or PDFs and numbered notes explaining what you found and how you verified it.',
    ],
    privacy: 'Remove names, account details, private messages, passwords, OTPs, ID numbers, and payment information before uploading evidence.',
  },
  scamAlert: {
    number: 2,
    title: 'Scam Alert',
    summary: 'Identify two scams or suspicious messages and explain the warning signs, what each message asks people to do, and how you checked it.',
    steps: [
      'Choose two public scam examples, suspicious links, fake offers, or impersonation messages.',
      'Record the urgency, payment request, sender mismatch, or unsafe link that raised concern.',
      'Prepare screenshots or PDFs and numbered notes describing your verification process.',
    ],
    privacy: 'Never upload live credentials, passwords, OTPs, payment details, ID numbers, or unedited private conversations.',
  },
  aiIntegrity: {
    number: 3,
    title: 'AI Integrity Check',
    summary: 'Investigate two AI-generated or AI-assisted misinformation examples and show why they are risky and how you verified them.',
    steps: [
      'Choose two public AI images, text outputs, fake sources, or deepfake claims.',
      'Identify whether the content is AI-generated, AI-assisted, or merely claimed to be AI.',
      'Prepare evidence and numbered notes comparing the claim with reliable sources or original context.',
    ],
    privacy: 'Do not upload private chats, harmful synthetic content, passwords, OTPs, identity documents, or another person’s private information.',
  },
  guardian: {
    number: 4,
    title: 'Digital Guardian',
    summary: 'Invite one to five people to complete the Onnoy course, support them without pressure, and submit a recognition claim afterward.',
    steps: [
      'Invite one to five people who may benefit from the course and explain that participation is optional.',
      'Let each person complete the learning activities using their own account and decisions.',
      'Submit your claim only after completion and provide contact details only with each person’s permission.',
    ],
    privacy: 'Ask permission before entering anyone’s name or contact information. Never submit passwords, OTPs, account access, or private messages.',
  },
} satisfies Record<string, MissionFallback>;