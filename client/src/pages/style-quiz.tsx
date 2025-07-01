import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const quizSteps = [
  {
    id: "occasions",
    title: "What occasions do you dress for most?",
    type: "multiple",
    options: [
      {
        id: "professional",
        label: "Professional/Work",
        description: "Office attire, business meetings",
      },
      {
        id: "traditional",
        label: "Traditional Events",
        description: "Weddings, cultural ceremonies",
      },
      {
        id: "casual",
        label: "Casual Daily",
        description: "Everyday comfort wear",
      },
      {
        id: "special",
        label: "Special Occasions",
        description: "Parties, celebrations",
      },
    ],
  },
  {
    id: "colors",
    title: "What colors do you gravitate towards?",
    type: "multiple",
    options: [
      { id: "earth", label: "Earth Tones", description: "Browns, beiges, oranges" },
      { id: "jewel", label: "Jewel Tones", description: "Deep blues, emeralds, purples" },
      { id: "neutral", label: "Neutral Colors", description: "Black, white, gray" },
      { id: "bright", label: "Bright Colors", description: "Reds, yellows, hot pink" },
      { id: "pastel", label: "Pastels", description: "Soft pinks, light blues, mint" },
    ],
  },
  {
    id: "style",
    title: "How would you describe your personal style?",
    type: "single",
    options: [
      { id: "classic", label: "Classic & Timeless", description: "Clean lines, traditional cuts" },
      { id: "trendy", label: "Trendy & Fashion-Forward", description: "Latest styles, bold choices" },
      { id: "bold", label: "Bold & Statement", description: "Eye-catching, unique pieces" },
      { id: "minimal", label: "Minimal & Clean", description: "Simple, understated elegance" },
    ],
  },
  {
    id: "budget",
    title: "What's your typical budget range?",
    type: "single",
    options: [
      { id: "budget", label: "Budget-Friendly", description: "₦15,000 - ₦30,000" },
      { id: "mid", label: "Mid-Range", description: "₦30,000 - ₦60,000" },
      { id: "premium", label: "Premium", description: "₦60,000+" },
    ],
  },
];

export default function StyleQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuizStep = quizSteps[currentStep];
  const progressPercentage = ((currentStep + 1) / quizSteps.length) * 100;

  const handleMultipleChoice = (optionId: string, checked: boolean) => {
    const stepId = currentQuizStep.id;
    const current = answers[stepId] || [];
    
    if (checked) {
      setAnswers({
        ...answers,
        [stepId]: [...current, optionId],
      });
    } else {
      setAnswers({
        ...answers,
        [stepId]: current.filter(id => id !== optionId),
      });
    }
  };

  const handleSingleChoice = (optionId: string) => {
    const stepId = currentQuizStep.id;
    setAnswers({
      ...answers,
      [stepId]: [optionId],
    });
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = answers[currentQuizStep.id]?.length > 0;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-8">
            <CardContent>
              <div className="text-center mb-8">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎉</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Style Profile Complete!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We've analyzed your preferences and we're ready to show you personalized recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Style Personality</h3>
                  <p className="text-gray-600 capitalize">
                    {answers.style?.[0]?.replace('-', ' ') || 'Classic & Timeless'}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">Preferred Occasions</h3>
                  <p className="text-gray-600">
                    {answers.occasions?.length || 2} occasion types selected
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/marketplace">
                  <Button className="bg-ofi-orange hover:bg-orange-600 px-8 py-3">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    See Recommended Designs
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 py-3">
                  Save & Continue Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tell Us Your Style
          </h1>
          <p className="text-lg text-gray-600">
            Help us recommend designs that match your personal style and preferences
          </p>
        </div>

        <Card className="p-8">
          <CardContent>
            <div className="space-y-8">
              {/* Progress */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {quizSteps.length}
                </span>
                <Progress value={progressPercentage} className="flex-1 mx-4" />
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>

              {/* Question */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentQuizStep.title}
                </h3>

                {currentQuizStep.type === "multiple" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuizStep.options.map((option) => (
                      <Label
                        key={option.id}
                        className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-ofi-orange transition-colors"
                      >
                        <Checkbox
                          checked={answers[currentQuizStep.id]?.includes(option.id) || false}
                          onCheckedChange={(checked) => 
                            handleMultipleChoice(option.id, checked as boolean)
                          }
                          className="mt-1 mr-4"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{option.label}</span>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </Label>
                    ))}
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[currentQuizStep.id]?.[0] || ""}
                    onValueChange={handleSingleChoice}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {currentQuizStep.options.map((option) => (
                        <Label
                          key={option.id}
                          className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-ofi-orange transition-colors"
                        >
                          <RadioGroupItem value={option.id} className="mt-1 mr-4" />
                          <div>
                            <span className="font-medium text-gray-900">{option.label}</span>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="bg-ofi-orange hover:bg-orange-600"
                >
                  {currentStep === quizSteps.length - 1 ? "Complete Quiz" : "Next Step"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
