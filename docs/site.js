const RELEASE_API = 'https://api.github.com/repos/minipulgajss-maker/Key-Bind-Master/releases/latest';

async function showVersion() {
  try {
    const response = await fetch(RELEASE_API, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) return;
    const { tag_name: tag, assets } = await response.json();
    const size = assets.find((asset) => asset.name === 'KeyBind-Master-Setup.exe')?.size;
    const megabytes = size ? ` · ${(size / 1048576).toFixed(1)} MB` : '';
    document.querySelectorAll('[data-version]').forEach((element) => {
      element.textContent = `Version ${tag}${megabytes} · Windows 10 or 11`;
    });
  } catch {
    return;
  }
}

showVersion();
