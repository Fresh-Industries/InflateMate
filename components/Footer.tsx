import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-sky-100 via-blue-50 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Inflatemate 🎈
            </h3>
            <p className="text-muted-foreground">
              Making party rentals magical, one bounce at a time! ✨
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sky-600">Quick Bounces 🦘</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Our Story</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Rental Guide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Party Ideas</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sky-600">Party Support 🎪</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">FAQs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sky-600">Join the Fun! 🎉</h4>
            <p className="text-muted-foreground">Get bouncing updates and party tips!</p>
            <Button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600">
              Subscribe Now! 🎈
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sky-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Inflatemate. All rights reserved. Keep bouncing! 🦄
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-sky-500 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
