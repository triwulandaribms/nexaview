'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Download,
  Plus,
  ArrowLeft,
  Mic,
  Square,
  Copy,
  Check,
  Edit3,
  Calendar,
  Search,
  Globe,
  ExternalLink,
  ArrowRight,
  Paperclip,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const QwenPlaygroundPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeFileTab, setActiveFileTab] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [streamingStats, setStreamingStats] = useState({
    characters: 0,
    words: 0,
    startTime: null,
  });
  const [apiSuggestions, setApiSuggestions] = useState([]);

  // Markdown components for proper rendering
  const markdownComponents = {
    // Remove default margins and let prose handle spacing
    p: ({ node, children, ...props }) => <p {...props}>{children}</p>,
    h1: ({ node, ...props }) => <h1 {...props} />,
    h2: ({ node, ...props }) => <h2 {...props} />,
    h3: ({ node, ...props }) => <h3 {...props} />,
    h4: ({ node, ...props }) => <h4 {...props} />,
    h5: ({ node, ...props }) => <h5 {...props} />,
    h6: ({ node, ...props }) => <h6 {...props} />,
    ul: ({ node, ...props }) => <ul {...props} />,
    ol: ({ node, ...props }) => <ol {...props} />,
    li: ({ node, ...props }) => <li {...props} />,
    blockquote: ({ node, ...props }) => <blockquote {...props} />,
    pre: ({ node, ...props }) => <pre {...props} />,
    code: ({ node, inline, ...props }) =>
      inline ? <code {...props} /> : <code {...props} />,
    table: ({ node, ...props }) => <table {...props} />,
    thead: ({ node, ...props }) => <thead {...props} />,
    th: ({ node, ...props }) => <th {...props} />,
    td: ({ node, ...props }) => <td {...props} />,
    a: ({ node, href, children, ...props }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
    hr: ({ node, ...props }) => <hr {...props} />,
    strong: ({ node, ...props }) => <strong {...props} />,
    em: ({ node, ...props }) => <em {...props} />,
  };

  // User markdown components with white text for dark backgrounds
  const userMarkdownComponents = {
    ...markdownComponents,
    p: ({ node, children, ...props }) => (
      <p className="text-white" {...props}>
        {children}
      </p>
    ),
    h1: ({ node, ...props }) => <h1 className="text-white" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-white" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-white" {...props} />,
    h4: ({ node, ...props }) => <h4 className="text-white" {...props} />,
    h5: ({ node, ...props }) => <h5 className="text-white" {...props} />,
    h6: ({ node, ...props }) => <h6 className="text-white" {...props} />,
    strong: ({ node, ...props }) => (
      <strong className="text-white font-bold" {...props} />
    ),
    em: ({ node, ...props }) => <em className="text-white italic" {...props} />,
    li: ({ node, ...props }) => <li className="text-white" {...props} />,
    a: ({ node, href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline hover:text-orange-100"
        {...props}
      >
        {children}
      </a>
    ),
  };

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Quick suggestions for users
  const quickSuggestions = [
    {
      id: 1,
      text: 'What can you help me with?',
      icon: '🤔',
    },
    {
      id: 2,
      text: 'Summarize the uploaded documents',
      icon: '📄',
    },
    {
      id: 3,
      text: 'Analyze the key points in these files',
      icon: '🔍',
    },
    {
      id: 4,
      text: 'What are the main topics discussed?',
      icon: '💡',
    },
    {
      id: 5,
      text: 'Create a summary report',
      icon: '📊',
    },
    {
      id: 6,
      text: 'Find specific information in the documents',
      icon: '🎯',
    },
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Hide suggestions when user has messages or starts typing
  useEffect(() => {
    if (messages.length > 0 || newMessage.trim()) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  }, [messages.length, newMessage]);

  // Get current suggestions to display
  const currentSuggestions =
    apiSuggestions.length > 0
      ? apiSuggestions.map((text, index) => ({
          id: `api-${index}`,
          text: text,
          icon: index === 0 ? '🤔' : index === 1 ? '💡' : '📝',
        }))
      : quickSuggestions;

  // Handle file upload with drag and drop support
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      for (const file of files) {
        const newFile = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        };

        setUploadedFiles((prev) => [...prev, newFile]);

        // If this is the first file, set it as active tab
        if (uploadedFiles.length === 0) {
          setActiveFileTab(newFile.id);
        }
      }
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Failed to process files. Please try again.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Send message with streaming support to Qwen API
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);
    setStreamingMessage('');
    setStreamingStats({
      characters: 0,
      words: 0,
      startTime: performance.now(),
    });

    // Add user message to chat
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    // Track performance metrics
    const startTime = performance.now();
    let firstTokenTime = null;
    let totalTokens = 0;

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('messages', userMessage);

      // Add uploaded files to form data
      uploadedFiles.forEach((fileObj) => {
        formData.append('files', fileObj.file);
      });

      // Send request to Qwen API
      const response = await fetch('https://qwen-mdw.ifabula.id/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response supports streaming
      if (!response.body) {
        throw new Error('Response body is not available for streaming');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let latestContent = '';
      let assistantMessageId = Date.now() + 1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            // Parse each line as a JSON array or object
            const parsed = JSON.parse(line);

            // Check if this is a suggestions object
            if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
              setApiSuggestions(parsed.suggestions);
              continue;
            }

            // Handle both array and single object responses
            const messages = Array.isArray(parsed) ? parsed : [parsed];

            for (const message of messages) {
              // Only process assistant messages with actual content (not function calls)
              if (
                message.content &&
                message.content.trim() &&
                message.role === 'assistant' &&
                !message.function_call
              ) {
                latestContent = message.content;
                totalTokens = latestContent.split(' ').length;

                // Track first token time
                if (!firstTokenTime) {
                  firstTokenTime = performance.now();
                }

                // Update streaming stats in real-time
                const currentStats = {
                  characters: latestContent.length,
                  words: totalTokens,
                  startTime: streamingStats.startTime || performance.now(),
                };
                setStreamingStats(currentStats);

                setStreamingMessage(latestContent);
                await new Promise((resolve) => setTimeout(resolve, 10));
              }
            }
          } catch (err) {
            // Try to handle non-JSON streaming data
            if (line.trim()) {
              latestContent += line;
              setStreamingMessage(latestContent);
            }
          }
        }
      }

      // Calculate final metrics
      const endTime = performance.now();
      const totalResponseTime = Math.round(endTime - startTime);
      const firstTokenLatency = firstTokenTime
        ? Math.round(firstTokenTime - startTime)
        : 0;
      const streamingTime = firstTokenTime
        ? Math.round(endTime - firstTokenTime)
        : totalResponseTime;
      const wordsPerSecond =
        streamingTime > 0
          ? Math.round((totalTokens * 1000) / streamingTime)
          : 0;
      const charactersPerSecond =
        streamingTime > 0
          ? Math.round(((latestContent?.length || 0) * 1000) / streamingTime)
          : 0;

      // Add final assistant message with metrics
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: latestContent || 'No response received',
        timestamp: new Date().toISOString(),
        metrics: {
          totalResponseTime,
          firstTokenLatency,
          wordCount: totalTokens,
          charactersPerSecond,
          wordsPerSecond,
          estimatedTokens: Math.round(totalTokens * 1.3), // Rough estimation
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage('');
      setStreamingStats({ characters: 0, words: 0, startTime: null });
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorTime = performance.now();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true,
          metrics: {
            totalResponseTime: Math.round(errorTime - startTime),
            firstTokenLatency: 0,
            wordCount: 9,
            charactersPerSecond: 0,
            wordsPerSecond: 0,
            estimatedTokens: 9,
          },
        },
      ]);
      setStreamingMessage('');
      setStreamingStats({ characters: 0, words: 0, startTime: null });
      setIsLoading(false);
    }
  }, [newMessage, uploadedFiles, isLoading]);

  // Remove file
  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (activeFileTab === fileId) {
      const remaining = uploadedFiles.filter((f) => f.id !== fileId);
      setActiveFileTab(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Copy message content
  const copyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestionText) => {
    setNewMessage(suggestionText);
    setShowSuggestions(false);
    // Focus on textarea after clicking suggestion
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/playground">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  <ArrowLeft className="size-4 text-gray-600" />
                </motion.button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Qwen Playground
                  </h1>
                  <Sparkles className="size-6 text-orange-500" />
                </div>
                <p className="text-gray-600 text-sm">
                  Upload files and chat with Qwen AI model
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              {isFullscreen ? (
                                    <Minimize2 className="size-5 text-gray-600" />
              ) : (
                                  <Maximize2 className="size-5 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Enhanced File Management Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="text-orange-600" />
                Files ({uploadedFiles.length})
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-md"
              >
                                    <Upload />
                Upload Files
              </motion.button>
            </div>

            <div
              className="flex-1 overflow-y-auto"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {uploadedFiles.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="size-6 opacity-50" />
                  </div>
                  <p className="text-sm font-medium mb-1">No files uploaded</p>
                  <p className="text-xs">Drag & drop files here</p>
                </div>
              ) : (
                <div className="p-2">
                  <AnimatePresence>
                    {uploadedFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-3 mb-2 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                          activeFileTab === file.id
                            ? 'border-orange-300 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveFileTab(file.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-lg hover:bg-red-50"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Chat Interface */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot className="text-white size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Qwen AI Assistant
                    </h3>
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.length} file
                      {uploadedFiles.length !== 1 ? 's' : ''} attached • Ready
                      to help
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages with Enhanced Design */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.role === 'user' ? 'order-2' : 'order-1'
                      }`}
                    >
                      <div
                        className={`flex items-start gap-3 ${
                          message.role === 'user'
                            ? 'flex-row-reverse'
                            : 'flex-row'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                              : message.isError
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 shadow-md'
                          }`}
                        >
                                                      {message.role === 'user' ? (
                              <User className="size-4" />
                            ) : (
                              <Bot className="size-4" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-md border ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-200'
                                : message.isError
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-white text-gray-900 border-gray-200'
                            }`}
                          >
                            <div
                              className={`prose prose-sm max-w-none ${
                                message.role === 'user'
                                  ? 'prose-invert'
                                  : 'prose-gray'
                              }`}
                            >
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={
                                  message.role === 'user'
                                    ? userMarkdownComponents
                                    : markdownComponents
                                }
                                unwrapDisallowed={true}
                                breaks={true}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <p
                                className={`text-xs ${
                                  message.role === 'user'
                                    ? 'text-white'
                                    : 'text-gray-500'
                                }`}
                              >
                                {new Date(
                                  message.timestamp
                                ).toLocaleTimeString()}
                              </p>

                              {message.role === 'assistant' && (
                                <button
                                  onClick={() =>
                                    copyMessage(message.content, message.id)
                                  }
                                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded"
                                >
                                  {copiedMessageId === message.id ? (
                                    <Check className="size-3 text-green-500" />
                                  ) : (
                                                                          <Copy className="size-3" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Message Metrics - Only for assistant messages */}
                            {message.role === 'assistant' &&
                              message.metrics && (
                                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-100">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {message.metrics.totalResponseTime}ms
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    {message.metrics.firstTokenLatency}ms
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    ~{message.metrics.estimatedTokens} est.
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {message.metrics.charactersPerSecond} c/s
                                    avg
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {message.metrics.wordCount} words
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Streaming Message */}
              {(isLoading || streamingMessage) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-2xl flex items-center justify-center shadow-md">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                      {streamingMessage ? (
                        <div>
                          <div className="prose prose-sm max-w-none prose-gray">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeHighlight]}
                              components={markdownComponents}
                              unwrapDisallowed={true}
                              breaks={true}
                            >
                              {streamingMessage}
                            </ReactMarkdown>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                              <span className="text-xs text-gray-500">
                                Streaming...
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {streamingStats.characters} chars
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {streamingStats.words} words
                              </span>
                              {streamingStats.startTime && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {Math.round(
                                    performance.now() - streamingStats.startTime
                                  )}
                                  ms
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin size-4 text-orange-600" />
                          <span className="text-sm text-gray-600">
                            Qwen is thinking...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Suggestions - Bottom of Messages */}
              <AnimatePresence>
                {((showSuggestions && messages.length === 0) ||
                  (apiSuggestions.length > 0 && !newMessage.trim())) &&
                  !isLoading &&
                  !streamingMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="px-4 pb-4"
                    >
                      <div className="text-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Quick suggestions
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {currentSuggestions.slice(0, 3).map((suggestion) => (
                          <motion.button
                            key={suggestion.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleSuggestionClick(suggestion.text)
                            }
                            className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left group text-sm shadow-sm"
                          >
                            <span className="text-lg">{suggestion.icon}</span>
                            <span className="font-medium text-gray-700 group-hover:text-orange-700">
                              {suggestion.text}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Message Input */}
            <div className="border-t border-gray-100 p-4 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask questions about your uploaded files..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                    rows={1}
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                    disabled={isLoading}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {isLoading ? (
                    <FaSpinner className="size-5 animate-spin" />
                  ) : (
                    <FaPaperPlane className="size-5" />
                  )}
                </motion.button>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Press Enter to send • Shift + Enter for new line</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Streaming enabled
                  </span>
                </div>
                {uploadedFiles.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MdAttachFile className="size-3" />
                    {uploadedFiles.length} file
                    {uploadedFiles.length !== 1 ? 's' : ''} attached
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QwenPlaygroundPage;
