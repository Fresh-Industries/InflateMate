'use client'
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, ChevronRight, 
  Clock, Star, ArrowRight, SkipForward 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Demo chapters for navigation
const CHAPTERS = [
  { time: 0, title: "Booking Flow", duration: "1:25" },
  { time: 85, title: "Mobile Experience", duration: "0:58" },
  { time: 143, title: "Owner Dashboard", duration: "1:42" },
  { time: 245, title: "Invoicing Demo", duration: "1:16" },
];

export default function DemoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showChapters, setShowChapters] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-hide controls after inactivity
  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);
  
  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
      
      // Update active chapter
      const newChapterIndex = CHAPTERS.findIndex((chapter, index) => {
        const nextChapter = CHAPTERS[index + 1];
        if (!nextChapter) return true;
        return video.currentTime >= chapter.time && video.currentTime < nextChapter.time;
      });
      
      if (newChapterIndex !== -1 && newChapterIndex !== activeChapter) {
        setActiveChapter(newChapterIndex);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    
    // Simulate loading delay (remove this in production)
    setTimeout(() => setIsLoading(false), 2000);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [activeChapter]);
  
  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };
  
  // Seek to time
  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
  };
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPosition * video.duration;
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };
  
  // Jump to chapter
  const jumpToChapter = (index: number) => {
    seekTo(CHAPTERS[index].time);
    setActiveChapter(index);
    setShowChapters(false);
  };
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-base" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              See InflateMate in action
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Watch how our platform transforms bounce house business operations in just a few minutes.
          </p>
        </motion.div>
        
        {/* Video player with custom frame */}
        <div 
          className="relative max-w-5xl mx-auto"
          ref={playerRef}
          onMouseMove={() => {
            setShowControls(true);
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
              controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) setShowControls(false);
              }, 3000);
            }
          }}
        >
          {/* Design frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-sm" />
          
          <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10">
            {/* Loading overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-white/80 font-medium">Loading demo...</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* The video */}
            <div className="relative aspect-video w-full">
              <video
                ref={videoRef}
                src="/videos/demo.mp4" /* Replace with your actual demo video */
                className="w-full h-full object-cover"
                onClick={togglePlay}
                poster="/images/demo-poster.jpg" /* Replace with your video thumbnail */
                playsInline
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Dim overlay when paused */}
              <AnimatePresence>
                {!isPlaying && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black"
                  />
                )}
              </AnimatePresence>
              
              {/* Big play button (shown when video is paused) */}
              <AnimatePresence>
                {!isPlaying && !isLoading && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                    onClick={togglePlay}
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary transition-colors">
                      <Play size={40} className="ml-2" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
              
              {/* Custom controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12 z-10"
                  >
                    {/* Progress bar */}
                    <div 
                      className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer relative"
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                      
                      {/* Chapter markers */}
                      {CHAPTERS.map((chapter, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "absolute top-1/2 w-1.5 h-1.5 rounded-full transform -translate-y-1/2",
                            index <= activeChapter ? "bg-white" : "bg-white/50"
                          )}
                          style={{ 
                            left: `${(chapter.time / duration) * 100}%`,
                            transition: 'background-color 0.3s'
                          }}
                        />
                      ))}
                      
                      {/* Draggable thumb */}
                      <div 
                        className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                        style={{ left: `${progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {/* Left controls */}
                      <div className="flex items-center gap-4">
                        {/* Play/Pause button */}
                        <button 
                          onClick={togglePlay}
                          className="text-white hover:text-primary transition-colors"
                          aria-label={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        
                        {/* Volume button */}
                        <button 
                          onClick={toggleMute}
                          className="text-white hover:text-primary transition-colors"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        
                        {/* Time display */}
                        <div className="text-sm text-white/80 flex items-center gap-1">
                          <Clock size={14} className="opacity-70" />
                          <span>{formatTime(currentTime)}</span>
                          <span className="opacity-50 mx-1">/</span>
                          <span className="opacity-70">{formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      {/* Right controls */}
                      <div className="flex items-center gap-4">
                        {/* Chapter navigation button */}
                        <div className="relative">
                          <button 
                            onClick={() => setShowChapters(!showChapters)}
                            className="flex items-center gap-1 text-white text-sm hover:text-primary transition-colors"
                          >
                            <span className="hidden sm:inline">Chapter:</span>
                            <span className="font-medium">{CHAPTERS[activeChapter]?.title}</span>
                            <ChevronRight 
                              size={16} 
                              className={cn(
                                "transition-transform duration-300",
                                showChapters ? "rotate-90" : "rotate-0"
                              )}
                            />
                          </button>
                          
                          {/* Chapter dropdown */}
                          <AnimatePresence>
                            {showChapters && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-xl w-56 sm:w-64"
                              >
                                <div className="p-2">
                                  {CHAPTERS.map((chapter, index) => (
                                    <button
                                      key={index}
                                      onClick={() => jumpToChapter(index)}
                                      className={cn(
                                        "w-full px-3 py-2 text-left text-sm rounded-md flex items-center justify-between",
                                        index === activeChapter 
                                          ? "bg-primary/20 text-primary"
                                          : "text-white hover:bg-white/10"
                                      )}
                                    >
                                      <span>{chapter.title}</span>
                                      <span className="text-xs opacity-70">{chapter.duration}</span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Skip 10s button */}
                        <button 
                          onClick={() => seekTo(currentTime + 10)}
                          className="text-white hover:text-primary transition-colors hidden sm:block"
                          aria-label="Skip 10 seconds"
                        >
                          <SkipForward size={18} />
                        </button>
                        
                        {/* Fullscreen button */}
                        <button 
                          onClick={toggleFullscreen}
                          className="text-white hover:text-primary transition-colors"
                          aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        >
                          <Maximize size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Feature highlights below video */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Star, title: "Easy to use", desc: "Intuitive interface for you and your clients" },
              { icon: Clock, title: "Time saving", desc: "Reduce admin work by up to 15 hours per week" },
              { icon: ArrowRight, title: "Get started fast", desc: "Set up your account in under 30 minutes" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 flex items-start gap-3"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <feature.icon size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* CTA button */}
          <div className="mt-10 text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-6 rounded-full"
            >
              <span className="font-bold text-base">Get started with InflateMate</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
