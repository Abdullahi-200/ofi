import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Palette, Handshake, Smartphone, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DesignWithTailor } from "@shared/schema";

export default function Home() {
  const { data: trendingDesigns, isLoading } = useQuery<DesignWithTailor[]>({
    queryKey: ["/api/designs/trending"],
  });

  return (
    <div className="bg-ofi-cream">
      {/* Hero Section */}
      <section className="relative gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Perfect Fit, <br />
                <span className="text-yellow-200">Nigerian Style</span>
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Use AI and AR technology to get accurate body measurements from your phone. 
                Connect with local tailors for custom designs inspired by Nigerian fashion trends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/measurement">
                  <Button className="bg-white text-ofi-orange px-8 py-4 text-lg font-semibold hover:bg-gray-100">
                    <Camera className="mr-2 h-5 w-5" />
                    Start Measurement
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="outline" className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-ofi-orange">
                    Browse Designs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="African woman in traditional dress" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-3 py-2">
                <span className="text-ofi-orange font-semibold">95% Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Ofi Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary AI and AR technology meets traditional Nigerian craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-ofi-orange bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Smartphone className="h-8 w-8 text-ofi-orange" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Measurement</h3>
              <p className="text-gray-600">
                Use your smartphone camera to take precise body measurements with 95% accuracy using advanced AR technology.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-ofi-green bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Palette className="h-8 w-8 text-ofi-green" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Style Recommendations</h3>
              <p className="text-gray-600">
                Get personalized fashion suggestions based on Nigerian trends, your preferences, and body measurements.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-ofi-gold bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-colors">
                <Handshake className="h-8 w-8 text-ofi-gold" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect with Tailors</h3>
              <p className="text-gray-600">
                Order directly from skilled local tailors who access our marketplace to showcase their unique designs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Designs Section */}
      {!isLoading && trendingDesigns && trendingDesigns.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Trending Designs
              </h2>
              <p className="text-lg text-gray-600">
                Popular Nigerian fashion styles loved by our customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingDesigns.slice(0, 3).map((design) => (
                <Card key={design.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={design.images?.[0] || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"}
                      alt={design.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-ofi-gold text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                      Trending
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={design.tailor.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
                        alt={design.tailor.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{design.tailor.name}</h3>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">★</span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{design.tailor.rating} ({design.tailor.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{design.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{design.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-ofi-orange">₦{parseInt(design.price).toLocaleString()}</span>
                      <Link href={`/design/${design.id}`}>
                        <Button className="bg-ofi-orange hover:bg-orange-600">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/marketplace">
                <Button className="bg-ofi-green hover:bg-green-700 text-white px-8 py-3">
                  View All Designs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Your Perfect Fit?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey to custom Nigerian fashion today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/measurement">
              <Button className="bg-ofi-orange hover:bg-orange-600 px-8 py-4 text-lg">
                <Camera className="mr-2 h-5 w-5" />
                Start Measuring
              </Button>
            </Link>
            <Link href="/style-quiz">
              <Button variant="outline" className="px-8 py-4 text-lg">
                Take Style Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
