"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { Button } from "@/components/ui/button";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

const loadingStates = [
  { text: "Trying to reach out AI agent" },
  { text: "Checking if that was a correct agent" },
  { text: "Yelling at the agent" },
  { text: "Arguing with the agent" },
  { text: "Assigning a task to the agent" },
  { text: "Waiting for task completion" },
  { text: "Task completed" },
  { text: "Formatting the task" },
  { text: "Returning the result to the user" },
];

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const router = useRouter(); 

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    setUploadComplete(false);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const uploadResponse = await axiosInstance.post(
        "/api/v1/csv/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload Response:", uploadResponse.data);
      setUploadComplete(true);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCategorization = async () => {
    if (!uploadComplete) return;

    setLoading(true);

    try {
    const processResponse = await axiosInstance.post(
        "/api/v1/categorize"
    );
    console.log("Processing Response:", processResponse.data);

    router.push("/transactions");
    } catch (error) {
    console.error("Error processing file:", error);
    } finally {
    setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 mt-50 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center space-y-4 p-6">
      <FileUpload onChange={handleFileUpload} />

      <Button
        onClick={handleCategorization}
        disabled={!uploadComplete || loading}
        className="w-40 h-10 bg-gray-500 hover:bg-gray-600 transition-all text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Categorize
      </Button>

      {/* Loader Animation */}
      {loading && (
        <>
          <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
          <button
            className="fixed top-4 right-4 text-black dark:text-white z-[120]"
            onClick={() => setLoading(false)}
          >
            <IconSquareRoundedX className="h-10 w-10" />
          </button>
        </>
      )}
    </div>
  );
}