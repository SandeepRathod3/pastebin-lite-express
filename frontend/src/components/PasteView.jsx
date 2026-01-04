// frontend/src/pages/PasteView.jsx
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
  User,
  Shield,
  AlertCircle,
  Home,
  Share2,
  Download,
  Printer
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { pasteAPI } from "../services/api";

export default function PasteView() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        setLoading(true);
        const data = await pasteAPI.get(id);
        setPaste(data);
      } catch (err) {
        setError(err.message || "Failed to load paste");
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  const copyToClipboard = async (text, type = "URL") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert(`${type} copied to clipboard!`);
    } catch (error) {
      alert("Could not copy to clipboard");
    }
  };

  const downloadPaste = () => {
    if (!paste) return;
    
    const blob = new Blob([paste.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paste-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printPaste = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/10 to-purple-50/10">
        <div className="container py-12">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/10 to-purple-50/10">
        <div className="container py-12">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50/50">
            <CardContent className="pt-12 pb-8">
              <div className="text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-3">Paste Unavailable</h2>
                  <p className="text-gray-600 text-lg mb-2">
                    {error || "This paste doesn't exist or has expired"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Pastes automatically expire based on time or view limits
                  </p>
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="gap-2">
                      <Link to="/">
                        <Home className="h-4 w-4" />
                        Create New Paste
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="gap-2">
                      <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/10 to-purple-50/10">
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
            <div className="lg:col-span-2 space-y-6">
              {/* Content Card */}
              <Card className="border-2 shadow-xl">
                <CardHeader className="border-b bg-blue-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Paste Content</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        Paste #{id}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(paste.content, "Content")}
                        title="Copy content"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <pre className="text-sm font-mono whitespace-pre-wrap break-words overflow-x-auto bg-gray-50 p-6 rounded-lg min-h-[400px]">
                    {paste.content}
                  </pre>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Paste Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">
                        {paste.content.length}
                      </div>
                      <div className="text-xs text-gray-500">Characters</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">
                        {paste.content.split(/\s+/).filter(w => w.length > 0).length}
                      </div>
                      <div className="text-xs text-gray-500">Words</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">
                        {paste.content.split('\n').length}
                      </div>
                      <div className="text-xs text-gray-500">Lines</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.ceil(paste.content.length / 1024)}KB
                      </div>
                      <div className="text-xs text-gray-500">Size</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Paste Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Paste ID</span>
                      <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {id}
                      </code>
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Total Views</span>
                      <span className="font-semibold">{paste.view_count + 1}</span>
                    </div>
                    
                    {paste.max_views && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Eye className="h-3 w-3" />
                            Views Remaining
                          </span>
                          <span className="font-semibold">{paste.remaining_views}</span>
                        </div>
                      </>
                    )}
                    
                    {paste.expires_at && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            Expires
                          </span>
                          <span className="font-medium">
                            {new Date(paste.expires_at).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Manage this paste</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => copyToClipboard(window.location.href, "URL")}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy Share URL
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => copyToClipboard(paste.content, "Content")}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Content
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={downloadPaste}
                  >
                    <Download className="h-4 w-4" />
                    Download as .txt
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={printPaste}
                  >
                    <Printer className="h-4 w-4" />
                    Print Paste
                  </Button>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <Badge variant="outline" className="gap-1">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Access</span>
                    <Badge variant="secondary">Public</Badge>
                  </div>
                  
                  {paste.expires_at && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800">
                        Expiring
                      </AlertTitle>
                      <AlertDescription className="text-amber-700">
                        This paste will expire on {new Date(paste.expires_at).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Create New */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                      <ExternalLink className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create New Paste</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Start fresh with a new paste
                      </p>
                    </div>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="/">
                        Create New Paste
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Pastebin-Lite</p>
                <p className="text-sm text-gray-500">
                  Secure paste sharing
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">API Status</Link>
              </Button>
              <span className="text-xs">v1.0.0</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Pastebin-Lite • Pastes expire based on time or view limits</p>
          </div>
        </div>
      </footer>
    </div>
  );
}