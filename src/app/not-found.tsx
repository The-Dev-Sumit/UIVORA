"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8">
          <h1 className="text-9xl font-bold text-blue-500">404</h1>
          <h2 className="text-3xl font-semibold text-white mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 mt-2">
            Oops! The page you're looking for doesn't exist.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Go Home
          </Link>
          <div className="mt-4">
            <Link
              href="/elements"
              className="text-blue-400 hover:text-blue-300 transition-colors">
              Browse Components
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
