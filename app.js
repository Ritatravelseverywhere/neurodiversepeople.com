/* ─────────────────────────────────────────────────────────────────
   NeuroScreen · neurodiversepeople.com
   Original questions © NeuroDiverse People. All questions are
   original content written for this platform. Clinical domains
   are based on published neurodevelopmental research. This tool
   is not affiliated with or endorsed by the authors of any
   published diagnostic instrument.
───────────────────────────────────────────────────────────────── */

'use strict';

/* ══ SCALES ══════════════════════════════════════════════════════ */

const FREQ5   = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];
const AGREE4  = ['Definitely agree', 'Slightly agree', 'Slightly disagree', 'Definitely disagree'];
const LIKERT7 = ['Strongly disagree', 'Disagree', 'Slightly disagree', 'Neutral', 'Slightly agree', 'Agree', 'Strongly agree'];
const RAADSR4 = ['Yes — both now and when I was younger', 'Yes — but only recently', 'Yes — but only when I was younger (under 16)', 'No — this has never applied to me'];

/* ══ QUESTION BANKS ══════════════════════════════════════════════
   All questions are original content © NeuroDiverse People.
   Clinical domains assessed: attention regulation, hyperactivity,
   impulsivity, social communication, sensory processing, social
   camouflaging, and circumscribed interests.
══════════════════════════════════════════════════════════════════ */

/* ATTENTION & FOCUS — 6 questions
   Assesses attention regulation and hyperactivity/impulsivity traits.
   Scale: FREQ5 (0–4)
   Threshold: Q1–4 ≥ 2 (Sometimes+), Q5–6 ≥ 3 (Often+)
   Positive screen: 4 or more items at or above threshold              */
const ASRS_A = [
  { id:'a1', text:'Do you struggle to finish the final parts of a project once the interesting or challenging bits are done?',            sub:'inattention',   thr:2 },
  { id:'a2', text:'Is it hard for you to get organised when you have a task with multiple steps that need doing in order?',               sub:'inattention',   thr:2 },
  { id:'a3', text:'Do you forget about appointments, deadlines, or things you promised to do?',                                          sub:'inattention',   thr:2 },
  { id:'a4', text:'When a task feels mentally demanding, do you put it off or avoid getting started?',                                   sub:'inattention',   thr:2 },
  { id:'a5', text:'Do you find yourself fidgeting or needing to move around when you have to stay seated for a long time?',              sub:'hyperactivity', thr:3 },
  { id:'a6', text:'Do you often feel internally restless or like you\'re running on overdrive, even when there\'s no obvious reason?',   sub:'hyperactivity', thr:3 },
];

/* DAILY LIFE & ACTIVITY — 12 questions (triggered if Attention screen positive)
   Deeper assessment of inattention, hyperactivity and impulsivity.
   Scale: FREQ5 (0–4)                                                  */
const ASRS_B = [
  { id:'b1',  text:'Do you make careless errors when you\'re working on something dull or complicated?',                                sub:'inattention'   },
  { id:'b2',  text:'Is it hard to keep your focus when a task is repetitive or unstimulating?',                                         sub:'inattention'   },
  { id:'b3',  text:'Does your mind wander when someone is talking directly to you?',                                                    sub:'inattention'   },
  { id:'b4',  text:'Do you regularly lose or misplace everyday items like your keys, phone, or wallet?',                                sub:'inattention'   },
  { id:'b5',  text:'Does background noise or movement around you easily pull your attention away from what you\'re doing?',             sub:'inattention'   },
  { id:'b6',  text:'Do you get up or move around in situations where you\'re expected to remain seated?',                               sub:'hyperactivity' },
  { id:'b7',  text:'Do you feel physically restless or unable to settle, even when things are calm?',                                   sub:'hyperactivity' },
  { id:'b8',  text:'Do you find it hard to properly switch off and relax when you have free time?',                                     sub:'hyperactivity' },
  { id:'b9',  text:'Does your brain feel like it\'s always switched on, even when you\'d like it to slow down?',                        sub:'hyperactivity' },
  { id:'b10', text:'Do people around you comment that you talk a lot in social situations?',                                            sub:'hyperactivity' },
  { id:'b11', text:'Do you find yourself jumping in to finish other people\'s sentences before they\'ve had a chance to?',              sub:'impulsivity'   },
  { id:'b12', text:'Is waiting your turn — in queues, conversations, or games — genuinely difficult for you?',                         sub:'impulsivity'   },
];

/* SOCIAL & COMMUNICATION STYLE — 10 questions
   Assesses social communication and perceptual processing differences.
   Scale: AGREE4 (0–3)
   dir='autistic': agree (value 0 or 1) scores 1 point
   dir='typical':  disagree (value 2 or 3) scores 1 point
   Positive screen: 6 or more                                          */
const AQ10 = [
  { id:'q1',  text:'I pick up on sounds, smells, or textures that other people seem not to notice.',                                    dir:'autistic', sub:'sensory'       },
  { id:'q2',  text:'When I\'m working on something, I naturally see the big picture rather than getting caught up in fine details.',    dir:'typical',  sub:'attention'     },
  { id:'q3',  text:'I find it easy to juggle more than one thing at a time.',                                                           dir:'typical',  sub:'attention'     },
  { id:'q4',  text:'If I get interrupted, I can easily pick up where I left off without losing my train of thought.',                   dir:'typical',  sub:'attention'     },
  { id:'q5',  text:'When someone is speaking to me, I easily pick up on what they\'re hinting at without them spelling it out.',        dir:'typical',  sub:'communication' },
  { id:'q6',  text:'I can usually tell when someone I\'m talking to is getting bored and wants to end the conversation.',              dir:'typical',  sub:'communication' },
  { id:'q7',  text:'When reading a book or watching a film, I find it hard to figure out what the characters are really thinking or feeling.', dir:'autistic', sub:'imagination' },
  { id:'q8',  text:'I really enjoy building up detailed knowledge about specific topics I\'m passionate about.',                        dir:'autistic', sub:'imagination'   },
  { id:'q9',  text:'I can usually tell how someone is feeling just by looking at their face.',                                          dir:'typical',  sub:'communication' },
  { id:'q10', text:'I find it difficult to figure out what people really want or mean in social situations.',                           dir:'autistic', sub:'communication' },
];

