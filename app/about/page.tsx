// Remover import não utilizado se houver: import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">About NullUnit</h1>
        <p className="text-xl text-default-600 max-w-3xl mx-auto">
          NullUnit is a dedicated cybersecurity collective focused on advancing knowledge through bug bounty hunting, Capture The Flag (CTF) competitions, research articles, and educational courses.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg text-default-700">
          Our mission is to explore the depths of cybersecurity, share our findings with the community, and foster a culture of ethical hacking and continuous learning. We aim to make the digital world a safer place, one vulnerability at a time.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
        <p className="text-lg text-default-700 mb-4">
          Founded in [Year], NullUnit started as a small group of enthusiasts participating in local CTFs. We quickly realized our shared passion and complementary skills could make a bigger impact. 
        </p>
        <p className="text-lg text-default-700">
          Since then, we've grown into a recognized team, contributing to various bug bounty programs, publishing research, and actively participating in the global cybersecurity community. Our collaborative spirit drives us to tackle complex challenges and share insights through articles and training.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Core Values</h2>
        <ul className="list-disc list-inside space-y-2 text-lg text-default-700">
          <li><span className="font-medium">Collaboration:</span> We believe in the power of teamwork and open knowledge sharing.</li>
          <li><span className="font-medium">Integrity:</span> Ethical conduct is at the heart of everything we do.</li>
          <li><span className="font-medium">Curiosity:</span> We constantly seek to learn, explore, and push boundaries.</li>
          <li><span className="font-medium">Community:</span> We strive to contribute positively to the cybersecurity ecosystem.</li>
        </ul>
      </section>

      {/* Adicionar outras seções se necessário, como "Join Us" ou "Our Approach" */}
    </div>
  );
}
