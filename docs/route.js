const section = location.pathname.replace(/^\/+|\/+$/g, '');
if (['features', 'boost', 'pro', 'faq'].includes(section)) location.replace(`/#${section}`);