/* SOCIAL STRATEGIES — 25 questions (triggered if Social screen positive)
   Assesses social adaptation, learned coping, and identity masking.
   Scale: LIKERT7 (1–7, higher = more camouflaging)
   Subscales: learned adaptation (7), conscious strategies (8), identity concealment (10)
   Threshold: ~88                                                       */
const CATQ = [
  // Learned adaptation (7)
  { id:'c1',  text:'I\'ve worked out my own personal set of rules for how to behave in social situations.',                             sub:'assimilation' },
  { id:'c2',  text:'I carefully watch how other people interact so I can learn from them and copy what seems to work.',                 sub:'assimilation' },
  { id:'c3',  text:'Before going into a social situation, I tend to plan out what I\'ll say and how I\'ll come across.',                sub:'assimilation' },
  { id:'c4',  text:'In unfamiliar social situations, I look at what others are doing to figure out how I should act.',                  sub:'assimilation' },
  { id:'c5',  text:'I borrow expressions, phrases, or mannerisms from other people to help me fit in.',                                sub:'assimilation' },
  { id:'c6',  text:'I\'ve actively looked up or read about how to handle social situations and put that knowledge into practice.',      sub:'assimilation' },
  { id:'c7',  text:'I have a version of myself — almost like a character — that I specifically use when I\'m around other people.',    sub:'assimilation' },
  // Conscious strategies (8)
  { id:'c8',  text:'I rely on phrases or lines I\'ve mentally rehearsed in advance when talking to people.',                           sub:'compensation' },
  { id:'c9',  text:'Before speaking in a conversation, I tend to mentally work out what I\'m going to say first.',                     sub:'compensation' },
  { id:'c10', text:'Understanding other people\'s body language takes real conscious effort on my part.',                              sub:'compensation' },
  { id:'c11', text:'I have to actively decode what someone\'s facial expression means rather than it coming naturally.',               sub:'compensation' },
  { id:'c12', text:'I often find it hard to tell when someone is being sarcastic or joking, and have to consciously work it out.',     sub:'compensation' },
  { id:'c13', text:'I follow personal conversation rules I\'ve developed over time to get through social interactions.',               sub:'compensation' },
  { id:'c14', text:'I\'ve deliberately taught myself the unspoken rules of how conversations and social interactions work.',           sub:'compensation' },
  { id:'c15', text:'I often find myself mentally translating or interpreting what people say in order to understand what they mean.',   sub:'compensation' },
  // Identity concealment (10)
  { id:'c16', text:'I adjust my body language or expressions to seem more engaged in a conversation than I actually feel.',            sub:'masking'      },
  { id:'c17', text:'I naturally start mirroring the gestures or way of speaking of whoever I\'m talking to.',                          sub:'masking'      },
  { id:'c18', text:'I copy the facial expressions of people I\'m talking to so that I seem to be reacting the way I\'m expected to.', sub:'masking'      },
  { id:'c19', text:'I\'m very aware of how I\'m coming across physically when I\'m around other people.',                             sub:'masking'      },
  { id:'c20', text:'I hold back instinctive impulses or behaviours when I\'m in social settings.',                                     sub:'masking'      },
  { id:'c21', text:'I display more emotion than I actually feel inside because it\'s what the situation seems to call for.',           sub:'masking'      },
  { id:'c22', text:'I keep my true thoughts, feelings, or opinions to myself when I\'m with other people.',                            sub:'masking'      },
  { id:'c23', text:'I hide parts of myself that I think others would find odd or off-putting.',                                        sub:'masking'      },
  { id:'c24', text:'How I act changes quite significantly depending on who I\'m with.',                                                sub:'masking'      },
  { id:'c25', text:'Being in social situations often feels like giving a performance rather than just being myself.',                   sub:'masking'      },
];

/* LIFE EXPERIENCES — 40 questions (optional extended assessment)
   Original questions assessing social connection, language, sensory
   experience, and routine-based thinking across the lifespan.
   Scale: RAADSR4 (0–3)  reverse=true items scored 3-v
   Subscales: social (12), language (7), sensory (12), circumscribed (9)
   Threshold: ≥32                                                       */
