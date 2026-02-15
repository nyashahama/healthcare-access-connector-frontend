import React from "react";
import { MdVideoCall, MdPhone } from "react-icons/md";
import { FaUserMd, FaRegClock } from "react-icons/fa";

const ChatHeader = ({
  isConnected,
  activeProvider,
  waitTime,
  onStartVideoCall,
  onStartPhoneCall,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
      {isConnected && activeProvider ? (
        <>
          <div className="flex items-center">
            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl dark:bg-brand-900/30">
              {activeProvider.avatar}
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                {activeProvider.name}
              </h4>
              <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                {activeProvider.specialty}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onStartVideoCall}
              className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
              title="Start Video Call"
            >
              <MdVideoCall className="h-5 w-5" />
            </button>
            <button
              onClick={onStartPhoneCall}
              className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
              title="Start Phone Call"
            >
              <MdPhone className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <FaUserMd className="mr-3 h-8 w-8 text-brand-500" />
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Telemedicine Consultation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with a healthcare provider
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <FaRegClock className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              Wait time: {waitTime}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;
