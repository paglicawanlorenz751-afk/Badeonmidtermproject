const menuButton = document.getElementById('menuButton');
const navigation = document.getElementById('navigation');
menuButton.addEventListener('click', () => {
  const opened = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.innerHTML = opened ? 'CLOSE <span>−</span>' : 'INDEX <span>＋</span>';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = 'INDEX <span>＋</span>';
}));

const sectionLinks = [...navigation.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-38% 0px -52% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.route-graphic,.stack-diagram,.profile-art').forEach(el => revealObserver.observe(el));

const stages = {
  1: { title: 'IT Support Technician', description: 'Supports users, prepares devices, manages basic accounts, and documents incidents so problems can be resolved consistently.', responsibilities: 'Resolve tickets · Prepare devices · Support accounts · Record incidents', skills: 'Operating system basics · Troubleshooting · Clear communication · Customer support practice', tools: 'Windows or Linux endpoints · Ticketing systems · Remote support tools · Directory basics', next: 'Build server, networking, and account administration experience.' },
  2: { title: 'System Administrator', description: 'Maintains server operating systems, user permissions, backups, monitoring, updates, and routine infrastructure operations.', responsibilities: 'Maintain servers · Manage access · Verify backups · Monitor services · Apply updates', skills: 'Windows and Linux administration · Networking · Security fundamentals · Scripting · Change discipline', tools: 'Windows Server · Linux · PowerShell or Bash · Monitoring and backup systems', next: 'Grow toward infrastructure automation, cloud operations, and systems engineering.' },
  3: { title: 'Systems Engineer', description: 'Designs and improves infrastructure, automates operations, evaluates cloud services, and plans for resilience and recovery.', responsibilities: 'Design infrastructure · Automate deployments · Improve scalability · Plan recovery', skills: 'Systems architecture · Cloud concepts · Infrastructure automation · Security · Technical documentation', tools: 'Cloud platforms · Linux and Windows Server · PowerShell or Bash · Infrastructure as code', next: 'Continue into specialized architecture, platform engineering, or infrastructure leadership.' }
};
const stageTabs = [...document.querySelectorAll('.milestone')];
const stagePanel = document.getElementById('stage-panel');
function selectStage(tab, focus = false) {
  stageTabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const number = tab.dataset.stage;
  const stage = stages[number];
  stagePanel.setAttribute('aria-labelledby', tab.id);
  document.getElementById('stage-count').textContent = `0${number} / 03`;
  for (const key of ['title', 'description', 'responsibilities', 'skills', 'tools', 'next']) {
    document.getElementById(`stage-${key}`).textContent = stage[key];
  }
  stagePanel.style.animation = 'none';
  requestAnimationFrame(() => { stagePanel.style.animation = ''; });
  if (focus) tab.focus();
}
stageTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStage(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? stageTabs.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + stageTabs.length) % stageTabs.length;
    selectStage(stageTabs[next], true);
  });
});
selectStage(stageTabs[0]);

const toolTabs = [...document.querySelectorAll('.tool-chip')];
function selectTool(tab) {
  toolTabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  document.getElementById('toolType').textContent = tab.dataset.type;
  document.getElementById('toolName').textContent = tab.dataset.name;
  document.getElementById('toolDescription').textContent = tab.dataset.detail;
  document.getElementById('toolGlyph').textContent = ({ 'Windows Server': 'W', Linux: 'L', 'PowerShell / Bash': '>_', 'Cloud platforms': 'C' })[tab.dataset.name];
}
toolTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTool(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? toolTabs.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + toolTabs.length) % toolTabs.length;
    selectTool(toolTabs[next]); toolTabs[next].focus();
  });
});
selectTool(toolTabs[0]);

document.querySelectorAll('.skill-entry').forEach(entry => entry.addEventListener('click', () => {
  const expanded = entry.getAttribute('aria-expanded') === 'true';
  entry.setAttribute('aria-expanded', String(!expanded));
  entry.querySelector('p').hidden = expanded;
  entry.querySelector('.skill-link').textContent = `${entry.querySelector('.skill-link').textContent.split(' ')[0]} ${expanded ? '＋' : '↗'}`;
}));

document.getElementById('traceButton').addEventListener('click', event => {
  const map = event.currentTarget.closest('.cover-map');
  map.classList.remove('drawn');
  requestAnimationFrame(() => map.classList.add('drawn'));
});