const RAADSR = [
  // Social connection (12)
  { id:'r1',  text:'I find it easy to tune into how other people are feeling.',                                                       sub:'social',        rev:true  },
  { id:'r2',  text:'I often drop quotes or lines from TV shows, films, or books into everyday conversation.',                        sub:'social',        rev:false },
  { id:'r3',  text:'People have told me I go on too long about subjects I find interesting.',                                         sub:'social',        rev:false },
  { id:'r4',  text:'Forming genuine connections with other people feels out of reach for me.',                                        sub:'social',        rev:false },
  { id:'r5',  text:'Reaching out and asking others for help comes naturally to me.',                                                  sub:'social',        rev:true  },
  { id:'r6',  text:'I consistently struggle to see things from another person\'s point of view.',                                    sub:'social',        rev:false },
  { id:'r7',  text:'I often prefer my own company — or even talking to myself — over being with other people.',                      sub:'social',        rev:false },
  { id:'r8',  text:'I\'m fine when social plans change unexpectedly at the last minute.',                                             sub:'social',        rev:true  },
  { id:'r9',  text:'I genuinely don\'t understand why certain situations cause people to feel embarrassed.',                          sub:'social',        rev:false },
  { id:'r10', text:'Navigating social situations feels harder for me than it appears to be for most people.',                        sub:'social',        rev:false },
  { id:'r11', text:'People have commented that my voice sounds flat, robotic, overly formal, or unusual in some way.',               sub:'social',        rev:false },
  { id:'r12', text:'I tend to zoom in on specific details rather than taking in the overall picture.',                               sub:'social',        rev:false },
  // Language & thinking (7)
  { id:'r13', text:'I tend to take things at face value and sometimes miss the real meaning behind what someone says.',              sub:'language',      rev:false },
  { id:'r14', text:'My memory for facts, figures, and specific details is unusually strong.',                                         sub:'language',      rev:false },
  { id:'r15', text:'I\'ve said things that others found rude or hurtful, though I genuinely didn\'t mean to.',                       sub:'language',      rev:false },
  { id:'r16', text:'I\'ve been told that I repeat myself or circle back to the same topics.',                                         sub:'language',      rev:false },
  { id:'r17', text:'I automatically spot patterns in things — numbers, sequences, words, structures.',                               sub:'language',      rev:false },
  { id:'r18', text:'Starting a conversation — or keeping one going — is something I genuinely find hard.',                           sub:'language',      rev:false },
  { id:'r19', text:'I find figures of speech, metaphors, and abstract concepts easy to understand.',                                 sub:'language',      rev:true  },
  // Sensory experience (12)
  { id:'r20', text:'Sensory things that barely register for others — certain smells, lighting, noise levels — can genuinely overwhelm me.', sub:'sensory', rev:false },
  { id:'r21', text:'Certain food textures or fabric materials cause me real physical discomfort.',                                    sub:'sensory',       rev:false },
  { id:'r22', text:'Being touched unexpectedly, even lightly, is something I find hard to handle.',                                  sub:'sensory',       rev:false },
  { id:'r23', text:'Some everyday sounds are physically uncomfortable or even painful for me.',                                      sub:'sensory',       rev:false },
  { id:'r24', text:'I tend to notice small details in my surroundings that most people don\'t pick up on.',                          sub:'sensory',       rev:false },
  { id:'r25', text:'When I look at something, I process it in parts rather than taking in the whole thing at once.',                 sub:'sensory',       rev:false },
  { id:'r26', text:'My body reacts strongly to temperature changes that other people barely seem to notice.',                        sub:'sensory',       rev:false },
  { id:'r27', text:'I rock, sway, or make repetitive physical movements when I\'m sitting still or concentrating.',                  sub:'sensory',       rev:false },
  { id:'r28', text:'I notice tiny asymmetries or irregularities in things — faces, objects, rooms — that others walk right past.',   sub:'sensory',       rev:false },
  { id:'r29', text:'I have repeated body movements or habits that others have pointed out as unusual.',                              sub:'sensory',       rev:false },
  { id:'r30', text:'I can put up with significant physical pain or discomfort without appearing to react much.',                     sub:'sensory',       rev:false },
  { id:'r31', text:'I find certain items of clothing uncomfortable in a way that\'s hard to ignore — like tight waistbands, labels, or sock seams.', sub:'sensory', rev:false },
  // Routine & focused interests (9)
  { id:'r32', text:'I have one or more areas of deep, specific interest where my knowledge goes far beyond that of most people.',    sub:'circumscribed', rev:false },
  { id:'r33', text:'Sticking to my own routine makes me feel calm and in control.',                                                  sub:'circumscribed', rev:false },
  { id:'r34', text:'Changes to my plans or environment genuinely upset me, even when the change seems minor.',                       sub:'circumscribed', rev:false },
  { id:'r35', text:'I need to carry out everyday tasks in a specific way — if I can\'t, it bothers me.',                             sub:'circumscribed', rev:false },
  { id:'r36', text:'I tend to collect, organise, or arrange things with a particular precision or system.',                          sub:'circumscribed', rev:false },
  { id:'r37', text:'I notice straight away when something in my environment has been moved or changed, even slightly.',              sub:'circumscribed', rev:false },
  { id:'r38', text:'Changing my daily routine — even small elements of it — feels genuinely difficult.',                             sub:'circumscribed', rev:false },
  { id:'r39', text:'I\'ve always had a very specific passion or area of focus that most people around me don\'t share.',             sub:'circumscribed', rev:false },
  { id:'r40', text:'If I\'m prevented from following my usual routine, I find it very hard to cope.',                                sub:'circumscribed', rev:false },
];

/* ══ STATE ═══════════════════════════════════════════════════════ */

const state = {
  phase:        'welcome', // welcome | phase1 | phase2 | results | raadsr
  phase1Queue:  [],
  phase2Queue:  [],
  idx:          0,
  raadsrIdx:    0,
  answers:      {},        // { questionId: value (0-based index) }
  raadsrAns:    {},
  scores:       {},
  path:         null,      // 'adhd' | 'asd' | 'audhd' | 'sub'
  raadsrDone:   false,
};

/* ══ QUEUE BUILDERS ══════════════════════════════════════════════ */

function buildPhase1() {
  state.phase1Queue = [
    ...ASRS_A.map(q => ({ ...q, instrument: 'asrs_a', scale: FREQ5,  hint: 'Think about the past 6 months.' })),
    ...AQ10.map(q   => ({ ...q, instrument: 'aq10',   scale: AGREE4, hint: 'Answer based on how you generally are.' })),
  ];
}

function buildPhase2(adhd, asd) {
  const q2 = [];
  if (adhd) q2.push(...ASRS_B.map(q => ({ ...q, instrument: 'asrs_b', scale: FREQ5,   hint: 'Think about the past 6 months.' })));
  if (asd)  q2.push(...CATQ.map(q   => ({ ...q, instrument: 'catq',   scale: LIKERT7, hint: 'Rate how much this applies to you in social situations (1 = Strongly disagree, 7 = Strongly agree).' })));
  state.phase2Queue = q2;
}

/* ══ SCORING ═════════════════════════════════════════════════════ */

function scoreASRS_A() {
  let met = 0, raw = 0;
  ASRS_A.forEach(q => {
    const v = state.answers[q.id] ?? 0;
    raw += v;
    if (v >= q.thr) met++;
  });
  return { met, raw, maxRaw: 24, positive: met >= 4 };
}

function scoreASRS_B() {
  let inatt = 0, hyper = 0, impuls = 0;
  ASRS_B.forEach(q => {
    const v = state.answers[q.id] ?? 0;
    if (q.sub === 'inattention')   inatt  += v;
    if (q.sub === 'hyperactivity') hyper  += v;
    if (q.sub === 'impulsivity')   impuls += v;
  });
  return { inatt, hyper, impuls, total: inatt + hyper + impuls };
}

function scoreAQ10() {
  let score = 0;
  AQ10.forEach(q => {
    const v = state.answers[q.id];
    if (v === undefined) return;
    const hit = q.dir === 'autistic' ? v <= 1 : v >= 2;
    if (hit) score++;
  });
  return { score, max: 10, positive: score >= 6 };
}

