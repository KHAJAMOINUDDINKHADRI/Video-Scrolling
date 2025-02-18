"use client";

import { useRef, useEffect, useState } from "react";
import {
  Loader2,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Play,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// List of videos from the ToastD web application.
const videos = [
  {
    id: 1,
    url: "https://assets.toastd.in/kapiva-himalayan-shilajit-resin-20g/videos/shilajitVideo.mp4",
    title: "Kapiva Himalayan Shilajit Resin",
    description:
      "One of the most trusted products to increase stamina and strength",
    productLink:
      "https://www.toastd.in/product/kapiva-himalayan-shilajit-resin-20g",
    likes: 5,
  },
  {
    id: 2,
    url: "https://assets.toastd.in/arata-intensive-hair-growth-serum-30ml/videos/arataVideo.mp4",
    title: "Arata Intensive Hair Growth Serum",
    description:
      "Give Your Hair the Power to Grow Stronger, Thicker, and Healthier Every Day.",
    productLink:
      "https://www.toastd.in/product/arata-intensive-hair-growth-serum-30ml",
    likes: 7,
  },
  {
    id: 3,
    url: "https://assets.toastd.in/fuelled-protein-bars-12/videos/fuelledProteinBar.mp4",
    title: "Death By Chocolate - Protein Bars",
    description: "The Most Delicious High-Protein, Low-Calorie Bar Out There.",
    productLink: "https://www.toastd.in/product/fuelled-protein-bars-12",
    likes: 10,
  },
  {
    id: 4,
    url: "https://assets.toastd.in/kamaayurveda-kumkumadi-bringadi-hair-oil/videos/kama-hairoil.mp4",
    title: "Your Shortcut to Gorgeous Hair",
    description:
      "Click now to experience the secret to fuller, shinier hair that's as strong as it looks.",
    productLink:
      "https://www.toastd.in/product/kamaayurveda-kumkumadi-miraculous-beauty-ayurvedic-night-serum",
    likes: 63,
  },
  {
    id: 5,
    url: "https://assets.toastd.in/luxury-jewellery-set-personalised-for-her/salty-video1.mp4",
    title: "Jewellery Set For HER to Get out of Friendzone",
    description: "Sometimes a gesture says what words cannot",
    productLink:
      "https://www.toastd.in/product/luxury-jewellery-set-personalised-for-her",
    likes: 11,
  },
  {
    id: 6,
    url: "https://assets.toastd.in/luxury-jewellery-set-personalised-for-her/salty-video2.mp4",
    title: "Jewellery Set For HER to Get out of Friendzone",
    description: "Sometimes a gesture says what words cannot",
    productLink:
      "https://www.toastd.in/product/luxury-jewellery-set-personalised-for-her",
    likes: 11,
  },
  {
    id: 7,
    url: "https://assets.toastd.in/luxury-jewellery-set-personalised-for-her/salty-video3.mp4",
    title: "Jewellery Set For HER to Get out of Friendzone",
    description: "Sometimes a gesture says what words cannot",
    productLink:
      "https://www.toastd.in/product/luxury-jewellery-set-personalised-for-her",
    likes: 11,
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState<Record<number, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const [currentVideoId, setCurrentVideoId] = useState<number>(1);

  // Creats the interaction observer to track if the video is visible like 50%, then it automatically plays the current video and pauses the previous video.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    videos.forEach((video) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentVideoId(video.id);
              const videoElement = videoRefs.current[video.id];
              if (videoElement) {
                videoElement.play();
                setIsPlaying((prev) => ({ ...prev, [video.id]: true }));
              }
            } else {
              const videoElement = videoRefs.current[video.id];
              if (videoElement) {
                videoElement.pause();
                setIsPlaying((prev) => ({ ...prev, [video.id]: false }));
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      const videoContainer = document.getElementById(`video-${video.id}`);
      if (videoContainer) {
        observer.observe(videoContainer);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Handles video loading state and sets playing state if it's the current video
  const handleVideoLoad = (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: false }));
    if (id === currentVideoId) {
      setIsPlaying((prev) => ({ ...prev, [id]: true }));
    }
  };

  // Sets loading state when video starts loading
  const handleVideoLoadStart = (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
  };

  // Toggles play/pause state for a specific video
  const togglePlay = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying((prev) => ({ ...prev, [id]: true }));
    } else {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Toggles mute state for all videos
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      Object.values(videoRefs.current).forEach((video) => {
        if (video) video.muted = newMutedState;
      });
      return newMutedState;
    });
  };

  // Toggles like state for a specific video
  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handles sharing products with Web Share or clipboard
  const handelShare = (videoUrl: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out the video!",
          url: videoUrl,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard
        .writeText(videoUrl)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(() => {
          prompt("Copy this link:", videoUrl);
        });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <ScrollArea
        ref={containerRef}
        className="h-screen w-[calc((9/16)*100vh)] overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {videos.map((video) => (
          <div
            key={video.id}
            id={`video-${video.id}`}
            className="h-screen w-full snap-start relative transition-all duration-500 ease-in-out mb-2 mt-2 rounded-lg"
          >
            <video
              ref={(el) => (videoRefs.current[video.id] = el)}
              src={video.url}
              className="h-full w-full object-cover"
              loop
              muted={isMuted}
              playsInline
              autoPlay
              onLoadStart={() => handleVideoLoadStart(video.id)}
              onLoadedData={() => handleVideoLoad(video.id)}
              onClick={() => togglePlay(video.id)}
            />
            {loading[video.id] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60">
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleMute();
                  }}
                  className="rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </Button>
              </div>

              {/* Center Play/Pause Button */}
              <div
                className="absolute inset-0 flex items-center justify-center z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay(video.id);
                }}
              >
                {!isPlaying[video.id] && (
                  <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              {/* Product Info and Actions */}
              <Card className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-sm border-none text-white z-40">
                <div className="p-4 flex items-end justify-between">
                  {/* Left side - Product Info */}
                  <div className="flex-1 mr-4">
                    <h2 className="text-xl font-bold mb-2">{video.title}</h2>
                    <p className="text-white/90 text-sm mb-3">
                      {video.description}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="hover:bg-white/30"
                      asChild
                    >
                      <a
                        href={video.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        Shop Now
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex flex-col gap-14 items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleLike(video.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                        <Heart
                          className={`w-5 h-5 ${
                            liked[video.id]
                              ? "text-red-500 fill-red-500"
                              : "text-white"
                          }`}
                        />
                      </div>
                      <span className="text-xs">
                        {formatNumber(video.likes)}
                      </span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex flex-col items-center gap-1 pb-8"
                      onClick={() => handelShare(video.url)}
                    >
                      <div className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs">Share</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
