/**
 * Onnoy (অন্বয়) - Multi-Course Data & Storage Engine
 * Supports multiple courses (AI Acknowledgement, Digital Safety, etc.)
 * Each course has its own video lessons, 5 timestamped questions per video,
 * independent progress tracking, and verified certificates.
 */

const ONNOY_COURSE_STORAGE = {
  STUDENT_KEY: 'onnoy_course_student',
  ACTIVE_COURSE_KEY: 'onnoy_active_course_id',
  PROGRESS_PREFIX: 'onnoy_progress_',
  CERT_PREFIX: 'onnoy_cert_'
};

/**
 * Course Registry
 */
const ONNOY_COURSES = {
  'ai-acknowledgement': {
    id: 'ai-acknowledgement',
    title: 'AI Acknowledgement & Literacy Course',
    titleBn: 'এআই পরিচিতি ও সচেতনতা কোর্স (AI Acknowledgement)',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLb71XEVSg6VY',
    badge: '⭐ New · 7 Video Lessons',
    summary: 'Master the fundamental working mechanics of Artificial Intelligence: CPU vs GPU, AI Agents, Context Windows, RAG, Hallucinations, LLM Training, and Transformers.',
    certificateIssuer: 'Onnoy — অন্বয় Foundation',
    certificateLocation: 'Mymensingh, Bangladesh',
    lessons: [
      {
        id: 'ai-lesson-1',
        lessonNumber: 1,
        title: 'AI চালাতে কেন গ্রাফিক্স কার্ড লাগে? (CPU vs GPU)',
        titleBn: 'Why AI Needs Graphic Cards (CPU vs GPU)',
        videoId: 'OC44fRxkIX4',
        duration: '06:30',
        summary: 'Understand why Artificial Intelligence algorithms require massive parallel matrix operations best handled by GPU cores rather than sequential CPUs.',
        questions: [
          {
            id: 'ai1_q1',
            question: 'What is the primary architectural difference between a CPU and a GPU when processing AI models?',
            questionBn: 'AI মডেল প্রসেসিংয়ে CPU এবং GPU-এর মধ্যে প্রধান পার্থক্য কী?',
            options: [
              'CPU has a few powerful sequential cores; GPU has thousands of smaller parallel cores designed for simultaneous tasks',
              'CPU only operates with text files while GPU only displays computer monitors',
              'CPU requires water cooling whereas GPU requires no electricity',
              'There is no architectural difference between them'
            ],
            correctAnswer: 0,
            timestamp: 30,
            timestampLabel: '00:30',
            explanation: 'CPUs excel at complex sequential logic with a few fast cores, while GPUs contain thousands of cores that compute massive parallel math simultaneously.'
          },
          {
            id: 'ai1_q2',
            question: 'Why do neural network forward and backward passes rely heavily on matrix multiplication?',
            questionBn: 'নিউরাল নেটওয়ার্কের গণনায় ম্যাট্রিক্স মাল্টিপ্লিকেশন (Matrix Multiplication) কেন এত বেশি প্রয়োজন?',
            options: [
              'Because audio sound cards cannot read code',
              'Because millions of artificial neural connections and weights are mathematically structured as large numeric matrices',
              'Because computer monitors cannot render curved lines',
              'Because Python programming language only recognizes tables'
            ],
            correctAnswer: 1,
            timestamp: 80,
            timestampLabel: '01:20',
            explanation: 'Weights and activations in neural networks are stored as high-dimensional matrices; computing predictions requires multiplying these massive matrices.'
          },
          {
            id: 'ai1_q3',
            question: 'What critical role does GPU Video Memory (VRAM) play when running Large Language Models (LLMs)?',
            questionBn: 'লার্জ ল্যাঙ্গুয়েজ মডেল (LLM) চালানোর ক্ষেত্রে GPU-এর VRAM-এর ভূমিকা কী?',
            options: [
              'It stores the billions of model parameters (weights) directly on ultra-fast memory for immediate computation',
              'It increases internet download bandwidth automatically',
              'It permanently saves every YouTube video in your history',
              'It acts as an external keyboard buffer'
            ],
            correctAnswer: 0,
            timestamp: 165,
            timestampLabel: '02:45',
            explanation: 'To generate tokens fast, the model parameters must fit in ultra-fast GPU VRAM so tensor cores do not stall waiting on slower system RAM.'
          },
          {
            id: 'ai1_q4',
            question: 'What software ecosystem contributed significantly to NVIDIA’s leadership in AI hardware?',
            questionBn: 'AI হার্ডওয়্যারে এনভিডিয়া (NVIDIA)-এর আধিপত্যের পেছনে কোন সফটওয়্যার প্ল্যাটফর্মের অবদান সবচেয়ে বেশি?',
            options: [
              'CUDA (Compute Unified Device Architecture)',
              'Microsoft Paint',
              'Flash Player',
              'DirectX 9'
            ],
            correctAnswer: 0,
            timestamp: 230,
            timestampLabel: '03:50',
            explanation: 'NVIDIA developed CUDA in 2006, allowing developers to write general-purpose GPU math easily, establishing the foundation for modern AI libraries like PyTorch.'
          },
          {
            id: 'ai1_q5',
            question: 'Can a standard computer CPU run an AI model without a dedicated GPU?',
            questionBn: 'একটি সাধারণ কম্পিউটার CPU কি ডেডিকেটেড GPU ছাড়া কোনো AI মডেল চালাতে পারে?',
            options: [
              'No, CPUs physically cannot execute any AI code',
              'Yes, but processing and token generation will generally be significantly slower than on a modern GPU',
              'Yes, and it is always faster than any GPU',
              'Only if the computer is disconnected from the internet'
            ],
            correctAnswer: 1,
            timestamp: 280,
            timestampLabel: '04:40',
            explanation: 'CPUs can perform inference (e.g. using quantized models via llama.cpp), but they lack the massive parallelism needed for high-speed generation.'
          }
        ]
      },
      {
        id: 'ai-lesson-2',
        lessonNumber: 2,
        title: 'চ্যাটবটের দিন শেষ: কেন ২০২৬ সাল AI এজেন্টের? (Chatbot vs AI Agent)',
        titleBn: 'The Era of AI Agents (Chatbot vs Autonomous Agent)',
        videoId: '0kQ63my2ifQ',
        duration: '07:15',
        summary: 'Discover the shift from passive text responders to autonomous AI agents that plan, reason, invoke software tools, and execute workflows.',
        questions: [
          {
            id: 'ai2_q1',
            question: 'How does an autonomous AI Agent differ from a traditional conversational chatbot?',
            questionBn: 'একটি অটোনোমাস এআই এজেন্ট (AI Agent) সাধারণ চ্যাটবট থেকে কীভাবে আলাদা?',
            options: [
              'An AI Agent can independently plan, execute multi-step actions, and use external software tools to accomplish a goal',
              'A chatbot speaks with human voice while an agent can only print text',
              'Chatbots use electricity while agents do not',
              'There is no technical difference between them'
            ],
            correctAnswer: 0,
            timestamp: 35,
            timestampLabel: '00:35',
            explanation: 'Traditional chatbots only produce text responses. AI Agents receive high-level goals, break them down, and execute actions via APIs and tools.'
          },
          {
            id: 'ai2_q2',
            question: 'What capability enables an AI agent to query databases, check weather, or book tickets?',
            questionBn: 'এআই এজেন্টকে বাহ্যিক ডেটাবেজ ব্রাউজ বা টিকিট কাটার মতো কাজ করার সুযোগ দেয় কোনটি?',
            options: [
              'Function Calling and Tool Integration APIs',
              'Increasing the font size of the prompt',
              'Overclocking the computer monitor',
              'Sending an email to OpenAI staff'
            ],
            correctAnswer: 0,
            timestamp: 90,
            timestampLabel: '01:30',
            explanation: 'Function calling allows the model to output structured JSON instructing an external program to execute real-world tasks and return the result.'
          },
          {
            id: 'ai2_q3',
            question: 'What is the "Planning and Reasoning Loop" in an AI agent workflow?',
            questionBn: 'এআই এজেন্টের "প্ল্যানিং ও রিজনিং লুপ" বলতে কী বোঝায়?',
            options: [
              'The process of decomposing a large objective into sequential sub-tasks, observing results, and self-correcting',
              'Restarting the computer after every question',
              'Writing the response in alphabetical order',
              'Asking the user to rewrite their operating system'
            ],
            correctAnswer: 0,
            timestamp: 160,
            timestampLabel: '02:40',
            explanation: 'Agents use loops (like ReAct: Reason + Act) to think, execute a step, observe the output, and iteratively adjust course until the goal is met.'
          },
          {
            id: 'ai2_q4',
            question: 'What does "Human-in-the-Loop" (HITL) ensure in agentic systems?',
            questionBn: 'এআই এজেন্টের ক্ষেত্রে "Human-in-the-Loop" কী নিশ্চিত করে?',
            options: [
              'Critical, risky, or irreversible actions (like payments or deleting data) require explicit human approval before execution',
              'Humans must type every token by hand',
              'The AI must speak to five people every day',
              'The agent cannot use machine learning'
            ],
            correctAnswer: 0,
            timestamp: 235,
            timestampLabel: '03:55',
            explanation: 'Human-in-the-loop provides crucial safety guardrails, pausing execution so human operators can review sensitive actions before execution.'
          },
          {
            id: 'ai2_q5',
            question: 'Why are AI agents considered a massive leap in digital productivity?',
            questionBn: 'এআই এজেন্টকে উৎপাদনশীলতার ক্ষেত্রে কেন এক বিশাল বিপ্লব মনে করা হয়?',
            options: [
              'Because they automate end-to-end multi-step tasks rather than just drafting raw text',
              'Because they make computers use zero internet data',
              'Because they replace physical electricity with software',
              'Because they make all website links free'
            ],
            correctAnswer: 0,
            timestamp: 310,
            timestampLabel: '05:10',
            explanation: 'Instead of having a human manually copy-paste between five apps, an agent can autonomously gather data, analyze it, and publish the final result.'
          }
        ]
      },
      {
        id: 'ai-lesson-3',
        lessonNumber: 3,
        title: 'ChatGPT কেন পুরোনো চ্যাট ভুলে যায়? (Context Window-এর আসল সত্য)',
        titleBn: 'Why ChatGPT Forgets Context (The Truth of Context Windows)',
        videoId: 'jJXGIcLaSHE',
        duration: '06:00',
        summary: 'Demystify context windows, token limits, statelessness, and why long conversations cause models to forget earlier points.',
        questions: [
          {
            id: 'ai3_q1',
            question: 'What is the "Context Window" of an AI language model?',
            questionBn: 'এআই ল্যাঙ্গুয়েজ মডেলের "কনটেক্সট উইন্ডো" (Context Window) কী?',
            options: [
              'The maximum amount of text (tokens) the model can read and process simultaneously in a single prompt and response',
              'The glass window in a server room',
              'The size of the browser window on your screen',
              'The number of tabs you have open in Chrome'
            ],
            correctAnswer: 0,
            timestamp: 30,
            timestampLabel: '00:30',
            explanation: 'The context window defines the maximum token capacity (input + output) that an LLM can pay attention to during any single inference step.'
          },
          {
            id: 'ai3_q2',
            question: 'What unit of measurement do language models use to count text length?',
            questionBn: 'ল্যাঙ্গুয়েজ মডেল টেক্সটের দৈর্ঘ্য পরিমাপে কোন একক ব্যবহার করে?',
            options: [
              'Tokens (sub-word units representing fragments of words, characters, or syllables)',
              'Centimeters',
              'Megabytes only',
              'Pounds'
            ],
            correctAnswer: 0,
            timestamp: 85,
            timestampLabel: '01:25',
            explanation: 'Models process text as tokens; in English, 1 token is roughly 4 characters or 0.75 words, while Bengali words may be split into multiple sub-tokens.'
          },
          {
            id: 'ai3_q3',
            question: 'What happens when an ongoing conversation exceeds the model’s context window limit?',
            questionBn: 'চলমান কথোপকথন যখন মডেলের কনটেক্সট উইন্ডোর সীমা অতিক্রম করে তখন কী ঘটে?',
            options: [
              'The system truncates or drops the oldest messages to make room for new ones, causing the model to "forget" earlier details',
              'The computer immediately shuts down',
              'The model starts speaking backwards',
              'Your internet subscription is canceled'
            ],
            correctAnswer: 0,
            timestamp: 150,
            timestampLabel: '02:30',
            explanation: 'Chat systems use sliding window truncation or compression: older context falls off the beginning of the prompt window to stay within token limits.'
          },
          {
            id: 'ai3_q4',
            question: 'Does a standard LLM naturally maintain permanent memory between separate new chats?',
            questionBn: 'একটি সাধারণ LLM কি স্বয়ংক্রিয়ভাবে দুটি ভিন্ন চ্যাটের মাঝে স্থায়ী স্মৃতি মনে রাখে?',
            options: [
              'No, standard LLMs are fundamentally stateless; each request is calculated anew from the provided prompt',
              'Yes, it saves every thought in your computer hard drive BIOS',
              'Yes, all LLMs share one single human brain',
              'Only on weekends'
            ],
            correctAnswer: 0,
            timestamp: 220,
            timestampLabel: '03:40',
            explanation: 'LLMs are stateless mathematical functions. Unless an external database stores memory and re-inserts it into the prompt, the model has no recollection.'
          },
          {
            id: 'ai3_q5',
            question: 'Why is dramatically increasing the context window computationally expensive?',
            questionBn: 'কনটেক্সট উইন্ডো অনেক বড় করা কেন কম্পিউটেশনালভাবে অত্যন্ত ব্যয়বহুল?',
            options: [
              'Standard self-attention mechanisms scale quadratically: doubling context quadruples computational and memory requirements',
              'Because internet cables melt with long words',
              'Because monitors cannot render more than 10 lines of text',
              'Because Unicode characters take physical space'
            ],
            correctAnswer: 0,
            timestamp: 275,
            timestampLabel: '04:35',
            explanation: 'Traditional Transformer self-attention compares every token with every other token, meaning computation and memory grow with O(N^2).'
          }
        ]
      },
      {
        id: 'ai-lesson-4',
        lessonNumber: 4,
        title: 'ChatGPT ইন্টারনেটের রিয়েল-টাইম তথ্য কীভাবে পায়? (Tools ও RAG মেকানিজম)',
        titleBn: 'Real-Time Web Data in AI (Tools & RAG Mechanisms)',
        videoId: 'IZJZTSo-pBA',
        duration: '06:45',
        summary: 'Learn how Retrieval-Augmented Generation (RAG) and search tools connect frozen LLMs with up-to-date factual information.',
        questions: [
          {
            id: 'ai4_q1',
            question: 'What does the acronym RAG stand for in AI engineering?',
            questionBn: 'এআই ইঞ্জিনিয়ারিংয়ে RAG-এর পূর্ণরূপ কী?',
            options: [
              'Retrieval-Augmented Generation',
              'Random Automatic Graphing',
              'Recursive Algorithm Gateway',
              'Rapid Artificial Generalization'
            ],
            correctAnswer: 0,
            timestamp: 30,
            timestampLabel: '00:30',
            explanation: 'RAG stands for Retrieval-Augmented Generation: retrieving external factual data and augmenting the prompt given to the generation model.'
          },
          {
            id: 'ai4_q2',
            question: 'Why can’t a standalone base LLM know today’s news or weather on its own?',
            questionBn: 'একটি বেস LLM নিজে থেকে আজকের তাজা খবর বা আবহাওয়া কেন জানতে পারে না?',
            options: [
              'Because its training was completed in the past and has a fixed knowledge cutoff date',
              'Because AI is forbidden from reading newspapers by law',
              'Because weather forecasts cannot be converted to numbers',
              'Because AI only works at night'
            ],
            correctAnswer: 0,
            timestamp: 80,
            timestampLabel: '01:20',
            explanation: 'Base models only know the data they were trained on up to their cutoff date; without live search tools, they cannot know recent events.'
          },
          {
            id: 'ai4_q3',
            question: 'What is the role of Vector Embeddings in a RAG system?',
            questionBn: 'RAG সিস্টেমে ভেক্টর এমবেডিংস (Vector Embeddings)-এর ভূমিকা কী?',
            options: [
              'Converting text into mathematical coordinates so semantic meaning and similarity can be searched instantly',
              'Compressing video files into MP3 format',
              'Translating English words into Roman numerals',
              'Protecting passwords from hackers'
            ],
            correctAnswer: 0,
            timestamp: 155,
            timestampLabel: '02:35',
            explanation: 'Embeddings convert text into high-dimensional vectors, allowing semantic search to find passages that share conceptual meaning, even with different phrasing.'
          },
          {
            id: 'ai4_q4',
            question: 'How does an AI system ground its answer when using internet search?',
            questionBn: 'ইন্টারনেট সার্চ ব্যবহার করার সময় এআই কীভাবে তার উত্তর তথ্যনির্ভর করে?',
            options: [
              'It searches web queries, extracts top snippet passages, and places them into the prompt as factual reference context',
              'It retrains the entire model weights from scratch in 2 seconds',
              'It asks another student on Facebook',
              'It guesses based on random numbers'
            ],
            correctAnswer: 0,
            timestamp: 225,
            timestampLabel: '03:45',
            explanation: 'The system runs a search query, retrieves factual articles, injects them into the prompt, and directs the model to summarize those retrieved sources.'
          },
          {
            id: 'ai4_q5',
            question: 'Why is RAG preferred over constantly retraining foundation models with new company documents?',
            questionBn: 'নতুন তথ্যের জন্য পুরো মডেল পুনরায় ট্রেইনিং না করে RAG পদ্ধতি কেন বেশি পছন্দনীয়?',
            options: [
              'RAG is drastically cheaper, faster, updates instantly, and provides direct source citations',
              'Retraining a model takes only 5 seconds on a smartphone',
              'RAG completely eliminates the need for electricity',
              'Foundation models are deleted after one use'
            ],
            correctAnswer: 0,
            timestamp: 290,
            timestampLabel: '04:50',
            explanation: 'Retraining foundation models costs millions of dollars and weeks of compute. RAG updates knowledge dynamically in milliseconds for fractions of a cent.'
          }
        ]
      },
      {
        id: 'ai-lesson-5',
        lessonNumber: 5,
        title: 'ChatGPT এত আত্মবিশ্বাসের সাথে বানিয়ে বানিয়ে মিথ্যা বলে কেন? (AI Hallucinations)',
        titleBn: 'Understanding AI Hallucinations & Fabrications',
        videoId: '1MKVLqUY298',
        duration: '06:15',
        summary: 'Analyze why language models generate confident untruths, how probabilistic text prediction works, and how students can verify AI claims.',
        questions: [
          {
            id: 'ai5_q1',
            question: 'What is an "AI Hallucination"?',
            questionBn: 'এআই হ্যালুসিনেশন (AI Hallucination) বলতে কী বোঝায়?',
            options: [
              'When an AI generates fabricated, inaccurate, or non-existent facts with high persuasive confidence',
              'When an AI screen flickers with colorful lights',
              'When an AI model refuses to speak in English',
              'When the computer battery drains quickly'
            ],
            correctAnswer: 0,
            timestamp: 35,
            timestampLabel: '00:35',
            explanation: 'Hallucination occurs when an AI outputs believable, grammatically sound text that is factually false, invented, or misleading.'
          },
          {
            id: 'ai5_q2',
            question: 'Why do LLMs hallucinate instead of simply looking up verified truths?',
            questionBn: 'সত্য যাচাই না করে LLM কেন তথ্য বানিয়ে বলে?',
            options: [
              'Because they are statistical engines trained to predict probable next words, not databases of verified facts',
              'Because they are programmed to deliberately deceive human users',
              'Because their computer processors get confused by questions',
              'Because they run out of internet data'
            ],
            correctAnswer: 0,
            timestamp: 90,
            timestampLabel: '01:30',
            explanation: 'LLMs generate text by estimating what word is most statistically plausible in context; they have no inherent sense of truth or reality.'
          },
          {
            id: 'ai5_q3',
            question: 'Why can an AI hallucination sound so convincing to readers?',
            questionBn: 'এআই-এর বানিয়ে বলা মিথ্যা কেন পাঠকের কাছে এত বিশ্বাসযোগ্য মনে হয়?',
            options: [
              'Because it is trained on polished, authoritative human writing styles and uses confident grammatical structure',
              'Because it speaks in a robotic sound',
              'Because false information is always printed in red ink',
              'Because teachers endorse everything on the internet'
            ],
            correctAnswer: 0,
            timestamp: 160,
            timestampLabel: '02:40',
            explanation: 'Models mimic the tone of encyclopedias, textbooks, and scholarly papers, making fabrications sound just as authoritative as truth.'
          },
          {
            id: 'ai5_q4',
            question: 'Which prompting technique helps reduce the likelihood of hallucination?',
            questionBn: 'কোন প্রম্পট টেকনিক এআই হ্যালুসিনেশন কমাতে সাহায্য করে?',
            options: [
              'Explicitly instructing: "Answer only based on the provided text. If you do not know, say I do not know"',
              'Typing the prompt entirely in CAPITAL letters',
              'Adding 10 exclamation marks after every question',
              'Promising to give the AI money'
            ],
            correctAnswer: 0,
            timestamp: 230,
            timestampLabel: '03:50',
            explanation: 'Giving the model explicit permission to decline answering and providing reference text grounds its output directly.'
          },
          {
            id: 'ai5_q5',
            question: 'What is the golden rule for students using AI for homework or academic assignments?',
            questionBn: 'পড়াশোনা ও গবেষণায় এআই ব্যবহারের ক্ষেত্রে শিক্ষার্থীদের প্রধান নিয়ম কী?',
            options: [
              'Never blindly trust citations or claims; always verify sources with primary textbooks or credible publications',
              'Copy and paste everything directly without reading',
              'Assume that whatever ChatGPT prints is 100% verified by scientists',
              'Delete all school textbooks'
            ],
            correctAnswer: 0,
            timestamp: 285,
            timestampLabel: '04:45',
            explanation: 'Responsible digital students treat AI as a drafting assistant, verifying every factual claim, calculation, and citation independently.'
          }
        ]
      },
      {
        id: 'ai-lesson-6',
        lessonNumber: 6,
        title: 'AI কি আসলেই কিছু শেখে, নাকি অন্ধের মতো মুখস্থ করে? (LLM Training ও RLHF)',
        titleBn: 'How LLMs Learn: Pre-Training vs RLHF Alignment',
        videoId: 'hNPmKPBbWq8',
        duration: '07:00',
        summary: 'Explore the two primary phases of AI creation: self-supervised pre-training on web corpora and Reinforcement Learning from Human Feedback (RLHF).',
        questions: [
          {
            id: 'ai6_q1',
            question: 'What is the primary objective of the "Pre-Training" phase of an LLM?',
            questionBn: 'একটি LLM-এর "প্রি-ট্রেইনিং" (Pre-Training) পর্যায়ের প্রধান লক্ষ্য কী?',
            options: [
              'Learning grammar, facts, reasoning patterns, and world knowledge by predicting the next token across massive text datasets',
              'Teaching the model how to format Word documents',
              'Installing antivirus software on the server',
              'Setting up user passwords'
            ],
            correctAnswer: 0,
            timestamp: 40,
            timestampLabel: '00:40',
            explanation: 'During pre-training, the model processes trillions of words, learning syntactic, semantic, and reasoning patterns through next-word prediction.'
          },
          {
            id: 'ai6_q2',
            question: 'What does RLHF stand for in modern AI development?',
            questionBn: 'আধুনিক এআই উন্নয়নে RLHF-এর পূর্ণরূপ কী?',
            options: [
              'Reinforcement Learning from Human Feedback',
              'Recursive Logic for Hardware Facilities',
              'Randomized Language High Frequency',
              'Rotational Learning in Human Foundations'
            ],
            correctAnswer: 0,
            timestamp: 105,
            timestampLabel: '01:45',
            explanation: 'RLHF stands for Reinforcement Learning from Human Feedback: training a reward model based on human ratings to steer model behavior.'
          },
          {
            id: 'ai6_q3',
            question: 'Does an LLM store compressed literal copies of web pages like a ZIP archive?',
            questionBn: 'একটি LLM কি ইন্টারনেটের ওয়েব পেজগুলোর জিপ (ZIP) ফাইলের মতো হুবহু কপি সংরক্ষণ করে?',
            options: [
              'No, it adjusts numerical neural network weights representing abstract statistical relationships and concepts',
              'Yes, it saves every single webpage as a PDF file inside its memory',
              'Yes, it is identical to Google Drive',
              'No, it only stores pictures'
            ],
            correctAnswer: 0,
            timestamp: 170,
            timestampLabel: '02:50',
            explanation: 'Models do not store text documents; they encode associations and syntactic patterns across billions of numerical weight parameters.'
          },
          {
            id: 'ai6_q4',
            question: 'Why is RLHF necessary after initial pre-training is complete?',
            questionBn: 'প্রি-ট্রেইনিং শেষ হওয়ার পর RLHF কেন অপরিহার্য?',
            options: [
              'Because raw pre-trained models can be toxic, unhelpful, or continue rambling; RLHF aligns them to be helpful and safe assistants',
              'To speed up CPU clock speeds by 50%',
              'To delete all foreign languages from the model',
              'To convert the model into a physical robot'
            ],
            correctAnswer: 0,
            timestamp: 240,
            timestampLabel: '04:00',
            explanation: 'Pre-training produces an unruly document predictor; RLHF aligns it to follow instructions respectfully, decline harmful prompts, and be concise.'
          },
          {
            id: 'ai6_q5',
            question: 'What is "Generalization" in deep learning?',
            questionBn: 'ডিপ লার্নিংয়ে "জেনারেলাইজেশন" (Generalization) বলতে কী বোঝায়?',
            options: [
              'The capacity to correctly answer novel, unseen prompts by applying underlying learned patterns rather than mere rote memorization',
              'Writing answers in general non-specific words',
              'Translating all responses into Latin',
              'Shutting down the program when an error occurs'
            ],
            correctAnswer: 0,
            timestamp: 315,
            timestampLabel: '05:15',
            explanation: 'Generalization means the model has learned the underlying structure of tasks, enabling it to solve brand-new questions it never saw during training.'
          }
        ]
      },
      {
        id: 'ai-lesson-7',
        lessonNumber: 7,
        title: 'ChatGPT কীভাবে পরের শব্দ আন্দাজ করে? (Transformer ও Attention মেকানিজম)',
        titleBn: 'How Transformers Predict the Next Word (Self-Attention)',
        videoId: 'NgB4jPe5hh0',
        duration: '07:30',
        summary: 'Understand the landmark Transformer architecture, self-attention mechanisms, token probabilities, and temperature controls.',
        questions: [
          {
            id: 'ai7_q1',
            question: 'What breakthrough paper published in 2017 introduced the Transformer architecture?',
            questionBn: '২০১৭ সালে কোন যুগান্তকারী গবেষণাপত্রে ট্রান্সফরমার আর্কিটেকচার প্রথম উন্মোচিত হয়?',
            options: [
              '"Attention Is All You Need" (by Vaswani et al.)',
              '"Deep Residual Learning for Image Recognition"',
              '"Computing Machinery and Intelligence by Alan Turing"',
              '"The Master Algorithm"'
            ],
            correctAnswer: 0,
            timestamp: 35,
            timestampLabel: '00:35',
            explanation: 'The paper "Attention Is All You Need" by Google researchers revolutionized AI by replacing recurrent neural networks with pure self-attention.'
          },
          {
            id: 'ai7_q2',
            question: 'What does the "Self-Attention" mechanism calculate inside a Transformer layer?',
            questionBn: 'ট্রান্সফরমার লেয়ারে "সেলফ-অ্যাটেনশন" (Self-Attention) মেকানিজম কী হিসাব করে?',
            options: [
              'How strongly each token in a sentence relates to every other token, capturing context and ambiguous references',
              'The electrical voltage of the GPU fan',
              'The grammatical spelling mistakes made by the user',
              'The physical distance to the data center'
            ],
            correctAnswer: 0,
            timestamp: 100,
            timestampLabel: '01:40',
            explanation: 'Self-attention assigns dynamic weights between words, helping the model understand what "it" refers to in "The animal did not cross the street because it was too tired".'
          },
          {
            id: 'ai7_q3',
            question: 'How does an LLM select the next token during text generation?',
            questionBn: 'টেক্সট জেনারেশনের সময় LLM কীভাবে পরের টোকেনটি বেছে নেয়?',
            options: [
              'It computes a probability distribution (via Softmax) across its entire vocabulary and samples according to generation settings',
              'It selects the first word in the dictionary alphabetically',
              'It searches Google and picks the first sentence',
              'It rolls a physical 6-sided dice'
            ],
            correctAnswer: 0,
            timestamp: 175,
            timestampLabel: '02:55',
            explanation: 'The final layer outputs logits converted to probabilities via Softmax over 50,000+ vocabulary tokens, from which the next token is sampled.'
          },
          {
            id: 'ai7_q4',
            question: 'What happens when you adjust the "Temperature" setting of a language model to a lower value (e.g. 0.1)?',
            questionBn: 'ল্যাঙ্গুয়েজ মডেলের "Temperature" সেটিংস কমিয়ে দিলে (যেমন ০.১) কী ঘটে?',
            options: [
              'The outputs become much more deterministic, focused, and predictable by favoring top probable tokens',
              'The computer cooling fan spins slower',
              'The model outputs random poetry',
              'The font color turns blue'
            ],
            correctAnswer: 0,
            timestamp: 250,
            timestampLabel: '04:10',
            explanation: 'Lower temperature concentrates probability on the most likely tokens (ideal for coding/math), while higher temperature flattens it for creativity.'
          },
          {
            id: 'ai7_q5',
            question: 'Does the Transformer architecture possess human conscious intent or subjective feeling?',
            questionBn: 'ট্রান্সফরমার আর্কিটেকচারের কি মানুষের মতো চেতনা বা নিজস্ব অনুভূতি রয়েছে?',
            options: [
              'No, it is a sophisticated mathematical function that maps input token patterns to output token probability distributions',
              'Yes, it feels emotions whenever someone speaks kindly to it',
              'Yes, it dreams when the server is powered off',
              'Only models trained on creative writing have feelings'
            ],
            correctAnswer: 0,
            timestamp: 330,
            timestampLabel: '05:30',
            explanation: 'AI models are non-sentient computational algorithms optimizing mathematical representations without consciousness or personal understanding.'
          }
        ]
      }
    ]
  },

  'digital-safety': {
    id: 'digital-safety',
    title: 'Digital Responsibility & Cyber Safety Course',
    titleBn: 'ডিজিটাল দায়িত্বশীলতা ও সাইবার সুরক্ষা কোর্স',
    playlistUrl: '',
    badge: '⭐ 5 Video Lessons',
    summary: 'Essential digital citizenship, password safety, phishing detection, misinformation fact-checking, and Bangladeshi cyber laws.',
    certificateIssuer: 'Onnoy — অন্বয় Foundation',
    certificateLocation: 'Mymensingh, Bangladesh',
    lessons: [
      {
        id: 'ds-lesson-1',
        lessonNumber: 1,
        title: 'Understanding Digital Footprints & Online Identity',
        titleBn: 'ডিজিটাল পদচিহ্ন ও অনলাইন পরিচয় পরিচিতি',
        videoId: 'yrln8nyVBLU',
        duration: '04:15',
        summary: 'Discover what a digital footprint is, how permanent online actions are, and how students can protect their reputation.',
        questions: [
          {
            id: 'ds1_q1',
            question: 'What constitutes your "digital footprint"?',
            questionBn: 'আপনার "ডিজিটাল পদচিহ্ন" বলতে কী বোঝায়?',
            options: [
              'The brand of smartphone or computer you own',
              'The trail of data and information you leave behind when using the internet',
              'The physical distance you travel with a device',
              'Only the files you permanently delete'
            ],
            correctAnswer: 1,
            timestamp: 25,
            timestampLabel: '00:25',
            explanation: 'Your digital footprint consists of all online activities, comments, posts, searches, and app records you create over time.'
          },
          {
            id: 'ds1_q2',
            question: 'Can content you delete online always be completely erased?',
            questionBn: 'অনলাইন থেকে মুছে ফেলা পোস্ট বা কনটেন্ট কি সবসময় চিরতরে মুছে যায়?',
            options: [
              'Yes, once you click delete, nobody can ever retrieve or view it',
              'No, screenshots, archives, and server logs may keep copies permanently',
              'Yes, but only if you delete it within 1 hour',
              'No, but it only stays on your own screen'
            ],
            correctAnswer: 1,
            timestamp: 85,
            timestampLabel: '01:25',
            explanation: 'Online posts can easily be screenshot, forwarded, scraped, or saved on servers before you have a chance to delete them.'
          },
          {
            id: 'ds1_q3',
            question: 'Which of the following is considered an "active" digital footprint?',
            questionBn: 'নিচের কোনটি একটি "সক্রিয়" (Active) ডিজিটাল পদচিহ্ন?',
            options: [
              'Websites collecting your IP address in background logs',
              'Cookies tracking your browsing history without interaction',
              'A photo or comment you intentionally publish on social media',
              'Search engines caching your general city location'
            ],
            correctAnswer: 2,
            timestamp: 135,
            timestampLabel: '02:15',
            explanation: 'Active footprints are created when you deliberately share information such as social media posts, comments, or emails.'
          },
          {
            id: 'ds1_q4',
            question: 'Why should students be mindful of their digital footprint for the future?',
            questionBn: 'ভবিষ্যতের জন্য শিক্ষার্থীদের ডিজিটাল পদচিহ্ন সম্পর্কে কেন সতর্ক থাকা উচিত?',
            options: [
              'Colleges, scholarship boards, and employers often review public online activity',
              'Having any online presence will block you from taking board exams',
              'Internet service providers cancel accounts with more than 10 posts',
              'It is required by law to delete all social media before turning 18'
            ],
            correctAnswer: 0,
            timestamp: 185,
            timestampLabel: '03:05',
            explanation: 'Universities, scholarship evaluators, and prospective employers increasingly check digital presence to evaluate character and integrity.'
          },
          {
            id: 'ds1_q5',
            question: 'What is the most effective habit to protect your digital footprint?',
            questionBn: 'আপনার ডিজিটাল পদচিহ্ন সুরক্ষিত রাখার সবচেয়ে কার্যকর অভ্যাস কোনটি?',
            options: [
              'Sharing all personal passwords with trusted friends',
              'Pausing to think about long-term consequences before posting personal info',
              'Accepting friend requests from everyone to grow your network',
              'Turning off device security updates'
            ],
            correctAnswer: 1,
            timestamp: 220,
            timestampLabel: '03:40',
            explanation: 'Pausing to think before posting and keeping personal details private are foundational habits for digital wellbeing.'
          }
        ]
      },
      {
        id: 'ds-lesson-2',
        lessonNumber: 2,
        title: 'Recognizing Phishing, Scams & Social Engineering',
        titleBn: 'ফিশিং, অনলাইন প্রতারণা ও সোশ্যাল ইঞ্জিনিয়ারিং শনাক্তকরণ',
        videoId: '7bz1uVqgQ3A',
        duration: '05:10',
        summary: 'Learn how cyber fraudsters craft deceptive messages, OTP traps, fake giveaways, and urgent emergency scams.',
        questions: [
          {
            id: 'ds2_q1',
            question: 'What is the primary method used in a "phishing" attack?',
            questionBn: '"ফিশিং" (Phishing) আক্রমণের প্রধান কৌশল কী?',
            options: [
              'Deceiving users with fake emails, links, or messages to steal passwords or money',
              'Cracking a hardware router using physical cables',
              'Remotely accelerating your internet connection speed',
              'Infecting devices exclusively via Bluetooth pairing in person'
            ],
            correctAnswer: 0,
            timestamp: 30,
            timestampLabel: '00:30',
            explanation: 'Phishing mimics legitimate organizations (banks, government, schools) to trick users into handing over confidential data.'
          },
          {
            id: 'ds2_q2',
            question: 'If you receive an SMS saying you won 50,000 BDT in a lottery you never entered, you should:',
            questionBn: 'আপনি কখনো অংশ নেননি এমন লটারিতে ৫০,০০০ টাকা জিতেছেন বলে কোনো মেসেজ পেলে আপনার কী করা উচিত?',
            options: [
              'Immediately call the number and provide your bKash PIN to claim the prize',
              'Recognize it as an advance-fee fraud scam and ignore/report it',
              'Forward it to all your classmates so they can win too',
              'Click the short link and download the attached verification app'
            ],
            correctAnswer: 1,
            timestamp: 90,
            timestampLabel: '01:30',
            explanation: 'Unexpected prize and lottery announcements requiring prompt fees, PINs, or link clicks are classic financial scams.'
          },
          {
            id: 'ds2_q3',
            question: 'When is it safe to share your One-Time Password (OTP) or mobile banking PIN?',
            questionBn: 'কখন ওটিপি (OTP) বা মোবাইল ব্যাংকিং পিন অন্যদের সাথে শেয়ার করা নিরাপদ?',
            options: [
              'When someone calls claiming to be a customer service representative',
              'When a friend on Facebook messages saying they need urgent help',
              'Never; authentic service providers and banks will never request your OTP or PIN',
              'Whenever requested on a public survey form'
            ],
            correctAnswer: 2,
            timestamp: 160,
            timestampLabel: '02:40',
            explanation: 'An OTP or PIN is strictly confidential. Legitimate representatives from bKash, Nagad, or banks never ask for it.'
          },
          {
            id: 'ds2_q4',
            question: 'What common psychological trigger do cyber scammers exploit the most?',
            questionBn: 'সাইবার প্রতারকরা সাধারণত মানুষের কোন মানসিক অনুভূতির সুযোগ নেয়?',
            options: [
              'Deep relaxation and patience',
              'Artificial urgency, panic, and fear of missing out',
              'Boredom and silence',
              'Scientific curiosity only'
            ],
            correctAnswer: 1,
            timestamp: 215,
            timestampLabel: '03:35',
            explanation: 'Scammers invent high-pressure deadlines ("Act within 5 minutes or your account is suspended!") so victims react emotionally without thinking.'
          },
          {
            id: 'ds2_q5',
            question: 'How can you verify if a login webpage link is genuine before typing your credentials?',
            questionBn: 'লগইন তথ্য দেওয়ার আগে কীভাবে নিশ্চিত হবেন লিংকটি আসল কি না?',
            options: [
              'Check the exact spelling of the domain name and ensure secure HTTPS protocol',
              'Trust any link that contains an attractive logo and green colors',
              'If it was sent on WhatsApp by an unknown number, it must be verified',
              'Only check if the page loads quickly'
            ],
            correctAnswer: 0,
            timestamp: 270,
            timestampLabel: '04:30',
            explanation: 'Scammers create spoofed domains with tiny misspellings (like faceb00k.com). Always inspect the browser address bar carefully.'
          }
        ]
      },
      {
        id: 'ds-lesson-3',
        lessonNumber: 3,
        title: 'Spotting Misinformation, Rumors & Fake News',
        titleBn: 'গুজব, ভুয়া খবর ও ভুল তথ্য যাচাইয়ের কৌশল',
        videoId: 'BSpYn65UvT8',
        duration: '04:45',
        summary: 'Master the SIFT method: Stop, Investigate the source, Find better coverage, and Trace claims back to original context.',
        questions: [
          {
            id: 'ds3_q1',
            question: 'What does the letter "S" stand for in the SIFT fact-checking routine?',
            questionBn: 'তথ্য যাচাইয়ের SIFT পদ্ধতির প্রথম অক্ষর "S" দ্বারা কী বোঝায়?',
            options: [
              'Share immediately to warn others',
              'Stop: pause your initial emotional reaction before liking or forwarding',
              'Search for funny comments',
              'Save the post to your photo gallery'
            ],
            correctAnswer: 1,
            timestamp: 35,
            timestampLabel: '00:35',
            explanation: 'The first and most vital step is STOP: pause when you feel anger, shock, or excitement before spreading information.'
          },
          {
            id: 'ds3_q2',
            question: 'What is the key difference between misinformation and disinformation?',
            questionBn: 'ভুল তথ্য (Misinformation) ও অপতথ্য (Disinformation)-এর মধ্যে প্রধান পার্থক্য কী?',
            options: [
              'Misinformation is shared without malicious intent, while disinformation is created deliberately to deceive',
              'Misinformation only happens on television, while disinformation is online only',
              'Misinformation is always true facts, while disinformation is fictional stories',
              'There is no difference; they are exactly identical terms'
            ],
            correctAnswer: 0,
            timestamp: 95,
            timestampLabel: '01:35',
            explanation: 'Disinformation is weaponized deception engineered deliberately, whereas misinformation is false info spread by people unaware that it is fake.'
          },
          {
            id: 'ds3_q3',
            question: 'Why are sensationalist headlines or emotional captions a red flag?',
            questionBn: 'উত্তেজনাপূর্ণ বা আবেগতাড়িত শিরোনাম কেন সতর্কতার সংকেত?',
            options: [
              'Because professional journalists only use robotic words',
              'Because clickbait algorithms exploit emotional spikes to boost engagement without factual verification',
              'Because emotional posts automatically shut down device screens',
              'Because exclamation marks are prohibited in Bangladesh'
            ],
            correctAnswer: 1,
            timestamp: 155,
            timestampLabel: '02:35',
            explanation: 'Clickbait relies on emotional outrage or shock value to provoke shares before readers check if the underlying facts hold up.'
          },
          {
            id: 'ds3_q4',
            question: 'How can you verify whether an image or video is reused from an old event?',
            questionBn: 'একটি ছবি বা ভিডিও পুরোনো কোনো ঘটনার কি না, তা কীভাবে যাচাই করবেন?',
            options: [
              'Perform a reverse image search (e.g. Google Lens) to find original publication dates',
              'Increase the brightness of your device screen',
              'Ask five friends in a group chat to vote whether it looks real',
              'Assume that anything posted this morning must have occurred today'
            ],
            correctAnswer: 0,
            timestamp: 210,
            timestampLabel: '03:30',
            explanation: 'Reverse image search engines trace where and when an image first appeared on the internet, exposing recycled photos.'
          },
          {
            id: 'ds3_q5',
            question: 'What is lateral reading when evaluating an unfamiliar news website?',
            questionBn: 'কোনো অপরিচিত ওয়েবসাইটের নির্ভরযোগ্যতা যাচাইয়ে ল্যাটারাল রিডিং (Lateral Reading) কী?',
            options: [
              'Reading from right to left across the screen',
              'Opening new browser tabs to see what credible third-party sources say about that website',
              'Staying strictly on the site’s "About Us" page without leaving',
              'Reading only the last paragraph of the article'
            ],
            correctAnswer: 1,
            timestamp: 260,
            timestampLabel: '04:20',
            explanation: 'Fact-checkers read laterally: instead of trusting what a site says about itself, they open tabs to search what reliable sources say about it.'
          }
        ]
      },
      {
        id: 'ds-lesson-4',
        lessonNumber: 4,
        title: 'Account Security, Passwords & Two-Factor Authentication',
        titleBn: 'অ্যাকাউন্ট নিরাপত্তা, শক্তিশালী পাসওয়ার্ড ও টু-ফ্যাক্টর অথেনটিকেশন',
        videoId: 'q13zUv-P7Cg',
        duration: '04:30',
        summary: 'Build uncrackable passphrases, configure 2FA correctly, and manage social media recovery options safely.',
        questions: [
          {
            id: 'ds4_q1',
            question: 'Which of the following is the strongest password structure?',
            questionBn: 'নিচের কোন পাসওয়ার্ডটি সবচেয়ে শক্তিশালী?',
            options: [
              'Your birthdate followed by 123 (e.g., 2008123)',
              'Your nickname and mobile number',
              'A long passphrase made of 4+ random words with numbers and symbols (e.g., Mango#Rocket99River!)',
              'The word "Password2026"'
            ],
            correctAnswer: 2,
            timestamp: 40,
            timestampLabel: '00:40',
            explanation: 'Length and unpredictable combinations make passphrases exponentially harder for automated brute-force attacks to crack.'
          },
          {
            id: 'ds4_q2',
            question: 'Why is reusing the same password across multiple websites dangerous?',
            questionBn: 'বিভিন্ন ওয়েবসাইটে একই পাসওয়ার্ড বারবার ব্যবহার করা কেন বিপজ্জনক?',
            options: [
              'It uses up too much cloud storage space',
              'If one low-security website is breached, hackers can access all your other accounts',
              'Browsers automatically delete duplicate passwords every month',
              'It slows down your smartphone processor'
            ],
            correctAnswer: 1,
            timestamp: 105,
            timestampLabel: '01:45',
            explanation: 'Data breaches happen often. Credential-stuffing bots try breached email-password pairs on Facebook, Google, and banks automatically.'
          },
          {
            id: 'ds4_q3',
            question: 'What is Two-Factor Authentication (2FA)?',
            questionBn: 'টু-ফ্যাক্টর অথেনটিকেশন (2FA) বলতে কী বোঝায়?',
            options: [
              'Logging in using two different computers at the exact same moment',
              'A security layer requiring two separate proofs of identity (e.g. password + phone code/app)',
              'Changing your password two times every day',
              'Typing your password twice in the login box'
            ],
            correctAnswer: 1,
            timestamp: 165,
            timestampLabel: '02:45',
            explanation: '2FA ensures that even if someone steals your password, they cannot log in without the secondary token or authenticator code.'
          },
          {
            id: 'ds4_q4',
            question: 'What should you do immediately after using a public computer (cyber cafe or school lab)?',
            questionBn: 'সাইবার ক্যাফে বা স্কুলের কম্পিউটারে কাজ শেষে আপনার তাৎক্ষণিক করণীয় কী?',
            options: [
              'Simply turn off the computer monitor and walk away',
              'Log out of all accounts, uncheck "remember me", and clear browser session history',
              'Save your passwords in browser autofill for convenience tomorrow',
              'Leave your email open in a minimized window'
            ],
            correctAnswer: 1,
            timestamp: 215,
            timestampLabel: '03:35',
            explanation: 'Never leave sessions open or save passwords on shared computers, as anyone sitting next can take over your account.'
          },
          {
            id: 'ds4_q5',
            question: 'Where should account recovery codes (backup codes) be stored?',
            questionBn: 'অ্যাকাউন্টের ব্যাকআপ কোড বা রিকভারি কোড কোথায় সংরক্ষণ করা উচিত?',
            options: [
              'Posted as a public status or pinned comment',
              'In a secure, private place like a physical notebook or trusted password manager',
              'Sent in a group chat to friends for safe keeping',
              'Screenshot and set as your phone lock screen wallpaper'
            ],
            correctAnswer: 1,
            timestamp: 250,
            timestampLabel: '04:10',
            explanation: 'Backup codes provide master access if you lose your phone; keep them in a secure, confidential place offline or in an encrypted vault.'
          }
        ]
      },
      {
        id: 'ds-lesson-5',
        lessonNumber: 5,
        title: 'Responsible Online Conduct, Cyberbullying & Law in Bangladesh',
        titleBn: 'দায়িত্বশীল অনলাইন আচরণ, সাইবার বুলিং ও বাংলাদেশের সাইবার আইন',
        videoId: '3Z4sR_p5q_o',
        duration: '05:00',
        summary: 'Understand the legal framework (Cyber Security Act), reporting mechanisms, and bystander interventions against online harassment.',
        questions: [
          {
            id: 'ds5_q1',
            question: 'What should you do if someone is threatening or blackmailing you online in Bangladesh?',
            questionBn: 'বাংলাদেশে অনলাইনে কেউ আপনাকে হুমকি বা ব্ল্যাকমেইল করলে আপনার প্রথম পদক্ষেপ কী হওয়া উচিত?',
            options: [
              'Pay whatever ransom or money they demand immediately',
              'Preserve evidence (screenshots, URLs, sender info) and contact trusted guardians or Cyber Police (999 / CID Cyber Police)',
              'Delete all your social media accounts and stay completely silent',
              'Threaten the perpetrator with physical retaliation'
            ],
            correctAnswer: 1,
            timestamp: 45,
            timestampLabel: '00:45',
            explanation: 'Preserving digital evidence without tampering is crucial. Report to parents, teachers, and Police Cyber Support for Women / CID Cyber Police.'
          },
          {
            id: 'ds5_q2',
            question: 'Under cyber laws in Bangladesh, is publishing someone’s private photos or defamatory content without consent an offense?',
            questionBn: 'অনুমতি ছাড়া কারো ব্যক্তিগত ছবি বা মানহানিকর কনটেন্ট অনলাইনে প্রকাশ করা কি আইনে দণ্ডনীয় অপরাধ?',
            options: [
              'No, the internet is completely unregulated and anything goes',
              'Yes, non-consensual sharing of intimate images and defamation are punishable offenses with fines and imprisonment',
              'Only if the victim is a celebrity',
              'No, provided you add a disclaimer saying "no offense intended"'
            ],
            correctAnswer: 1,
            timestamp: 110,
            timestampLabel: '01:50',
            explanation: 'Under Bangladeshi cyber safety laws, unauthorized distribution of private images and harassment carry strict legal penalties.'
          },
          {
            id: 'ds5_q3',
            question: 'What is the role of an "active bystander" when witnessing cyberbullying?',
            questionBn: 'সহপাঠী বা কাউকে সাইবার বুলিংয়ের শিকার হতে দেখলে একজন সচেতন নাগরিক হিসেবে আপনার ভূমিকা কী?',
            options: [
              'Join in the teasing to fit in with the group',
              'Support the victim privately, report the harassing content, and do not amplify abusive posts',
              'Tag more people in the comments to make the post viral',
              'Download and circulate the defamatory post'
            ],
            correctAnswer: 1,
            timestamp: 175,
            timestampLabel: '02:55',
            explanation: 'Active upstanders refuse to forward abusive posts, report bullying through platform tools, and offer support to the targeted person.'
          },
          {
            id: 'ds5_q4',
            question: 'What emergency helpline number can anyone in Bangladesh dial for emergency police assistance including cyber harassment?',
            questionBn: 'বাংলাদেশে সাইবার হয়রানি সহ যেকোনো জরুরি পুলিশি সহায়তার জন্য কোন হেল্পলাইনে কল করা যায়?',
            options: [
              '999 (National Emergency Service)',
              '100',
              '555',
              '000'
            ],
            correctAnswer: 0,
            timestamp: 230,
            timestampLabel: '03:50',
            explanation: 'Dialing 999 connects you directly to Bangladesh Police, Ambulance, and Fire Service dispatchers who can route cyber threats.'
          },
          {
            id: 'ds5_q5',
            question: 'What does "Digital Empathy" mean in the Onnoy philosophy?',
            questionBn: 'অন্বয় (Onnoy)-এর ধারণায় "ডিজিটাল সহমর্মিতা" (Digital Empathy) বলতে কী বোঝায়?',
            options: [
              'Remembering that behind every screen and profile is a real human with feelings, dignity, and rights',
              'Using artificial intelligence to write all your personal messages',
              'Never speaking to anyone online',
              'Posting continuously without ever taking a break'
            ],
            correctAnswer: 0,
            timestamp: 275,
            timestampLabel: '04:35',
            explanation: 'Digital empathy means treating others online with respect, fairness, and compassion, connecting the necessary dots for a healthy digital society.'
          }
        ]
      }
    ]
  }
};