function scoreCATQ() {
  let assim = 0, comp = 0, mask = 0;
  CATQ.forEach(q => {
    const v = (state.answers[q.id] ?? 0) + 1; // convert 0-based idx to 1-7
    if (q.sub === 'assimilation') assim += v;
    if (q.sub === 'compensation') comp  += v;
    if (q.sub === 'masking')      mask  += v;
  });
  return { assim, comp, mask, total: assim + comp + mask, max: 175, thr: 88, positive: (assim + comp + mask) >= 88 };
}

function scoreRADSR() {
  let social = 0, lang = 0, sensory = 0, circ = 0;
  RAADSR.forEach(q => {
    let v = state.raadsrAns[q.id] ?? 0;
    if (q.rev) v = 3 - v;
    if (q.sub === 'social')        social  += v;
    if (q.sub === 'language')      lang    += v;
    if (q.sub === 'sensory')       sensory += v;
    if (q.sub === 'circumscribed') circ    += v;
  });
  const total = social + lang + sensory + circ;
  return { social, lang, sensory, circ, total, max: 120, thr: 32, positive: total >= 32 };
}

function computeScores() {
  const asrsa  = scoreASRS_A();
  const aq10   = scoreAQ10();
  const hasB   = state.phase2Queue.some(q => q.instrument === 'asrs_b');
  const hasCat = state.phase2Queue.some(q => q.instrument === 'catq');
  const asrsb  = hasB   ? scoreASRS_B() : null;
  const catq   = hasCat ? scoreCATQ()   : null;
  const raadsr = state.raadsrDone ? scoreRADSR() : null;
  state.scores = { asrsa, aq10, asrsb, catq, raadsr };
}

/* ══ SCREEN HELPERS ══════════════════════════════════════════════ */

