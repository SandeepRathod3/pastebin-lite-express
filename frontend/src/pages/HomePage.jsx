// frontend/src/pages/HomePage.jsx
import { useState } from "react";
import { 
  Zap, 
  Clock, 
  Eye, 
  Shield, 
  Sparkles, 
  Copy,
  Check,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { pasteAPI } from "../services/api";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create and share pastes in milliseconds",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Auto-expiring pastes with view limits",
  },
  {
    icon: Clock,
    title: "Time-Based Expiry",
    description: "Set custom expiration times",
  },
  {
    icon: Eye,
    title: "View Count Limits",
    description: "Control how many times your paste can be viewed",
  },
];

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdPaste, setCreatedPaste] = useState(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        content,
        ...(ttlSeconds && { ttl_seconds: parseInt(ttlSeconds) }),
        ...(maxViews && { max_views: parseInt(maxViews) }),
      };

      const result = await pasteAPI.create(data);
      setCreatedPaste(result);
      
      toast({
        title: "🎉 Paste Created!",
        description: "Your paste has been created successfully",
      });

      // Reset form
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!createdPaste?.url) return;
    
    try {
      await navigator.clipboard.writeText(createdPaste.url);
      setCopied(true);
      
      toast({
        title: "✅ Copied!",
        description: "URL copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
      <Header />
      
      <main className="container py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Create Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Create & Share
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Create a New <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Paste</span>
              </h2>
              <p className="text-muted-foreground">
                Share code, text, or anything you want with optional expiry and view limits
              </p>
            </div>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>New Paste</CardTitle>
                <CardDescription>
                  Paste your content below and set constraints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content" className="flex items-center gap-2 mb-2">
                        Content <Badge variant="outline" className="text-xs">Required</Badge>
                      </Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your text, code, or message here..."
                        className="min-h-[200px] font-mono text-base"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum 10,000 characters
                      </p>
                    </div>

                    <Tabs defaultValue="constraints" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="constraints">Constraints</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                      <TabsContent value="constraints" className="space-y-4 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ttl" className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Expiry (seconds)
                            </Label>
                            <Input
                              id="ttl"
                              type="number"
                              min="1"
                              placeholder="e.g., 3600"
                              value={ttlSeconds}
                              onChange={(e) => setTtlSeconds(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Leave empty for no expiry
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="views" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Max Views
                            </Label>
                            <Input
                              id="views"
                              type="number"
                              min="1"
                              placeholder="e.g., 10"
                              value={maxViews}
                              onChange={(e) => setMaxViews(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Leave empty for unlimited
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="advanced" className="pt-4">
                        <div className="space-y-2">
                          <Label>Syntax Highlighting</Label>
                          <p className="text-sm text-muted-foreground">
                            Coming soon! We're working on code syntax highlighting.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold"
                    disabled={loading || !content.trim()}
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Create Paste
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result Card */}
            {createdPaste && (
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent animate-fade-in">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Paste Created Successfully!</h3>
                          <p className="text-sm text-muted-foreground">
                            Share this URL with others
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Ready
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label>Shareable URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={createdPaste.url}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          onClick={copyToClipboard}
                          variant={copied ? "default" : "outline"}
                          className="shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(createdPaste.url, '_blank')}
                      >
                        View Paste
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          setCreatedPaste(null);
                          toast({
                            title: "New paste ready",
                            description: "Form has been cleared",
                          });
                        }}
                      >
                        Create Another
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Features & Info */}
          <div className="space-y-8">
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Simple three-step process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Paste Content", desc: "Enter your text or code" },
                    { step: "2", title: "Set Constraints", desc: "Optional expiry & view limits" },
                    { step: "3", title: "Share & Enjoy", desc: "Copy URL and share instantly" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Info */}
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>
                  Programmatic access available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted p-3 font-mono text-sm">
                    <span className="text-primary">POST</span> /api/pastes
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use our REST API to create and manage pastes programmatically.
                    Perfect for integrations and automation.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View API Docs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                {/* <Code2 className="h-4 w-4 text-white" /> */}
              </div>
              <div>
                <p className="font-semibold">Pastebin-Lite</p>
                <p className="text-sm text-muted-foreground">
                  Modern paste sharing solution
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}