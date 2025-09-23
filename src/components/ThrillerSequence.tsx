import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import crowbarImage from "@/assets/crowbar.jpg";
import darkBackground from "@/assets/dark-background.png";

type GameState = 
  | 'password'
  | 'flash-red'
  | 'crowbar-laugh'
  | 'threat-message'
  | 'who-are-you'
  | 'who-is-agent'
  | 'final-text'
  | 'game-over';

export const ThrillerSequence = () => {
  const [gameState, setGameState] = useState<GameState>('password');
  const [passwordInput, setPasswordInput] = useState('');
  const [whoAreYouInput, setWhoAreYouInput] = useState('');
  const [whoIsAgentInput, setWhoIsAgentInput] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [showCrowbar, setShowCrowbar] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetGame = () => {
    setGameState('password');
    setPasswordInput('');
    setWhoAreYouInput('');
    setWhoIsAgentInput('');
    setIsFlashing(false);
    setShowCrowbar(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput.toLowerCase() === 'agent1297354') {
      setGameState('flash-red');
      setIsFlashing(true);
      
      // Flash red for 5 seconds
      setTimeout(() => {
        setIsFlashing(false);
        setGameState('crowbar-laugh');
        setShowCrowbar(true);
        
        // Note: You'll need to add sinister-laugh.mp3 to public folder
        try {
          audioRef.current = new Audio('/sinister-laugh.mp3');
          audioRef.current.play().catch(console.error);
        } catch (error) {
          console.log('Audio not found - add sinister-laugh.mp3 to public folder');
        }
        
        // Show crowbar and play laugh for 10 seconds
        setTimeout(() => {
          setShowCrowbar(false);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setGameState('threat-message');
          
          // Show threat message for 5 seconds
          setTimeout(() => {
            setGameState('who-are-you');
          }, 5000);
        }, 10000);
      }, 5000);
    } else {
      // Wrong password - could add error state here
      setPasswordInput('');
    }
  };

  const handleWhoAreYouSubmit = () => {
    if (whoAreYouInput.toLowerCase().includes('batman')) {
      setGameState('who-is-agent');
    } else {
      playGameOverSequence();
    }
  };

  const handleWhoIsAgentSubmit = () => {
    const answer = whoIsAgentInput.toLowerCase();
    if (answer.includes('jason todd') || answer.includes('red hood')) {
      setGameState('final-text');
    } else {
      playGameOverSequence();
    }
  };

  const playGameOverSequence = () => {
    setGameState('game-over');
    
    // Play sinister laugh interrupted by bang
    try {
      const laughAudio = new Audio('/sinister-laugh.mp3');
      laughAudio.play().catch(console.error);
      
      setTimeout(() => {
        laughAudio.pause();
        const bangAudio = new Audio('/bang.mp3');
        bangAudio.play().catch(console.error);
        
        setTimeout(() => {
          resetGame();
        }, 2000);
      }, 3000);
    } catch (error) {
      console.log('Audio files not found');
      setTimeout(resetGame, 3000);
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'password':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 restricted-bg">
            <div className="max-w-md w-full space-y-8 relative z-10">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-ominous text-crimson mb-8">
                  RESTRICTED ACCESS
                </h1>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    className="input-thriller text-center text-lg"
                  />
                  <Button 
                    onClick={handlePasswordSubmit}
                    className="w-full btn-thriller"
                  >
                    ENTER
                  </Button>
                </div>
              </div>
              
              {/* Hidden text that becomes visible when highlighted */}
              <div className="mt-16 text-sm leading-relaxed">
                <p className="hidden-text select-text">
                  So desperate to unlock the past huh? Are you sure you want to remember? 
                  You don't have to, you can forget about it all. I'll do what you never could. 
                  I'll do what should've been done long ago. Password will be agent1297354 for now.
                </p>
              </div>
            </div>
          </div>
        );

      case 'flash-red':
        return (
          <div className={`min-h-screen flex items-center justify-center ${isFlashing ? 'flash-red' : ''}`}>
            <div className="text-center">
              <h1 className="text-6xl font-bold text-ominous text-shadow-black">
                You haven't lost your touch *Undecipherable*, maybe this will help you remember:
              </h1>
            </div>
          </div>
        );

      case 'crowbar-laugh':
        return (
          <div className="min-h-screen flex items-center justify-center">
            {showCrowbar && (
              <div className="flash-image">
                <img 
                  src={crowbarImage} 
                  alt="Crowbar" 
                  className="max-w-4xl w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        );

      case 'threat-message':
        return (
          <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${darkBackground})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="text-center relative z-10">
              <h1 className="text-5xl font-bold text-ominous text-bone-white drop-shadow-2xl">
                I will do what must be done, and you will watch.
              </h1>
            </div>
          </div>
        );

      case 'who-are-you':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-ominous text-crimson mb-6">
                  Who are you:
                </h2>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your answer..."
                    value={whoAreYouInput}
                    onChange={(e) => setWhoAreYouInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleWhoAreYouSubmit()}
                    className="input-thriller text-center"
                  />
                  <Button 
                    onClick={handleWhoAreYouSubmit}
                    className="w-full btn-thriller"
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'who-is-agent':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-ominous text-crimson mb-6">
                  Who is agent1297354:
                </h2>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your answer..."
                    value={whoIsAgentInput}
                    onChange={(e) => setWhoIsAgentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleWhoIsAgentSubmit()}
                    className="input-thriller text-center"
                  />
                  <Button 
                    onClick={handleWhoIsAgentSubmit}
                    className="w-full btn-thriller"
                  >
                    SUBMIT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'final-text':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-4xl px-8">
              <h1 className="text-4xl font-bold text-ominous text-bone-white leading-relaxed">
                You escape your bindings and knock Jason down, saving the joker. Flag:
              </h1>
              <div className="mt-8">
                <span className="text-2xl font-mono text-crimson bg-card px-4 py-2 rounded border border-crimson">
                  THRILLER_SEQUENCE_COMPLETE_2024
                </span>
              </div>
            </div>
          </div>
        );

      case 'game-over':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-ominous text-blood-red animate-pulse">
                GAME OVER
              </h1>
              <p className="text-2xl text-muted-foreground mt-4">
                Resetting...
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {renderContent()}
    </div>
  );
};