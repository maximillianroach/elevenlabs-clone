"use client";

import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import {
  generateSpeechToSpeech,
  generateUploadUrl,
  generationStatus,
} from "~/actions/generate-speech";
import { GenerateButton } from "~/components/client/speech-synthesis/generate-button";
import { useAudioStore } from "~/stores/audio-store";
import { useVoiceStore } from "~/stores/voice-store";
import type { ServiceType } from "~/types/services";

const ALLOWED_AUDIO_TYPES = ["audio/mp3", "audio/wav"];

export function VoiceChanger({
  credits,
  service,
}: {
  credits: number;
  service: ServiceType;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

  const { playAudio } = useAudioStore();

  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);
  const selectedVoice = getSelectedVoice(service);

  const handleFileSelect = (selectedFile: File) => {
    const isAllowedAudio = ALLOWED_AUDIO_TYPES.includes(selectedFile.type);

    const isUnder50MB = selectedFile.size <= 50 * 1024 * 1024;

    if (isAllowedAudio && isUnder50MB) {
      setFile(selectedFile);
    } else {
      alert(
        isAllowedAudio
          ? "File is too large. Max size is 50 MB"
          : "Please selected MP3 or WAV file only.",
      );
    }
  };

  const handleGenerateSpeech = async () => {
    if (!file || !selectedVoice) return;

    try {
      setIsLoading(true);

      const { uploadUrl, s3Key } = await generateUploadUrl(file.type);

      const uploadResult = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error("Failed to upload file to storage");
      }

      const { audioId, shouldShowThrottleAlert } = await generateSpeechToSpeech(
        s3Key,
        selectedVoice.id,
      );
      setCurrentAudioId(audioId);
    } catch (error) {
      if (error instanceof Error && error.cause) {
        console.error("Cause: " + error.cause);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentAudioId || !isLoading) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await generationStatus(currentAudioId);

        if (status.success && status.audioUrl && selectedVoice) {
          clearInterval(pollInterval);
          setIsLoading(false);

          const newAudio = {
            id: currentAudioId,
            title: file?.name || "Voice changed audio",

            audioUrl: status.audioUrl,
            voice: selectedVoice?.id,
            duration: "0:30",
            progress: 0,
            service: service,
          };

          playAudio(newAudio);
          setCurrentAudioId(null);
          setFile(null);
        } else if (!status.success) {
          clearInterval(pollInterval);
          setIsLoading(false);
          setCurrentAudioId(null);
          console.error("Failed");
        }
      } catch (error) {
        console.error("Error polling for audio status: " + error);
        clearInterval(pollInterval);
        setIsLoading(false);
        setCurrentAudioId(null);
      }
    }, 500);

    return () => {
      clearInterval(pollInterval);
    };
  }, [currentAudioId, isLoading, selectedVoice?.id, playAudio, file, service]);

  return (
    <div className="flex flex-1 flex-col justify-between px-4">
      <div className="flex flex-1 items-center justify-center py-8">
        <div
          onDragOver={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const file = e.dataTransfer.files[0];
              if (file) {
                handleFileSelect(file);
              }
            }
          }}
          onClick={() => {
            if (isLoading) return;
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "audio/mp3, audio/wav";
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                const file = target.files[0];
                if (file) {
                  handleFileSelect(file);
                }
              }
            };
            input.click();
          }}
          className={`w-full max-w-xl rounded-2xl border-2 border-dotted p-8 transition-all duration-200 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"} ${file ? "bg-white" : "bg-gray-50"}`}
        >
          {file ? (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                <FaUpload className="h-4 w-4" />
              </div>
              <p className="mb-1 text-sm font-medium">{file.name}</p>
              <p className="mb-1 text-sm font-medium">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLoading) {
                    setFile(null);
                  }
                }}
                disabled={isLoading}
                className={`mt-2 text-sm ${isLoading ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
              >
                Choose a different file
              </button>
            </div>
          ) : (
            <div className="flex cursor-pointer flex-col items-center py-8 text-center">
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                <FaUpload className="h-4 w-4 text-gray-500" />
              </div>
              <p className="mb-1 text-sm font-medium">
                Click to upload, or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                MP3 or WAV files only, up to 50MB
              </p>
            </div>
          )}
        </div>
      </div>
      <GenerateButton
        onGenerate={handleGenerateSpeech}
        isDisabled={!file || isLoading}
        isLoading={isLoading}
        showDownload={true}
        creditsRemaining={credits}
        buttonText="Convert Voice"
      />
    </div>
  );
}
