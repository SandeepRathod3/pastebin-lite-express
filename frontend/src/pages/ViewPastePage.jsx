// frontend/src/pages/ViewPastePage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Copy, 
  Clock, 
  Eye, 
  Check, 
  ExternalLink,
  Calendar,
  User
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { pasteAPI } from "../services/api";
import { formatDistanceToNow } from "date-fns";

export default function ViewPastePage() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const data = await pasteAPI.get(id);
        setPaste(data);
      } catch (err) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "✅ Copied!",
        description: "Copied to clipboard",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12">
          <Card className="max-w-md mx-auto border-destructive/20">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Paste Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || "This paste doesn't exist or has expired"}
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Create New Paste
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-purple-50/20 dark:from-background dark:via-blue-950/5 dark:to-purple-950/5">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="border-2 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="gap-1">
                          <User className="h-3 w-3" />
                          Paste #{id}
                        </Badge>
                        {paste.expires_at && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Expiring
                          </Badge>
                        )}
                      </div>
                      <CardTitle>Paste Content</CardTitle>
                      <CardDescription>
                        Created {formatDistanceToNow(new Date(), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(paste.content)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto bg-muted/50 min-h-[400px]">
                    {paste.content}
                  </pre>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Paste Information</CardTitle>
                  <CardDescription>Details about this paste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Paste ID</span>
                      <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {id}
                      </code>
                    </div>
                    <Separator />
                    
                    {paste.expires_at && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Expires
                          </span>
                          <span className="text-sm font-medium">
                            {formatDistanceToNow(new Date(paste.expires_at), { addSuffix: true })}
                          </span>
                        </div>
                        <Separator />
                      </>
                    )}
                    
                    {paste.remaining_views !== null && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            Views Remaining
                          </span>
                          <Badge variant="outline">
                            {paste.remaining_views} / {paste.remaining_views + paste.view_count}
                          </Badge>
                        </div>
                        <Separator />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Share and manage this paste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Share URL
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => copyToClipboard(paste.content)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Content
                  </Button>
                  
                  <Button className="w-full justify-start gap-2" asChild>
                    <Link to="/">
                      <ExternalLink className="h-4 w-4" />
                      Create New Paste
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <div className="text-2xl font-bold text-primary">
                        {paste.view_count + 1}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Views</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <div className="text-2xl font-bold text-primary">
                        {paste.remaining_views !== null ? paste.remaining_views : "∞"}
                      </div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Pastebin-Lite • Modern paste sharing with elegance</p>
          <p className="mt-1">Pastes may expire based on time or view limits</p>
        </div>
      </footer>
    </div>
  );
}