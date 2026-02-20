import React from "react";
import { MdCheck, MdDoneAll } from "react-icons/md";
import { MdAttachFile } from "react-icons/md";

const MessageBubble = ({ message }) => {
  // System event
  if (message.sender === "system" || message.message_type === "system_event") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-gray-100 px-4 py-1.5 text-xs text-gray-500 dark:bg-navy-700 dark:text-gray-400">
          {message.text}
        </div>
      </div>
    );
  }

  const isUser = message.sender === "user";

  // File / attachment
  const isAttachment =
    message.message_type === "file" || message.attachment_url;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "rounded-tr-sm bg-brand-500 text-white"
            : "rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-navy-700 dark:text-gray-200"
        }`}
      >
        {/* Provider name */}
        {!isUser && message.provider && (
          <div className="mb-1 text-xs font-semibold opacity-60">
            {message.provider}
          </div>
        )}

        {/* Attachment */}
        {isAttachment ? (
          <a
            href={message.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 underline ${
              isUser ? "text-white/90" : "text-brand-500"
            }`}
          >
            <MdAttachFile className="h-4 w-4 flex-shrink-0" />
            <span className="truncate text-sm">
              {message.attachment_filename || "Attachment"}
            </span>
          </a>
        ) : (
          <p className="text-sm leading-relaxed">{message.text}</p>
        )}

        {/* Timestamp + read receipt */}
        <div
          className={`mt-1 flex items-center gap-1 text-xs ${
            isUser ? "justify-end text-white/60" : "text-gray-400"
          }`}
        >
          <span>{message.time}</span>
          {isUser &&
            (message.is_read ? (
              <MdDoneAll className="h-3.5 w-3.5 text-blue-300" />
            ) : (
              <MdCheck className="h-3.5 w-3.5 opacity-60" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
