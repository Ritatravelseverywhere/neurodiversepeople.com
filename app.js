/* ─────────────────────────────────────────────────────────────────
   NeuroScreen · neurodiversepeople.com
   Instruments: ASRS-v1.1 · AQ-10 · CAT-Q · RAADS-R (40-item)
───────────────────────────────────────────────────────────────── */

'use strict';

/* ══ SCALES ══════════════════════════════════════════════════════ */

const FREQ5   = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];
const AGREE4  = ['Definitely agree', 'Slightly agree', 'Slightly disagree', 'Definitely disagree'];
const LIKERT7 = ['Strongly disagree', 'Disagree', 'Slightly disagree', 'Neutral', 'Slightly agree', 'Agree', 'Strongly agree'];
const RAADSR4 = ['True now and when I was young', 'True only now', 'True only when I was younger (under 16)', 'Never true'];

/* ══ QUESTION BANKS ══════════════════════════════════════════════ */

/* ASRS-v1.1 Part A — 6 items (WHO Adult ADHD Self-Report Scale)
   Scale: FREQ5 (0–4)
   Clinical threshold per item: Q1-4 → ≥2 (Sometimes), Q5-6 → ≥3 (Often)
   Positive screen: 4+ items at or above their threshold                 */
const ASRS_A = [
  { id:'a1', text:'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',           sub:'inattention',   thr:2 },
  { id:'a2', text:'How often do you have difficulty getting things in order when you have to do a task that requires organisation?',                sub:'inattention',   thr:2 },
  { id:'a3', text:'How often do you have problems remembering appointments or obligations?',                                                        sub:'inattention',   thr:2 },
  { id:'a4', text:'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',                          sub:'inattention',   thr:2 },
  { id:'a5', text:'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',                          sub:'hyperactivity', thr:3 },
  { id:'a6', text:'How often do you feel overly active and compelled to do things, as if you were driven by a motor?',                             sub:'hyperactivity', thr:3 },
];

/* ASRS-v1.1 Part B — 12 items (triggered if Part A positive)
   Scale: FREQ5 (0–4)                                                    */
const ASRS_B = [
  { id:'b1',  text:'How often do you make careless mistakes when you have to work on a boring or difficult project?',                              sub:'inattention'   },
  { id:'b2',  text:'How often do you have difficulty keeping your attention when doing boring or repetitive work?',                                sub:'inattention'   },
  { id:'b3',  text:'How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?',       sub:'inattention'   },
  { id:'b4',  text:'How often do you misplace or have difficulty finding things at home or at work?',                                              sub:'inattention'   },
  { id:'b5',  text:'How often are you distracted by activity or noise around you?',                                                               sub:'inattention'   },
  { id:'b6',  text:'How often do you leave your seat in meetings or situations where you are expected to remain seated?',                          sub:'hyperactivity' },
  { id:'b7',  text:'How often do you feel restless or fidgety?',                                                                                  sub:'hyperactivity' },
  { id:'b8',  text:'How often do you have difficulty unwinding and relaxing when you have time to yourself?',                                     sub:'hyperactivity' },
  { id:'b9',  text:'How often do you feel overly active and compelled to do things, as if you were driven by a motor?',                           sub:'hyperactivity' },
  { id:'b10', text:'How often do you find yourself talking too much when you are in social situations?',                                           sub:'hyperactivity' },
  { id:'b11', text:'When in a conversation, how often do you finish the sentences of the person you are talking to before they can finish them?', sub:'impulsivity'   },
  { id:'b12', text:'How often do you have difficulty waiting your turn in situations where turn-taking is required?',                              sub:'impulsivity'   },
];

/* AQ-10 — 10 items (Baron-Cohen et al.)
   Scale: AGREE4 (0–3)
   direction='autistic': agree (value 0 or 1) scores 1 point
   direction='typical':  disagree (value 2 or 3) scores 1 point
   Positive screen: ≥6                                                   */