/**
 * Storage & Progress Management API (Multi-Course)
 */
const OnnoyCourseStore = {
  /**
   * Returns active course ID (from URL query param ?course=... or defaults to 'ai-acknowledgement')
   */
  getActiveCourseId() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const cid = params.get('course');
        if (cid && ONNOY_COURSES[cid]) {
          return cid;
        }
      }
      const saved = localStorage.getItem(ONNOY_COURSE_STORAGE.ACTIVE_COURSE_KEY);
      if (saved && ONNOY_COURSES[saved]) {
        return saved;
      }
    } catch (e) {}
    return 'ai-acknowledgement';
  },

  setActiveCourseId(courseId) {
    if (ONNOY_COURSES[courseId]) {
      localStorage.setItem(ONNOY_COURSE_STORAGE.ACTIVE_COURSE_KEY, courseId);
    }
  },

  getCourse(courseId) {
    const cid = courseId || this.getActiveCourseId();
    return ONNOY_COURSES[cid] || ONNOY_COURSES['ai-acknowledgement'];
  },

  getAllCourses() {
    return Object.values(ONNOY_COURSES);
  },

  getStudent() {
    try {
      const data = localStorage.getItem(ONNOY_COURSE_STORAGE.STUDENT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveStudent(student) {
    try {
      const existing = this.getStudent() || {};
      const updated = {
        ...existing,
        ...student,
        updatedAt: new Date().toISOString()
      };
      if (!updated.registeredAt) {
        updated.registeredAt = new Date().toISOString();
      }
      localStorage.setItem(ONNOY_COURSE_STORAGE.STUDENT_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return null;
    }
  },

  getProgress(courseId) {
    const cid = courseId || this.getActiveCourseId();
    const course = this.getCourse(cid);
    try {
      const data = localStorage.getItem(ONNOY_COURSE_STORAGE.PROGRESS_PREFIX + cid);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    return {
      courseId: cid,
      completedLessons: [],
      quizScores: {},
      currentLessonId: course.lessons[0].id,
      isCourseFinished: false,
      startedAt: new Date().toISOString()
    };
  },

  saveProgress(progress, courseId) {
    const cid = courseId || progress.courseId || this.getActiveCourseId();
    try {
      localStorage.setItem(ONNOY_COURSE_STORAGE.PROGRESS_PREFIX + cid, JSON.stringify(progress));
    } catch (e) {}
  },

  isLessonCompleted(lessonId, courseId) {
    const progress = this.getProgress(courseId);
    return progress.completedLessons.includes(lessonId);
  },

  isLessonUnlocked(lessonId, courseId) {
    const course = this.getCourse(courseId);
    const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex <= 0) return true;
    const previousLesson = course.lessons[lessonIndex - 1];
    return this.isLessonCompleted(previousLesson.id, courseId);
  },

  markLessonComplete(lessonId, score = 5, courseId) {
    const cid = courseId || this.getActiveCourseId();
    const course = this.getCourse(cid);
    const progress = this.getProgress(cid);

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
    progress.quizScores[lessonId] = score;

    const allCompleted = course.lessons.every(l => progress.completedLessons.includes(l.id));
    if (allCompleted) {
      progress.isCourseFinished = true;
      progress.completedAt = progress.completedAt || new Date().toISOString();
    } else {
      const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
      if (currentIndex !== -1 && currentIndex + 1 < course.lessons.length) {
        progress.currentLessonId = course.lessons[currentIndex + 1].id;
      }
    }

    this.saveProgress(progress, cid);

    if (allCompleted) {
      this.generateCertificateRecord(cid);
    }

    return progress;
  },

  generateCertificateRecord(courseId) {
    try {
      const cid = courseId || this.getActiveCourseId();
      const course = this.getCourse(cid);
      const student = this.getStudent();
      if (!student) return null;

      const progress = this.getProgress(cid);
      const allCompleted = course.lessons.every(l => progress.completedLessons && progress.completedLessons.includes(l.id));
      if (!allCompleted || !progress.isCourseFinished) {
        // Strict guard: course must be 100% completed
        return null;
      }

      const key = ONNOY_COURSE_STORAGE.CERT_PREFIX + cid;
      const existingCert = localStorage.getItem(key);
      if (existingCert) {
        return JSON.parse(existingCert);
      }

      const year = new Date().getFullYear();
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const certId = `ONN-${year}-${randomCode}`;

      const certificate = {
        certificateId: certId,
        courseId: cid,
        studentName: student.name,
        institution: student.institution,
        district: student.district || 'Bangladesh',
        courseTitle: course.title,
        courseTitleBn: course.titleBn,
        issuedAt: new Date().toISOString(),
        issueDateFormatted: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        issuer: course.certificateIssuer,
        verificationUrl: `https://onnoy.vercel.app/courses.html?course=${cid}&cert=${certId}`
      };

      localStorage.setItem(key, JSON.stringify(certificate));
      return certificate;
    } catch (e) {
      return null;
    }
  },

  getCertificate(courseId) {
    try {
      const cid = courseId || this.getActiveCourseId();
      const course = this.getCourse(cid);
      const progress = this.getProgress(cid);
      const key = ONNOY_COURSE_STORAGE.CERT_PREFIX + cid;

      const allCompleted = course.lessons.every(l => progress.completedLessons && progress.completedLessons.includes(l.id));
      if (!allCompleted || !progress.isCourseFinished) {
        localStorage.removeItem(key);
        return null;
      }

      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  resetCourse(courseId) {
    const cid = courseId || this.getActiveCourseId();
    localStorage.removeItem(ONNOY_COURSE_STORAGE.PROGRESS_PREFIX + cid);
    localStorage.removeItem(ONNOY_COURSE_STORAGE.CERT_PREFIX + cid);
  }
};

// Global aliases dynamically matching active course
Object.defineProperty(window, 'ONNOY_COURSE_CONFIG', {
  get: () => OnnoyCourseStore.getCourse(),
  configurable: true
});

Object.defineProperty(window, 'ONNOY_COURSE_LESSONS', {
  get: () => OnnoyCourseStore.getCourse().lessons,
  configurable: true
});

window.ONNOY_COURSES = ONNOY_COURSES;
window.OnnoyCourseStore = OnnoyCourseStore;
