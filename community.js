/* NeuroDiverse People — Community forums
   Backend: Supabase (project neurodiversepeople-community).
   The anon key is public by design; Row Level Security protects all data. */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://metnofxgjvltigctpzxo.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldG5vZnhnanZsdGlnY3RwenhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDkwODEsImV4cCI6MjEwNzEyNTA4MX0.UCaThNfoEpfQV7_EC9JYkuRVn-CtVPVcwNn__Wp_HAc';

  var supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  var state = { session: null, profile: null };

  var view = document.getElementById('view');
  var authbar = document.getElementById('authbar');

  /* ---------- tiny DOM helpers (textContent-only for user data) ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') n.className = attrs[k];
        else if (k === 'text') n.textContent = attrs[k];
        else if (k === 'html') n.innerHTML = attrs[k]; // only used with trusted static strings
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function timeAgo(iso) {
    var s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'just now';
    var m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
    var h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    var d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function param(name) { return new URLSearchParams(location.search).get(name); }
  function go(search) { history.pushState({}, '', 'community.html' + (search ? '?' + search : '')); route(); }

  /* ---------------------- auth ---------------------- */
  function isLoggedIn() { return !!state.session; }
  function uid() { return state.session ? state.session.user.id : null; }

  async function loadProfile() {
    state.profile = null;
    if (!state.session) return;
    var r = await supa.from('profiles').select('id, display_name, is_moderator, is_banned').eq('id', uid()).maybeSingle();
    state.profile = r.data || null;
  }

  function renderAuthbar() {
    clear(authbar);
    if (isLoggedIn() && state.profile) {
      var who = el('span', { class: 'who' }, ['Signed in as ']);
      who.appendChild(el('b', { text: state.profile.display_name }));
      if (state.profile.is_moderator) who.appendChild(el('span', { class: 'mod-badge', text: 'mod' }));
      authbar.appendChild(who);
      authbar.appendChild(el('button', { class: 'btn btn-ghost btn-sm', onclick: signOut }, ['Log out']));
    } else {
      authbar.appendChild(el('button', { class: 'btn btn-ghost btn-sm', onclick: function () { openAuth('login'); } }, ['Log in']));
      authbar.appendChild(el('button', { class: 'btn btn-primary btn-sm', onclick: function () { openAuth('signup'); } }, ['Sign up']));
    }
  }

  async function signOut() { await supa.auth.signOut(); location.href = 'community.html'; }

  /* auth modal */
  var modal = document.getElementById('auth-modal');
  var authForm = document.getElementById('auth-form');
  var authMode = 'login';
  function openAuth(mode) { authMode = mode; paintAuth(); modal.classList.add('open'); }
  function closeAuth() { modal.classList.remove('open'); document.getElementById('auth-msg').innerHTML = ''; authForm.reset(); }
  function paintAuth() {
    var signup = authMode === 'signup';
    document.getElementById('auth-title').textContent = signup ? 'Create your account' : 'Log in';
    document.getElementById('auth-sub').textContent = signup ? 'Pick a display name — you stay anonymous.' : 'Welcome back.';
    document.getElementById('field-name').style.display = signup ? 'block' : 'none';
    document.getElementById('f-name').required = signup;
    document.getElementById('f-pass').setAttribute('autocomplete', signup ? 'new-password' : 'current-password');
    document.getElementById('auth-submit').textContent = signup ? 'Create account' : 'Log in';
    var sw = document.getElementById('auth-switch'); clear(sw);
    sw.appendChild(document.createTextNode(signup ? 'Already have an account? ' : 'New here? '));
    sw.appendChild(el('button', { onclick: function () { authMode = signup ? 'login' : 'signup'; document.getElementById('auth-msg').innerHTML = ''; paintAuth(); } }, [signup ? 'Log in' : 'Create an account']));
  }
  function authMsg(kind, text) {
    var box = document.getElementById('auth-msg'); clear(box);
    if (text) box.appendChild(el('div', { class: kind === 'ok' ? 'form-ok' : 'form-err', text: text }));
  }
  document.getElementById('auth-close').addEventListener('click', closeAuth);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeAuth(); });

  authForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = document.getElementById('f-email').value.trim();
    var pass = document.getElementById('f-pass').value;
    var submit = document.getElementById('auth-submit');
    submit.disabled = true;
    authMsg();
    try {
      if (authMode === 'signup') {
        var name = document.getElementById('f-name').value.trim();
        if (name.length < 3 || name.length > 30) { authMsg('err', 'Display name must be 3–30 characters.'); submit.disabled = false; return; }
        // pre-check availability (best-effort; DB unique constraint is the real guard)
        var taken = await supa.from('profiles').select('id').eq('display_name', name).maybeSingle();
        if (taken.data) { authMsg('err', 'That display name is taken — try another.'); submit.disabled = false; return; }
        var up = await supa.auth.signUp({ email: email, password: pass, options: { data: { display_name: name } } });
        if (up.error) { authMsg('err', friendly(up.error.message)); submit.disabled = false; return; }
        if (!up.data.session) {
          authMsg('ok', 'Account created. Check your email to confirm your address, then log in.');
          authMode = 'login'; paintAuth(); submit.disabled = false; return;
        }
        state.session = up.data.session;
        await afterAuth();
      } else {
        var inp = await supa.auth.signInWithPassword({ email: email, password: pass });
        if (inp.error) { authMsg('err', friendly(inp.error.message)); submit.disabled = false; return; }
        state.session = inp.data.session;
        await afterAuth();
      }
    } catch (err) {
      authMsg('err', 'Something went wrong. Please try again.');
      submit.disabled = false;
    }
  });
  function friendly(msg) {
    if (/already registered/i.test(msg)) return 'That email already has an account — try logging in.';
    if (/invalid login/i.test(msg)) return 'Email or password is incorrect.';
    if (/duplicate key|display_name/i.test(msg)) return 'That display name is taken — try another.';
    return msg;
  }
  async function afterAuth() {
    await loadProfile();
    document.getElementById('auth-submit').disabled = false;
    closeAuth();
    renderAuthbar();
    route();
  }

  function requireAuth() {
    if (!isLoggedIn()) { openAuth('login'); return false; }
    if (state.profile && state.profile.is_banned) return false;
    return true;
  }

  /* ---------------------- data ---------------------- */
  function postSelect() {
    return 'id, forum_id, author_id, title, body, score, comment_count, is_removed, created_at, profiles(display_name)';
  }

  async function myVotes(ids, col) {
    var map = {};
    if (!isLoggedIn() || !ids.length) return map;
    var r = await supa.from('votes').select(col + ', value').in(col, ids).eq('user_id', uid());
    (r.data || []).forEach(function (v) { map[v[col]] = v.value; });
    return map;
  }

  async function castVote(col, id, value, onDone) {
    if (!requireAuth()) return;
    var existing = await supa.from('votes').select('value').eq('user_id', uid()).eq(col, id).maybeSingle();
    if (!existing.data) {
      await supa.from('votes').insert({ user_id: uid(), post_id: col === 'post_id' ? id : null, comment_id: col === 'comment_id' ? id : null, value: value });
    } else if (existing.data.value === value) {
      await supa.from('votes').delete().eq('user_id', uid()).eq(col, id);
    } else {
      await supa.from('votes').update({ value: value }).eq('user_id', uid()).eq(col, id);
    }
    try { gtag('event', 'community_vote', { kind: col, value: value }); } catch (e) {}
    onDone();
  }

  async function reportContent(col, id) {
    if (!requireAuth()) return;
    var reason = prompt('Briefly, what’s wrong with this? (optional)');
    if (reason === null) return;
    await supa.from('reports').insert({ reporter_id: uid(), post_id: col === 'post_id' ? id : null, comment_id: col === 'comment_id' ? id : null, reason: reason || null });
    try { gtag('event', 'community_report', { kind: col }); } catch (e) {}
    alert('Thanks — a moderator will review this.');
  }

  async function modRemove(table, id, onDone) {
    if (!confirm('Remove this content? It will be hidden from the community.')) return;
    await supa.from(table).update({ is_removed: true }).eq('id', id);
    onDone();
  }

  /* ---------------------- vote widget ---------------------- */
  function voteWidget(col, id, score, myVote, horizontal, reload) {
    var box = el('div', { class: horizontal ? 'votebox cvote' : 'votebox' });
    var up = el('button', { class: 'vote-arrow up' + (myVote === 1 ? ' on' : ''), title: 'Upvote', 'aria-label': 'Upvote', text: '▲' });
    var sc = el('span', { class: 'vote-score', text: String(score) });
    var dn = el('button', { class: 'vote-arrow down' + (myVote === -1 ? ' on' : ''), title: 'Downvote', 'aria-label': 'Downvote', text: '▼' });
    up.addEventListener('click', function () { castVote(col, id, 1, reload); });
    dn.addEventListener('click', function () { castVote(col, id, -1, reload); });
    box.appendChild(up); box.appendChild(sc); box.appendChild(dn);
    return box;
  }

  /* ---------------------- views ---------------------- */
  async function viewForumList() {
    clear(view);
    view.appendChild(disclaimer());
    var head = el('div', { class: 'section-head' }, [el('h2', { text: 'Forums' })]);
    view.appendChild(head);
    var r = await supa.from('forums').select('id, slug, name, description').order('sort_order', { ascending: true });
    if (r.error) { view.appendChild(errorBox()); return; }
    if (!r.data.length) { view.appendChild(el('div', { class: 'empty', text: 'No forums yet.' })); return; }
    r.data.forEach(function (f) {
      var card = el('a', { class: 'forum-card', href: 'community.html?forum=' + encodeURIComponent(f.slug) });
      card.addEventListener('click', function (e) { e.preventDefault(); go('forum=' + encodeURIComponent(f.slug)); });
      card.appendChild(el('h3', { text: f.name }));
      if (f.description) card.appendChild(el('p', { text: f.description }));
      view.appendChild(card);
    });
    view.appendChild(rules());
  }

  async function viewForum(slug) {
    clear(view);
    var sort = param('sort') === 'new' ? 'new' : 'top';
    var fr = await supa.from('forums').select('id, slug, name, description').eq('slug', slug).maybeSingle();
    if (fr.error || !fr.data) { view.appendChild(notFound('That forum doesn’t exist.')); return; }
    var forum = fr.data;

    view.appendChild(crumbs([['Community', ''], [forum.name, null]]));
    var head = el('div', { class: 'section-head' });
    head.appendChild(el('h2', { text: forum.name }));
    var right = el('div', { style: 'display:flex;gap:10px;align-items:center;flex-wrap:wrap' });
    var tabs = el('div', { class: 'sort-tabs' });
    tabs.appendChild(el('button', { class: sort === 'top' ? 'active' : '', onclick: function () { go('forum=' + encodeURIComponent(slug) + '&sort=top'); } }, ['Top']));
    tabs.appendChild(el('button', { class: sort === 'new' ? 'active' : '', onclick: function () { go('forum=' + encodeURIComponent(slug) + '&sort=new'); } }, ['New']));
    right.appendChild(tabs);
    right.appendChild(el('button', { class: 'btn btn-primary btn-sm', onclick: function () { toggleNewPost(forum); } }, ['+ New post']));
    head.appendChild(right);
    view.appendChild(head);

    if (forum.description) view.appendChild(el('div', { class: 'forum-desc', text: forum.description }));
    view.appendChild(el('div', { id: 'newpost-slot' }));

    var q = supa.from('posts').select(postSelect()).eq('forum_id', forum.id);
    q = sort === 'new' ? q.order('created_at', { ascending: false }) : q.order('score', { ascending: false }).order('created_at', { ascending: false });
    var pr = await q.limit(100);
    if (pr.error) { view.appendChild(errorBox()); return; }
    var posts = pr.data;
    var votes = await myVotes(posts.map(function (p) { return p.id; }), 'post_id');
    if (!posts.length) { view.appendChild(el('div', { class: 'empty', text: 'No posts yet — be the first to start a conversation.' })); return; }
    posts.forEach(function (p) { view.appendChild(postRow(p, forum, votes[p.id])); });
  }

  function postRow(p, forum, myVote) {
    var row = el('div', { class: 'post-row' });
    row.appendChild(voteWidget('post_id', p.id, p.score, myVote, false, function () { viewForum(forum.slug); }));
    var main = el('div', { class: 'post-main' });
    var title = el('a', { class: 'ptitle', href: 'community.html?forum=' + encodeURIComponent(forum.slug) + '&post=' + p.id });
    title.textContent = p.is_removed ? '[removed]' : p.title;
    if (p.is_removed) title.className += ' removed';
    title.addEventListener('click', function (e) { e.preventDefault(); go('forum=' + encodeURIComponent(forum.slug) + '&post=' + p.id); });
    main.appendChild(title);
    main.appendChild(metaLine(p));
    row.appendChild(main);
    return row;
  }

  async function viewPost(slug, postId) {
    clear(view);
    var pr = await supa.from('posts').select(postSelect() + ', forums(slug, name)').eq('id', postId).maybeSingle();
    if (pr.error || !pr.data) { view.appendChild(notFound('That post doesn’t exist or was removed.')); return; }
    var p = pr.data;
    var forumName = p.forums ? p.forums.name : 'Forum';
    var forumSlug = p.forums ? p.forums.slug : slug;
    var reload = function () { viewPost(forumSlug, postId); };

    view.appendChild(crumbs([['Community', ''], [forumName, 'forum=' + encodeURIComponent(forumSlug)], ['Post', null]]));

    var myV = (await myVotes([p.id], 'post_id'))[p.id];
    var wrap = el('div', { class: 'post-row' });
    wrap.appendChild(voteWidget('post_id', p.id, p.score, myV, false, reload));
    var main = el('div', { class: 'post-main' });
    var h = el('h2', { style: 'font-size:1.3rem;font-weight:800;line-height:1.3' });
    h.textContent = p.is_removed ? '[removed]' : p.title;
    main.appendChild(h);
    main.appendChild(metaLine(p));
    if (!p.is_removed && p.body) main.appendChild(el('div', { class: 'pbody', text: p.body }));
    else if (p.is_removed) main.appendChild(el('div', { class: 'pbody removed', text: 'This post was removed by a moderator.' }));
    main.appendChild(contentActions('post_id', 'posts', p, reload));
    wrap.appendChild(main);
    view.appendChild(wrap);

    // comment composer
    var composer = el('div', { class: 'card' }, [el('h3', { text: 'Add a comment' })]);
    var ta = el('textarea', { id: 'c-body', maxlength: '10000', placeholder: 'Share your thoughts, support or experience…' });
    composer.appendChild(ta);
    var cerr = el('div', { id: 'c-err' });
    composer.appendChild(cerr);
    composer.appendChild(el('button', { class: 'btn btn-primary', onclick: function () { submitComment(postId, null, ta, cerr, reload); } }, ['Post comment']));
    view.appendChild(composer);

    // comments
    var cr = await supa.from('comments').select('id, post_id, parent_id, author_id, body, score, is_removed, created_at, profiles(display_name)').eq('post_id', postId).order('created_at', { ascending: true });
    if (cr.error) { view.appendChild(errorBox()); return; }
    var comments = cr.data;
    var cVotes = await myVotes(comments.map(function (c) { return c.id; }), 'comment_id');
    var cont = el('div', { id: 'comments' });
    view.appendChild(cont);
    if (!comments.length) { cont.appendChild(el('div', { class: 'empty', text: 'No comments yet.' })); return; }
    renderCommentTree(comments, cVotes, cont, postId, reload);
  }

  function renderCommentTree(comments, cVotes, container, postId, reload) {
    var byParent = {};
    comments.forEach(function (c) { var k = c.parent_id || 'root'; (byParent[k] = byParent[k] || []).push(c); });
    clear(container);
    function render(parentKey, parentEl) {
      (byParent[parentKey] || []).forEach(function (c) {
        var n = commentNode(c, cVotes[c.id], postId, reload);
        parentEl.appendChild(n);
        render(c.id, n); // nest replies inside this node
      });
    }
    render('root', container);
  }

  function commentNode(c, myVote, postId, reload) {
    var node = el('div', { class: 'comment' });
    var top = el('div', { style: 'display:flex;align-items:center;gap:10px' });
    top.appendChild(voteWidget('comment_id', c.id, c.score, myVote, true, reload));
    var name = el('span', { class: 'meta' });
    name.appendChild(el('b', { text: c.is_removed ? '[removed]' : (c.profiles ? c.profiles.display_name : 'member') }));
    name.appendChild(document.createTextNode(' · ' + timeAgo(c.created_at)));
    top.appendChild(name);
    node.appendChild(top);
    var body = el('div', { class: 'cbody' + (c.is_removed ? ' removed' : '') });
    body.textContent = c.is_removed ? 'This comment was removed by a moderator.' : c.body;
    node.appendChild(body);
    if (!c.is_removed) node.appendChild(commentActions(c, postId, reload));
    return node;
  }

  function commentActions(c, postId, reload) {
    var row = el('div', { class: 'comment-actions' });
    row.appendChild(el('button', { class: 'linkbtn', onclick: function () { inlineReply(c, postId, reload, row); } }, ['Reply']));
    row.appendChild(el('button', { class: 'linkbtn danger', onclick: function () { reportContent('comment_id', c.id); } }, ['Report']));
    if (canModerate() || (isLoggedIn() && c.author_id === uid())) {
      row.appendChild(el('button', { class: 'linkbtn danger', onclick: function () {
        if (canModerate()) modRemove('comments', c.id, reload);
        else deleteOwn('comments', c.id, reload);
      } }, [canModerate() ? 'Remove' : 'Delete']));
    }
    return row;
  }

  function inlineReply(parent, postId, reload, afterEl) {
    if (!requireAuth()) return;
    if (afterEl.parentNode.querySelector('.reply-box')) return;
    var box = el('div', { class: 'reply-box', style: 'margin-top:10px' });
    var ta = el('textarea', { maxlength: '10000', placeholder: 'Reply to ' + (parent.profiles ? parent.profiles.display_name : 'this comment') + '…' });
    var err = el('div');
    box.appendChild(ta); box.appendChild(err);
    var actions = el('div', { style: 'display:flex;gap:8px' });
    actions.appendChild(el('button', { class: 'btn btn-primary btn-sm', onclick: function () { submitComment(postId, parent.id, ta, err, reload); } }, ['Reply']));
    actions.appendChild(el('button', { class: 'btn btn-ghost btn-sm', onclick: function () { box.remove(); } }, ['Cancel']));
    box.appendChild(actions);
    afterEl.parentNode.appendChild(box);
    ta.focus();
  }

  async function submitComment(postId, parentId, ta, errSlot, reload) {
    if (!requireAuth()) return;
    var body = ta.value.trim();
    clear(errSlot);
    if (!body) { errSlot.appendChild(el('div', { class: 'form-err', text: 'Please write something first.' })); return; }
    var ins = await supa.from('comments').insert({ post_id: postId, parent_id: parentId, author_id: uid(), body: body });
    if (ins.error) { errSlot.appendChild(el('div', { class: 'form-err', text: friendly(ins.error.message) })); return; }
    try { gtag('event', 'community_comment', { reply: !!parentId }); } catch (e) {}
    reload();
  }

  async function deleteOwn(table, id, reload) {
    if (!confirm('Delete this? This can’t be undone.')) return;
    await supa.from(table).delete().eq('id', id);
    reload();
  }

  /* new post form */
  function toggleNewPost(forum) {
    if (!requireAuth()) return;
    var slot = document.getElementById('newpost-slot');
    if (slot.firstChild) { clear(slot); return; }
    var card = el('div', { class: 'card' }, [el('h3', { text: 'Start a new post' })]);
    var title = el('input', { id: 'np-title', type: 'text', maxlength: '200', placeholder: 'Title' });
    var body = el('textarea', { id: 'np-body', maxlength: '20000', placeholder: 'Share your experience, question or strategy…' });
    var err = el('div');
    card.appendChild(el('label', { text: 'Title' })); card.appendChild(title);
    card.appendChild(el('label', { text: 'Body' })); card.appendChild(body);
    card.appendChild(err);
    var actions = el('div', { style: 'display:flex;gap:8px' });
    actions.appendChild(el('button', { class: 'btn btn-primary', onclick: function () { submitPost(forum, title, body, err); } }, ['Post']));
    actions.appendChild(el('button', { class: 'btn btn-ghost', onclick: function () { clear(slot); } }, ['Cancel']));
    card.appendChild(actions);
    clear(slot); slot.appendChild(card);
    title.focus();
  }

  async function submitPost(forum, titleEl, bodyEl, errSlot) {
    if (!requireAuth()) return;
    var title = titleEl.value.trim(), body = bodyEl.value.trim();
    clear(errSlot);
    if (title.length < 3) { errSlot.appendChild(el('div', { class: 'form-err', text: 'Give your post a title (at least 3 characters).' })); return; }
    var ins = await supa.from('posts').insert({ forum_id: forum.id, author_id: uid(), title: title, body: body }).select('id').maybeSingle();
    if (ins.error) { errSlot.appendChild(el('div', { class: 'form-err', text: friendly(ins.error.message) })); return; }
    try { gtag('event', 'community_post'); } catch (e) {}
    go('forum=' + encodeURIComponent(forum.slug) + '&post=' + ins.data.id);
  }

  /* ---------------------- shared bits ---------------------- */
  function canModerate() { return isLoggedIn() && state.profile && state.profile.is_moderator; }

  function metaLine(p) {
    var m = el('div', { class: 'meta' });
    m.appendChild(el('b', { text: p.profiles ? p.profiles.display_name : 'member' }));
    m.appendChild(document.createTextNode(' · ' + timeAgo(p.created_at) + ' · ' + p.comment_count + ' comment' + (p.comment_count === 1 ? '' : 's')));
    return m;
  }

  function contentActions(col, table, p, reload) {
    var row = el('div', { class: 'comment-actions', style: 'margin-top:12px' });
    row.appendChild(el('button', { class: 'linkbtn danger', onclick: function () { reportContent(col, p.id); } }, ['Report']));
    if (canModerate() && !p.is_removed) row.appendChild(el('button', { class: 'linkbtn danger', onclick: function () { modRemove(table, p.id, reload); } }, ['Remove']));
    else if (isLoggedIn() && p.author_id === uid() && !p.is_removed) row.appendChild(el('button', { class: 'linkbtn danger', onclick: function () { deleteOwn(table, p.id, reload); } }, ['Delete']));
    return row;
  }

  function crumbs(parts) {
    var c = el('div', { class: 'crumbs' });
    parts.forEach(function (pair, i) {
      var label = pair[0], search = pair[1];
      if (search === null) { c.appendChild(document.createTextNode(label)); }
      else {
        var a = el('a', { href: 'community.html' + (search ? '?' + search : ''), text: label });
        a.addEventListener('click', function (e) { e.preventDefault(); go(search); });
        c.appendChild(a);
      }
      if (i < parts.length - 1) c.appendChild(document.createTextNode('  ›  '));
    });
    return c;
  }

  function disclaimer() {
    return el('div', { class: 'disclaimer' }, [
      el('strong', { text: 'Peer support, not medical advice. ' }),
      'This community is a space to share lived experience. Nothing here is a diagnosis or a substitute for care from a qualified clinician. Be kind, protect your privacy, and never share personal identifying details.'
    ]);
  }

  function rules() {
    var d = el('details', { class: 'rules', style: 'margin-top:24px' });
    d.appendChild(el('summary', { text: 'Community rules' }));
    var ul = el('ul');
    ['Be respectful and supportive — we’re all figuring this out.',
     'No medical advice, diagnosis or dosing recommendations.',
     'Protect your privacy: use a display name, not your real one, and don’t post identifying details.',
     'No promotion, spam, or selling.',
     'Report anything harmful — a moderator will review it.'
    ].forEach(function (t) { ul.appendChild(el('li', { text: t })); });
    d.appendChild(ul);
    return d;
  }

  function errorBox() { return el('div', { class: 'empty', text: 'Couldn’t load this right now. Please refresh.' }); }
  function notFound(msg) {
    var box = el('div', { class: 'empty' });
    box.appendChild(document.createTextNode(msg + ' '));
    var a = el('a', { href: 'community.html', text: 'Back to forums', style: 'color:var(--blue)' });
    a.addEventListener('click', function (e) { e.preventDefault(); go(''); });
    box.appendChild(a);
    return box;
  }

  /* ---------------------- router ---------------------- */
  function route() {
    var forum = param('forum'), post = param('post');
    if (forum && post) viewPost(forum, post);
    else if (forum) viewForum(forum);
    else viewForumList();
  }
  window.addEventListener('popstate', route);

  /* ---------------------- boot ---------------------- */
  (async function init() {
    var s = await supa.auth.getSession();
    state.session = s.data.session;
    await loadProfile();
    renderAuthbar();
    paintAuth();
    route();
    supa.auth.onAuthStateChange(function (_e, session) { state.session = session; });
  })();
})();
