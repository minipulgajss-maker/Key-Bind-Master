async function showVersion() {
  try {
    const response = await fetch('version.json', { cache: 'no-store' });
    if (!response.ok) return;
    const { version, size } = await response.json();
    const megabytes = size ? ` · ${(size / 1048576).toFixed(1)} MB` : '';
    document.querySelectorAll('[data-version]').forEach((element) => {
      element.textContent = `Version ${version}${megabytes} · Windows 10 or 11`;
    });
  } catch {
    return;
  }
}

showVersion();
