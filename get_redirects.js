async function resolve(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    const loc = res.headers.get('location');
    console.log(url, '->', loc);
    return loc;
  } catch (err) {
    console.error(url, err.message);
  }
}

async function run() {
  await resolve('https://maps.app.goo.gl/C92jTsB3j3JC58Ya6');
  await resolve('https://maps.app.goo.gl/JTzm2DMxXv6XJyMs9');
  await resolve('https://maps.app.goo.gl/pdS8RtPoMvKhE9RN8');
}

run();
