// TalkBoard AAC — offline support.
// Keeps a copy of the app so it opens without internet.
// Pages: network first (so updates arrive), cached copy if offline or slow.
// Other files (tile pictures, icons): cache first.
const CACHE = 'talkboard-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];
// Tile pictures: cached up front so every board works offline
const ART = [
  './art/a_close.webp',
  './art/a_come.webp',
  './art/a_drink.webp',
  './art/a_eat.webp',
  './art/a_give.webp',
  './art/a_go.webp',
  './art/a_listen.webp',
  './art/a_look.webp',
  './art/a_open.webp',
  './art/a_play.webp',
  './art/a_read.webp',
  './art/a_sit.webp',
  './art/a_sleep.webp',
  './art/a_stand.webp',
  './art/a_take.webp',
  './art/a_write.webp',
  './art/b_arm.webp',
  './art/b_back.webp',
  './art/b_breathe.webp',
  './art/b_cold.webp',
  './art/b_dizzy.webp',
  './art/b_ear.webp',
  './art/b_eye.webp',
  './art/b_foot.webp',
  './art/b_hand.webp',
  './art/b_head.webp',
  './art/b_hot.webp',
  './art/b_itchy.webp',
  './art/b_leg.webp',
  './art/b_mouth.webp',
  './art/b_nose.webp',
  './art/b_tummy.webp',
  './art/board_quick.webp',
  './art/f_angry.webp',
  './art/f_bad.webp',
  './art/f_bored.webp',
  './art/f_calm.webp',
  './art/f_confused.webp',
  './art/f_excited.webp',
  './art/f_good.webp',
  './art/f_happy.webp',
  './art/f_hungry.webp',
  './art/f_love.webp',
  './art/f_pain.webp',
  './art/f_sad.webp',
  './art/f_scared.webp',
  './art/f_sick.webp',
  './art/f_surprised.webp',
  './art/f_tired.webp',
  './art/fd_apple.webp',
  './art/fd_banana.webp',
  './art/fd_bread.webp',
  './art/fd_burger.webp',
  './art/fd_cake.webp',
  './art/fd_chicken.webp',
  './art/fd_coffee.webp',
  './art/fd_food.webp',
  './art/fd_juice.webp',
  './art/fd_milk.webp',
  './art/fd_pizza.webp',
  './art/fd_rice.webp',
  './art/fd_snack.webp',
  './art/fd_soup.webp',
  './art/fd_tea.webp',
  './art/fd_water.webp',
  './art/p_baby.webp',
  './art/p_boy.webp',
  './art/p_dad.webp',
  './art/p_doctor.webp',
  './art/p_everyone.webp',
  './art/p_family.webp',
  './art/p_friend.webp',
  './art/p_girl.webp',
  './art/p_me.webp',
  './art/p_mom.webp',
  './art/p_teacher.webp',
  './art/p_you.webp',
  './art/pl_bedroom.webp',
  './art/pl_bus.webp',
  './art/pl_car.webp',
  './art/pl_home.webp',
  './art/pl_hospital.webp',
  './art/pl_inside.webp',
  './art/pl_kitchen.webp',
  './art/pl_outside.webp',
  './art/pl_park.webp',
  './art/pl_school.webp',
  './art/pl_store.webp',
  './art/pl_toilet.webp',
  './art/s_bye.webp',
  './art/s_fine.webp',
  './art/s_hello.webp',
  './art/s_how.webp',
  './art/s_morning.webp',
  './art/s_name.webp',
  './art/s_night.webp',
  './art/s_what.webp',
  './art/s_when.webp',
  './art/s_where.webp',
  './art/s_who.webp',
  './art/s_why.webp',
  './art/t_again.webp',
  './art/t_finished.webp',
  './art/t_help.webp',
  './art/t_idont.webp',
  './art/t_ilike.webp',
  './art/t_more.webp',
  './art/t_my.webp',
  './art/t_need.webp',
  './art/t_no.webp',
  './art/t_please.webp',
  './art/t_sorry.webp',
  './art/t_stop.webp',
  './art/t_thankyou.webp',
  './art/t_wait.webp',
  './art/t_want.webp',
  './art/t_yes.webp',
  './art/x_bandage.webp',
  './art/x_bath.webp',
  './art/x_brain.webp',
  './art/x_chat.webp',
  './art/x_gift.webp',
  './art/x_handshake.webp',
  './art/x_heart.webp',
  './art/x_music.webp',
  './art/x_playground.webp',
  './art/x_shopping.webp',
  './art/x_shower.webp',
  './art/x_smile_heart.webp',
  './art/x_speech.webp',
  './art/x_story.webp',
  './art/x_tooth.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(SHELL.concat(ART).map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('talkboard-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const network = fetch(req).then(res => {
        if (res && res.ok) cache.put('./', res.clone());
        return res;
      });
      const cached = (await cache.match(req, { ignoreSearch: true })) || (await cache.match('./')) || (await cache.match('./index.html'));
      if (!cached) return network;
      const slow = new Promise(resolve => setTimeout(() => resolve(null), 2500));
      const fresh = await Promise.race([network.catch(() => null), slow]);
      return fresh || cached;
    })());
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
      }
      return res;
    }))
  );
});
