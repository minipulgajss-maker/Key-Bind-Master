const LANGS = { en: 'English', pt: 'Português', es: 'Español', fr: 'Français', de: 'Deutsch' };
const KEY = 'kbm.lang';

const T = {
  en: {
    'r.1': 'Bad', 'r.2': 'Poor', 'r.3': 'Okay', 'r.4': 'Good', 'r.5': 'Excellent',
    'fb.sending': 'Sending…', 'fb.send': 'Send feedback',
    'err.pick': 'Pick a rating from 1 to 5 stars.', 'err.short': 'Write at least 10 characters.', 'err.long': 'The message is too long (1000 characters at most).', 'err.links': 'Links are not accepted. Remove the address and try again.', 'err.rude': 'Some words cannot be accepted. Please rephrase your message.', 'err.spam': 'The message looks like spam. Please write it in your own words.', 'err.fast': 'That was very quick. Take your time and try again.', 'err.duplicate': 'We already received this message.', 'err.rate': 'You sent a lot of messages. Try again later.', 'err.invalid': 'Could not send. Check the fields.', 'err.network': 'Cannot reach the server. Try again in a moment.'
  },
  pt: {
    'nav.features': 'Funções', 'nav.boost': 'Boost', 'nav.pro': 'Pro grátis', 'nav.faq': 'Perguntas', 'nav.feedback': 'Feedback', 'nav.download': 'Descarregar',
    'hero.eyebrow': 'Para Windows 10 e 11', 'hero.title': 'Todos os atalhos que gostavas que o Windows tivesse.', 'hero.lead': 'Liga qualquer combinação de teclas a um script, uma app, um site, o Discord ou o teu PC. Depois liga o Boost e deixa os jogos usar a máquina toda.', 'hero.cta': 'Descarregar para Windows', 'hero.cta2': 'Ver funções', 'hero.fine': 'Grátis durante 7 dias. Sem direitos de administrador.',
    'facts.1': 'ações de sistema', 'facts.2': 'otimizações de jogos', 'facts.3': 'pacotes prontos', 'facts.4': 'direitos de admin',
    'bento.title': 'Tudo num só sítio.', 'bento.lead': 'Atalhos, apps, jogos e planos ligados entre si: mudas uma coisa e o resto acompanha.',
    'b1.t': 'Atalhos globais', 'b1.d': 'Funcionam em qualquer app, mesmo com a janela fechada.',
    'b2.t': 'Discord e apps', 'b2.d': 'Silenciar, ensurdecer, mudar de canal e controlar apps detetadas.',
    'b3.t': 'Boost de jogos', 'b3.d': 'Menos atraso, mais FPS, e tudo volta ao normal quando paras.',
    'b4.t': 'Pesquisa instantânea', 'b4.d': 'Prime Ctrl+K e adiciona qualquer função com um toque.',
    'b5.t': 'Planos e códigos', 'b5.d': 'Pro grátis na primeira semana, códigos e convites de amigos.',
    'b6.t': 'Atualizações seguras', 'b6.d': 'Instaladas em segundo plano depois de verificar a assinatura.',
    'f1.title': 'Carrega nas teclas. Acontece.', 'f1.p': 'Os atalhos funcionam em todas as apps. Se o Windows ou outro programa já usa uma combinação, o KeyBind Master toma conta dela.',
    'f1.l1': 'Corre scripts PowerShell, batch, Python ou Node sem janela de consola', 'f1.l2': 'Abre apps, sites e jogos do Steam, Epic ou Riot', 'f1.l3': 'Volume, bloquear, suspender, capturas, ambientes de trabalho e mais', 'f1.l4': 'Níveis de prioridade resolvem choques entre atalhos nas mesmas teclas',
    'f2.title': 'Dá um boost ao jogo e depois repõe tudo.', 'f2.p': 'Escolhe um jogo, verifica a ligação aos servidores mais próximos e escolhe um pacote. Cada alteração fica num diário, por isso o Boost desfaz-se sozinho, até depois de um crash.',
    'p1.t': 'Recomendado', 'p1.d': 'Uma mistura segura para a maioria dos jogos', 'p2.t': 'Esports', 'p2.d': 'Menor atraso e mais FPS', 'p3.t': 'Equilibrado', 'p3.d': 'Toque leve que mantém o PC fresco', 'p4.t': 'Streaming', 'p4.d': 'Jogo fluido com gravação de clipes', 'p5.t': 'Portátil', 'p5.d': 'Velocidade sem gastar a bateria',
    'f3.title': 'O Pro é grátis na primeira semana.', 'f3.p': 'Todas as funções Pro ficam abertas durante 7 dias desde a primeira vez que abres a app. Quando receberes um código, cola-o no separador Códigos e os dias são somados logo.',
    'f3.l1': 'Cada código funciona uma vez por PC', 'f3.l2': 'Os códigos são verificados no teu PC: sem conta nem início de sessão', 'f3.l3': 'Convida um amigo e ganham ambos mais 7 dias', 'f3.l4': 'Podes cancelar qualquer plano com um toque, e desfazer logo a seguir',
    'how.title': 'Pronto em menos de um minuto.', 'how.1t': 'Descarrega', 'how.1d': 'Um único ficheiro, sem conta e sem direitos de admin.', 'how.2t': 'Cria um atalho', 'how.2d': 'Escolhe as teclas e o que acontece. Testa antes de guardar.', 'how.3t': 'Joga e esquece', 'how.3d': 'Fica na bandeja do sistema e atualiza-se sozinho.',
    'fbk.title': 'Diz-nos o que achas.', 'fbk.p': 'Uma ideia, um erro ou só um elogio: lemos tudo. Funciona em qualquer língua.', 'fbk.cta': 'Dar a minha opinião',
    'get.title': 'Pronto em menos de um minuto.', 'get.p': 'Descarrega, faz duplo clique e pronto. A app abre quando a instalação acaba e fica na bandeja do sistema.', 'get.fine': 'Windows 10 ou 11 · 64 bits',
    'faq.title': 'Perguntas', 'q1': 'O Windows avisa-me quando abro o instalador.', 'a1': 'O instalador ainda não está assinado, por isso o SmartScreen pode perguntar uma vez. Escolhe Mais informações e depois Executar mesmo assim. As atualizações não mostram esse aviso.',
    'q2': 'Preciso de direitos de administrador?', 'a2': 'Não. O KeyBind Master instala-se só para o teu utilizador.', 'q3': 'Que versões do Windows funcionam?', 'a3': 'Windows 10 e Windows 11. Algumas ações precisam de uma versão mais recente e a app avisa quais.',
    'q4': 'Como funcionam as atualizações?', 'a4': 'A app procura versões novas e instala-as depois de verificar uma assinatura. Todas as atualizações são obrigatórias para toda a gente ficar numa versão segura.',
    'q5': 'Envia os meus dados para algum lado?', 'a5': 'Os teus atalhos ficam no teu PC. A app só vai à internet para atualizações, códigos, convites e o teste de ligação.', 'q6': 'O que acontece depois dos 7 dias grátis?', 'a6': 'Os atalhos continuam a funcionar. As funções Pro param até somares dias com um código.',
    'foot.rights': 'Todos os direitos reservados.', 'foot.terms': 'Termos', 'foot.privacy': 'Privacidade', 'foot.problem': 'Reportar um problema',
    'fb.title': 'A tua opinião conta.', 'fb.lead': 'Conta-nos o que gostas, o que falha e o que gostavas de ver. Escreve na tua língua.', 'fb.rating': 'Que nota dás?', 'fb.type': 'Sobre o quê?', 'fb.t.idea': 'Ideia', 'fb.t.bug': 'Erro', 'fb.t.praise': 'Elogio', 'fb.t.other': 'Outro',
    'fb.name': 'O teu nome (opcional)', 'fb.name.ph': 'Como te chamas?', 'fb.msg': 'A tua mensagem', 'fb.msg.ph': 'Escreve aqui, com pelo menos 10 caracteres…', 'fb.send': 'Enviar opinião', 'fb.sending': 'A enviar…',
    'fb.thanks.title': 'Obrigado!', 'fb.thanks.text': 'A tua mensagem chegou. Lemos tudo e usamos para melhorar a app.', 'fb.again': 'Enviar outra', 'fb.note': 'Não guardamos o teu email nem o teu IP. As mensagens passam por um filtro automático contra spam e insultos antes de chegarem a nós.',
    'r.1': 'Mau', 'r.2': 'Fraco', 'r.3': 'Normal', 'r.4': 'Bom', 'r.5': 'Excelente',
    'err.pick': 'Escolhe uma nota de 1 a 5 estrelas.', 'err.short': 'Escreve pelo menos 10 caracteres.', 'err.long': 'A mensagem é demasiado longa (máximo 1000 caracteres).', 'err.links': 'Não aceitamos links. Tira o endereço e tenta outra vez.', 'err.rude': 'Há palavras que não podemos aceitar. Reformula a mensagem, por favor.', 'err.spam': 'A mensagem parece spam. Escreve-a por palavras tuas.', 'err.fast': 'Demoraste muito pouco. Escreve com calma e tenta outra vez.', 'err.duplicate': 'Já recebemos esta mensagem.', 'err.rate': 'Enviaste muitas mensagens. Tenta mais tarde.', 'err.invalid': 'Não foi possível enviar. Verifica os campos.', 'err.network': 'Sem ligação ao servidor. Tenta outra vez daqui a pouco.'
  },
  es: {
    'nav.features': 'Funciones', 'nav.boost': 'Boost', 'nav.pro': 'Pro gratis', 'nav.faq': 'Preguntas', 'nav.feedback': 'Opiniones', 'nav.download': 'Descargar',
    'hero.eyebrow': 'Para Windows 10 y 11', 'hero.title': 'Todos los atajos que desearías que Windows tuviera.', 'hero.lead': 'Asigna cualquier combinación de teclas a un script, una app, una web, Discord o tu PC. Luego activa Boost y deja que tus juegos usen toda la máquina.', 'hero.cta': 'Descargar para Windows', 'hero.cta2': 'Ver funciones', 'hero.fine': 'Gratis durante 7 días. Sin permisos de administrador.',
    'facts.1': 'acciones del sistema', 'facts.2': 'optimizaciones de juegos', 'facts.3': 'paquetes listos', 'facts.4': 'permisos de admin',
    'bento.title': 'Todo en un solo lugar.', 'bento.lead': 'Atajos, apps, juegos y planes conectados: cambias una cosa y el resto se actualiza.',
    'b1.t': 'Atajos globales', 'b1.d': 'Funcionan en cualquier app, incluso con la ventana cerrada.',
    'b2.t': 'Discord y apps', 'b2.d': 'Silenciar, ensordecer, cambiar de canal y controlar las apps detectadas.',
    'b3.t': 'Boost para juegos', 'b3.d': 'Menos retraso, más FPS, y todo vuelve a la normalidad al parar.',
    'b4.t': 'Búsqueda instantánea', 'b4.d': 'Pulsa Ctrl+K y añade cualquier función con un toque.',
    'b5.t': 'Planes y códigos', 'b5.d': 'Pro gratis la primera semana, códigos e invitaciones de amigos.',
    'b6.t': 'Actualizaciones seguras', 'b6.d': 'Se instalan en segundo plano tras verificar la firma.',
    'f1.title': 'Pulsa las teclas. Sucede.', 'f1.p': 'Los atajos funcionan en todas las apps. Si Windows u otro programa ya usa una combinación, KeyBind Master la toma.',
    'f1.l1': 'Ejecuta scripts PowerShell, batch, Python o Node sin ventana de consola', 'f1.l2': 'Abre apps, webs y juegos de Steam, Epic o Riot', 'f1.l3': 'Volumen, bloquear, suspender, capturas, escritorios virtuales y más', 'f1.l4': 'Los niveles de prioridad resuelven choques entre atajos en las mismas teclas',
    'f2.title': 'Potencia tu juego y luego devuelve todo.', 'f2.p': 'Elige un juego, comprueba tu conexión con los servidores más cercanos y elige un paquete. Cada cambio queda en un diario, así que Boost se deshace solo, incluso tras un fallo.',
    'p1.t': 'Recomendado', 'p1.d': 'Una mezcla segura para la mayoría de juegos', 'p2.t': 'Esports', 'p2.d': 'Menor retraso y más FPS', 'p3.t': 'Equilibrado', 'p3.d': 'Un toque ligero que mantiene el PC fresco', 'p4.t': 'Streaming', 'p4.d': 'Juego fluido con grabación de clips', 'p5.t': 'Portátil', 'p5.d': 'Velocidad sin gastar la batería',
    'f3.title': 'Pro es gratis tu primera semana.', 'f3.p': 'Todas las funciones Pro se desbloquean 7 días desde la primera vez que abres la app. Cuando recibas un código, pégalo en la pestaña Códigos y los días se suman al instante.',
    'f3.l1': 'Cada código funciona una vez por PC', 'f3.l2': 'Los códigos se comprueban en tu PC: sin cuenta ni inicio de sesión', 'f3.l3': 'Invita a un amigo y ambos ganáis 7 días más', 'f3.l4': 'Cancela cualquier plan con un toque y deshazlo justo después',
    'how.title': 'Listo en menos de un minuto.', 'how.1t': 'Descarga', 'how.1d': 'Un solo archivo, sin cuenta y sin permisos de admin.', 'how.2t': 'Crea un atajo', 'how.2d': 'Elige las teclas y qué ocurre. Pruébalo antes de guardar.', 'how.3t': 'Juega y olvida', 'how.3d': 'Vive en la bandeja del sistema y se actualiza solo.',
    'fbk.title': 'Dinos qué piensas.', 'fbk.p': 'Una idea, un fallo o solo un elogio: lo leemos todo. Funciona en cualquier idioma.', 'fbk.cta': 'Dar mi opinión',
    'get.title': 'Listo en menos de un minuto.', 'get.p': 'Descarga, haz doble clic y listo. La app se abre al terminar la instalación y vive en la bandeja del sistema.', 'get.fine': 'Windows 10 u 11 · 64 bits',
    'faq.title': 'Preguntas', 'q1': 'Windows me avisa al abrir el instalador.', 'a1': 'El instalador aún no está firmado, así que SmartScreen puede preguntar una vez. Elige Más información y luego Ejecutar de todos modos. Las actualizaciones no muestran ese aviso.',
    'q2': '¿Necesito permisos de administrador?', 'a2': 'No. KeyBind Master se instala solo para tu usuario.', 'q3': '¿Qué versiones de Windows funcionan?', 'a3': 'Windows 10 y Windows 11. Algunas acciones necesitan una versión más nueva y la app te dice cuáles.',
    'q4': '¿Cómo funcionan las actualizaciones?', 'a4': 'La app busca versiones nuevas y las instala tras verificar una firma. Todas las actualizaciones son obligatorias para que todos estén en una versión segura.',
    'q5': '¿Envía mis datos a algún sitio?', 'a5': 'Tus atajos se quedan en tu PC. La app solo se conecta para actualizaciones, códigos, invitaciones y la prueba de conexión.', 'q6': '¿Qué pasa tras los 7 días gratis?', 'a6': 'Tus atajos siguen funcionando. Las funciones Pro se pausan hasta que sumes días con un código.',
    'foot.rights': 'Todos los derechos reservados.', 'foot.terms': 'Términos', 'foot.privacy': 'Privacidad', 'foot.problem': 'Informar de un problema',
    'fb.title': 'Tu opinión cuenta.', 'fb.lead': 'Cuéntanos qué te gusta, qué falla y qué te gustaría ver. Escribe en tu idioma.', 'fb.rating': '¿Qué nota le das?', 'fb.type': '¿Sobre qué?', 'fb.t.idea': 'Idea', 'fb.t.bug': 'Fallo', 'fb.t.praise': 'Elogio', 'fb.t.other': 'Otro',
    'fb.name': 'Tu nombre (opcional)', 'fb.name.ph': '¿Cómo te llamas?', 'fb.msg': 'Tu mensaje', 'fb.msg.ph': 'Escribe aquí, al menos 10 caracteres…', 'fb.send': 'Enviar opinión', 'fb.sending': 'Enviando…',
    'fb.thanks.title': '¡Gracias!', 'fb.thanks.text': 'Tu mensaje llegó. Lo leemos todo y lo usamos para mejorar la app.', 'fb.again': 'Enviar otro', 'fb.note': 'No guardamos tu email ni tu IP. Los mensajes pasan por un filtro automático contra spam e insultos antes de llegar a nosotros.',
    'r.1': 'Malo', 'r.2': 'Flojo', 'r.3': 'Normal', 'r.4': 'Bueno', 'r.5': 'Excelente',
    'err.pick': 'Elige una nota de 1 a 5 estrellas.', 'err.short': 'Escribe al menos 10 caracteres.', 'err.long': 'El mensaje es demasiado largo (máximo 1000 caracteres).', 'err.links': 'No aceptamos enlaces. Quita la dirección e inténtalo de nuevo.', 'err.rude': 'Hay palabras que no podemos aceptar. Reformula el mensaje, por favor.', 'err.spam': 'El mensaje parece spam. Escríbelo con tus palabras.', 'err.fast': 'Fue demasiado rápido. Escribe con calma e inténtalo de nuevo.', 'err.duplicate': 'Ya recibimos este mensaje.', 'err.rate': 'Enviaste demasiados mensajes. Inténtalo más tarde.', 'err.invalid': 'No se pudo enviar. Revisa los campos.', 'err.network': 'Sin conexión con el servidor. Inténtalo de nuevo en un rato.'
  },
  fr: {
    'nav.features': 'Fonctions', 'nav.boost': 'Boost', 'nav.pro': 'Pro gratuit', 'nav.faq': 'Questions', 'nav.feedback': 'Avis', 'nav.download': 'Télécharger',
    'hero.eyebrow': 'Pour Windows 10 et 11', 'hero.title': 'Tous les raccourcis que Windows devrait avoir.', 'hero.lead': 'Associez n’importe quelle combinaison de touches à un script, une appli, un site, Discord ou votre PC. Activez ensuite Boost et laissez vos jeux profiter de toute la machine.', 'hero.cta': 'Télécharger pour Windows', 'hero.cta2': 'Voir les fonctions', 'hero.fine': 'Gratuit pendant 7 jours. Aucun droit administrateur.',
    'facts.1': 'actions système', 'facts.2': 'optimisations de jeux', 'facts.3': 'packs prêts', 'facts.4': 'droits admin',
    'bento.title': 'Tout au même endroit.', 'bento.lead': 'Raccourcis, applis, jeux et forfaits reliés : vous changez une chose, le reste suit.',
    'b1.t': 'Raccourcis globaux', 'b1.d': 'Ils marchent dans toutes les applis, même fenêtre fermée.',
    'b2.t': 'Discord et applis', 'b2.d': 'Couper le micro, changer de salon et piloter les applis détectées.',
    'b3.t': 'Boost de jeux', 'b3.d': 'Moins de latence, plus de FPS, et tout revient à la normale à l’arrêt.',
    'b4.t': 'Recherche instantanée', 'b4.d': 'Appuyez sur Ctrl+K et ajoutez n’importe quelle fonction d’un geste.',
    'b5.t': 'Forfaits et codes', 'b5.d': 'Pro gratuit la première semaine, codes et invitations d’amis.',
    'b6.t': 'Mises à jour sûres', 'b6.d': 'Installées en arrière-plan après vérification de la signature.',
    'f1.title': 'Appuyez sur les touches. C’est fait.', 'f1.p': 'Les raccourcis fonctionnent dans toutes les applis. Si Windows ou un autre programme utilise déjà une combinaison, KeyBind Master la reprend.',
    'f1.l1': 'Lancez des scripts PowerShell, batch, Python ou Node sans fenêtre console', 'f1.l2': 'Ouvrez applis, sites et jeux Steam, Epic ou Riot', 'f1.l3': 'Volume, verrouillage, veille, captures, bureaux virtuels et plus', 'f1.l4': 'Les niveaux de priorité règlent les conflits entre raccourcis',
    'f2.title': 'Boostez votre jeu, puis remettez tout en place.', 'f2.p': 'Choisissez un jeu, testez votre connexion aux serveurs les plus proches et choisissez un pack. Chaque changement est consigné : Boost s’annule seul, même après un plantage.',
    'p1.t': 'Recommandé', 'p1.d': 'Un mélange sûr pour la plupart des jeux', 'p2.t': 'Esports', 'p2.d': 'Latence minimale et FPS maximum', 'p3.t': 'Équilibré', 'p3.d': 'Une touche légère qui garde le PC au frais', 'p4.t': 'Streaming', 'p4.d': 'Jeu fluide avec enregistrement de clips', 'p5.t': 'Portable', 'p5.d': 'De la vitesse sans vider la batterie',
    'f3.title': 'Pro est gratuit la première semaine.', 'f3.p': 'Toutes les fonctions Pro sont débloquées 7 jours dès la première ouverture de l’appli. Collez un code dans l’onglet Codes et les jours s’ajoutent aussitôt.',
    'f3.l1': 'Chaque code fonctionne une fois par PC', 'f3.l2': 'Les codes sont vérifiés sur votre PC : pas de compte ni de connexion', 'f3.l3': 'Invitez un ami et gagnez tous deux 7 jours de plus', 'f3.l4': 'Annulez n’importe quel forfait d’un geste, et annulez l’annulation juste après',
    'how.title': 'Prêt en moins d’une minute.', 'how.1t': 'Téléchargez', 'how.1d': 'Un seul fichier, sans compte ni droits admin.', 'how.2t': 'Créez un raccourci', 'how.2d': 'Choisissez les touches et l’action. Testez avant d’enregistrer.', 'how.3t': 'Jouez et oubliez', 'how.3d': 'Il reste dans la zone de notification et se met à jour seul.',
    'fbk.title': 'Dites-nous ce que vous en pensez.', 'fbk.p': 'Une idée, un bug ou juste un compliment : nous lisons tout. Dans toutes les langues.', 'fbk.cta': 'Donner mon avis',
    'get.title': 'Prêt en moins d’une minute.', 'get.p': 'Téléchargez, double-cliquez, c’est terminé. L’appli s’ouvre à la fin de l’installation et reste dans la zone de notification.', 'get.fine': 'Windows 10 ou 11 · 64 bits',
    'faq.title': 'Questions', 'q1': 'Windows m’avertit à l’ouverture de l’installateur.', 'a1': 'L’installateur n’est pas encore signé, donc SmartScreen peut demander une fois. Choisissez Informations complémentaires puis Exécuter quand même. Les mises à jour n’affichent pas cet avertissement.',
    'q2': 'Faut-il des droits administrateur ?', 'a2': 'Non. KeyBind Master s’installe uniquement pour votre utilisateur.', 'q3': 'Quelles versions de Windows ?', 'a3': 'Windows 10 et Windows 11. Certaines actions demandent une version plus récente et l’appli vous l’indique.',
    'q4': 'Comment fonctionnent les mises à jour ?', 'a4': 'L’appli cherche les nouvelles versions et les installe après vérification d’une signature. Toutes les mises à jour sont obligatoires.',
    'q5': 'Mes données sont-elles envoyées quelque part ?', 'a5': 'Vos raccourcis restent sur votre PC. L’appli ne se connecte que pour les mises à jour, les codes, les invitations et le test de connexion.', 'q6': 'Que se passe-t-il après les 7 jours gratuits ?', 'a6': 'Vos raccourcis continuent de fonctionner. Les fonctions Pro se mettent en pause jusqu’à ce que vous ajoutiez des jours avec un code.',
    'foot.rights': 'Tous droits réservés.', 'foot.terms': 'Conditions', 'foot.privacy': 'Confidentialité', 'foot.problem': 'Signaler un problème',
    'fb.title': 'Votre avis compte.', 'fb.lead': 'Dites-nous ce que vous aimez, ce qui ne va pas et ce que vous voudriez voir. Écrivez dans votre langue.', 'fb.rating': 'Quelle note donnez-vous ?', 'fb.type': 'À propos de quoi ?', 'fb.t.idea': 'Idée', 'fb.t.bug': 'Bug', 'fb.t.praise': 'Compliment', 'fb.t.other': 'Autre',
    'fb.name': 'Votre nom (facultatif)', 'fb.name.ph': 'Comment vous appelez-vous ?', 'fb.msg': 'Votre message', 'fb.msg.ph': 'Écrivez ici, au moins 10 caractères…', 'fb.send': 'Envoyer mon avis', 'fb.sending': 'Envoi…',
    'fb.thanks.title': 'Merci !', 'fb.thanks.text': 'Votre message est arrivé. Nous lisons tout et nous l’utilisons pour améliorer l’appli.', 'fb.again': 'En envoyer un autre', 'fb.note': 'Nous ne gardons ni votre e-mail ni votre IP. Les messages passent par un filtre automatique contre le spam et les insultes avant de nous parvenir.',
    'r.1': 'Mauvais', 'r.2': 'Moyen', 'r.3': 'Correct', 'r.4': 'Bien', 'r.5': 'Excellent',
    'err.pick': 'Choisissez une note de 1 à 5 étoiles.', 'err.short': 'Écrivez au moins 10 caractères.', 'err.long': 'Le message est trop long (1000 caractères maximum).', 'err.links': 'Les liens ne sont pas acceptés. Retirez l’adresse et réessayez.', 'err.rude': 'Certains mots ne sont pas acceptés. Reformulez votre message, s’il vous plaît.', 'err.spam': 'Le message ressemble à du spam. Écrivez-le avec vos mots.', 'err.fast': 'C’était trop rapide. Prenez votre temps et réessayez.', 'err.duplicate': 'Nous avons déjà reçu ce message.', 'err.rate': 'Trop de messages envoyés. Réessayez plus tard.', 'err.invalid': 'Envoi impossible. Vérifiez les champs.', 'err.network': 'Serveur injoignable. Réessayez dans un instant.'
  },
  de: {
    'nav.features': 'Funktionen', 'nav.boost': 'Boost', 'nav.pro': 'Pro gratis', 'nav.faq': 'Fragen', 'nav.feedback': 'Feedback', 'nav.download': 'Herunterladen',
    'hero.eyebrow': 'Für Windows 10 und 11', 'hero.title': 'Jede Tastenkombination, die Windows haben sollte.', 'hero.lead': 'Belege jede Tastenkombination mit einem Skript, einer App, einer Website, Discord oder deinem PC. Dann schalte Boost ein und gib deinen Spielen die ganze Maschine.', 'hero.cta': 'Für Windows herunterladen', 'hero.cta2': 'Funktionen ansehen', 'hero.fine': '7 Tage gratis. Keine Administratorrechte nötig.',
    'facts.1': 'Systemaktionen', 'facts.2': 'Spiel-Optimierungen', 'facts.3': 'fertige Pakete', 'facts.4': 'Adminrechte',
    'bento.title': 'Alles an einem Ort.', 'bento.lead': 'Kürzel, Apps, Spiele und Tarife sind verbunden: Du änderst eins, der Rest zieht nach.',
    'b1.t': 'Globale Kürzel', 'b1.d': 'Funktionieren in jeder App, auch bei geschlossenem Fenster.',
    'b2.t': 'Discord und Apps', 'b2.d': 'Stummschalten, Kanal wechseln und erkannte Apps steuern.',
    'b3.t': 'Spiele-Boost', 'b3.d': 'Weniger Verzögerung, mehr FPS, und beim Beenden ist alles wieder normal.',
    'b4.t': 'Sofortsuche', 'b4.d': 'Drücke Strg+K und füge jede Funktion mit einem Tipp hinzu.',
    'b5.t': 'Tarife und Codes', 'b5.d': 'Pro gratis in der ersten Woche, Codes und Freunde-Einladungen.',
    'b6.t': 'Sichere Updates', 'b6.d': 'Im Hintergrund installiert, nachdem die Signatur geprüft wurde.',
    'f1.title': 'Tasten drücken. Passiert.', 'f1.p': 'Kürzel funktionieren in jeder App. Belegt Windows oder ein anderes Programm eine Kombination schon, übernimmt KeyBind Master sie.',
    'f1.l1': 'PowerShell-, Batch-, Python- oder Node-Skripte ohne Konsolenfenster ausführen', 'f1.l2': 'Apps, Websites und Spiele von Steam, Epic oder Riot öffnen', 'f1.l3': 'Lautstärke, Sperren, Ruhezustand, Screenshots, virtuelle Desktops und mehr', 'f1.l4': 'Prioritätsstufen lösen Konflikte zwischen Kürzeln auf denselben Tasten',
    'f2.title': 'Boost fürs Spiel, danach ist alles wieder wie vorher.', 'f2.p': 'Wähle ein Spiel, prüfe die Verbindung zu den nächsten Servern und wähle ein Paket. Jede Änderung steht in einem Journal, daher macht Boost sich selbst rückgängig, sogar nach einem Absturz.',
    'p1.t': 'Empfohlen', 'p1.d': 'Eine sichere Mischung für die meisten Spiele', 'p2.t': 'Esports', 'p2.d': 'Niedrigste Verzögerung, höchste FPS', 'p3.t': 'Ausgewogen', 'p3.d': 'Ein leichter Eingriff, der den PC kühl hält', 'p4.t': 'Streaming', 'p4.d': 'Flüssiges Spiel mit Clip-Aufnahme', 'p5.t': 'Laptop', 'p5.d': 'Tempo ohne den Akku zu leeren',
    'f3.title': 'Pro ist in der ersten Woche gratis.', 'f3.p': 'Alle Pro-Funktionen sind 7 Tage ab dem ersten Start der App freigeschaltet. Fügst du einen Code im Tab Codes ein, werden die Tage sofort addiert.',
    'f3.l1': 'Jeder Code funktioniert einmal pro PC', 'f3.l2': 'Codes werden auf deinem PC geprüft: kein Konto, keine Anmeldung', 'f3.l3': 'Lade einen Freund ein und ihr bekommt beide 7 Tage mehr', 'f3.l4': 'Jeden Tarif mit einem Tipp kündigen und gleich danach rückgängig machen',
    'how.title': 'In unter einer Minute startklar.', 'how.1t': 'Herunterladen', 'how.1d': 'Eine einzige Datei, ohne Konto und ohne Adminrechte.', 'how.2t': 'Kürzel erstellen', 'how.2d': 'Tasten und Aktion wählen. Vor dem Speichern testen.', 'how.3t': 'Spielen und vergessen', 'how.3d': 'Läuft im Infobereich und aktualisiert sich selbst.',
    'fbk.title': 'Sag uns, was du denkst.', 'fbk.p': 'Eine Idee, ein Fehler oder einfach Lob: Wir lesen alles. In jeder Sprache.', 'fbk.cta': 'Meine Meinung abgeben',
    'get.title': 'In unter einer Minute startklar.', 'get.p': 'Herunterladen, doppelklicken, fertig. Die App öffnet sich nach der Installation und läuft im Infobereich.', 'get.fine': 'Windows 10 oder 11 · 64 Bit',
    'faq.title': 'Fragen', 'q1': 'Windows warnt mich beim Öffnen des Installers.', 'a1': 'Der Installer ist noch nicht signiert, daher fragt SmartScreen eventuell einmal nach. Wähle Weitere Informationen, dann Trotzdem ausführen. Updates zeigen diese Warnung nicht.',
    'q2': 'Brauche ich Administratorrechte?', 'a2': 'Nein. KeyBind Master wird nur für deinen Benutzer installiert.', 'q3': 'Welche Windows-Versionen funktionieren?', 'a3': 'Windows 10 und Windows 11. Einige Aktionen brauchen eine neuere Version, und die App sagt dir welche.',
    'q4': 'Wie funktionieren Updates?', 'a4': 'Die App sucht neue Versionen und installiert sie nach Prüfung einer Signatur. Alle Updates sind verpflichtend, damit alle auf einer sicheren Version bleiben.',
    'q5': 'Werden meine Daten irgendwohin gesendet?', 'a5': 'Deine Kürzel bleiben auf deinem PC. Die App geht nur für Updates, Codes, Einladungen und den Verbindungstest online.', 'q6': 'Was passiert nach den 7 Gratistagen?', 'a6': 'Deine Kürzel laufen weiter. Pro-Funktionen pausieren, bis du mit einem Code Tage hinzufügst.',
    'foot.rights': 'Alle Rechte vorbehalten.', 'foot.terms': 'Bedingungen', 'foot.privacy': 'Datenschutz', 'foot.problem': 'Problem melden',
    'fb.title': 'Deine Meinung zählt.', 'fb.lead': 'Sag uns, was dir gefällt, was nicht klappt und was du dir wünschst. Schreibe in deiner Sprache.', 'fb.rating': 'Welche Note gibst du?', 'fb.type': 'Worum geht es?', 'fb.t.idea': 'Idee', 'fb.t.bug': 'Fehler', 'fb.t.praise': 'Lob', 'fb.t.other': 'Sonstiges',
    'fb.name': 'Dein Name (optional)', 'fb.name.ph': 'Wie heißt du?', 'fb.msg': 'Deine Nachricht', 'fb.msg.ph': 'Schreibe hier, mindestens 10 Zeichen …', 'fb.send': 'Meinung senden', 'fb.sending': 'Wird gesendet …',
    'fb.thanks.title': 'Danke!', 'fb.thanks.text': 'Deine Nachricht ist angekommen. Wir lesen alles und nutzen es, um die App zu verbessern.', 'fb.again': 'Noch eine senden', 'fb.note': 'Wir speichern weder deine E-Mail noch deine IP. Nachrichten laufen durch einen automatischen Filter gegen Spam und Beleidigungen, bevor sie bei uns ankommen.',
    'r.1': 'Schlecht', 'r.2': 'Schwach', 'r.3': 'Okay', 'r.4': 'Gut', 'r.5': 'Ausgezeichnet',
    'err.pick': 'Wähle eine Note von 1 bis 5 Sternen.', 'err.short': 'Schreibe mindestens 10 Zeichen.', 'err.long': 'Die Nachricht ist zu lang (höchstens 1000 Zeichen).', 'err.links': 'Links sind nicht erlaubt. Entferne die Adresse und versuche es erneut.', 'err.rude': 'Einige Wörter können wir nicht akzeptieren. Bitte formuliere die Nachricht um.', 'err.spam': 'Die Nachricht wirkt wie Spam. Schreibe sie mit eigenen Worten.', 'err.fast': 'Das ging zu schnell. Nimm dir Zeit und versuche es erneut.', 'err.duplicate': 'Diese Nachricht haben wir schon erhalten.', 'err.rate': 'Zu viele Nachrichten gesendet. Versuche es später erneut.', 'err.invalid': 'Senden nicht möglich. Prüfe die Felder.', 'err.network': 'Server nicht erreichbar. Versuche es gleich noch einmal.'
  }
};

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export function currentLanguage() {
  const stored = read();
  if (stored && LANGS[stored]) return stored;
  const guess = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS[guess] ? guess : 'en';
}