function show(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function currentQueue() {
  return state.phase === 'phase1' ? state.phase1Queue : state.phase2Queue;
}

/* ══ QUESTION RENDERING ══════════════════════════════════════════ */

const INSTRUMENT_LABELS = {
  asrs_a: 'Attention & Focus',
  asrs_b: 'Daily Life & Activity',
  aq10:   'Social & Communication Style',
  catq:   'Social Strategies',
};

const PHASE_LABELS = {
  asrs_a: 'Section 1 · Attention & Focus',
  aq10:   'Section 1 · Social & Communication',
  asrs_b: 'Section 2 · Daily Life & Activity',
  catq:   'Section 2 · Social Strategies',
};

function renderQuestion() {
  const queue = currentQueue();
  const q     = queue[state.idx];

  // Progress
  const totalQ = state.phase === 'phase1'
    ? state.phase1Queue.length
    : state.phase1Queue.length + state.phase2Queue.length;
  const doneQ = state.phase === 'phase1'
    ? state.idx
    : state.phase1Queue.length + state.idx;
  const pct = Math.round((doneQ / totalQ) * 100);

  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-counter').textContent = `Q ${state.idx + 1} / ${queue.length}`;
  document.getElementById('quiz-phase-label').textContent = PHASE_LABELS[q.instrument] || 'Assessment';

  // Question content
  document.getElementById('q-instrument-tag').textContent = INSTRUMENT_LABELS[q.instrument] || '';
  document.getElementById('q-hint').textContent           = q.hint || '';
  document.getElementById('q-text').textContent           = q.text;

  // Options — rendered as styled <button> elements (no fieldset, no radio)
  const list = document.getElementById('options-list');
  list.innerHTML = '';
  const saved = state.answers[q.id];

  q.scale.forEach((label, idx) => {
    const btn = document.createElement('button');
    btn.type        = 'button';
    btn.className   = 'option-item' + (saved === idx ? ' selected' : '');
    btn.setAttribute('aria-pressed', saved === idx ? 'true' : 'false');

    const dot  = document.createElement('span');
    dot.className  = 'option-dot';
    dot.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = label;

    btn.appendChild(dot);
    btn.appendChild(text);
    btn.addEventListener('click', () => selectOption(q.id, idx));
    list.appendChild(btn);
  });

  // Nav buttons
  const isFirstEver = state.phase === 'phase1' && state.idx === 0;
  document.getElementById('prev-btn').disabled = isFirstEver;
  document.getElementById('next-btn').disabled = (saved === undefined);

  // Scroll question into view on mobile
  document.getElementById('question-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function selectOption(qId, value) {
  state.answers[qId] = value;

  // Update button states visually
  const buttons = document.querySelectorAll('#options-list .option-item');
  buttons.forEach((btn, i) => {
    const isSelected = i === value;
    btn.classList.toggle('selected', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  document.getElementById('next-btn').disabled = false;
}

/* ══ FLOW CONTROL ════════════════════════════════════════════════ */

function startPhase1() {
  buildPhase1();
  state.phase = 'phase1';
  state.idx   = 0;
  show('screen-quiz');
  renderQuestion();
}

function advance(dir) {
  state.idx += dir;

  // Going back past phase2 start → jump to last phase1 question
  if (state.idx < 0) {
    if (state.phase === 'phase2') {
      state.phase = 'phase1';
      state.idx   = state.phase1Queue.length - 1;
      renderQuestion();
    }
    return;
  }

  const queue = currentQueue();

  // End of phase1 → analyse
  if (state.phase === 'phase1' && state.idx >= queue.length) {
    runAnalysis();
    return;
  }

  // End of phase2 → results
  if (state.phase === 'phase2' && state.idx >= queue.length) {
    showResults();
    return;
  }

  renderQuestion();
}

function runAnalysis() {
  show('screen-analysing');

  const asrsa = scoreASRS_A();
  const aq10  = scoreAQ10();

  const adhdPos = asrsa.positive;
  const asdPos  = aq10.positive;

  if      (adhdPos && asdPos) state.path = 'audhd';
  else if (adhdPos)            state.path = 'adhd';
  else if (asdPos)             state.path = 'asd';
  else                         state.path = 'sub';

  buildPhase2(adhdPos || asdPos && false || adhdPos, asdPos);
  // Simpler: always build based on what screened positive
  buildPhase2(adhdPos, asdPos);

  // Build analysis steps
  const steps = [
    { label: `Attention & Focus: ${asrsa.met}/6 items above threshold${asrsa.positive ? ' — traits indicated' : ''}`, done: true },
    { label: `Social & Communication: ${aq10.score}/10${aq10.positive ? ' — traits indicated' : ''}`,                  done: true },
    { label: getPathLabel(state.path),                                                                                   done: true },
    { label: state.phase2Queue.length > 0 ? `Loading ${state.phase2Queue.length} follow-up questions…` : 'Preparing your results…', done: false },
  ];

  const ul = document.getElementById('analysing-steps');
  ul.innerHTML = '';
  steps.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'step-li' + (s.done ? ' done' : '');
    li.style.animationDelay = (i * 0.2) + 's';

    const dot  = document.createElement('span');
    dot.className = 'step-dot';
    li.appendChild(dot);
    li.appendChild(document.createTextNode(s.label));
    ul.appendChild(li);
  });

  setTimeout(() => {
    if (state.phase2Queue.length > 0) {
      state.phase = 'phase2';
      state.idx   = 0;
      show('screen-quiz');
      renderQuestion();
    } else {
      showResults();
    }
  }, 2400);
}

function getPathLabel(path) {
  return {
    adhd:  'Your path: ADHD traits indicated — loading follow-up questions',
    asd:   'Your path: Autism traits indicated — loading follow-up questions',
    audhd: 'Your path: Both indicated — loading follow-up questions',
    sub:   'Both sections below threshold — preparing your summary',
  }[path] || '';
}

/* ══ RESULTS ═════════════════════════════════════════════════════ */

function showResults() {
  computeScores();
  show('screen-results');
  renderScoreBlocks();
  renderInterpretation();
  renderNextSteps();
  renderRadar();
  renderBooks();

  const { asrsa, aq10 } = state.scores;
  const showRADSR = (aq10.positive || asrsa.positive) && !state.raadsrDone;
  if (showRADSR) document.getElementById('raadsr-card').style.display = 'block';
}

/* ══ BOOKS ═══════════════════════════════════════════════════════
   Affiliate links — replace AFFILIATE-TAG with your Amazon
   Associates tracking ID (e.g. neurodiversepeople-21).
   Sign up free at: affiliate-program.amazon.co.uk
═══════════════════════════════════════════════════════════════ */

const AFFILIATE_TAG = 'neurodiversep-21';

const BOOKS = {

  adhd: [
    {
      title:  'ADHD 2.0',
      author: 'Edward Hallowell & John Ratey',
      desc:   'The definitive modern guide to adult ADHD — updated with the latest neuroscience on focus, motivation, and the ADHD brain.',
      asin:   '1399813285',
      emoji:  '⚡',
      colour: '#DBEAFE',
    },
    {
      title:  'Scattered Minds',
      author: 'Gabor Maté',
      desc:   'A compassionate, trauma-informed exploration of ADHD — particularly powerful for adults who went undiagnosed in childhood.',
      asin:   '1785042211',
      emoji:  '🌊',
      colour: '#E0F2FE',
    },
    {
      title:  'A Radical Guide for Women with ADHD',
      author: 'Sari Solden & Michelle Frank',
      desc:   'Essential reading for women with ADHD — addresses the unique challenges of late diagnosis, shame, and reclaiming identity.',
      asin:   '168403261X',
      emoji:  '💜',
      colour: '#F3E8FF',
    },
    {
      title:  'How to ADHD',
      author: 'Jessica McCabe',
      desc:   'From the creator of the acclaimed YouTube channel — a practical, friendly insider\'s guide to working with your ADHD brain, not against it.',
      asin:   '1805221256',
      emoji:  '🚀',
      colour: '#DCFCE7',
    },
  ],

  autism: [
    {
      title:  'Unmasking Autism',
      author: 'Devon Price',
      desc:   'The essential guide for late-diagnosed autistic adults — explores masking, burnout, and what it means to live authentically.',
      asin:   '1800960549',
      emoji:  '🎭',
      colour: '#FEF3C7',
    },
    {
      title:  'NeuroTribes',
      author: 'Steve Silberman',
      desc:   'Award-winning history of autism — from pathology to neurodiversity. Changes how you understand yourself and the world.',
      asin:   '1760113646',
      emoji:  '🧠',
      colour: '#DBEAFE',
    },
    {
      title:  'Odd Girl Out',
      author: 'Laura James',
      desc:   'A British journalist\'s account of being diagnosed autistic at 45. Warm, honest, and deeply relatable for women.',
      asin:   '150984306X',
      emoji:  '📖',
      colour: '#FCE7F3',
    },
    {
      title:  'The Reason I Jump',
      author: 'Naoki Higashida',
      desc:   'Written by a 13-year-old nonspeaking autistic boy — a window into inner autistic experience that has changed countless lives.',
      asin:   '1444776770',
      emoji:  '✨',
      colour: '#ECFDF5',
    },
  ],

  general: [
    {
      title:  'Divergent Mind',
      author: 'Jenara Nerenberg',
      desc:   'Explores sensory processing, neurodiversity, and why so many women go undiagnosed with ADHD, autism, and related conditions.',
      asin:   '0062876805',
      emoji:  '🌿',
      colour: '#ECFDF5',
    },
    {
      title:  'Unmasking Autism',
      author: 'Devon Price',
      desc:   'The essential guide for late-diagnosed autistic adults — explores masking, burnout, and what it means to live authentically.',
      asin:   '1800960549',
      emoji:  '🎭',
      colour: '#FEF3C7',
    },
    {
      title:  'ADHD 2.0',
      author: 'Edward Hallowell & John Ratey',
      desc:   'The definitive modern guide to adult ADHD — updated with the latest neuroscience on focus, motivation, and the ADHD brain.',
      asin:   '1399813285',
      emoji:  '⚡',
      colour: '#DBEAFE',
    },
    {
      title:  'The Reason I Jump',
      author: 'Naoki Higashida',
      desc:   'Written by a 13-year-old nonspeaking autistic boy — a profound window into autistic inner experience.',
      asin:   '1444776770',
      emoji:  '✨',
      colour: '#E0F2FE',
    },
  ],

};

function renderBooks() {
  const { asrsa, aq10 } = state.scores;
  const adhdPos = asrsa.positive;
  const asdPos  = aq10.positive;

  // Pick the right book list
  let books;
  if (adhdPos && asdPos) {
    // AuDHD: 2 from each list
    books = [
      ...BOOKS.adhd.slice(0, 2),
      ...BOOKS.autism.slice(0, 2),
    ];
  } else if (adhdPos) {
    books = BOOKS.adhd;
  } else if (asdPos) {
    books = BOOKS.autism;
  } else {
    books = BOOKS.general;
  }

  const grid = document.getElementById('books-grid');
  if (!grid) return;
  grid.innerHTML = '';

  books.forEach(book => {
    const url = `https://www.amazon.co.uk/dp/${book.asin}/?tag=${AFFILIATE_TAG}`;

    const card = document.createElement('a');
    card.href   = url;
    card.target = '_blank';
    card.rel    = 'noopener sponsored';
    card.className = 'book-card';

    card.innerHTML = `
      <div class="book-cover" style="background:${book.colour}">
        <span class="book-emoji">${book.emoji}</span>
      </div>
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <p class="book-desc">${book.desc}</p>
        <span class="book-cta">View on Amazon →</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ── Score blocks ──────────────────────────────────────────────── */

function lvl(score, thr) {
  if (score < thr * 0.75) return 'low';
  if (score < thr)        return 'border';
  return 'high';
}

function pct(score, max) { return Math.min(100, Math.round((score / max) * 100)); }

function addScoreBlock(container, { name, badge, level, score, thr, max, unit, detail }) {
  const fillPct  = pct(score, max);
  const thrPct   = pct(thr,   max);

  const block = document.createElement('div');
  block.className = `score-block level-${level}`;
  block.innerHTML = `
    <div class="score-block-head">
      <span class="score-block-name">${name}</span>
      <span class="score-pill">${badge}</span>
    </div>
    <div class="score-bar-row">
      <div class="score-track">
        <div class="score-fill" style="width:${fillPct}%"></div>
        <div class="score-threshold" style="left:${thrPct}%"></div>
      </div>
      <span class="score-nums">${score} ${unit}</span>
    </div>
    <p class="score-detail">${detail}</p>
  `;
  container.appendChild(block);
}

function renderScoreBlocks() {
  const { asrsa, aq10, asrsb, catq, raadsr } = state.scores;
  const container = document.getElementById('score-blocks');
  container.innerHTML = '';

  // ADHD
  addScoreBlock(container, {
    name:   'Attention & Focus — ADHD Traits',
    badge:  asrsa.positive ? 'Traits indicated' : 'Below threshold',
    level:  lvl(asrsa.met, 4),
    score:  asrsa.met,
    thr:    4,
    max:    6,
    unit:   '/ 6 items',
    detail: `${asrsa.met} of 6 items reached the frequency threshold (4+ = traits indicated).${asrsb ? ` Inattention score: ${asrsb.inatt}/20 · Hyperactivity score: ${asrsb.hyper}/20` : ''}`,
  });

  // Autism Social
  addScoreBlock(container, {
    name:   'Social & Communication — Autism Traits',
    badge:  aq10.positive ? 'Traits indicated' : 'Below threshold',
    level:  lvl(aq10.score, 6),
    score:  aq10.score,
    thr:    6,
    max:    10,
    unit:   '/ 10',
    detail: `${aq10.score} of 10 items aligned with autistic trait patterns. Threshold for further assessment: 6 or above.`,
  });

  // Social Strategies
  if (catq) {
    addScoreBlock(container, {
      name:   'Social Strategies — Masking & Camouflaging',
      badge:  catq.positive ? 'High masking' : 'Below threshold',
      level:  lvl(catq.total, catq.thr),
      score:  catq.total,
      thr:    catq.thr,
      max:    175,
      unit:   '/ 175',
      detail: `Learned adaptation: ${catq.assim}/49 · Conscious strategies: ${catq.comp}/56 · Identity concealment: ${catq.mask}/70. Threshold: ~88.`,
    });
  }

  // Life Experiences
  if (raadsr) {
    addScoreBlock(container, {
      name:   'Life Experiences — Extended Assessment',
      badge:  raadsr.positive ? 'Above threshold' : 'Below threshold',
      level:  lvl(raadsr.total, raadsr.thr),
      score:  raadsr.total,
      thr:    raadsr.thr,
      max:    120,
      unit:   '/ 120',
      detail: `Social ${raadsr.social}/36 · Language ${raadsr.lang}/21 · Sensory ${raadsr.sensory}/36 · Circumscribed Interests ${raadsr.circ}/27. Threshold: 32.`,
    });
  }
}

/* ── Radar chart ───────────────────────────────────────────────── */

let radarChart = null;

function renderRadar() {
  const { asrsa, aq10, asrsb, catq, raadsr } = state.scores;

  const labels = [], data = [], thresholds = [];

  // Inattention
  if (asrsb) {
    labels.push('Inattention');
    data.push(pct(asrsb.inatt, 20));
    thresholds.push(50);
  } else {
    const raw = ASRS_A.filter(q => q.sub === 'inattention').reduce((s, q) => s + (state.answers[q.id] || 0), 0);
    labels.push('Inattention');
    data.push(pct(raw, 16));
    thresholds.push(50);
  }

  // Hyperactivity
  if (asrsb) {
    labels.push('Hyperactivity');
    data.push(pct(asrsb.hyper + asrsb.impuls, 28));
    thresholds.push(50);
  } else {
    const raw = ASRS_A.filter(q => q.sub === 'hyperactivity').reduce((s, q) => s + (state.answers[q.id] || 0), 0);
    labels.push('Hyperactivity');
    data.push(pct(raw, 8));
    thresholds.push(50);
  }

  // Social / Communication
  labels.push('Social Communication');
  data.push(raadsr ? pct(raadsr.social, 36) : pct(aq10.score, 10) * 1);
  thresholds.push(60);

  // Sensory
  if (raadsr) {
    labels.push('Sensory Processing');
    data.push(pct(raadsr.sensory, 36));
    thresholds.push(60);
  }

  // Circumscribed interests
  if (raadsr) {
    labels.push('Focused Interests');
    data.push(pct(raadsr.circ, 27));
    thresholds.push(60);
  }

  // Camouflaging
  if (catq) {
    labels.push('Camouflaging');
    data.push(pct(catq.total, 175));
    thresholds.push(pct(catq.thr, 175));
  }

  if (radarChart) radarChart.destroy();

  if (typeof Chart === 'undefined') {
    document.getElementById('radar-chart').parentElement.innerHTML =
      '<p style="text-align:center;color:#9CA3AF;padding:32px 0">Chart unavailable offline — view score blocks below.</p>';
    return;
  }

  const canvas = document.getElementById('radar-chart');
  radarChart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label:                'Your profile',
          data,
          backgroundColor:      'rgba(37,99,235,0.12)',
          borderColor:          '#2563EB',
          borderWidth:          2.5,
          pointBackgroundColor: '#2563EB',
          pointRadius:          4,
          pointHoverRadius:     6,
        },
        {
          label:           'Clinical threshold',
          data:            thresholds,
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor:     'rgba(156,163,175,0.7)',
          borderWidth:     1.5,
          borderDash:      [6, 4],
          pointRadius:     0,
        },
      ],
    },
    options: {
      responsive:  true,
      scales: {
        r: {
          beginAtZero: true, max: 100,
          ticks:       { display: false, stepSize: 25 },
          grid:        { color: 'rgba(229,231,235,0.8)' },
          angleLines:  { color: 'rgba(229,231,235,0.8)' },
          pointLabels: { font: { size: 11, weight: '600', family: 'Inter, sans-serif' }, color: '#374151' },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels:   { font: { size: 11 }, padding: 16, usePointStyle: true },
        },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` },
        },
      },
    },
  });
}

