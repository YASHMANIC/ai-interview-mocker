# AI Mock Interview

![AI Mock Interview Banner](https://img.shields.io/badge/AI-Mock%20Interview-blue?style=for-the-badge&logo=next.js)

A sophisticated Next.js application that simulates job interviews using artificial intelligence to help candidates practice and improve their interview skills.

## ✨ Features

- **Realistic AI Interviewers**: Experience interviews with AI personas that mimic real recruiters
- **Industry-Specific Questions**: Practice with questions tailored to your field
- **Real-time Feedback**: Get instant analysis on your answers
- **Interview Recording**: Review your performance with audio/video recordings
- **Performance Analytics**: Track your improvement over time
- **Customizable Sessions**: Select interview duration, difficulty, and focus areas

## 🚀 Live Demo

Check out the live demo at [ai-mock-interview.example.com](https://ai-mock-interview.example.com)

## 📸 Screenshots

<div align="center">
  <img src="/api/placeholder/800/450" alt="AI Mock Interview Dashboard" width="800"/>
  <p><i>Dashboard with interview statistics and recommendations</i></p>
  
  <img src="/api/placeholder/800/450" alt="Interview Session" width="800"/>
  <p><i>Live interview session with AI interviewer</i></p>
</div>

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS ,ShadCn
- **Backend**:  Node,Bun,Zustand
- **Authentication**: Next-auth
- **AI/ML**: Google Gemini API,
- **Database**: Postgres
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YASHMANIC/ai-interview-mocker.git
cd ai-interview-mocker
```

2. Install dependencies:
```bash
bun install
#or
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then fill in your API keys and other environment variables.

4. Run the development server:
```bash
bun run dev
#or
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

The application can be configured through the `.env.local` file:

```
NEXT_PUBLIC_API_URL=your_api_url
GEMINI_API_KEY=your_gemini_api_key
POSTGRES_URI=your_postgres_connection_string
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

If you have any questions or feedback, please reach out to [yashmanic96@gmail.com](mailto:yashmanic96@gmail.com).

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/YASHMANIC">Yaswanth</a></p>
</div>