const AQ10 = [
  { id:'q1',  text:'I often notice small sounds when others do not.',                                                              dir:'autistic', sub:'sensory'       },
  { id:'q2',  text:'I usually concentrate more on the whole picture, rather than the small details.',                             dir:'typical',  sub:'attention'     },
  { id:'q3',  text:'I find it easy to do more than one thing at once.',                                                           dir:'typical',  sub:'attention'     },
  { id:'q4',  text:'If there is an interruption, I can switch back to what I was doing very quickly.',                            dir:'typical',  sub:'attention'     },
  { id:'q5',  text:"I find it easy to 'read between the lines' when someone is talking to me.",                                  dir:'typical',  sub:'communication' },
  { id:'q6',  text:'I know how to tell if someone listening to me is getting bored.',                                             dir:'typical',  sub:'communication' },
  { id:'q7',  text:"When I'm reading a story, I find it difficult to work out the characters' intentions.",                      dir:'autistic', sub:'imagination'   },
  { id:'q8',  text:'I like to collect information about categories of things (e.g. types of car, types of bird, types of plant).', dir:'autistic', sub:'imagination'  },
  { id:'q9',  text:'I find it easy to work out what someone is thinking or feeling just by looking at their face.',               dir:'typical',  sub:'communication' },
  { id:'q10', text:"I find it difficult to work out people's intentions.",                                                        dir:'autistic', sub:'communication' },
];

/* CAT-Q — 25 items (Hull et al., 2019)
   Scale: LIKERT7 (1–7, higher = more camouflaging)
   Subscales: assimilation (7), compensation (8), masking (10)
   Clinical mean: ~88 (range 77–100 for autistic adults)                 */
const CATQ = [
  { id:'c1',  text:'I have developed a set of rules to help me understand what is expected of me in social situations.',                          sub:'assimilation' },
  { id:'c2',  text:'I observe other people closely in order to learn the unwritten rules of social interaction.',                                 sub:'assimilation' },
  { id:'c3',  text:'Before I enter a social situation, I try to prepare myself by planning what I will say and how I will act.',                  sub:'assimilation' },
  { id:'c4',  text:'I look to other people in unfamiliar social situations to know what I should do.',                                            sub:'assimilation' },
  { id:'c5',  text:'I use phrases or sayings that I have heard other people use as a way of fitting in with them.',                              sub:'assimilation' },
  { id:'c6',  text:'I research social rules and norms and use this information when talking with other people.',                                  sub:'assimilation' },
  { id:'c7',  text:"I have developed a 'social performance' or 'mask' that I use in social situations.",                                          sub:'assimilation' },
  { id:'c8',  text:'I use scripts or phrases that I have practised beforehand when talking to other people.',                                     sub:'compensation' },
  { id:'c9',  text:'I work out in advance what to say in a conversation before I say it.',                                                        sub:'compensation' },
  { id:'c10', text:"I have to work hard to understand other people's body language.",                                                             sub:'compensation' },
  { id:'c11', text:'I need to work out the meaning of facial expressions when people are talking to me.',                                         sub:'compensation' },
  { id:'c12', text:'I find it difficult to recognise when other people are joking or being sarcastic, and have to figure it out.',                sub:'compensation' },
  { id:'c13', text:'I use conversation rules I have developed in order to communicate with other people.',                                        sub:'compensation' },
  { id:'c14', text:"I have consciously learned the 'hidden rules' of social interaction.",                                                        sub:'compensation' },
  { id:'c15', text:'I need to consciously interpret what people say in order to understand their intended meaning.',                              sub:'compensation' },
  { id:'c16', text:'I adjust my body language or facial expressions so that I appear interested in the person I am talking with.',                sub:'masking'      },
  { id:'c17', text:'I mimic the body language or speech style of the person I am talking to.',                                                    sub:'masking'      },
  { id:'c18', text:'I copy the facial expressions of the people I am talking to.',                                                               sub:'masking'      },
  { id:'c19', text:'I think carefully about how I appear to other people in social situations.',                                                   sub:'masking'      },
  { id:'c20', text:'I suppress my natural urges or behaviours in social situations.',                                                             sub:'masking'      },
  { id:'c21', text:'I pretend to feel more emotions than I actually do in social situations.',                                                    sub:'masking'      },
  { id:'c22', text:'I hide my real feelings and opinions when talking with other people.',                                                        sub:'masking'      },
  { id:'c23', text:'I hide aspects of myself that I think other people will find strange.',                                                       sub:'masking'      },
  { id:'c24', text:'I behave very differently in different social situations, adapting to whoever I am with.',                                    sub:'masking'      },
  { id:'c25', text:'In social situations, I feel like I am performing or putting on an act.',                                                     sub:'masking'      },
];

