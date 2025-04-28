"use client";

import { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TabContentProps {
  activeTab: string;
}

const FAQContent: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">How do I use the UIVora?</h3>
      <p className="text-gray-300">
        The UIVora allows you to write and test HTML, CSS, and JavaScript code
        in real-time. Select your preferred language from the tabs and start
        coding!
      </p>
    </div>
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        Which animation libraries I can use?
      </h3>
      <p className="text-gray-300">
        You can use Framer Motion, GSAP, and Anime.js, and in react you don't
        need to import anything just start using it.
      </p>
    </div>
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        Is there a size limit for code?
      </h3>
      <p className="text-gray-300">
        Currently, there is a limit of 10MB per code snippet to ensure optimal
        performance.
      </p>
    </div>
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        Is UiVora an open source project?
      </h3>
      <p className="text-gray-300">
        Yes, it&apos;s an open source — made by a junior developer.
      </p>
    </div>
  </div>
);

const ContactContent: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Email Support</h3>
      <p className="text-gray-300">
        For any queries or issues, please email us at:
        <a
          href="mailto:sumitp4365@gmail.com"
          className="text-blue-400 hover:text-blue-300 ml-2">
          sumitp4365@gmail.com
        </a>
      </p>
    </div>
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Discord Community</h3>
      <p className="text-gray-300">
        Join our Discord community for real-time support and discussions:
        <a
          href="https://discord.gg/m3X4zquR"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 ml-2">
          <FaDiscord className="inline mr-1" />
          Discord Server
        </a>
      </p>
    </div>
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">GitHub Contributions</h3>
      <p className="text-gray-300">
        Found a bug? Report it on my GitHub repository or you can contribute to the project:
        <a
          href="https://github.com/The-Dev-Sumit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 ml-2">
          <FaGithub className="inline mr-1" />
          GitHub Repository
        </a>
      </p>
    </div>
  </div>
);

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  if (activeTab === "faq") return <FAQContent />;
  if (activeTab === "contact") return <ContactContent />;
  return null;
};

const GetHelp: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-white lemonada-sem tracking-wider">
            Get Help
          </h1>
        </div>

        <div className="space-y-6 text-white">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "faq"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400"
              }`}>
              <FaQuestionCircle className="inline mr-2" />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "contact"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400"
              }`}>
              <MdEmail className="inline mr-2" />
              Contact Us
            </button>
          </div>

          {/* Content */}
          <div className="mt-6">
            <TabContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetHelp;