/* ── Interpretation ────────────────────────────────────────────── */

function renderInterpretation() {
  const { asrsa, aq10, catq, raadsr } = state.scores;
  const adhdPos = asrsa.positive;
  const asdPos  = aq10.positive;
  const body    = document.getElementById('interp-body');
  const byLine  = document.getElementById('results-by');
  let html = '';

  if (adhdPos && asdPos) {
    byLine.innerHTML = '<span class="result-badge">AuDHD profile indicated</span>';
    html += `<p><strong>Your responses are consistent with both ADHD and Autism Spectrum Condition (AuDHD).</strong> You scored above the referral threshold on both the Attention & Focus section (${asrsa.met}/6 items) and the Social & Communication section (${aq10.score}/10). AuDHD — co-occurring ADHD and autism — is increasingly recognised as a distinct presentation requiring specialist assessment.</p>`;
    if (catq && catq.positive) {
      html += `<p>Your Social Strategies score of <strong>${catq.total}/175</strong> is above the threshold, suggesting substantial masking or camouflaging. This is particularly common in women and people who received no childhood support. Masking can contribute to exhaustion, anxiety, and late diagnosis.</p>`;
    }
    html += `<p>When seeking a referral, explicitly mention both ADHD and autism — many services assess only one unless both are raised. Your GP can initiate an NHS referral, or you may be eligible to self-refer to specific services.</p>`;

  } else if (adhdPos) {
    byLine.textContent = 'ADHD traits above threshold';
    html += `<p><strong>Your responses suggest ADHD traits above the clinical referral threshold.</strong> You endorsed ${asrsa.met} of 6 Attention & Focus items at or above the frequency threshold (4 or more required).</p>`;
    html += `<p>Research-based screening tools for attention and activity traits have strong validity for identifying adults who would benefit from formal assessment. This is the starting point for a clinical evaluation by a psychiatrist or specialist psychologist.</p>`;

  } else if (asdPos) {
    byLine.textContent = 'Autism traits above threshold';
    html += `<p><strong>Your Social & Communication score of ${aq10.score}/10 is above the referral threshold of 6.</strong> This indicates autistic traits at a level that warrants further evaluation by a specialist.</p>`;
    if (catq && catq.positive) {
      html += `<p>Your Social Strategies score of <strong>${catq.total}/175</strong> suggests you use significant effort to mask or camouflage your natural traits. High masking is associated with late diagnosis, burnout, and anxiety — and may mean your presentation appears more neurotypical to others than it feels internally.</p>`;
    }
    if (raadsr) {
      const top = topSub(raadsr);
      html += `<p>Your Life Experiences assessment scored <strong>${raadsr.total}/120</strong> — ${raadsr.positive ? 'above' : 'below'} the threshold of 32. Your highest area was <strong>${top}</strong>.</p>`;
    }

  } else {
    byLine.textContent = 'Both sections below threshold';
    html += `<p>Your responses did not reach the referral threshold on either the Attention & Focus section (${asrsa.met}/6 items) or the Social & Communication section (${aq10.score}/10). This suggests your self-reported traits are within the range typically seen in the general adult population.</p>`;
    html += `<p>These results do <em>not</em> rule out neurodivergence. Masking, burnout, and the specific framing of questions can all affect scores. If you have persistent concerns, a conversation with your GP is still worthwhile.</p>`;
  }

  body.innerHTML = html;
}