/* RAADS-R condensed — 40 representative items (Ritvo et al., 2011)
   Scale: RAADSR4 (0–3, scored from most autistic to never true)
   reverse=true items are scored 3-v instead of v
   Subscales: social (12), language (7), sensory (12), circumscribed (9)
   Clinical cutoff: ≥32 (scaled from full 80-item cutoff of 65)          */
const RAADSR = [
  { id:'r1',  text:'I am a sympathetic person.',                                                                                  sub:'social',        rev:true  },
  { id:'r2',  text:'I often use words and phrases from movies or television in my own conversations.',                            sub:'social',        rev:false },
  { id:'r3',  text:'I am often told that I talk too much about certain topics.',                                                   sub:'social',        rev:false },
  { id:'r4',  text:'I do not know how to connect with people.',                                                                   sub:'social',        rev:false },
  { id:'r5',  text:'It is easy for me to ask for other people\'s help.',                                                          sub:'social',        rev:true  },
  { id:'r6',  text:'I always have difficulty seeing things from another person\'s perspective.',                                  sub:'social',        rev:false },
  { id:'r7',  text:'I would rather talk to myself than with others.',                                                             sub:'social',        rev:false },
  { id:'r8',  text:'I am comfortable with unplanned changes to social events.',                                                   sub:'social',        rev:true  },
  { id:'r9',  text:'I do not understand why some people get embarrassed.',                                                        sub:'social',        rev:false },
  { id:'r10', text:'Socialising is harder for me than it seems to be for most others.',                                           sub:'social',        rev:false },
  { id:'r11', text:'I have been told I have an unusual voice (e.g. monotone, flat, or overly formal).',                          sub:'social',        rev:false },
  { id:'r12', text:'I focus on details rather than the overall idea.',                                                            sub:'social',        rev:false },
  { id:'r13', text:'I take things very literally, so I often miss what people are really trying to say.',                        sub:'language',      rev:false },
  { id:'r14', text:'I have a very good memory for facts and details.',                                                            sub:'language',      rev:false },
  { id:'r15', text:'I sometimes say things that other people find rude, but I am not aware I have done this.',                   sub:'language',      rev:false },
  { id:'r16', text:'People often tell me I repeat myself.',                                                                       sub:'language',      rev:false },
  { id:'r17', text:'I notice patterns in things all the time.',                                                                   sub:'language',      rev:false },
  { id:'r18', text:'I find it hard to start or carry on a conversation.',                                                         sub:'language',      rev:false },
  { id:'r19', text:'I easily understand abstract ideas and metaphors.',                                                           sub:'language',      rev:true  },
  { id:'r20', text:'I am overwhelmed by sensory stimuli that do not bother other people (e.g. strong smells, bright lights, loud sounds).', sub:'sensory', rev:false },
  { id:'r21', text:'I have extreme sensitivity to textures of fabrics or foods.',                                                 sub:'sensory',       rev:false },
  { id:'r22', text:'I find it difficult to tolerate unexpected or uninvited touch from people.',                                  sub:'sensory',       rev:false },
  { id:'r23', text:'Certain everyday sounds are very distressing or painful to me.',                                              sub:'sensory',       rev:false },
  { id:'r24', text:'I notice details that others do not notice.',                                                                 sub:'sensory',       rev:false },
  { id:'r25', text:'When I look at something, I find it hard to take in the whole picture at once.',                             sub:'sensory',       rev:false },
  { id:'r26', text:'I have very strong reactions to changes in temperature.',                                                     sub:'sensory',       rev:false },
  { id:'r27', text:'I often rock or sway my body when I am sitting.',                                                             sub:'sensory',       rev:false },
  { id:'r28', text:'I notice when people\'s faces are even slightly asymmetrical.',                                               sub:'sensory',       rev:false },
  { id:'r29', text:'I have unusual body movements (such as hand-flapping, spinning, or rocking).',                               sub:'sensory',       rev:false },
  { id:'r30', text:'I can handle large amounts of pain or physical discomfort without reaction.',                                 sub:'sensory',       rev:false },
  { id:'r31', text:'I am bothered by uncomfortable clothing textures or seams in socks.',                                        sub:'sensory',       rev:false },
  { id:'r32', text:'I have a very strong interest in a few specific topics and know a great deal about them.',                    sub:'circumscribed', rev:false },
  { id:'r33', text:'I am happiest when I am following my own routine.',                                                           sub:'circumscribed', rev:false },
  { id:'r34', text:'I strongly prefer things to stay the same and get upset when they change.',                                   sub:'circumscribed', rev:false },
  { id:'r35', text:'I have to follow a set routine when doing everyday things.',                                                  sub:'circumscribed', rev:false },
  { id:'r36', text:'I collect things of specific interest and keep them in a precise order.',                                     sub:'circumscribed', rev:false },
  { id:'r37', text:'I notice when objects in my environment have been moved or rearranged.',                                      sub:'circumscribed', rev:false },
  { id:'r38', text:'I find it difficult to adapt to changes in daily routine.',                                                   sub:'circumscribed', rev:false },
  { id:'r39', text:'I have always had a special interest that few others share.',                                                 sub:'circumscribed', rev:false },
  { id:'r40', text:'I become very upset if I cannot carry out my usual routines.',                                                sub:'circumscribed', rev:false },
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
  asrs_a: 'ASRS-v1.1 Part A',
  asrs_b: 'ASRS-v1.1 Part B',
  aq10:   'AQ-10',
  catq:   'CAT-Q',
};

