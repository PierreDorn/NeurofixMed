import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Turbopack estava caindo depois de alguns minutos de dev porque detectou
  // um package-lock.json em ~/ e passou a observar a home inteira. Fixar o
  // root no diretório do projeto resolve o file watching e o crash do dev.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