function topSub(r) {
  const map = {
    'Social Relatedness': r.social / 36,
    'Language':           r.lang   / 21,
    'Sensory-Motor':      r.sensory / 36,
    'Circumscribed Interests': r.circ / 27,
  };
  return Object.entries(map).sort((a, b) => b[1] - a[1])[0][0];
}

/* ── Next steps ────────────────────────────────────────────────── */

function renderNextSteps() {
  const { asrsa, aq10 } = state.scores;
  const adhdPos = asrsa.positive;
  const asdPos  = aq10.positive;
  const list    = document.getElementById('steps-list');
  list.innerHTML = '';

  const steps = [];

  if (adhdPos || asdPos) {
    steps.push({
      title: 'Print or save these results',
      desc:  'Use the "Save / Print PDF" button above. Sharing your scored results with your GP gives them a concrete starting point rather than a verbal description.',
    });
    steps.push({
      title: 'Book a GP appointment',
      desc:  'Ask specifically for a referral to an adult neurodevelopmental assessment service. Share your results from this screening — your GP can use them as a starting point for a referral.',
    });
    if (adhdPos) {
      steps.push({
        title: 'Right to Choose (England)',
        desc:  "After an NHS referral, if your wait exceeds 18 weeks you may be eligible to use 'Right to Choose' to access a different ADHD service. ADHD UK and Psychiatry UK both participate.",
      });
    }
    if (asdPos) {
      steps.push({
        title: 'Explore community support',
        desc:  "The National Autistic Society (autism.org.uk) and Autistic UK offer peer support, information, and guidance on getting a diagnosis — even while awaiting an NHS assessment.",
      });
    }
  } else {
    steps.push({
      title: 'Speak to your GP if concerns persist',
      desc:  "Screening tools are not perfect — your lived experience matters. If daily functioning, work, or relationships feel consistently difficult, that is worth discussing with a clinician regardless of these scores.",
    });
    steps.push({
      title: 'Consider retaking after reflection',
      desc:  'Some people find that masking suppresses their true scores. You can retake this assessment at any time.',
    });
  }

  steps.push({
    title: 'Remember: screening ≠ diagnosis',
    desc:  'Only a qualified clinician (psychiatrist, clinical psychologist, or specialist paediatrician) can diagnose ADHD, autism, or AuDHD. These results are evidence to support — not replace — that process.',
  });

  steps.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'step-item';
    li.innerHTML = `
      <div class="step-num">${i + 1}</div>
      <div>
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
    `;
    list.appendChild(li);
  });
}

