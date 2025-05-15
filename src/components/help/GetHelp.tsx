"use client";

import { useState, useEffect } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
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
        Found a bug? Report it on my GitHub repository or you can contribute to
        the project:
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

const UserGuideContent: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Creating Components</h3>
      <p className="text-gray-300">You can create two types of components:</p>
      <ul className="list-disc pl-6 mt-2 text-gray-300">
        <li>
          <span className="text-amber-300">HTML Components:</span> Using HTML,
          CSS, Tailwind css and JavaScript/TypeScript
        </li>
        <li>
          <span className="text-amber-300">React Components:</span> Using React
          with JSX/TSX and Tailwind css
        </li>
      </ul>
    </div>

    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Styling Options</h3>
      <p className="text-gray-300">You have multiple styling options:</p>
      <ul className="list-disc pl-6 mt-2 text-gray-300">
        <li>
          <span className="text-amber-300">Regular CSS:</span> Write traditional
          CSS in the CSS editor
        </li>
        <li>
          <span className="text-amber-300">Tailwind CSS:</span> Use Tailwind
          utility classes in your HTML/JSX
        </li>
        <li>
          <span className="text-amber-300">Both Together:</span> You can use
          both CSS and Tailwind in the same component
        </li>
      </ul>
      <p className="mt-2 text-sm text-gray-400">
        Note: The preview area is full-width and full-height, giving you
        complete control over layout.
      </p>
    </div>

    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Editor Features</h3>
      <ul className="list-disc pl-6 text-gray-300">
        <li>Split-screen view with live preview</li>
        <li>Syntax highlighting for all languages</li>
        <li>Real-time preview updates</li>
        <li>Switch between different code files (HTML/CSS/JS or JSX/CSS)</li>
      </ul>
    </div>

    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Saving and Managing</h3>
      <ul className="list-disc pl-6 text-gray-300">
        <li>Click "Save" to store your component</li>
        <li>Add tags to organize your components</li>
        <li>View all components in your dashboard's MyComponents</li>
        <li>Edit or delete components anytime</li>
      </ul>
    </div>

    <div className="bg-gray-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
      <ul className="list-disc pl-6 text-gray-300">
        <li>Use live preview to see changes instantly</li>
        <li>Test at different screen sizes</li>
        <li>Use meaningful names and tags</li>
        <li>Combine CSS and Tailwind for maximum flexibility</li>
      </ul>
    </div>
  </div>
);

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  if (activeTab === "faq") return <FAQContent />;
  if (activeTab === "contact") return <ContactContent />;
  if (activeTab === "guide") return <UserGuideContent />;
  return null;
};

const GetHelp: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "guide">(
    "faq"
  );

  const devMode = process.env.NEXT_PUBLIC_DEV_MODE;

  useEffect(() => {
    if (devMode !== "skip_auth" && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, devMode]);

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
              onClick={() => setActiveTab("guide")}
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "guide"
                  ? "border-b-2 border-gray-900 text-blue-300"
                  : "text-gray-300"
              }`}>
              <FaBook className="inline mr-2" />
              User Guide
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "faq"
                  ? "border-b-2 border-gray-900 text-blue-300"
                  : "text-gray-300"
              }`}>
              <FaQuestionCircle className="inline mr-2" />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-2 cursor-pointer ${
                activeTab === "contact"
                  ? "border-b-2 border-gray-900 text-blue-300"
                  : "text-gray-300"
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