const originals = new WeakMap();

export function text(key, lang = currentLanguage()) {
  return T[lang]?.[key] ?? T.en[key] ?? originals.get(document.documentElement)?.[key] ?? key;
}

export function applyLanguage(lang) {
  document.documentElement.lang = lang;
  const store = originals.get(document.documentElement) ?? {};
  originals.set(document.documentElement, store);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    store[key] ??= element.textContent;
    element.textContent = lang === 'en' ? store[key] : T[lang]?.[key] ?? store[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((element) => {
    const key = element.dataset.i18nPh;
    store[key] ??= element.getAttribute('placeholder');
    element.setAttribute('placeholder', lang === 'en' ? store[key] : T[lang]?.[key] ?? store[key]);
  });
  document.querySelectorAll('[data-lang-select]').forEach((select) => (select.value = lang));
  document.dispatchEvent(new CustomEvent('kbm-language', { detail: lang }));
}

const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14"><path d="m6 9 6 6 6-6"/></svg>';

function languageMenu(select) {
  select.hidden = true;
  const wrap = document.createElement('div');
  wrap.className = 'lang-menu';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lang lang-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  const list = document.createElement('ul');
  list.className = 'lang-list';
  list.setAttribute('role', 'listbox');
  list.hidden = true;
  const options = Object.entries(LANGS).map(([code, label]) => {
    const option = document.createElement('li');
    option.className = 'lang-option';
    option.setAttribute('role', 'option');
    option.dataset.code = code;
    option.tabIndex = -1;
    option.innerHTML = `<span>${label}</span>${CHECK}`;
    list.append(option);
    return option;
  });
  const close = () => {
    list.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  };
  const sync = (code) => {
    button.innerHTML = `${LANGS[code] ?? LANGS.en}${CHEVRON}`;
    options.forEach((option) => option.setAttribute('aria-selected', String(option.dataset.code === code)));
  };
  const choose = (code) => {
    select.value = code;
    close();
    button.focus();
    select.dispatchEvent(new Event('change'));
  };
  button.addEventListener('click', () => {
    list.hidden = !list.hidden;
    button.setAttribute('aria-expanded', String(!list.hidden));
    if (!list.hidden) options.find((option) => option.getAttribute('aria-selected') === 'true')?.focus();
  });
  list.addEventListener('click', (event) => {
    const option = event.target.closest('.lang-option');
    if (option) choose(option.dataset.code);
  });
  list.addEventListener('keydown', (event) => {
    const index = options.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      close();
      button.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (index >= 0) choose(options[index].dataset.code);
    }
  });
  document.addEventListener('click', (event) => {
    if (!wrap.contains(event.target)) close();
  });
  select.addEventListener('change', () => sync(select.value));
  wrap.append(button, list);
  select.after(wrap);
  sync(select.value);
}

export function startLanguage() {
  document.querySelectorAll('[data-lang-select]').forEach((select) => {
    select.replaceChildren(...Object.entries(LANGS).map(([code, label]) => Object.assign(document.createElement('option'), { value: code, textContent: label })));
    select.addEventListener('change', () => {
      try {
        localStorage.setItem(KEY, select.value);
      } catch {
        return;
      } finally {
        applyLanguage(select.value);
      }
    });
    languageMenu(select);
  });
  applyLanguage(currentLanguage());
}