/* ══ RAADS-R FLOW ════════════════════════════════════════════════ */

function renderRADSRQuestion() {
  const q = RAADSR[state.raadsrIdx];

  const pctVal = Math.round((state.raadsrIdx / RAADSR.length) * 100);
  document.getElementById('raadsr-progress-bar').style.width = pctVal + '%';
  document.getElementById('raadsr-counter').textContent = `Q ${state.raadsrIdx + 1} / ${RAADSR.length}`;
  document.getElementById('raadsr-q-text').textContent  = q.text;

  const list  = document.getElementById('raadsr-options-list');
  list.innerHTML = '';
  const saved = state.raadsrAns[q.id];

  RAADSR4.forEach((label, idx) => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'option-item' + (saved === idx ? ' selected' : '');
    btn.setAttribute('aria-pressed', saved === idx ? 'true' : 'false');

    const dot  = document.createElement('span');
    dot.className = 'option-dot';
    dot.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = label;

    btn.appendChild(dot);
    btn.appendChild(text);
    btn.addEventListener('click', () => {
      state.raadsrAns[q.id] = idx;
      document.querySelectorAll('#raadsr-options-list .option-item').forEach((b, i) => {
        const sel = i === idx;
        b.classList.toggle('selected', sel);
        b.setAttribute('aria-pressed', sel ? 'true' : 'false');
      });
      document.getElementById('raadsr-next-btn').disabled = false;
    });

    list.appendChild(btn);
  });

  document.getElementById('raadsr-prev-btn').disabled = state.raadsrIdx === 0;
  document.getElementById('raadsr-next-btn').disabled = (saved === undefined);
}

/* ══ EVENT LISTENERS ═════════════════════════════════════════════ */

document.getElementById('start-btn').addEventListener('click', startPhase1);

document.getElementById('next-btn').addEventListener('click', () => advance(1));
document.getElementById('prev-btn').addEventListener('click', () => advance(-1));

document.getElementById('raadsr-start-btn').addEventListener('click', () => {
  document.getElementById('raadsr-card').style.display = 'none';
  state.raadsrIdx = 0;
  show('screen-raadsr');
  renderRADSRQuestion();
});

document.getElementById('raadsr-next-btn').addEventListener('click', () => {
  state.raadsrIdx++;
  if (state.raadsrIdx >= RAADSR.length) {
    state.raadsrDone = true;
    showResults();
  } else {
    renderRADSRQuestion();
  }
});

document.getElementById('raadsr-prev-btn').addEventListener('click', () => {
  if (state.raadsrIdx > 0) {
    state.raadsrIdx--;
    renderRADSRQuestion();
  }
});

document.getElementById('restart-btn').addEventListener('click', () => {
  Object.assign(state, {
    phase: 'welcome', phase1Queue: [], phase2Queue: [],
    idx: 0, raadsrIdx: 0, answers: {}, raadsrAns: {},
    scores: {}, path: null, raadsrDone: false,
  });
  if (radarChart) { radarChart.destroy(); radarChart = null; }
  show('screen-welcome');
});

document.getElementById('print-btn').addEventListener('click', () => window.print());

/* ── Keyboard shortcuts ────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  const onQuiz   = document.getElementById('screen-quiz').classList.contains('active');
  const onRADSR  = document.getElementById('screen-raadsr').classList.contains('active');
  if (!onQuiz && !onRADSR) return;

  const keys = ['1','2','3','4','5','6','7'];
  if (keys.includes(e.key)) {
    const idx     = parseInt(e.key) - 1;
    const listId  = onRADSR ? 'raadsr-options-list' : 'options-list';
    const buttons = document.querySelectorAll(`#${listId} .option-item`);
    if (buttons[idx]) buttons[idx].click();
  }
  if ((e.key === 'Enter' || e.key === 'ArrowRight') && !e.repeat) {
    const btn = document.getElementById(onRADSR ? 'raadsr-next-btn' : 'next-btn');
    if (!btn.disabled) btn.click();
  }
  if (e.key === 'ArrowLeft' && !e.repeat) {
    const btn = document.getElementById(onRADSR ? 'raadsr-prev-btn' : 'prev-btn');
    if (!btn.disabled) btn.click();
  }
});

// Fix the one remaining text() call in RAADSR data (r31, r36 used text() syntax - patch at runtime)
// These were already fixed above in the array literals, but double-check:
;(function fixRADSR() {
  RAADSR.forEach(q => {
    if (typeof q.text === 'function') {
      // This shouldn't happen after the fix, but safety net:
      console.warn('text() found on', q.id);
      q.text = q.id;
    }
  });
})();
