# 🎵 NeonTune

Une application de streaming musical moderne avec une interface néon cyberpunk, construite avec Next.js 15 et l'API YouTube.

## ✨ Fonctionnalités

- 🔍 Recherche de musique via l'API YouTube
- 🎧 Lecture audio en streaming progressif
- 🎨 Interface utilisateur néon cyberpunk
- 📱 Design responsive
- 🚫 Sans publicité
- 📨 Système de feedback intégré

## 🛠️ Technologies utilisées

- **Frontend**
  - Next.js 15
  - Tailwind CSS v4
  - shadcn/ui
  - Phosphor Icons
  - Zustand (State Management)
  - aceternity UI
  - motion.dev (animations)
  - react-hook-form
  - Tanstack Query

- **Backend**
  - Next.js API Routes
  - YouTube Data API v3
  - yt-dlp (extraction audio)
  - Resend (emails)
  - Zod (validation)

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/yourusername/neontune.git
cd neontune
```

2. Installez les dépendances :
```bash
pnpm install
```

3. Installez yt-dlp :
```bash
# Windows (avec Chocolatey)
choco install yt-dlp

# macOS (avec Homebrew)
brew install yt-dlp

# Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

4. Créez un fichier `.env.local` avec les variables suivantes :
```env
YOUTUBE_API_KEY=votre_clé_api_youtube
RESEND_API_KEY=votre_clé_api_resend
CONTACT_EMAIL=votre@email.com
```

5. Lancez le serveur de développement :
```bash
pnpm dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## 📝 Configuration

### YouTube API

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API YouTube Data v3
4. Créez des identifiants (clé API)
5. Copiez la clé dans votre fichier `.env.local`

### Resend (Emails)

1. Créez un compte sur [Resend](https://resend.com)
2. Générez une clé API
3. Copiez la clé dans votre fichier `.env.local`

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [YouTube API](https://developers.google.com/youtube/v3)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