const PHASE_LABELS = {
  asrs_a: 'Phase 1 · Attention Screen',
  aq10:   'Phase 1 · Autism Screen',
  asrs_b: 'Phase 2 · ADHD Deep Dive',
  catq:   'Phase 2 · Camouflaging',
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
    { label: `ASRS-v1.1 Part A: ${asrsa.met}/6 items above threshold${asrsa.positive ? ' — positive' : ''}`, done: true },
    { label: `AQ-10: ${aq10.score}/10${aq10.positive ? ' — positive' : ''}`,                                  done: true },
    { label: getPathLabel(state.path),                                                                         done: true },
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
    adhd:  'Adaptive path: ADHD — loading ASRS-v1.1 Part B',
    asd:   'Adaptive path: Autism — loading CAT-Q',
    audhd: 'Adaptive path: AuDHD — loading ASRS-v1.1 Part B + CAT-Q',
    sub:   'Both screens below threshold — preparing summary',
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

  const { asrsa, aq10 } = state.scores;
  const showRADSR = (aq10.positive || asrsa.positive) && !state.raadsrDone;
  if (showRADSR) document.getElementById('raadsr-card').style.display = 'block';
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
    name:   'ADHD — ASRS-v1.1',
    badge:  asrsa.positive ? 'Positive screen' : 'Below threshold',
    level:  lvl(asrsa.met, 4),
    score:  asrsa.met,
    thr:    4,
    max:    6,
    unit:   '/ 6 items',
    detail: `${asrsa.met} of 6 Part A items reached clinical frequency threshold (4+ = positive screen).${asrsb ? ` Part B inattention: ${asrsb.inatt}/20 · Hyperactivity: ${asrsb.hyper}/20` : ''}`,
  });

  // Autism AQ-10
  addScoreBlock(container, {
    name:   'Autism — AQ-10',
    badge:  aq10.positive ? 'Positive screen' : 'Below threshold',
    level:  lvl(aq10.score, 6),
    score:  aq10.score,
    thr:    6,
    max:    10,
    unit:   '/ 10',
    detail: `Score of ${aq10.score}/10. Clinical referral threshold: 6 or above.`,
  });

  // CAT-Q
  if (catq) {
    addScoreBlock(container, {
      name:   'Camouflaging — CAT-Q',
      badge:  catq.positive ? 'High camouflaging' : 'Below threshold',
      level:  lvl(catq.total, catq.thr),
      score:  catq.total,
      thr:    catq.thr,
      max:    175,
      unit:   '/ 175',
      detail: `Assimilation ${catq.assim}/49 · Compensation ${catq.comp}/56 · Masking ${catq.mask}/70. Clinical mean threshold: ~88.`,
    });
  }

  // RAADS-R
  if (raadsr) {
    addScoreBlock(container, {
      name:   'Autism — RAADS-R (condensed)',
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
    html += `<p><strong>Your responses are consistent with both ADHD and Autism Spectrum Condition (AuDHD).</strong> You reached the clinical referral threshold on the ASRS-v1.1 Part A (${asrsa.met}/6 items) and the AQ-10 (${aq10.score}/10). AuDHD — co-occurring ADHD and autism — is increasingly recognised as a distinct presentation requiring specialist assessment.</p>`;
    if (catq && catq.positive) {
      html += `<p>Your CAT-Q score of <strong>${catq.total}/175</strong> is above the clinical threshold, suggesting substantial camouflaging or masking. This is particularly common in women and people who received no childhood support. Masking can contribute to exhaustion, anxiety, and late diagnosis.</p>`;
    }
    html += `<p>When seeking a referral, explicitly mention both ADHD and autism — many services assess only one unless both are requested. Your GP can initiate an NHS referral, or you may be eligible to self-refer to specific services.</p>`;

  } else if (adhdPos) {
    byLine.textContent = 'ADHD traits above clinical threshold';
    html += `<p><strong>Your responses are consistent with ADHD traits above the clinical referral threshold.</strong> You endorsed ${asrsa.met} of 6 Part A items at or above the clinical frequency level (4 or more required for a positive screen).</p>`;
    html += `<p>The ASRS-v1.1 has strong published validity for detecting adult ADHD. A positive Part A screen is the starting point for a formal clinical assessment by a psychiatrist or specialist psychologist.</p>`;

  } else if (asdPos) {
    byLine.textContent = 'Autism traits above clinical threshold';
    html += `<p><strong>Your AQ-10 score of ${aq10.score}/10 is above the clinical referral threshold of 6.</strong> The AQ-10 indicates the presence of autistic traits at a level that warrants further evaluation.</p>`;
    if (catq && catq.positive) {
      html += `<p>Your CAT-Q score of <strong>${catq.total}/175</strong> suggests you use significant effort to mask or camouflage autistic traits. High masking scores are associated with late diagnosis, burnout, and anxiety — and may mean your presentation appears more neurotypical to others than it feels internally.</p>`;
    }
    if (raadsr) {
      const top = topSub(raadsr);
      html += `<p>The RAADS-R (condensed) scored <strong>${raadsr.total}/120</strong> — ${raadsr.positive ? 'above' : 'below'} the threshold of 32. Your highest subscale was <strong>${top}</strong>.</p>`;
    }

  } else {
    byLine.textContent = 'Both screens below clinical threshold';
    html += `<p>Your responses did not reach the clinical referral threshold on either the ASRS-v1.1 Part A (${asrsa.met}/6 items) or the AQ-10 (${aq10.score}/10). This means your self-reported traits are within the range typically seen in the general adult population on these instruments.</p>`;
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
      desc:  'Ask specifically for a referral to an adult neurodevelopmental assessment service. Mention the screening tools used here (ASRS-v1.1 and AQ-10) and your scores.',
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
