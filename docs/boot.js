if (location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') location.replace(`https://key-bind-master.xyz${location.pathname}${location.search}${location.hash}`);
else if (location.hostname === 'www.key-bind-master.xyz') location.replace(`https://key-bind-master.xyz${location.pathname}${location.search}${location.hash}`);
document.documentElement.classList.add('js');
